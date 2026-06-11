import '../entities/draft_solicitacao.dart';
import '../entities/occurrence_entity.dart';
import '../entities/occurrence_timeline_entity.dart';

abstract class OccurrenceRepository {
  // ── Cidadão ───────────────────────────────────────────────────────────────
  Future<String> createOccurrence(DraftSolicitacao draft, String userId, String prefeituraId);
  Future<List<Map<String, dynamic>>> findDuplicates(String description, double lat, double lng, String prefeituraId);
  Future<void> supportOccurrence(String occurrenceId);
  Future<List<OccurrenceEntity>> getOccurrencesByUser(String userId);
  Future<List<OccurrenceTimelineEntity>> getTimelineForOccurrence(String occurrenceId);
  Stream<List<OccurrenceTimelineEntity>> getTimelineStreamForOccurrence(String occurrenceId);
  Future<void> updateOccurrenceLocation(String occurrenceId, double newLat, double newLng);
  Future<void> rateOccurrence(String occurrenceId, int rating, String? feedbackNotes);
}

