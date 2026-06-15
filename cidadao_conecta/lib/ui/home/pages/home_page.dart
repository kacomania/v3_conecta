import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../viewmodels/home_view_model.dart';
import '../widgets/greeting_header.dart';
import '../widgets/action_card.dart';
import '../widgets/category_grid.dart';
import '../../../core/di/providers.dart';
import '../../core/themes/app_colors.dart';
import '../../novo_chamado/viewmodels/novo_chamado_view_model.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final homeStateAsync = ref.watch(homeViewModelProvider);
    final tenantState = ref.watch(currentTenantProvider);

    return Scaffold(
      backgroundColor: AppColors.backgroundGrey,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        automaticallyImplyLeading: false,
        title: tenantState.value?.logoUrl != null
            ? CachedNetworkImage(
                imageUrl: tenantState.value!.logoUrl!,
                height: 40,
                errorWidget: (context, url, error) => const Text(
                  'Cidadão Conecta',
                  style: TextStyle(
                    color: AppColors.primary,
                    fontWeight: FontWeight.bold,
                    fontSize: 18,
                  ),
                ),
              )
            : const Text(
                'Cidadão Conecta',
                style: TextStyle(
                  color: AppColors.primary,
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                ),
              ),
        actions: [
          Consumer(
            builder: (context, ref, child) {
              final unreadCount = ref.watch(unreadNotificationsCountProvider);
              return Stack(
                alignment: Alignment.center,
                children: [
                  IconButton(
                    icon: const Icon(Icons.notifications_none, color: AppColors.primary, size: 28),
                    tooltip: 'Notificações',
                    onPressed: () => context.pushNamed('notificacoes'),
                  ),
                  if (unreadCount > 0)
                    Positioned(
                      right: 8,
                      top: 8,
                      child: Container(
                        padding: const EdgeInsets.all(2),
                        decoration: BoxDecoration(
                          color: Colors.red,
                          borderRadius: BorderRadius.circular(10),
                        ),
                        constraints: const BoxConstraints(
                          minWidth: 16,
                          minHeight: 16,
                        ),
                        child: Text(
                          '$unreadCount',
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                          ),
                          textAlign: TextAlign.center,
                        ),
                      ),
                    ),
                ],
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.account_circle_outlined, color: AppColors.primary, size: 28),
            tooltip: 'Meu Perfil',
            onPressed: () => context.pushNamed('meuPerfil'),
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.red, size: 28),
            tooltip: 'Sair',
            onPressed: () async {
              final confirmed = await showDialog<bool>(
                context: context,
                builder: (ctx) => AlertDialog(
                  title: const Text('Sair da conta?'),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.of(ctx).pop(false),
                      child: const Text('Cancelar'),
                    ),
                    TextButton(
                      onPressed: () => Navigator.of(ctx).pop(true),
                      child: const Text('Sair'),
                    ),
                  ],
                ),
              );
              if (confirmed == true) {
                await ref.read(authRepositoryProvider).signOut();
              }
            },
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: homeStateAsync.when(
        data: (state) {
          final userName = state.user?.name ?? 'Cidadão';
          final prefeituraName = tenantState.value?.name ?? 'Sua Cidade';

          return RefreshIndicator(
            onRefresh: () async {
              // ignore: unused_result
              ref.refresh(homeViewModelProvider.future);
            },
            child: CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: GreetingHeader(
                    userName: userName,
                    prefeituraName: prefeituraName,
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.all(24),
                  sliver: SliverList(
                    delegate: SliverChildListDelegate([
                      const Text(
                        'Acesso Rápido',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      ActionCard(
                        icon: Icons.add_circle_outline,
                        title: 'Nova Solicitação',
                        onTap: () {
                          context.pushNamed('novoChamado');
                        },
                      ),
                      const SizedBox(height: 12),
                      ActionCard(
                        icon: Icons.list_alt,
                        title: 'Meus Chamados',
                        onTap: () {
                          context.pushNamed('meusChamados');
                        },
                      ),
                      const SizedBox(height: 12),
                      ActionCard(
                        icon: Icons.campaign_outlined,
                        title: 'Mural de Avisos',
                        onTap: () {
                          context.pushNamed('avisos');
                        },
                      ),
                      const SizedBox(height: 32),
                      const Text(
                        'Serviços por Categoria',
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 16),
                      CategoryGrid(
                        categorias: state.categorias.take(4).toList(),
                        onCategoryTap: (categoria) {
                          ref.read(novoChamadoViewModelProvider.notifier).updateCategoria(categoria.id);
                          context.pushNamed('novoChamado');
                        },
                      ),
                      const SizedBox(height: 32),
                    ]),
                  ),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.error_outline, size: 48, color: Colors.red),
              const SizedBox(height: 16),
              Text('Erro ao carregar os dados:\n$error', textAlign: TextAlign.center),
              const SizedBox(height: 16),
              ElevatedButton(
                onPressed: () {
                  ref.invalidate(homeViewModelProvider);
                },
                child: const Text('Tentar novamente'),
              )
            ],
          ),
        ),
      ),
    );
  }
}
