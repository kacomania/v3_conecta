import '../entities/notification_entity.dart';

abstract class NotificationRepository {
  Stream<List<NotificationEntity>> watchNotifications(String userId);
  Future<void> markAsRead(String notificationId);
}
