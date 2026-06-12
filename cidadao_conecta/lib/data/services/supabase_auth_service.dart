import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:google_sign_in/google_sign_in.dart';

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
    required String cpf,
    required String prefeituraId,
  }) async {
    // IMPORTANTE: prefeitura_id deve ir no metadata (data) para a trigger do Supabase capturar.
    return await _client.auth.signUp(
      email: email,
      password: password,
      data: {
        'name': name,
        'cpf': cpf,
        'prefeitura_id': prefeituraId,
      },
    );
  }

  bool _googleSignInInitialized = false;

  Future<AuthResponse> signInWithGoogle() async {
    if (!_googleSignInInitialized) {
      final webClientId = dotenv.env['GOOGLE_WEB_CLIENT_ID'];
      if (webClientId == null || webClientId.isEmpty) {
        throw Exception('A variável GOOGLE_WEB_CLIENT_ID não está configurada no .env');
      }

      await GoogleSignIn.instance.initialize(
        serverClientId: webClientId,
      );
      _googleSignInInitialized = true;
    }

    final googleUser = await GoogleSignIn.instance.authenticate();
    
    final googleAuth = googleUser.authentication;
    final idToken = googleAuth.idToken;

    if (idToken == null) {
      throw Exception('Falha ao obter ID token do Google.');
    }

    return await _client.auth.signInWithIdToken(
      provider: OAuthProvider.google,
      idToken: idToken,
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
