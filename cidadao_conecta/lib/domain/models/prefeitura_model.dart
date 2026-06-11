class PrefeituraModel {
  final String id;
  final String name;
  final String? primaryColor;
  final String? secondaryColor;
  final String? logoUrl;

  const PrefeituraModel({
    required this.id,
    required this.name,
    this.primaryColor,
    this.secondaryColor,
    this.logoUrl,
  });

  factory PrefeituraModel.fromJson(Map<String, dynamic> json) {
    return PrefeituraModel(
      id: json['id'] as String,
      name: json['name'] as String,
      primaryColor: json['primary_color'] as String?,
      secondaryColor: json['secondary_color'] as String?,
      logoUrl: json['logo_url'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'primary_color': primaryColor,
      'secondary_color': secondaryColor,
      'logo_url': logoUrl,
    };
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is PrefeituraModel && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;
}
