import 'dart:async';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../../domain/models/app_user.dart';
import '../../domain/repositories/auth_repository.dart';
import '../services/supabase_auth_service.dart';

class AuthRepositoryImpl implements AuthRepository {
  final SupabaseAuthService _authService;
  final SupabaseClient _supabase;

  AuthRepositoryImpl(this._authService, this._supabase);

  @override
  Stream<AppUser?> get authStateChanges {
    return _authService.authStateChanges.asyncMap((authState) async {
      final user = authState.session?.user;
      if (user == null) return null;
      return await _mapUser(user);
    });
  }

  @override
  AppUser? get currentUser {
    final user = _authService.currentUser;
    if (user == null) return null;
    // Retorna usuário base enquanto o stream async não resolve (getter síncrono)
    return AppUser(
      id: user.id,
      email: user.email ?? '',
      name: user.userMetadata?['name'] as String?,
    );
  }

  @override
  Future<AppUser> signIn({required String email, required String password}) async {
    final response = await _authService.signIn(email: email, password: password);
    final user = response.user;
    if (user == null) throw Exception('Falha ao fazer login');
    return await _mapUser(user);
  }

  @override
  Future<AppUser> signInWithGoogle() async {
    final response = await _authService.signInWithGoogle();
    final user = response.user;
    if (user == null) throw Exception('Falha ao fazer login com Google');
    return await _mapUser(user);
  }

  @override
  Future<AppUser> signUp({
    required String email,
    required String password,
    required String name,
    required String cpf,
    required String prefeituraId,
  }) async {
    final response = await _authService.signUp(
      email: email,
      password: password,
      name: name,
      cpf: cpf,
      prefeituraId: prefeituraId,
    );
    final user = response.user;
    if (user == null) throw Exception('Falha ao registrar usuário');
    return await _mapUser(user);
  }

  @override
  Future<void> signOut() async {
    await _authService.signOut();
  }

  @override
  Future<void> resetPassword(String email) async {
    await _authService.resetPasswordForEmail(email);
  }

  @override
  Future<AppUser> updateProfile({required String name}) async {
    final response = await _authService.updateCurrentUser(name: name);
    final user = response.user;
    if (user == null) throw Exception('Falha ao atualizar perfil');
    return await _mapUser(user);
  }

  @override
  Future<void> deleteAccount() async {
    await _supabase.rpc('delete_user_account');
  }

  /// Mapeia o User do Supabase para AppUser, buscando a role na tabela user_roles.
  Future<AppUser> _mapUser(User user) async {
    final metadata = user.userMetadata ?? {};

    try {
      final roleData = await _supabase
          .from('user_roles')
          .select('role, prefeitura_id')
          .eq('user_id', user.id)
          .maybeSingle();

      return AppUser(
        id: user.id,
        email: user.email ?? '',
        name: metadata['name'] as String?,
        role: AppUserRole.fromString(roleData?['role'] as String?),
        prefeituraId: roleData?['prefeitura_id'] as String?,
      );
    } catch (_) {
      // Fallback: se não encontrar registro em user_roles, trata como cidadão comum
      return AppUser(
        id: user.id,
        email: user.email ?? '',
        name: metadata['name'] as String?,
        role: AppUserRole.user,
      );
    }
  }
}
