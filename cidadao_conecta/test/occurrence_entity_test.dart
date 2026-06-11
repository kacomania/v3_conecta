import 'package:flutter_test/flutter_test.dart';
import 'package:cidadao_conecta/domain/entities/occurrence_entity.dart';

void main() {
  group('OccurrenceEntity', () {
    test('fromJson and toJson should work correctly', () {
      final json = {
        'id': '123',
        'title': 'Test title',
        'description': 'Test description',
        'latitude': -23.5,
        'longitude': -46.6,
        'image_url': 'http://example.com/image.jpg',
        'image_urls': ['http://example.com/image.jpg'],
        'status': 'PENDING',
        'user_id': 'user123',
        'category_id': 'cat123',
        'department_id': 'dep123',
        'prefeitura_id': 'pref123',
        'created_at': '2026-06-11T12:00:00.000Z',
        'original_latitude': -23.5,
        'original_longitude': -46.6,
        'location_edited_at': null,
        'due_date': null,
        'rating': 5,
        'feedback_notes': 'Good',
        'supporters_count': 10,
      };

      final entity = OccurrenceEntity.fromJson(json);

      expect(entity.id, '123');
      expect(entity.title, 'Test title');
      expect(entity.description, 'Test description');
      expect(entity.latitude, -23.5);
      expect(entity.longitude, -46.6);
      expect(entity.imageUrl, 'http://example.com/image.jpg');
      expect(entity.imageUrls, ['http://example.com/image.jpg']);
      expect(entity.status, 'PENDING');
      expect(entity.userId, 'user123');
      expect(entity.categoryId, 'cat123');
      expect(entity.departmentId, 'dep123');
      expect(entity.prefeituraId, 'pref123');
      expect(entity.createdAt, DateTime.parse('2026-06-11T12:00:00.000Z'));
      expect(entity.originalLatitude, -23.5);
      expect(entity.originalLongitude, -46.6);
      expect(entity.locationEditedAt, null);
      expect(entity.dueDate, null);
      expect(entity.rating, 5);
      expect(entity.feedbackNotes, 'Good');
      expect(entity.supportersCount, 10);

      final toJsonResult = entity.toJson();

      expect(toJsonResult['id'], '123');
      expect(toJsonResult['title'], 'Test title');
      expect(toJsonResult['description'], 'Test description');
      expect(toJsonResult['latitude'], -23.5);
      expect(toJsonResult['longitude'], -46.6);
      expect(toJsonResult['image_url'], 'http://example.com/image.jpg');
      expect(toJsonResult['image_urls'], ['http://example.com/image.jpg']);
      expect(toJsonResult['status'], 'PENDING');
      expect(toJsonResult['user_id'], 'user123');
      expect(toJsonResult['category_id'], 'cat123');
      expect(toJsonResult['department_id'], 'dep123');
      expect(toJsonResult['prefeitura_id'], 'pref123');
      expect(toJsonResult['created_at'], '2026-06-11T12:00:00.000Z');
      expect(toJsonResult['original_latitude'], -23.5);
      expect(toJsonResult['original_longitude'], -46.6);
      expect(toJsonResult['location_edited_at'], null);
      expect(toJsonResult['due_date'], null);
      expect(toJsonResult['rating'], 5);
      expect(toJsonResult['feedback_notes'], 'Good');
      expect(toJsonResult['supporters_count'], 10);
    });
  });
}
