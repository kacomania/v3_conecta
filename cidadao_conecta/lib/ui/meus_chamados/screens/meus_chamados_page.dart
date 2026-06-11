import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../viewmodels/meus_chamados_view_model.dart';
import '../widgets/chamado_card.dart';
import '../widgets/offline_chamado_card.dart';
import '../../../domain/entities/occurrence_entity.dart';
import '../../../core/local_db/local_database_helper.dart';

class MeusChamadosPage extends ConsumerStatefulWidget {
  const MeusChamadosPage({super.key});

  @override
  ConsumerState<MeusChamadosPage> createState() => _MeusChamadosPageState();
}

class _MeusChamadosPageState extends ConsumerState<MeusChamadosPage> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(meusChamadosProvider.notifier).fetchOccurrences();
    });
  }

  @override
  Widget build(BuildContext context) {
    final mergedState = ref.watch(meusChamadosProvider);

    return Scaffold(
      backgroundColor: const Color(0xFFFBF9F8),
      appBar: AppBar(
        backgroundColor: const Color(0xFFFBF9F8),
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF003B73)),
          onPressed: () => context.pop(),
        ),
        title: Text(
          'Meus Chamados',
          style: GoogleFonts.inter(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: const Color(0xFF003B73),
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(color: const Color(0xFFC3C6D1), height: 1.0),
        ),
      ),
      body: mergedState.when(
        data: (merged) {
          final allItems = merged.allItems;

          if (allItems.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.inbox_outlined, size: 64, color: Color(0xFFC3C6D1)),
                  const SizedBox(height: 16),
                  Text(
                    'Nenhum chamado encontrado.',
                    style: GoogleFonts.inter(
                      fontSize: 16,
                      color: const Color(0xFF434750),
                    ),
                  ),
                ],
              ),
            );
          }

          return RefreshIndicator(
            onRefresh: () =>
                ref.read(meusChamadosProvider.notifier).fetchOccurrences(),
            color: const Color(0xFF003B73),
            child: CustomScrollView(
              slivers: [
                // Banner informativo quando há itens offline
                if (merged.hasOfflineItems)
                  SliverToBoxAdapter(
                    child: _buildOfflineBanner(merged.offlineItems.length),
                  ),

                // Lista unificada
                SliverPadding(
                  padding: const EdgeInsets.all(20),
                  sliver: SliverList.separated(
                    itemCount: allItems.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final item = allItems[index];

                      if (item is QueuedOccurrence) {
                        // Card offline — sem navegação (sem ID real)
                        return OfflineChamadoCard(occurrence: item);
                      } else if (item is OccurrenceEntity) {
                        return ChamadoCard(
                          occurrence: item,
                          onTap: () {
                            context.push('/chamado/${item.id}');
                          },
                        );
                      }
                      return const SizedBox.shrink();
                    },
                  ),
                ),
              ],
            ),
          );
        },
        loading: () => const Center(
          child: CircularProgressIndicator(color: Color(0xFF003B73)),
        ),
        error: (err, stack) => Center(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Text(
              'Erro ao carregar chamados: $err',
              style: const TextStyle(color: Color(0xFFBA1A1A)),
              textAlign: TextAlign.center,
            ),
          ),
        ),
      ),
    );
  }

  /// Banner informativo exibido no topo quando há itens na fila offline.
  Widget _buildOfflineBanner(int count) {
    return Container(
      margin: const EdgeInsets.fromLTRB(20, 16, 20, 4),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFFFFF8DC),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0xFFE0C97F), width: 1),
      ),
      child: Row(
        children: [
          const Icon(Icons.cloud_off_rounded, color: Color(0xFF7A6500), size: 20),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              '$count chamado${count > 1 ? 's' : ''} aguardando sincronização. '
              'Será enviado automaticamente ao recuperar a conexão.',
              style: GoogleFonts.inter(
                fontSize: 13,
                color: const Color(0xFF7A6500),
                height: 1.4,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
