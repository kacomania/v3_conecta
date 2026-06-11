import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/providers/categoria_providers.dart';
import '../../../core/di/providers.dart';
import '../../../domain/entities/categoria_entity.dart';

class CategoriesController extends AsyncNotifier<List<CategoriaEntity>> {
  @override
  Future<List<CategoriaEntity>> build() async {
    return _fetchCategories();
  }

  Future<List<CategoriaEntity>> _fetchCategories() async {
    final tenant = await ref.watch(currentTenantProvider.future);
    if (tenant == null) {
      return [];
    }

    final repository = ref.read(categoriaRepositoryProvider);
    return await repository.getCategorias(tenant.id);
  }
}

final categoriesControllerProvider = AsyncNotifierProvider<CategoriesController, List<CategoriaEntity>>(() {
  return CategoriesController();
});
