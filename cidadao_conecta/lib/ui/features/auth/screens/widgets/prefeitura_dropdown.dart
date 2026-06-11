import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../../core/di/providers.dart';
import '../../../../../domain/models/prefeitura_model.dart';

final tenantsListProvider = FutureProvider<List<PrefeituraModel>>((ref) async {
  final repo = ref.watch(tenantRepositoryProvider);
  return repo.fetchAllTenants();
});

class PrefeituraDropdown extends ConsumerWidget {
  const PrefeituraDropdown({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tenantsAsyncValue = ref.watch(tenantsListProvider);
    final currentTenantAsync = ref.watch(currentTenantProvider);

    return tenantsAsyncValue.when(
      data: (tenants) {
        final currentTenant = currentTenantAsync.value;
        return DropdownButtonFormField<PrefeituraModel>(
          decoration: const InputDecoration(
            labelText: 'Selecione a Prefeitura',
            border: OutlineInputBorder(),
          ),
          initialValue: currentTenant,
          items: tenants.map((tenant) {
            return DropdownMenuItem(
              value: tenant,
              child: Text(tenant.name),
            );
          }).toList(),
          onChanged: (selectedTenant) {
            if (selectedTenant != null) {
              ref.read(currentTenantProvider.notifier).setTenant(selectedTenant);
            }
          },
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, st) => Text('Erro ao carregar prefeituras: $e'),
    );
  }
}
