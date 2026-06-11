import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cidadao_conecta/ui/meus_chamados/widgets/chamado_card.dart';
import 'package:cidadao_conecta/domain/entities/occurrence_entity.dart';

void main() {
  testWidgets('ChamadoCard displays correct color based on status', (WidgetTester tester) async {
    final occurrencePending = OccurrenceEntity(
      id: 'uuid-123',
      title: 'Hole in the road',
      description: 'Big hole',
      status: 'PENDING',
      prefeituraId: 'pref-123',
      createdAt: DateTime.now(),
    );

    await tester.pumpWidget(MaterialApp(
      home: Scaffold(
        body: ChamadoCard(
          occurrence: occurrencePending,
          onTap: () {},
        ),
      ),
    ));

    // Find the text
    final badgeText = find.text('PENDENTE');
    expect(badgeText, findsOneWidget);
    
    // Check background color
    final container = tester.widget<Container>(
      find.ancestor(of: badgeText, matching: find.byType(Container)).first
    );
    final decoration = container.decoration as BoxDecoration;
    expect(decoration.color, const Color(0xFFFEF08A));
  });
}
