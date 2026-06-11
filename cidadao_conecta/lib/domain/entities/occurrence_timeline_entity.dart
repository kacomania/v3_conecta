class OccurrenceTimelineEntity {
  final String id;
  final String occurrenceId;
  final String? createdBy;
  final String? oldStatus;
  final String newStatus;
  final String? description;
  final String? imageUrl;
  final bool isPublic;
  final DateTime createdAt;

  OccurrenceTimelineEntity({
    required this.id,
    required this.occurrenceId,
    this.createdBy,
    this.oldStatus,
    required this.newStatus,
    this.description,
    this.imageUrl,
    required this.isPublic,
    required this.createdAt,
  });
}
