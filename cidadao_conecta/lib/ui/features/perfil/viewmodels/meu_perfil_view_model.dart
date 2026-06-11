import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/providers.dart';
import '../../../../domain/models/app_user.dart';

/// Estado da tela de Meu Perfil.
class MeuPerfilState {
  final AppUser? user;
  final bool isSaving;
  final String? errorMessage;

  const MeuPerfilState({
    this.user,
    this.isSaving = false,
    this.errorMessage,
  });

  MeuPerfilState copyWith({
    AppUser? user,
    bool? isSaving,
    String? errorMessage,
  }) {
    return MeuPerfilState(
      user: user ?? this.user,
      isSaving: isSaving ?? this.isSaving,
      errorMessage: errorMessage,
    );
  }
}

/// ViewModel da tela Meu Perfil.
///
/// Segue Clean Architecture: comunica-se exclusivamente com o [AuthRepository].
/// A UI nunca acessa o Supabase diretamente.
class MeuPerfilViewModel extends AsyncNotifier<MeuPerfilState> {
  @override
  FutureOr<MeuPerfilState> build() async {
    // Escuta o provider reativo de estado de autenticação
    final user = ref.watch(authStateProvider).value;
    return MeuPerfilState(user: user);
  }

  /// Atualiza o nome do usuário autenticado via [AuthRepository].
  Future<void> updateName(String newName) async {
    final current = state.value;
    if (current == null) return;

    state = AsyncValue.data(current.copyWith(isSaving: true, errorMessage: null));
    try {
      final authRepository = ref.read(authRepositoryProvider);
      final updatedUser = await authRepository.updateProfile(name: newName);
      state = AsyncValue.data(current.copyWith(
        user: updatedUser,
        isSaving: false,
      ));
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Desloga o usuário. O GoRouter detecta o estado nulo no [authStateProvider]
  /// e redireciona automaticamente para `/login`.
  Future<void> signOut() async {
    state = const AsyncValue.loading();
    try {
      final authRepository = ref.read(authRepositoryProvider);
      await authRepository.signOut();
      // Após signOut() o Supabase emite null no stream → GoRouter redireciona.
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Exclui permanentemente a conta do usuário logado.
  Future<void> deleteAccount() async {
    state = const AsyncValue.loading();
    try {
      final authRepository = ref.read(authRepositoryProvider);
      await authRepository.deleteAccount();
      await authRepository.signOut();
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  /// Limpa a preferência de tenant e navega para seleção de prefeitura.
  Future<void> clearTenant() async {
    final notifier = ref.read(currentTenantProvider.notifier);
    // Reseta o estado do tenant para nulo; a navegação fica a cargo da UI.
    notifier.state = const AsyncValue.data(null);
  }
}

final meuPerfilViewModelProvider =
    AsyncNotifierProvider<MeuPerfilViewModel, MeuPerfilState>(() {
  return MeuPerfilViewModel();
});
