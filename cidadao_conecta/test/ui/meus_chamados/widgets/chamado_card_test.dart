import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cidadao_conecta/ui/meus_chamados/widgets/chamado_card.dart';
import 'package:cidadao_conecta/domain/entities/occurrence_entity.dart';

void main() {
  group('ChamadoCard', () {
    testWidgets('should render with correct status color for PENDING', (WidgetTester tester) async {
      final occurrence = OccurrenceEntity(
        id: '123',
        title: 'Buraco na rua',
        description: 'Um buraco enorme',
        status: 'PENDING',
        prefeituraId: 'pref-1',
        createdAt: DateTime.now(),
      );

      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ChamadoCard(
            occurrence: occurrence,
            onTap: () {},
          ),
        ),
      ));

      expect(find.text('Buraco na rua'), findsOneWidget);
      expect(find.text('PENDENTE'), findsOneWidget);

      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(ChamadoCard),
          matching: find.byWidgetPredicate((widget) => widget is Container && widget.decoration is BoxDecoration && (widget.decoration as BoxDecoration).color == const Color(0xFFFEF08A))
        ).last
      );
      
      expect((container.decoration as BoxDecoration).color, const Color(0xFFFEF08A));
    });

    testWidgets('should render with correct status color for COMPLETED', (WidgetTester tester) async {
      final occurrence = OccurrenceEntity(
        id: '123',
        title: 'Poste apagado',
        description: 'Escuro',
        status: 'COMPLETED',
        prefeituraId: 'pref-1',
        createdAt: DateTime.now(),
      );

      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: ChamadoCard(
            occurrence: occurrence,
            onTap: () {},
          ),
        ),
      ));

      expect(find.text('Poste apagado'), findsOneWidget);
      expect(find.text('CONCLUÍDO'), findsOneWidget);
      
      final container = tester.widget<Container>(
        find.descendant(
          of: find.byType(ChamadoCard),
          matching: find.byWidgetPredicate((widget) => widget is Container && widget.decoration is BoxDecoration && (widget.decoration as BoxDecoration).color == const Color(0xFFBBF7D0))
        ).last
      );
      
      expect((container.decoration as BoxDecoration).color, const Color(0xFFBBF7D0));
    });
  });
}
