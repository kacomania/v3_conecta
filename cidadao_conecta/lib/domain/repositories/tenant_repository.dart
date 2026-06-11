import '../models/prefeitura_model.dart';

abstract class TenantRepository {
  Future<List<PrefeituraModel>> fetchAllTenants();
  Future<PrefeituraModel?> fetchTenantById(String id);
}
