import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:latlong2/latlong.dart';
import '../viewmodels/detalhes_chamado_view_model.dart';
import '../widgets/timeline_widget.dart';
import '../widgets/image_carousel_widget.dart';
import '../widgets/rating_widget.dart';
import '../screens/location_picker_page.dart';
import '../../meus_chamados/viewmodels/meus_chamados_view_model.dart';

class DetalhesChamadoPage extends ConsumerStatefulWidget {
  final String chamadoId;

  const DetalhesChamadoPage({super.key, required this.chamadoId});

  @override
  ConsumerState<DetalhesChamadoPage> createState() =>
      _DetalhesChamadoPageState();
}

class _DetalhesChamadoPageState extends ConsumerState<DetalhesChamadoPage> {
  bool _isUpdatingLocation = false;

  Future<void> _handleEditLocation(double currentLat, double currentLng) async {
    final result = await Navigator.of(context).push<LatLng>(
      MaterialPageRoute(
        builder: (_) =>
            LocationPickerPage(initialLat: currentLat, initialLng: currentLng),
      ),
    );

    if (result == null || !mounted) return;

    setState(() => _isUpdatingLocation = true);

    try {
      await ref
          .read(updateLocationProvider.notifier)
          .updateLocation(widget.chamadoId, result.latitude, result.longitude);

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Localização atualizada com sucesso!'),
          backgroundColor: Color(0xFF166534),
        ),
      );
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Erro ao atualizar: $e'),
          backgroundColor: const Color(0xFFBA1A1A),
        ),
      );
    } finally {
      if (mounted) setState(() => _isUpdatingLocation = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    ref.listen(occurrenceUpdatesProvider(widget.chamadoId), (previous, next) {
      if (next.hasValue && previous?.value != null) {
        ref.invalidate(meusChamadosProvider);
        ref.invalidate(detalhesChamadoProvider(widget.chamadoId));
      }
    });

    final timelineState = ref.watch(detalhesChamadoProvider(widget.chamadoId));
    final chamadosState = ref.watch(meusChamadosProvider);

    final occurrence = chamadosState.value?.supabaseItems.firstWhere(
      (o) => o.id == widget.chamadoId,
      orElse: () => throw Exception('Chamado não encontrado'),
    );

    return Scaffold(
      backgroundColor: const Color(0xFFFBF9F8),
      appBar: AppBar(
        backgroundColor: const Color(0xFF00254D),
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'Protocolo ${widget.chamadoId.split('-')[0].toUpperCase()}',
              style: GoogleFonts.inter(
                fontSize: 20,
                fontWeight: FontWeight.w600,
                color: Colors.white,
              ),
            ),
            IconButton(
              icon: const Icon(Icons.copy, color: Colors.white, size: 20),
              onPressed: () {
                Clipboard.setData(ClipboardData(
                    text: widget.chamadoId.split('-')[0].toUpperCase()));
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Protocolo copiado!'),
                    backgroundColor: Color(0xFF166534),
                    duration: Duration(seconds: 2),
                  ),
                );
              },
            ),
          ],
        ),
        centerTitle: true,
        actions: [const SizedBox(width: 48)],
      ),
      body: occurrence == null
          ? const Center(child: CircularProgressIndicator())
          : RefreshIndicator(
              onRefresh: () async {
                ref.invalidate(detalhesChamadoProvider(widget.chamadoId));
                ref.invalidate(meusChamadosProvider);
              },
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.only(bottom: 40),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Hero Image (Carrossel)
                    ImageCarouselWidget(
                      imageUrls: occurrence.imageUrls.isNotEmpty
                          ? occurrence.imageUrls
                          : (occurrence.imageUrl != null
                                ? [occurrence.imageUrl!]
                                : []),
                    ),

                    // Title Block
                    Container(
                      width: double.infinity,
                      color: Colors.white,
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 4,
                                ),
                                decoration: BoxDecoration(
                                  color: const Color(0xFF003B73),
                                  borderRadius: BorderRadius.circular(16),
                                ),
                                child: Text(
                                  'Ocorrência',
                                  style: GoogleFonts.inter(
                                    fontSize: 12,
                                    fontWeight: FontWeight.w500,
                                    color: const Color(0xFF7FA7E5),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Text(
                                DateFormat(
                                  'dd/MM/yy HH:mm',
                                ).format(occurrence.createdAt.toLocal()),
                                style: GoogleFonts.inter(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                  color: const Color(0xFF434750),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            occurrence.title,
                            style: GoogleFonts.inter(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: const Color(0xFF1B1C1C),
                            ),
                          ),
                          if (occurrence.dueDate != null) ...[
                            const SizedBox(height: 12),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: occurrence.status == 'COMPLETED' ? const Color(0xFFF0FDF4) : const Color(0xFFF0F5FA),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                  color: occurrence.status == 'COMPLETED' ? const Color(0xFF16A34A) : const Color(0xFF003B73),
                                  width: 1,
                                ),
                              ),
                              child: Row(
                                children: [
                                  Icon(
                                    occurrence.status == 'COMPLETED' ? Icons.check_circle_outline : Icons.calendar_today,
                                    color: occurrence.status == 'COMPLETED' ? const Color(0xFF16A34A) : const Color(0xFF003B73),
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      occurrence.status == 'COMPLETED'
                                          ? 'Atendimento Concluído'
                                          : 'Previsão de Resolução: ${DateFormat('dd/MM/yyyy').format(occurrence.dueDate!.toLocal())}',
                                      style: GoogleFonts.inter(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                        color: occurrence.status == 'COMPLETED' ? const Color(0xFF16A34A) : const Color(0xFF003B73),
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),

                    // Descrição do Problema
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Descrição do Problema',
                            style: GoogleFonts.inter(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF1B1C1C),
                            ),
                          ),
                          const SizedBox(height: 8),
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border.all(
                                color: const Color(0xFFC3C6D1),
                                width: 1,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              occurrence.description.isEmpty
                                  ? 'Sem descrição detalhada'
                                  : occurrence.description,
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                color: const Color(0xFF434750),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Localização
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Text(
                                'Localização',
                                style: GoogleFonts.inter(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w600,
                                  color: const Color(0xFF1B1C1C),
                                ),
                              ),
                              const SizedBox(width: 8),
                              // Badge "Ajustada" se a localização já foi editada
                              if (occurrence.locationAlreadyEdited)
                                Container(
                                  padding: const EdgeInsets.symmetric(
                                    horizontal: 8,
                                    vertical: 3,
                                  ),
                                  decoration: BoxDecoration(
                                    color: const Color(0xFFBBF7D0),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      const Icon(
                                        Icons.check_circle,
                                        size: 12,
                                        color: Color(0xFF166534),
                                      ),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Ajustada pelo Usuário em ${DateFormat('dd-MM-yy').format(occurrence.locationEditedAt!.toLocal())} às ${DateFormat('HH:mm').format(occurrence.locationEditedAt!.toLocal())}',
                                        style: GoogleFonts.inter(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                          color: const Color(0xFF166534),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                            ],
                          ),
                          const SizedBox(height: 8),
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(16),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border.all(
                                color: const Color(0xFFC3C6D1),
                                width: 1,
                              ),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    const Icon(
                                      Icons.location_on_outlined,
                                      color: Color(0xFF737781),
                                      size: 20,
                                    ),
                                    const SizedBox(width: 8),
                                    Expanded(
                                      child: Text(
                                        'Lat: ${occurrence.latitude?.toStringAsFixed(6) ?? '--'}\n'
                                        'Long: ${occurrence.longitude?.toStringAsFixed(6) ?? '--'}',
                                        style: GoogleFonts.inter(
                                          fontSize: 14,
                                          color: const Color(0xFF434750),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                const SizedBox(height: 12),
                                Row(
                                  children: [
                                    // Botão Ver no Mapa
                                    Expanded(
                                      child: OutlinedButton.icon(
                                        onPressed: () {
                                          Navigator.of(context).push(
                                            MaterialPageRoute(
                                              builder: (_) =>
                                                  LocationPickerPage(
                                                    initialLat:
                                                        occurrence.latitude ??
                                                        -15.7801,
                                                    initialLng:
                                                        occurrence.longitude ??
                                                        -47.9292,
                                                    isReadOnly: true,
                                                  ),
                                            ),
                                          );
                                        },
                                        icon: const Icon(Icons.map, size: 18),
                                        label: Text(
                                          'Ver no Mapa',
                                          style: GoogleFonts.inter(
                                            fontSize: 14,
                                            fontWeight: FontWeight.w600,
                                          ),
                                        ),
                                        style: OutlinedButton.styleFrom(
                                          foregroundColor: const Color(
                                            0xFF00254D,
                                          ),
                                          side: const BorderSide(
                                            color: Color(0xFF00254D),
                                            width: 2,
                                          ),
                                          padding: const EdgeInsets.symmetric(
                                            vertical: 12,
                                          ),
                                          shape: RoundedRectangleBorder(
                                            borderRadius: BorderRadius.circular(
                                              24,
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                    // Botão Editar — visível apenas se ainda não foi editado
                                    if (!occurrence.locationAlreadyEdited) ...[
                                      const SizedBox(width: 8),
                                      Expanded(
                                        child: _isUpdatingLocation
                                            ? const Center(
                                                child:
                                                    CircularProgressIndicator(
                                                      color: Color(0xFF00254D),
                                                    ),
                                              )
                                            : ElevatedButton.icon(
                                                onPressed: () =>
                                                    _handleEditLocation(
                                                      occurrence.latitude ??
                                                          -15.7801,
                                                      occurrence.longitude ??
                                                          -47.9292,
                                                    ),
                                                icon: const Icon(
                                                  Icons.edit,
                                                  size: 18,
                                                ),
                                                label: Text(
                                                  'Editar',
                                                  style: GoogleFonts.inter(
                                                    fontSize: 14,
                                                    fontWeight: FontWeight.w600,
                                                  ),
                                                ),
                                                style: ElevatedButton.styleFrom(
                                                  backgroundColor: const Color(
                                                    0xFF00254D,
                                                  ),
                                                  foregroundColor: Colors.white,
                                                  padding:
                                                      const EdgeInsets.symmetric(
                                                        vertical: 12,
                                                      ),
                                                  shape: RoundedRectangleBorder(
                                                    borderRadius:
                                                        BorderRadius.circular(
                                                          24,
                                                        ),
                                                  ),
                                                ),
                                              ),
                                      ),
                                    ],
                                  ],
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Avaliação do Atendimento
                    if (occurrence.status == 'COMPLETED')
                      Padding(
                        padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
                        child: RatingWidget(
                          initialRating: occurrence.rating,
                          initialFeedback: occurrence.feedbackNotes,
                          isReadOnly: occurrence.rating != null,
                          onSubmit: (rating, feedback) async {
                            try {
                              await ref.read(rateOccurrenceProvider.notifier)
                                  .rateOccurrence(occurrence.id, rating, feedback);
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(
                                    content: Text('Avaliação enviada com sucesso!'),
                                    backgroundColor: Color(0xFF166534),
                                  ),
                                );
                              }
                            } catch (e) {
                              if (context.mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  SnackBar(
                                    content: Text('Erro ao enviar avaliação: $e'),
                                    backgroundColor: const Color(0xFFBA1A1A),
                                  ),
                                );
                              }
                            }
                          },
                        ),
                      ),

                    // Status da Ocorrência
                    Padding(
                      padding: const EdgeInsets.fromLTRB(20, 16, 20, 0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Status da Ocorrência',
                            style: GoogleFonts.inter(
                              fontSize: 18,
                              fontWeight: FontWeight.w600,
                              color: const Color(0xFF1B1C1C),
                            ),
                          ),
                          const SizedBox(height: 16),
                          timelineState.when(
                            data: (events) => TimelineWidget(events: events),
                            loading: () => const Padding(
                              padding: EdgeInsets.all(32.0),
                              child: Center(
                                child: CircularProgressIndicator(
                                  color: Color(0xFF00254D),
                                ),
                              ),
                            ),
                            error: (err, stack) => Center(
                              child: Text(
                                'Erro ao carregar histórico: $err',
                                style: const TextStyle(
                                  color: Color(0xFFBA1A1A),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}
