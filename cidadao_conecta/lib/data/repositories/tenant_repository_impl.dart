import '../../domain/models/prefeitura_model.dart';
import '../../domain/repositories/tenant_repository.dart';
import '../services/supabase_tenant_service.dart';

class TenantRepositoryImpl implements TenantRepository {
  final SupabaseTenantService _tenantService;

  TenantRepositoryImpl(this._tenantService);

  @override
  Future<List<PrefeituraModel>> fetchAllTenants() async {
    return await _tenantService.fetchAllTenants();
  }

  @override
  Future<PrefeituraModel?> fetchTenantById(String id) async {
    return await _tenantService.fetchTenantById(id);
  }
}
