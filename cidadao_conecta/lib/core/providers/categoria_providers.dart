import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../di/providers.dart';
import '../../data/repositories/categoria_repository_impl.dart';
import '../../domain/repositories/categoria_repository.dart';

final categoriaRepositoryProvider = Provider<CategoriaRepository>((ref) {
  return CategoriaRepositoryImpl(ref.watch(supabaseClientProvider));
});
