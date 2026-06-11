import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cidadao_conecta/ui/novo_chamado/viewmodels/novo_chamado_view_model.dart';
import 'package:cidadao_conecta/domain/entities/draft_solicitacao.dart';
import 'package:cidadao_conecta/domain/entities/occurrence_entity.dart';
import 'package:cidadao_conecta/domain/entities/occurrence_timeline_entity.dart';
import 'package:cidadao_conecta/domain/repositories/occurrence_repository.dart';
import 'package:cidadao_conecta/core/di/providers.dart';
import 'package:cidadao_conecta/domain/models/app_user.dart';
import 'package:cidadao_conecta/domain/models/prefeitura_model.dart';
import 'dart:async';

class FakeOccurrenceRepository implements OccurrenceRepository {
  bool throwError = false;
  String returnedId = 'PROT-1234';
  
  @override
  Future<String> createOccurrence(DraftSolicitacao draft, String userId, String prefeituraId) async {
    if (throwError) throw Exception('Erro simulado');
    return returnedId;
  }
  
  @override Future<List<Map<String, dynamic>>> findDuplicates(String description, double lat, double lng, String prefeituraId) async => [];
  @override Future<void> supportOccurrence(String occurrenceId) async {}
  @override Future<List<OccurrenceEntity>> getOccurrencesByUser(String userId) async => [];
  @override Future<List<OccurrenceTimelineEntity>> getTimelineForOccurrence(String occurrenceId) async => [];
  @override Stream<List<OccurrenceTimelineEntity>> getTimelineStreamForOccurrence(String occurrenceId) => Stream.value([]);
  @override Future<void> updateOccurrenceLocation(String occurrenceId, double newLat, double newLng) async {}
  @override Future<void> rateOccurrence(String occurrenceId, int rating, String? feedbackNotes) async {}
}

class FakeCurrentTenantNotifier extends CurrentTenantNotifier {
  @override
  Future<PrefeituraModel?> build() async {
    return const PrefeituraModel(id: 'pref-123', name: 'Prefeitura');
  }
}

void main() {
  group('NovoChamadoViewModel', () {
    late ProviderContainer container;
    late FakeOccurrenceRepository mockRepo;

    setUp(() {
      mockRepo = FakeOccurrenceRepository();
      container = ProviderContainer(
        overrides: [
          occurrenceRepositoryProvider.overrideWithValue(mockRepo),
          authStateProvider.overrideWith((ref) async* {
            yield const AppUser(id: 'user-123', email: 'test@test.com');
          }),
          currentTenantProvider.overrideWith(() => FakeCurrentTenantNotifier()),
        ],
      );
    });

    tearDown(() {
      container.dispose();
    });

    test('should start with empty draft', () async {
      final state = await container.read(novoChamadoViewModelProvider.future);
      expect(state.titulo, '');
      expect(state.descricao, '');
    });

    test('should update titulo', () async {
      final notifier = container.read(novoChamadoViewModelProvider.notifier);
      notifier.updateTitulo('Novo Titulo');
      final state = await container.read(novoChamadoViewModelProvider.future);
      expect(state.titulo, 'Novo Titulo');
    });

  });
}
