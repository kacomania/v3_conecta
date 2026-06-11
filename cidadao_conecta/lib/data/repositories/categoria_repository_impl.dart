import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/foundation.dart';
import '../../domain/entities/categoria_entity.dart';
import '../../domain/repositories/categoria_repository.dart';
import '../../core/local_db/local_database_helper.dart';

class CategoriaRepositoryImpl implements CategoriaRepository {
  // ignore: unused_field
  final SupabaseClient _supabaseClient;

  CategoriaRepositoryImpl(this._supabaseClient);

  @override
  Future<List<CategoriaEntity>> getCategorias(String prefeituraId) async {
    try {
      final response = await _supabaseClient.from('categories').select();
      
      final categorias = (response as List).map((json) => CategoriaEntity(
        id: json['id'],
        nome: json['name'],
        icone: 'lightbulb', // Mantido o default conforme original
        descricao: '',
      )).toList();

      // Atualiza o cache local de forma silenciosa
      try {
        await LocalDatabaseHelper().cacheCategories(categorias);
      } catch (e) {
        debugPrint('Erro ao salvar categorias no cache: $e');
      }

      return categorias;
    } catch (e) {
      debugPrint('Erro ao buscar categorias no Supabase, tentando cache local: $e');
      
      try {
        final cached = await LocalDatabaseHelper().getCachedCategories();
        if (cached.isNotEmpty) {
          return cached;
        }
      } catch (cacheError) {
        debugPrint('Erro ao ler cache de categorias: $cacheError');
      }

      return [];
    }
  }
}
