import '../models/announcement_model.dart';

abstract class AnnouncementRepository {
  Future<List<AnnouncementModel>> getAnnouncements(String prefeituraId);
}
