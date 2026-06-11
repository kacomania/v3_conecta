import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'route_names.dart';
import '../core/di/providers.dart';
import '../ui/features/auth/screens/login_screen.dart';
import '../ui/features/auth/screens/register_screen.dart';
import '../ui/features/auth/screens/recovery_screen.dart';
import '../ui/features/perfil/screens/meu_perfil_page.dart';
import '../ui/home/pages/home_page.dart';
import '../ui/novo_chamado/pages/novo_chamado_page.dart';
import '../ui/meus_chamados/screens/meus_chamados_page.dart';
import '../ui/detalhes_chamado/screens/detalhes_chamado_page.dart';
import '../ui/notifications/pages/notifications_page.dart';
import '../ui/novo_chamado/pages/camera_screen.dart';
import '../ui/features/announcements/screens/announcements_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authStateAsync = ref.watch(authStateProvider);

  ref.listen(
    authStateProvider,
    (previous, next) {
      final nextUser = next.value;
      final prevUser = previous?.value;
      if (nextUser != null && prevUser?.id != nextUser.id) {
        ref.read(deviceTokenRepositoryProvider).syncDeviceToken(nextUser.id);
        
        if (nextUser.prefeituraId != null) {
          ref.read(currentTenantProvider.notifier).setTenantById(nextUser.prefeituraId!);
        }
      }
    },
    fireImmediately: true,
  );

  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      if (authStateAsync.isLoading) return null;

      final user = authStateAsync.value;
      final isAuth = user != null;
      final location = state.matchedLocation;

      final isAuthRoute =
          location == '/login' ||
          location == '/register' ||
          location == '/recovery';

      // Não autenticado: vai para login (exceto se já está em rota de auth)
      if (!isAuth && !isAuthRoute) return '/login';

      // Autenticado em rota de auth: redireciona para home
      if (isAuth && isAuthRoute) return '/';

      return null;
    },
    routes: [
      GoRoute(
        name: RouteNames.home,
        path: '/',
        builder: (context, state) => const HomePage(),
      ),
      GoRoute(
        name: RouteNames.login,
        path: '/login',
        builder: (context, state) => const LoginScreen(),
      ),
      GoRoute(
        name: RouteNames.register,
        path: '/register',
        builder: (context, state) => const RegisterScreen(),
      ),
      GoRoute(
        name: RouteNames.recovery,
        path: '/recovery',
        builder: (context, state) => const RecoveryScreen(),
      ),
      GoRoute(
        name: RouteNames.novoChamado,
        path: '/novo-chamado',
        builder: (context, state) => const NovoChamadoPage(),
      ),
      GoRoute(
        name: 'meusChamados',
        path: '/meus-chamados',
        builder: (context, state) => const MeusChamadosPage(),
      ),
      GoRoute(
        name: 'detalhesChamado',
        path: '/chamado/:id',
        builder: (context, state) {
          final id = state.pathParameters['id']!;
          return DetalhesChamadoPage(chamadoId: id);
        },
      ),
      GoRoute(
        name: RouteNames.meuPerfil,
        path: '/meu-perfil',
        builder: (context, state) => const MeuPerfilPage(),
      ),
      GoRoute(
        name: 'notificacoes',
        path: '/notificacoes',
        builder: (context, state) => const NotificationsPage(),
      ),
      GoRoute(
        name: RouteNames.camera,
        path: '/camera',
        builder: (context, state) => const CameraScreen(),
      ),
      GoRoute(
        name: RouteNames.avisos,
        path: '/avisos',
        builder: (context, state) => const AnnouncementsScreen(),
      ),
    ],
  );
});
