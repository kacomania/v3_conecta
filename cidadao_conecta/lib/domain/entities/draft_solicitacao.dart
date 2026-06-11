class DraftSolicitacao {
  final String? idCategoria;
  final String titulo;
  final String descricao;
  final String endereco;
  final double? latitude;
  final double? longitude;
  final List<String> fotos;

  DraftSolicitacao({
    this.idCategoria,
    this.titulo = '',
    this.descricao = '',
    this.endereco = '',
    this.latitude,
    this.longitude,
    this.fotos = const [],
  });

  DraftSolicitacao copyWith({
    String? idCategoria,
    String? titulo,
    String? descricao,
    String? endereco,
    double? latitude,
    double? longitude,
    List<String>? fotos,
  }) {
    return DraftSolicitacao(
      idCategoria: idCategoria ?? this.idCategoria,
      titulo: titulo ?? this.titulo,
      descricao: descricao ?? this.descricao,
      endereco: endereco ?? this.endereco,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      fotos: fotos ?? this.fotos,
    );
  }
}
