import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:geolocator/geolocator.dart';
import '../../../domain/entities/draft_solicitacao.dart';
import '../../../core/di/providers.dart';

/// Notifier central para a criação de um novo chamado (Draft).
///
/// **Clean Architecture & Gerenciamento de Estado:** Atua como a ponte exclusiva entre o fluxo 
/// de criação na UI e a camada de dados (Repository). Manipula os estados de `AsyncLoading` e 
/// `AsyncError` durante o envio (`submitAndGetProtocol`), assegurando que os Widgets permaneçam 'burros' 
/// e puramente reativos. Se houver falha, ele restaura inteligentemente o estado anterior (draft) 
/// permitindo que o cidadão tente novamente sem perder os dados preenchidos.
class NovoChamadoViewModel extends AsyncNotifier<DraftSolicitacao> {
  @override
  FutureOr<DraftSolicitacao> build() {
    return DraftSolicitacao();
  }

  void updateTitulo(String titulo) {
    if (state.value != null) {
      state = AsyncData(state.value!.copyWith(titulo: titulo));
    }
  }

  void updateDescricao(String descricao) {
    if (state.value != null) {
      state = AsyncData(state.value!.copyWith(descricao: descricao));
    }
  }

  void updateCategoria(String idCategoria) {
    if (state.value != null) {
      state = AsyncData(state.value!.copyWith(idCategoria: idCategoria));
    }
  }

  void updateEndereco(String endereco) {
    if (state.value != null) {
      state = AsyncData(state.value!.copyWith(endereco: endereco));
    }
  }

  void addFoto(String path) {
    if (state.value != null && state.value!.fotos.length >= 3) {
      return; // Limite de 3 fotos atingido
    }
    
    if (state.value != null) {
      state = AsyncData(state.value!.copyWith(
        fotos: [...state.value!.fotos, path],
      ));
    }
  }

  void removeFoto(int index) {
    if (state.value != null) {
      final novasFotos = List<String>.from(state.value!.fotos);
      if (index >= 0 && index < novasFotos.length) {
        novasFotos.removeAt(index);
        state = AsyncData(state.value!.copyWith(fotos: novasFotos));
      }
    }
  }

  Future<void> capturarLocalizacao() async {
    final draft = state.value;
    if (draft == null) return;

    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('Serviços de localização desabilitados no aparelho.');
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('Permissão de localização negada pelo usuário.');
      }
    }
    
    if (permission == LocationPermission.deniedForever) {
      throw Exception('Permissão de localização negada permanentemente nas config.');
    } 

    try {
      final position = await Geolocator.getCurrentPosition(
        locationSettings: const LocationSettings(timeLimit: Duration(seconds: 10)),
      );
      
      state = AsyncData(draft.copyWith(
        latitude: position.latitude,
        longitude: position.longitude,
      ));
    } catch (e) {
      throw Exception('Falha ao obter localização (GPS pode estar sem sinal): $e');
    }
  }

  Future<String> submitAndGetProtocol() async {
    final draft = state.value;
    if (draft == null) throw Exception('Rascunho não encontrado');

    // Cache the previous value to revert to it on error
    final previousState = state.value!;
    
    state = const AsyncLoading();
    
    try {
      final repo = ref.read(occurrenceRepositoryProvider);
      
      // Capture user_id
      final user = ref.read(authStateProvider).value;
      final userId = user?.id;
      if (userId == null) throw Exception('Usuário não autenticado');

      // Capture prefeitura_id
      final tenant = ref.read(currentTenantProvider).value;
      final prefeituraId = tenant?.id;
      if (prefeituraId == null) throw Exception('Prefeitura não selecionada');

      final occurrenceId = await repo.createOccurrence(draft, userId, prefeituraId);
      final protocol = occurrenceId.split('-').first.toUpperCase();
      
      // Return empty draft on success
      state = AsyncData(DraftSolicitacao());
      return protocol;
    } catch (e, st) {
      state = AsyncError(e, st);
      // Wait a moment then revert state to previous draft so user can try again
      Future.delayed(const Duration(milliseconds: 100), () {
        state = AsyncData(previousState);
      });
      rethrow;
    }
  }

  void reset() {
    state = AsyncData(DraftSolicitacao());
  }
}

final novoChamadoViewModelProvider =
    AsyncNotifierProvider<NovoChamadoViewModel, DraftSolicitacao>(() {
  return NovoChamadoViewModel();
});
