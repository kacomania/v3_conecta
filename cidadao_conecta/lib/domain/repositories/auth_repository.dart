import '../models/app_user.dart';

abstract class AuthRepository {
  Stream<AppUser?> get authStateChanges;
  AppUser? get currentUser;

  Future<AppUser> signIn({required String email, required String password});
  Future<AppUser> signUp({
    required String email,
    required String password,
    required String name,
    required String prefeituraId,
  });
  Future<void> signOut();

  /// Envia e-mail de recuperação de senha para o endereço fornecido.
  Future<void> resetPassword(String email);

  /// Atualiza o metadado `name` do usuário autenticado no Supabase Auth.
  Future<AppUser> updateProfile({required String name});

  /// Exclui a conta do usuário atual (Direito ao Esquecimento).
  Future<void> deleteAccount();
}
