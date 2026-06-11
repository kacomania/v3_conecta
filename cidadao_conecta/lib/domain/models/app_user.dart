/// Roles válidas do sistema (espelha o CHECK da tabela user_roles).
enum AppUserRole {
  user,
  attendant,
  manager,
  auditor,
  cityAdmin,
  systemAdmin;

  static AppUserRole fromString(String? value) {
    switch (value) {
      case 'ATTENDANT':
        return AppUserRole.attendant;
      case 'MANAGER':
        return AppUserRole.manager;
      case 'AUDITOR':
        return AppUserRole.auditor;
      case 'CITY_ADMIN':
        return AppUserRole.cityAdmin;
      case 'SYSTEM_ADMIN':
        return AppUserRole.systemAdmin;
      case 'USER':
      default:
        return AppUserRole.user;
    }
  }

  /// Retorna true para qualquer role de servidor (não-cidadão).
  bool get isStaff => this != AppUserRole.user;
}

class AppUser {
  final String id;
  final String email;
  final String? name;
  final AppUserRole role;
  final String? prefeituraId;

  const AppUser({
    required this.id,
    required this.email,
    this.name,
    this.role = AppUserRole.user,
    this.prefeituraId,
  });

  /// Atalho para verificar se é funcionário da prefeitura.
  bool get isStaff => role.isStaff;

  factory AppUser.fromJson(Map<String, dynamic> json) {
    return AppUser(
      id: json['id'] as String,
      email: json['email'] as String,
      name: json['name'] as String?,
      role: AppUserRole.fromString(json['role'] as String?),
      prefeituraId: json['prefeitura_id'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role.name,
      'prefeitura_id': prefeituraId,
    };
  }
}
