import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/network/supabase_client.dart';
import 'core/network/sync_service.dart';
import 'core/di/providers.dart';
import 'routing/app_router.dart';

import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'firebase_options.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize dotenv
  await dotenv.load(fileName: ".env");
  
  // Initialize Firebase safely
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );

    // Request notification permissions
    await FirebaseMessaging.instance.requestPermission(
      alert: true,
      badge: true,
      sound: true,
    );
  } catch (e) {
    debugPrint('Erro ao inicializar Firebase (faltam configurações/google-services.json?): $e');
  }
  
  // Initialize Supabase
  await SupabaseConfig.initialize();

  runApp(
    const ProviderScope(
      child: MyApp(),
    ),
  );
}

class MyApp extends ConsumerStatefulWidget {
  const MyApp({super.key});

  @override
  ConsumerState<MyApp> createState() => _MyAppState();
}

class _MyAppState extends ConsumerState<MyApp> {
  @override
  void initState() {
    super.initState();
    _setupPushNotificationNavigation();
    // Inicializa o SyncService em background — começa a ouvir a rede
    ref.read(syncServiceProvider);
  }

  void _setupPushNotificationNavigation() {
    // Tratamento para quando o app é aberto a partir de uma notificação (background)
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      _handleNotificationClick(message);
    });

    // Tratamento para quando o app é aberto a partir de uma notificação (terminated/closed)
    FirebaseMessaging.instance.getInitialMessage().then((RemoteMessage? message) {
      if (message != null) {
        WidgetsBinding.instance.addPostFrameCallback((_) {
          _handleNotificationClick(message);
        });
      }
    });
  }

  void _handleNotificationClick(RemoteMessage message) {
    final occurrenceId = message.data['occurrence_id'];
    if (occurrenceId != null && occurrenceId.toString().isNotEmpty) {
      // Navega para a tela de detalhes usando o GoRouter
      ref.read(routerProvider).push('/chamado/$occurrenceId');
    }
  }

  @override
  Widget build(BuildContext context) {
    final router = ref.watch(routerProvider);
    final tenantTheme = ref.watch(tenantThemeProvider);

    return MaterialApp.router(
      title: 'Conecta V3',
      theme: tenantTheme.themeData,
      routerConfig: router,
      debugShowCheckedModeBanner: false,
    );
  }
}
