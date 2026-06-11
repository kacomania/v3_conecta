import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cidadao_conecta/ui/novo_chamado/viewmodels/novo_chamado_view_model.dart';

void main() {
  group('NovoChamadoViewModel', () {
    late ProviderContainer container;

    setUp(() {
      container = ProviderContainer();
    });

    tearDown(() {
      container.dispose();
    });

    test('Initial state should be empty DraftSolicitacao', () async {
      final state = await container.read(novoChamadoViewModelProvider.future);
      expect(state.titulo, isEmpty);
      expect(state.descricao, isEmpty);
      expect(state.fotos, isEmpty);
    });

    test('updateTitulo updates the title', () async {
      // Ensure provider is initialized
      await container.read(novoChamadoViewModelProvider.future);
      
      container.read(novoChamadoViewModelProvider.notifier).updateTitulo('New Title');
      final state = container.read(novoChamadoViewModelProvider).value!;
      
      expect(state.titulo, 'New Title');
    });

    test('updateDescricao updates the description', () async {
      await container.read(novoChamadoViewModelProvider.future);
      
      container.read(novoChamadoViewModelProvider.notifier).updateDescricao('New Desc');
      final state = container.read(novoChamadoViewModelProvider).value!;
      
      expect(state.descricao, 'New Desc');
    });

    test('addFoto adds a photo up to limit of 3', () async {
      await container.read(novoChamadoViewModelProvider.future);
      final notifier = container.read(novoChamadoViewModelProvider.notifier);
      
      notifier.addFoto('path1.jpg');
      expect(container.read(novoChamadoViewModelProvider).value!.fotos.length, 1);
      expect(container.read(novoChamadoViewModelProvider).value!.fotos.first, 'path1.jpg');
      
      notifier.addFoto('path2.jpg');
      notifier.addFoto('path3.jpg');
      expect(container.read(novoChamadoViewModelProvider).value!.fotos.length, 3);
      
      // Should not add a 4th photo
      notifier.addFoto('path4.jpg');
      expect(container.read(novoChamadoViewModelProvider).value!.fotos.length, 3);
    });

    test('removeFoto removes a photo at index', () async {
      await container.read(novoChamadoViewModelProvider.future);
      final notifier = container.read(novoChamadoViewModelProvider.notifier);
      
      notifier.addFoto('path1.jpg');
      notifier.addFoto('path2.jpg');
      expect(container.read(novoChamadoViewModelProvider).value!.fotos.length, 2);
      
      notifier.removeFoto(0);
      expect(container.read(novoChamadoViewModelProvider).value!.fotos.length, 1);
      expect(container.read(novoChamadoViewModelProvider).value!.fotos.first, 'path2.jpg');
    });

    test('reset clears the draft', () async {
      await container.read(novoChamadoViewModelProvider.future);
      final notifier = container.read(novoChamadoViewModelProvider.notifier);
      
      notifier.updateTitulo('Title');
      notifier.addFoto('path1.jpg');
      
      expect(container.read(novoChamadoViewModelProvider).value!.titulo, 'Title');
      expect(container.read(novoChamadoViewModelProvider).value!.fotos, isNotEmpty);
      
      notifier.reset();
      
      expect(container.read(novoChamadoViewModelProvider).value!.titulo, isEmpty);
      expect(container.read(novoChamadoViewModelProvider).value!.fotos, isEmpty);
    });
  });
}
