import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart' as p;
import '../../domain/models/prefeitura_model.dart';
import '../../domain/entities/categoria_entity.dart';

/// Modelo que representa um chamado na fila offline (SQLite).
class QueuedOccurrence {
  final int? id; // Auto-increment PK local
  final String localId; // UUID gerado localmente para rastreamento
  final String? categoryId;
  final String title;
  final String description;
  final String? photoPath; // Caminho LOCAL da foto (ApplicationDocumentsDirectory)
  final double? latitude;
  final double? longitude;
  final String prefeituraId;
  final String userId;
  final DateTime createdAt;

  const QueuedOccurrence({
    this.id,
    required this.localId,
    this.categoryId,
    required this.title,
    required this.description,
    this.photoPath,
    this.latitude,
    this.longitude,
    required this.prefeituraId,
    required this.userId,
    required this.createdAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'local_id': localId,
      'category_id': categoryId,
      'title': title,
      'description': description,
      'photo_path': photoPath,
      'latitude': latitude,
      'longitude': longitude,
      'prefeitura_id': prefeituraId,
      'user_id': userId,
      'created_at': createdAt.toIso8601String(),
    };
  }

  factory QueuedOccurrence.fromMap(Map<String, dynamic> map) {
    return QueuedOccurrence(
      id: map['id'] as int?,
      localId: map['local_id'] as String,
      categoryId: map['category_id'] as String?,
      title: map['title'] as String,
      description: map['description'] as String,
      photoPath: map['photo_path'] as String?,
      latitude: map['latitude'] != null ? (map['latitude'] as num).toDouble() : null,
      longitude: map['longitude'] != null ? (map['longitude'] as num).toDouble() : null,
      prefeituraId: map['prefeitura_id'] as String,
      userId: map['user_id'] as String,
      createdAt: DateTime.parse(map['created_at'] as String),
    );
  }
}

/// Singleton que gerencia o banco de dados SQLite local para a fila offline.
/// Garante que o app possa registrar chamados mesmo sem internet.
class LocalDatabaseHelper {
  static const _dbName = 'conecta_offline.db';
  static const _dbVersion = 2; // Atualizado para v2 para suportar cache local
  static const _tableName = 'queued_occurrences';
  static const _prefeiturasTable = 'cached_prefeituras';
  static const _categoriesTable = 'cached_categories';

  static LocalDatabaseHelper? _instance;
  static Database? _database;

  LocalDatabaseHelper._internal();

  factory LocalDatabaseHelper() {
    _instance ??= LocalDatabaseHelper._internal();
    return _instance!;
  }

  Future<Database> get database async {
    _database ??= await _initDatabase();
    return _database!;
  }

  Future<Database> _initDatabase() async {
    final dbPath = await getDatabasesPath();
    final fullPath = p.join(dbPath, _dbName);

    return await openDatabase(
      fullPath,
      version: _dbVersion,
      onCreate: _onCreate,
      onUpgrade: _onUpgrade,
    );
  }

  Future<void> _onCreate(Database db, int version) async {
    await db.execute('''
      CREATE TABLE $_tableName (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        local_id    TEXT    NOT NULL UNIQUE,
        category_id TEXT,
        title       TEXT    NOT NULL,
        description TEXT    NOT NULL,
        photo_path  TEXT,
        latitude    REAL,
        longitude   REAL,
        prefeitura_id TEXT  NOT NULL,
        user_id     TEXT    NOT NULL,
        created_at  TEXT    NOT NULL
      )
    ''');

    await _createCacheTables(db);
  }

  Future<void> _onUpgrade(Database db, int oldVersion, int newVersion) async {
    if (oldVersion < 2) {
      await _createCacheTables(db);
    }
  }

  Future<void> _createCacheTables(Database db) async {
    await db.execute('''
      CREATE TABLE $_prefeiturasTable (
        id TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        primary_color TEXT,
        secondary_color TEXT,
        logo_url TEXT
      )
    ''');

    await db.execute('''
      CREATE TABLE $_categoriesTable (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT,
        description TEXT
      )
    ''');
  }

  // ── CRUD: Fila Offline (Chamados) ─────────────────────────────────────────

  /// Insere um chamado na fila offline.
  Future<int> insertQueuedOccurrence(QueuedOccurrence occurrence) async {
    final db = await database;
    return await db.insert(
      _tableName,
      occurrence.toMap(),
      conflictAlgorithm: ConflictAlgorithm.replace,
    );
  }

  /// Retorna todos os chamados na fila offline, ordenados do mais recente.
  Future<List<QueuedOccurrence>> getAllQueuedOccurrences() async {
    final db = await database;
    final maps = await db.query(
      _tableName,
      orderBy: 'created_at DESC',
    );
    return maps.map((m) => QueuedOccurrence.fromMap(m)).toList();
  }

  /// Deleta um chamado da fila após sincronização bem-sucedida com o Supabase.
  Future<int> deleteQueuedOccurrence(String localId) async {
    final db = await database;
    return await db.delete(
      _tableName,
      where: 'local_id = ?',
      whereArgs: [localId],
    );
  }

  /// Verifica se há itens pendentes na fila.
  Future<bool> hasPendingItems() async {
    final items = await getAllQueuedOccurrences();
    return items.isNotEmpty;
  }

  // ── CRUD: Cache de Prefeituras ────────────────────────────────────────────

  Future<void> cachePrefeituras(List<PrefeituraModel> prefeituras) async {
    final db = await database;
    await db.transaction((txn) async {
      await txn.delete(_prefeiturasTable); // Limpa cache antigo
      for (final p in prefeituras) {
        await txn.insert(
          _prefeiturasTable,
          {
            'id': p.id,
            'nome': p.name,
            'primary_color': p.primaryColor,
            'secondary_color': p.secondaryColor,
            'logo_url': p.logoUrl,
          },
          conflictAlgorithm: ConflictAlgorithm.replace,
        );
      }
    });
  }

  Future<List<PrefeituraModel>> getCachedPrefeituras() async {
    final db = await database;
    final maps = await db.query(_prefeiturasTable);
    return maps.map((m) {
      return PrefeituraModel(
        id: m['id'] as String,
        name: m['nome'] as String,
        primaryColor: m['primary_color'] as String?,
        secondaryColor: m['secondary_color'] as String?,
        logoUrl: m['logo_url'] as String?,
      );
    }).toList();
  }

  // ── CRUD: Cache de Categorias ─────────────────────────────────────────────

  Future<void> cacheCategories(List<CategoriaEntity> categories) async {
    final db = await database;
    await db.transaction((txn) async {
      await txn.delete(_categoriesTable); // Limpa cache antigo
      for (final c in categories) {
        await txn.insert(
          _categoriesTable,
          {
            'id': c.id,
            'name': c.nome,
            'icon': c.icone,
            'description': c.descricao,
          },
          conflictAlgorithm: ConflictAlgorithm.replace,
        );
      }
    });
  }

  Future<List<CategoriaEntity>> getCachedCategories() async {
    final db = await database;
    final maps = await db.query(_categoriesTable);
    return maps.map((m) {
      return CategoriaEntity(
        id: m['id'] as String,
        nome: m['name'] as String,
        icone: m['icon'] as String? ?? 'lightbulb',
        descricao: m['description'] as String? ?? '',
      );
    }).toList();
  }
}
