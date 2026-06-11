import '../entities/categoria_entity.dart';

abstract class CategoriaRepository {
  Future<List<CategoriaEntity>> getCategorias(String prefeituraId);
}
