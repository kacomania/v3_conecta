import 'package:flutter_test/flutter_test.dart';
import 'package:cidadao_conecta/domain/entities/occurrence_entity.dart';

void main() {
  group('OccurrenceEntity', () {
    test('should instantiate correctly and locationAlreadyEdited should be false when locationEditedAt is null', () {
      final entity = OccurrenceEntity(
        id: '123',
        title: 'Test',
        description: 'Test Desc',
        status: 'PENDING',
        prefeituraId: 'pref-1',
        createdAt: DateTime.now(),
      );

      expect(entity.id, '123');
      expect(entity.title, 'Test');
      expect(entity.locationAlreadyEdited, isFalse);
      expect(entity.supportersCount, 0); // default
    });

    test('locationAlreadyEdited should be true when locationEditedAt is not null', () {
      final entity = OccurrenceEntity(
        id: '123',
        title: 'Test',
        description: 'Test Desc',
        status: 'PENDING',
        prefeituraId: 'pref-1',
        createdAt: DateTime.now(),
        locationEditedAt: DateTime.now(),
      );

      expect(entity.locationAlreadyEdited, isTrue);
    });
  });
}
