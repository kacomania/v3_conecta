import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../domain/entities/occurrence_timeline_entity.dart';
import '../../../core/di/providers.dart';
import '../../meus_chamados/viewmodels/meus_chamados_view_model.dart';

final detalhesChamadoProvider =
    StreamProvider.family<List<OccurrenceTimelineEntity>, String>(
        (ref, occurrenceId) {
  final repository = ref.watch(occurrenceRepositoryProvider);
  return repository.getTimelineStreamForOccurrence(occurrenceId);
});

final occurrenceUpdatesProvider = StreamProvider.family<List<Map<String, dynamic>>, String>((ref, occurrenceId) {
  final supabase = ref.watch(supabaseClientProvider);
  return supabase.from('occurrences').stream(primaryKey: ['id']).eq('id', occurrenceId);
});

// Provider simples para o estado de update de localização
// O ID da ocorrência é passado como parâmetro do método, não da família.
final updateLocationProvider =
    AsyncNotifierProvider<UpdateLocationNotifier, void>(
  UpdateLocationNotifier.new,
);

class UpdateLocationNotifier extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  Future<void> updateLocation(
    String occurrenceId,
    double newLat,
    double newLng,
  ) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(occurrenceRepositoryProvider);
      await repository.updateOccurrenceLocation(occurrenceId, newLat, newLng);
      ref.invalidate(meusChamadosProvider);
    });
  }
}

final rateOccurrenceProvider =
    AsyncNotifierProvider<RateOccurrenceNotifier, void>(
  RateOccurrenceNotifier.new,
);

class RateOccurrenceNotifier extends AsyncNotifier<void> {
  @override
  Future<void> build() async {}

  Future<void> rateOccurrence(
    String occurrenceId,
    int rating,
    String? feedbackNotes,
  ) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() async {
      final repository = ref.read(occurrenceRepositoryProvider);
      await repository.rateOccurrence(occurrenceId, rating, feedbackNotes);
      ref.invalidate(meusChamadosProvider);
    });
  }
}
