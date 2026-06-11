import 'dart:developer';
import 'dart:io';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import '../../domain/repositories/device_token_repository.dart';

class DeviceTokenRepositoryImpl implements DeviceTokenRepository {
  final SupabaseClient _supabaseClient;

  DeviceTokenRepositoryImpl(this._supabaseClient);

  @override
  Future<void> syncDeviceToken(String userId) async {
    try {
      final String? token = await FirebaseMessaging.instance.getToken();
      if (token == null) return;

      final platform = Platform.isIOS ? 'ios' : (Platform.isAndroid ? 'android' : 'web');

      await _supabaseClient.from('user_devices').upsert({
        'user_id': userId,
        'fcm_token': token,
        'platform': platform,
      }, onConflict: 'user_id, fcm_token');
    } catch (e) {
      log('Failed to sync device token: $e', error: e);
    }
  }
}
