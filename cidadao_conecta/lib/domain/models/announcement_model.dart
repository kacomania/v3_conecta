class AnnouncementModel {
  final String id;
  final String prefeituraId;
  final String title;
  final String body;
  final String severity;
  final DateTime createdAt;

  AnnouncementModel({
    required this.id,
    required this.prefeituraId,
    required this.title,
    required this.body,
    required this.severity,
    required this.createdAt,
  });

  factory AnnouncementModel.fromJson(Map<String, dynamic> json) {
    return AnnouncementModel(
      id: json['id'] as String,
      prefeituraId: json['prefeitura_id'] as String,
      title: json['title'] as String,
      body: json['body'] as String,
      severity: json['severity'] as String,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }
}
