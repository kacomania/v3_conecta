import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseAuthService {
  final SupabaseClient _client;

  SupabaseAuthService(this._client);

  Stream<AuthState> get authStateChanges => _client.auth.onAuthStateChange;

  User? get currentUser => _client.auth.currentUser;

  Future<AuthResponse> signIn({required String email, required String password}) async {
    return await _client.auth.signInWithPassword(
      email: email,
      password: password,
    );
  }

  Future<AuthResponse> signUp({
    required String email,
    required String password,
    required String name,
    required String prefeituraId,
  }) async {
    // IMPORTANTE: prefeitura_id deve ir no metadata (data) para a trigger do Supabase capturar.
    return await _client.auth.signUp(
      email: email,
      password: password,
      data: {
        'name': name,
        'prefeitura_id': prefeituraId,
      },
    );
  }

  Future<void> signOut() async {
    await _client.auth.signOut();
  }

  /// Envia e-mail de redefinição de senha para o endereço fornecido.
  Future<void> resetPasswordForEmail(String email) async {
    await _client.auth.resetPasswordForEmail(email);
  }

  /// Atualiza o metadado `name` do usuário autenticado.
  Future<UserResponse> updateCurrentUser({required String name}) async {
    return await _client.auth.updateUser(
      UserAttributes(data: {'name': name}),
    );
  }
}
