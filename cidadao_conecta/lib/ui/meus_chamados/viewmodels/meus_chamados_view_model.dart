import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../domain/entities/occurrence_entity.dart';
import '../../../core/di/providers.dart';
import '../../../core/local_db/local_database_helper.dart';
import '../../../core/network/sync_service.dart';

/// Representa o estado mesclado: chamados do Supabase + chamados na fila offline.
class MergedOccurrencesState {
  final List<OccurrenceEntity> supabaseItems;
  final List<QueuedOccurrence> offlineItems;

  const MergedOccurrencesState({
    this.supabaseItems = const [],
    this.offlineItems = const [],
  });

  /// Lista completa: itens offline no topo, seguidos dos do Supabase.
  List<Object> get allItems => [...offlineItems, ...supabaseItems];

  bool get hasOfflineItems => offlineItems.isNotEmpty;
}

class MeusChamadosViewModel
    extends AsyncNotifier<MergedOccurrencesState> {
  final LocalDatabaseHelper _localDb = LocalDatabaseHelper();
  StreamSubscription<void>? _syncSubscription;

  @override
  Future<MergedOccurrencesState> build() async {
    // Escuta o SyncService: quando sincroniza, atualiza a lista automaticamente
    final syncService = ref.watch(syncServiceProvider);
    _syncSubscription?.cancel();
    _syncSubscription = syncService.onSyncCompleted.listen((_) {
      fetchOccurrences();
    });

    ref.onDispose(() => _syncSubscription?.cancel());

    return _loadMergedState();
  }

  Future<MergedOccurrencesState> _loadMergedState() async {
    final authState = ref.read(authStateProvider);

    final user = authState.value;
    if (user == null) return const MergedOccurrencesState();

    // Carrega em paralelo para maior performance
    final results = await Future.wait([
      ref.read(occurrenceRepositoryProvider).getOccurrencesByUser(user.id),
      _localDb.getAllQueuedOccurrences(),
    ]);

    final supabaseItems = results[0] as List<OccurrenceEntity>;
    final offlineItems = results[1] as List<QueuedOccurrence>;

    return MergedOccurrencesState(
      supabaseItems: supabaseItems,
      offlineItems: offlineItems,
    );
  }

  Future<void> fetchOccurrences() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(_loadMergedState);
  }
}

final meusChamadosProvider =
    AsyncNotifierProvider<MeusChamadosViewModel, MergedOccurrencesState>(() {
  return MeusChamadosViewModel();
});

