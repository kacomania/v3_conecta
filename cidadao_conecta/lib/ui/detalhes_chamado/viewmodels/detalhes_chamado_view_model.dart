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

/// Notifier responsável por gerenciar o estado assíncrono da atualização de localização.
///
/// **Clean Architecture:** Atua como a única ponte permitida entre a UI (que deve ser 'burra') e
/// o `OccurrenceRepository`. Ao utilizar `AsyncValue` (loading, data, error), ele garante que
/// os Widgets apenas reajam às mudanças de estado, sem conter lógica de negócio ou chamadas diretas ao banco.
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

/// Notifier responsável pelo fluxo de avaliação (rating) de um chamado.
///
/// Encapsula a mutação assíncrona (AsyncValue) garantindo que a UI mostre os estados de loading
/// ou erro corretamente. Isolando a camada de apresentação, os repositórios permanecem agnósticos 
/// ao framework Flutter, e os Widgets reagem automaticamente às mudanças.
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
