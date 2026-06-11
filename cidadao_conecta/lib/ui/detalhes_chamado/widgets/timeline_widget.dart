import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../domain/entities/occurrence_timeline_entity.dart';

class TimelineWidget extends StatelessWidget {
  final List<OccurrenceTimelineEntity> events;

  const TimelineWidget({super.key, required this.events});

  @override
  Widget build(BuildContext context) {
    if (events.isEmpty) {
      return const Center(child: Text("Sem histórico disponível."));
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: events.length,
      itemBuilder: (context, index) {
        final event = events[index];
        final isLast = index == events.length - 1;
        // Consider the first item in the list as the "active" or latest step.
        final isActive = index == 0;

        return IntrinsicHeight(
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Linha e Círculo
              SizedBox(
                width: 32,
                child: Column(
                  children: [
                    Container(
                      width: 24,
                      height: 24,
                      decoration: BoxDecoration(
                        color: isActive
                            ? const Color(0xFF00254D) // primary
                            : const Color(0xFFE4E2E1), // surface-variant
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: Colors.white, // surface-container-lowest
                          width: 4,
                        ),
                        boxShadow: isActive
                            ? [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.1),
                                  blurRadius: 2,
                                  offset: const Offset(0, 1),
                                )
                              ]
                            : null,
                      ),
                      child: Center(
                        child: isActive
                            ? const Icon(
                                Icons.sync,
                                size: 12,
                                color: Colors.white,
                              )
                            : Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: Color(0xFFC3C6D1), // outline-variant
                                  shape: BoxShape.circle,
                                ),
                              ),
                      ),
                    ),
                    if (!isLast)
                      Expanded(
                        child: Container(
                          width: 2,
                          color: const Color(0xFFE4E2E1), // surface-variant
                        ),
                      ),
                  ],
                ),
              ),
              const SizedBox(width: 16),
              // Conteúdo do evento
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.only(bottom: 24.0, top: 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _getStatusLabel(event.newStatus),
                        style: GoogleFonts.inter(
                          fontSize: 18,
                          fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
                          color: isActive
                              ? const Color(0xFF1B1C1C) // on-surface
                              : const Color(0xFF434750), // on-surface-variant
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        DateFormat('dd/MM/yyyy HH:mm')
                            .format(event.createdAt.toLocal()),
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          color: isActive
                              ? const Color(0xFF00254D) // primary (active date/desc)
                              : const Color(0xFF434750), // on-surface-variant
                        ),
                      ),
                      if (event.description != null &&
                          event.description!.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 8.0),
                          child: Text(
                            event.description!,
                            style: GoogleFonts.inter(
                              fontSize: 14,
                              color: isActive
                                  ? const Color(0xFF00254D)
                                  : const Color(0xFF434750),
                              height: 1.5,
                            ),
                          ),
                        ),
                      if (event.imageUrl != null && event.imageUrl!.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(top: 12.0),
                          child: ClipRRect(
                            borderRadius: BorderRadius.circular(8),
                            child: Image.network(
                              event.imageUrl!,
                              fit: BoxFit.cover,
                              height: 150,
                              width: double.infinity,
                              errorBuilder: (context, error, stackTrace) =>
                                  const SizedBox(),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  String _getStatusLabel(String status) {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return 'Solicitação Criada';
      case 'ANALYZING':
        return 'Em Análise';
      case 'IN_PROGRESS':
        return 'Em Andamento';
      case 'COMPLETED':
      case 'RESOLVED':
        return 'Resolvido';
      default:
        return status;
    }
  }
}
