import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter/foundation.dart';
import '../../domain/models/prefeitura_model.dart';
import '../../core/local_db/local_database_helper.dart';

class SupabaseTenantService {
  final SupabaseClient _client;

  SupabaseTenantService(this._client);

  Future<List<PrefeituraModel>> fetchAllTenants() async {
    try {
      final response = await _client.from('prefeituras').select('*');
      final resultList = <PrefeituraModel>[];
      for (var item in (response as List)) {
        if (item is Map) {
          resultList.add(
            PrefeituraModel.fromJson(Map<String, dynamic>.from(item)),
          );
        }
      }
      
      // Atualiza o cache local de forma silenciosa
      try {
        await LocalDatabaseHelper().cachePrefeituras(resultList);
      } catch (e) {
        debugPrint('Erro ao salvar prefeituras no cache: $e');
      }

      return resultList;
    } catch (e) {
      debugPrint('Erro ao buscar prefeituras no Supabase, tentando cache local: $e');
      
      try {
        final cached = await LocalDatabaseHelper().getCachedPrefeituras();
        if (cached.isNotEmpty) {
          return cached;
        }
      } catch (cacheError) {
        debugPrint('Erro ao ler cache de prefeituras: $cacheError');
      }

      return [];
    }
  }

  Future<PrefeituraModel?> fetchTenantById(String id) async {
    final response = await _client
        .from('prefeituras')
        .select()
        .eq('id', id)
        .maybeSingle();
    if (response == null) return null;
    return PrefeituraModel.fromJson(response);
  }
}
