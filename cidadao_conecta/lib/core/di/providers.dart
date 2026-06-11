import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../network/supabase_client.dart';
import '../../ui/core/themes/tenant_theme.dart';
import '../../data/services/supabase_auth_service.dart';
import '../../data/services/supabase_tenant_service.dart';
import '../../data/repositories/auth_repository_impl.dart';
import '../../data/repositories/tenant_repository_impl.dart';
import '../../domain/repositories/auth_repository.dart';
import '../../domain/repositories/tenant_repository.dart';
import '../../domain/repositories/occurrence_repository.dart';
import '../../domain/models/app_user.dart';
import '../../domain/models/prefeitura_model.dart';
import '../../data/repositories/occurrence_repository_impl.dart';
import '../../domain/repositories/notification_repository.dart';
import '../../data/repositories/notification_repository_impl.dart';
import '../../domain/entities/notification_entity.dart';
import '../../domain/repositories/device_token_repository.dart';
import '../../data/repositories/device_token_repository_impl.dart';
import '../../domain/repositories/announcement_repository.dart';
import '../../data/repositories/announcement_repository_impl.dart';

// Supabase Client Provider
final supabaseClientProvider = Provider<SupabaseClient>((ref) {
  return SupabaseConfig.client;
});

// Services
final authServiceProvider = Provider<SupabaseAuthService>((ref) {
  return SupabaseAuthService(ref.watch(supabaseClientProvider));
});

final tenantServiceProvider = Provider<SupabaseTenantService>((ref) {
  return SupabaseTenantService(ref.watch(supabaseClientProvider));
});

// Repositories
final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepositoryImpl(
    ref.watch(authServiceProvider),
    ref.watch(supabaseClientProvider),
  );
});

final tenantRepositoryProvider = Provider<TenantRepository>((ref) {
  return TenantRepositoryImpl(ref.watch(tenantServiceProvider));
});

final occurrenceRepositoryProvider = Provider<OccurrenceRepository>((ref) {
  return OccurrenceRepositoryImpl(ref.watch(supabaseClientProvider));
});

final notificationRepositoryProvider = Provider<NotificationRepository>((ref) {
  return NotificationRepositoryImpl(ref.watch(supabaseClientProvider));
});

final deviceTokenRepositoryProvider = Provider<DeviceTokenRepository>((ref) {
  return DeviceTokenRepositoryImpl(ref.watch(supabaseClientProvider));
});

final announcementRepositoryProvider = Provider<AnnouncementRepository>((ref) {
  return AnnouncementRepositoryImpl(ref.watch(supabaseClientProvider));
});

// Auth State Provider
final authStateProvider = StreamProvider<AppUser?>((ref) {
  final authRepository = ref.watch(authRepositoryProvider);
  return authRepository.authStateChanges;
});

// Notifications Providers
final notificationsProvider = StreamProvider<List<NotificationEntity>>((ref) {
  final user = ref.watch(authStateProvider).value;
  if (user == null) {
    return Stream.value([]);
  }
  final repo = ref.watch(notificationRepositoryProvider);
  return repo.watchNotifications(user.id);
});

final unreadNotificationsCountProvider = Provider<int>((ref) {
  final notifications = ref.watch(notificationsProvider).value ?? [];
  return notifications.where((n) => !n.isRead).length;
});

// Current Tenant Provider (AsyncNotifier)
class CurrentTenantNotifier extends AsyncNotifier<PrefeituraModel?> {
  static const _tenantKey = 'last_prefeitura_id';

  @override
  Future<PrefeituraModel?> build() async {
    final prefs = await SharedPreferences.getInstance();
    final tenantId = prefs.getString(_tenantKey);
    
    if (tenantId == null) return null;

    final repo = ref.read(tenantRepositoryProvider);
    return await repo.fetchTenantById(tenantId);
  }

  Future<void> setTenant(PrefeituraModel tenant) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tenantKey, tenant.id);
    state = AsyncValue.data(tenant);
  }

  Future<void> setTenantById(String tenantId) async {
    try {
      final repo = ref.read(tenantRepositoryProvider);
      final tenant = await repo.fetchTenantById(tenantId);
      if (tenant != null) {
        await setTenant(tenant);
      }
    } catch (e) {
      // Ignora erro se não encontrar a prefeitura
    }
  }
}

final currentTenantProvider = AsyncNotifierProvider<CurrentTenantNotifier, PrefeituraModel?>(() {
  return CurrentTenantNotifier();
});

// Tenant Theme Provider (now depends on currentTenantProvider)
final tenantThemeProvider = Provider<TenantTheme>((ref) {
  final tenantState = ref.watch(currentTenantProvider);
  
  return tenantState.maybeWhen(
    data: (tenant) {
      if (tenant == null) return TenantTheme.defaultTheme();
      return TenantTheme.fromColors(
        primaryColorHex: tenant.primaryColor,
        secondaryColorHex: tenant.secondaryColor,
      );
    },
    orElse: () => TenantTheme.defaultTheme(),
  );
});
