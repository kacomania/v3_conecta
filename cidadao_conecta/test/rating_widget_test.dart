import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cidadao_conecta/ui/detalhes_chamado/widgets/rating_widget.dart';

void main() {
  testWidgets('RatingWidget renders 5 stars and reacts to clicks', (WidgetTester tester) async {
    int? submittedRating;
    String? submittedFeedback;

    await tester.pumpWidget(
      ProviderScope(
        child: MaterialApp(
          home: Scaffold(
            body: RatingWidget(
              onSubmit: (rating, feedback) async {
                submittedRating = rating;
                submittedFeedback = feedback;
              },
            ),
          ),
        ),
      ),
    );

    // Verify 5 stars are rendered
    expect(find.byType(IconButton), findsNWidgets(5));
    expect(find.byIcon(Icons.star_border), findsNWidgets(5));

    // Tap the 4th star
    await tester.tap(find.byType(IconButton).at(3));
    await tester.pump();

    // Verify stars updated (4 filled, 1 empty)
    expect(find.byIcon(Icons.star), findsNWidgets(4));
    expect(find.byIcon(Icons.star_border), findsNWidgets(1));

    // Fill feedback
    await tester.enterText(find.byType(TextField), 'Great service');
    await tester.pump();

    // Submit
    await tester.tap(find.byType(ElevatedButton));
    await tester.pump(); // Start loading
    await tester.pump(); // Finish loading

    expect(submittedRating, 4);
    expect(submittedFeedback, 'Great service');
  });
}
