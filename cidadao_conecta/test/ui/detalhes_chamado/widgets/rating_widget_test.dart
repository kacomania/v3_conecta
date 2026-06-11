import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:cidadao_conecta/ui/detalhes_chamado/widgets/rating_widget.dart';

void main() {
  group('RatingWidget', () {
    testWidgets('should render 5 stars', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(
        home: Scaffold(
          body: RatingWidget(),
        ),
      ));

      // Deve renderizar 5 icones de estrela
      expect(find.byType(Icon), findsNWidgets(5));
    });

    testWidgets('should react to click and update rating', (WidgetTester tester) async {
      int? submittedRating;
      String? submittedFeedback;

      await tester.pumpWidget(MaterialApp(
        home: Scaffold(
          body: RatingWidget(
            onSubmit: (rating, feedback) async {
              submittedRating = rating;
              submittedFeedback = feedback;
            },
          ),
        ),
      ));

      // Clica na 4ª estrela
      await tester.tap(find.byType(Icon).at(3));
      await tester.pump();

      // Clica no botão de enviar
      await tester.tap(find.byType(ElevatedButton));
      await tester.pumpAndSettle();

      expect(submittedRating, 4);
      expect(submittedFeedback, '');
    });
  });
}
