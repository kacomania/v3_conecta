class OccurrenceEntity {
  final String id;
  final String title;
  final String description;
  final double? latitude;
  final double? longitude;
  final String? imageUrl;
  final List<String> imageUrls;
  final String status;
  final String? userId;
  final String? categoryId;
  final String? departmentId;
  final String prefeituraId;
  final DateTime createdAt;

  // Campos de auditoria de localização
  final double? originalLatitude;
  final double? originalLongitude;
  final DateTime? locationEditedAt;
  final DateTime? dueDate;
  final int? rating;
  final String? feedbackNotes;

  /// Retorna true se a localização já foi editada uma vez (não pode mais editar)
  bool get locationAlreadyEdited => locationEditedAt != null;

  final int supportersCount;

  OccurrenceEntity({
    required this.id,
    required this.title,
    required this.description,
    this.latitude,
    this.longitude,
    this.imageUrl,
    this.imageUrls = const [],
    required this.status,
    this.userId,
    this.categoryId,
    this.departmentId,
    required this.prefeituraId,
    required this.createdAt,
    this.originalLatitude,
    this.originalLongitude,
    this.locationEditedAt,
    this.dueDate,
    this.rating,
    this.feedbackNotes,
    this.supportersCount = 0,
  });

  factory OccurrenceEntity.fromJson(Map<String, dynamic> json) {
    return OccurrenceEntity(
      id: json['id'] as String,
      title: json['title'] as String,
      description: json['description'] as String,
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
      imageUrl: json['image_url'] as String?,
      imageUrls: List<String>.from(json['image_urls'] ?? []),
      status: json['status'] as String,
      userId: json['user_id'] as String?,
      categoryId: json['category_id'] as String?,
      departmentId: json['department_id'] as String?,
      prefeituraId: json['prefeitura_id'] as String,
      createdAt: json['created_at'] != null ? DateTime.parse(json['created_at']) : DateTime.now(),
      originalLatitude: json['original_latitude']?.toDouble(),
      originalLongitude: json['original_longitude']?.toDouble(),
      locationEditedAt: json['location_edited_at'] != null ? DateTime.parse(json['location_edited_at']) : null,
      dueDate: json['due_date'] != null ? DateTime.parse(json['due_date']) : null,
      rating: json['rating'] as int?,
      feedbackNotes: json['feedback_notes'] as String?,
      supportersCount: json['supporters_count'] as int? ?? 0,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'title': title,
      'description': description,
      'latitude': latitude,
      'longitude': longitude,
      'image_url': imageUrl,
      'image_urls': imageUrls,
      'status': status,
      'user_id': userId,
      'category_id': categoryId,
      'department_id': departmentId,
      'prefeitura_id': prefeituraId,
      'created_at': createdAt.toIso8601String(),
      'original_latitude': originalLatitude,
      'original_longitude': originalLongitude,
      'location_edited_at': locationEditedAt?.toIso8601String(),
      'due_date': dueDate?.toIso8601String(),
      'rating': rating,
      'feedback_notes': feedbackNotes,
      'supporters_count': supportersCount,
    };
  }
}
