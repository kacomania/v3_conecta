import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/di/providers.dart';
import '../../../../domain/models/announcement_model.dart';

final announcementsControllerProvider =
    AsyncNotifierProvider<AnnouncementsController, List<AnnouncementModel>>(
  AnnouncementsController.new,
);

class AnnouncementsController extends AsyncNotifier<List<AnnouncementModel>> {
  @override
  Future<List<AnnouncementModel>> build() async {
    final tenant = await ref.watch(currentTenantProvider.future);
    if (tenant == null) return [];

    final repository = ref.watch(announcementRepositoryProvider);
    return repository.getAnnouncements(tenant.id);
  }
}
