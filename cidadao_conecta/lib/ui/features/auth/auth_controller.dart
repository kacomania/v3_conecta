import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/di/providers.dart';

class AuthController extends AsyncNotifier<void> {
  @override
  FutureOr<void> build() {
    // initial state
  }

  Future<void> signIn(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final repository = ref.read(authRepositoryProvider);
      await repository.signIn(email: email.trim(), password: password);
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> signInWithGoogle() async {
    state = const AsyncValue.loading();
    try {
      final repository = ref.read(authRepositoryProvider);
      await repository.signInWithGoogle();
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> signUp({
    required String email,
    required String password,
    required String name,
    required String cpf,
    required String prefeituraId,
  }) async {
    state = const AsyncValue.loading();
    try {
      final repository = ref.read(authRepositoryProvider);
      await repository.signUp(
        email: email.trim(),
        password: password,
        name: name.trim(),
        cpf: cpf.trim(),
        prefeituraId: prefeituraId,
      );
      state = const AsyncValue.data(null);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }
}

final authControllerProvider = AsyncNotifierProvider<AuthController, void>(() {
  return AuthController();
});
