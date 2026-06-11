import 'package:supabase_flutter/supabase_flutter.dart';
import '../../domain/models/announcement_model.dart';
import '../../domain/repositories/announcement_repository.dart';

class AnnouncementRepositoryImpl implements AnnouncementRepository {
  final SupabaseClient _supabase;

  AnnouncementRepositoryImpl(this._supabase);

  @override
  Future<List<AnnouncementModel>> getAnnouncements(String prefeituraId) async {
    final response = await _supabase
        .from('announcements')
        .select()
        .eq('prefeitura_id', prefeituraId)
        .order('created_at', ascending: false);

    return (response as List<dynamic>)
        .map((json) => AnnouncementModel.fromJson(json as Map<String, dynamic>))
        .toList();
  }
}
