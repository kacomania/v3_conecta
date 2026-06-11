import 'dart:async';
import 'dart:developer';
import 'dart:io';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../local_db/local_database_helper.dart';
import '../di/providers.dart';

/// Motor de sincronização offline-first.
///
/// Observa o estado da rede usando [connectivity_plus].
/// Quando a internet é restabelecida, processa a fila do SQLite:
///   1. Faz upload da foto para o Supabase Storage.
///   2. Insere a occurrence na tabela `occurrences`.
///   3. Remove o item da fila local.
///   4. Notifica os listeners para atualizar a UI.
class SyncService {
  final LocalDatabaseHelper _localDb;
  final SupabaseClient _supabase;

  StreamSubscription<List<ConnectivityResult>>? _connectivitySubscription;
  bool _isSyncing = false;

  // Notifier para que a UI possa reagir à conclusão da sincronização
  final _syncCompletedController = StreamController<void>.broadcast();
  Stream<void> get onSyncCompleted => _syncCompletedController.stream;

  SyncService(this._localDb, this._supabase);

  /// Inicia o monitoramento de rede em background.
  /// Deve ser chamado uma única vez em [main.dart] ou via Provider global.
  void startListening() {
    _connectivitySubscription?.cancel();

    _connectivitySubscription = Connectivity()
        .onConnectivityChanged
        .listen((List<ConnectivityResult> results) {
      final isOnline = results.any(
        (r) => r != ConnectivityResult.none,
      );

      if (isOnline) {
        log('[SyncService] 🌐 Conexão detectada. Verificando fila offline...');
        _processPendingQueue();
      }
    });

    log('[SyncService] ✅ Monitoramento de rede iniciado.');
  }

  void stopListening() {
    _connectivitySubscription?.cancel();
    _connectivitySubscription = null;
    log('[SyncService] 🔇 Monitoramento de rede encerrado.');
  }

  /// Processa todos os chamados pendentes na fila do SQLite.
  Future<void> _processPendingQueue() async {
    if (_isSyncing) {
      log('[SyncService] ⏳ Sincronização já em progresso. Pulando.');
      return;
    }

    _isSyncing = true;

    try {
      final pendingItems = await _localDb.getAllQueuedOccurrences();

      if (pendingItems.isEmpty) {
        log('[SyncService] ✨ Nenhum item na fila offline.');
        return;
      }

      log('[SyncService] 📦 ${pendingItems.length} item(s) na fila. Sincronizando...');

      for (final item in pendingItems) {
        try {
          await _syncItem(item);
        } catch (e) {
          // Falha em um item não deve bloquear os outros
          log('[SyncService] ❌ Falha ao sincronizar ${item.localId}: $e');
        }
      }

      // Notifica a UI para atualizar "Meus Chamados"
      _syncCompletedController.add(null);
      log('[SyncService] 🎉 Sincronização concluída.');
    } finally {
      _isSyncing = false;
    }
  }

  /// Sincroniza um único item da fila com o Supabase.
  Future<void> _syncItem(QueuedOccurrence item) async {
    log('[SyncService] 🔄 Sincronizando item local_id=${item.localId}...');

    // 1. Upload da foto, se existir
    String? imageUrl;
    if (item.photoPath != null) {
      final file = File(item.photoPath!);
      if (await file.exists()) {
        final fileName =
            '${DateTime.now().millisecondsSinceEpoch}_${item.userId}.jpg';
        final filePath = '${item.userId}/$fileName';

        await _supabase.storage.from('occurrences_media').upload(
              filePath,
              file,
              fileOptions: const FileOptions(cacheControl: '3600', upsert: false),
            );

        imageUrl = _supabase.storage
            .from('occurrences_media')
            .getPublicUrl(filePath);

        log('[SyncService] 📸 Upload de foto concluído: $imageUrl');
      } else {
        log('[SyncService] ⚠️ Foto não encontrada no caminho: ${item.photoPath}');
      }
    }

    // 2. Valida category_id (apenas UUID válido com '-')
    final validCategoryId =
        (item.categoryId != null && item.categoryId!.contains('-'))
            ? item.categoryId
            : null;

    // 3. Insere a occurrence no Supabase
    final response = await _supabase.from('occurrences').insert({
      'title': item.title.isNotEmpty ? item.title : 'Sem título',
      'description': item.description,
      'latitude': item.latitude,
      'longitude': item.longitude,
      'image_url': imageUrl,
      'image_urls': imageUrl != null ? [imageUrl] : [],
      'status': 'PENDING',
      'user_id': item.userId,
      'category_id': validCategoryId,
      'prefeitura_id': item.prefeituraId,
    }).select('id').single();

    final occurrenceId = response['id'] as String;
    log('[SyncService] ✅ Occurrence criada no Supabase: $occurrenceId');

    // 4. Invoca o embedding de forma assíncrona (não bloqueia nem falha a sync)
    try {
      await _supabase.functions.invoke(
        'generate-embedding',
        body: {'occurrence_id': occurrenceId, 'description': item.description},
      );
    } catch (e) {
      log('[SyncService] ⚠️ generate-embedding falhou (não crítico): $e');
    }

    // 5. Remove da fila local — só após sucesso no Supabase
    await _localDb.deleteQueuedOccurrence(item.localId);
    log('[SyncService] 🗑️ Item removido da fila local: ${item.localId}');
  }

  void dispose() {
    stopListening();
    _syncCompletedController.close();
  }
}

/// Provider global do SyncService.
/// Inicializado via [keepAlive] para sobreviver durante toda a sessão do app.
final syncServiceProvider = Provider<SyncService>((ref) {
  final localDb = LocalDatabaseHelper();
  final supabase = ref.read(supabaseClientProvider);

  final service = SyncService(localDb, supabase);
  service.startListening();

  ref.onDispose(service.dispose);

  return service;
});
