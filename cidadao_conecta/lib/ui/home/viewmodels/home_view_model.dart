import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/di/providers.dart';
import '../../../core/providers/categoria_providers.dart';
import '../../../domain/entities/categoria_entity.dart';
import '../../../domain/models/app_user.dart';

class HomeState {
  final AppUser? user;
  final List<CategoriaEntity> categorias;

  HomeState({
    this.user,
    this.categorias = const [],
  });
}

class HomeViewModel extends AsyncNotifier<HomeState> {
  @override
  Future<HomeState> build() async {
    final authRepo = ref.watch(authRepositoryProvider);
    final categoriaRepo = ref.watch(categoriaRepositoryProvider);
    final tenantState = await ref.watch(currentTenantProvider.future);
    
    final prefeituraId = tenantState?.id ?? '';

    // Buscar simultaneamente o Perfil do usuário e as Categorias
    final results = await Future.wait([
      Future.value(authRepo.currentUser), // Profile (using cached/sync data from auth repo for now)
      categoriaRepo.getCategorias(prefeituraId),
    ]);

    final user = results[0] as AppUser?;
    final categorias = results[1] as List<CategoriaEntity>;

    return HomeState(
      user: user,
      categorias: categorias,
    );
  }
}

final homeViewModelProvider = AsyncNotifierProvider<HomeViewModel, HomeState>(() {
  return HomeViewModel();
});
