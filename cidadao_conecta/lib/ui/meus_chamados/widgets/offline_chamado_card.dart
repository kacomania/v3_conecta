import 'dart:io';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import '../../../core/local_db/local_database_helper.dart';

/// Card exibido para chamados que ainda estão na fila offline (SQLite).
/// Apresenta badge visual "Aguardando Rede" para que o cidadão saiba
/// que o chamado ainda não foi enviado ao servidor.
class OfflineChamadoCard extends StatelessWidget {
  final QueuedOccurrence occurrence;

  const OfflineChamadoCard({super.key, required this.occurrence});

  @override
  Widget build(BuildContext context) {
    final hasPhoto = occurrence.photoPath != null &&
        File(occurrence.photoPath!).existsSync();

    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFFFFBEE),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: const Color(0xFFE0C97F),
          width: 1.5,
        ),
      ),
      padding: const EdgeInsets.all(16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Thumbnail local
          Container(
            width: 96,
            height: 96,
            decoration: BoxDecoration(
              color: const Color(0xFFF0EDED),
              borderRadius: BorderRadius.circular(8),
              image: hasPhoto
                  ? DecorationImage(
                      image: FileImage(File(occurrence.photoPath!)),
                      fit: BoxFit.cover,
                    )
                  : null,
            ),
            child: !hasPhoto
                ? const Icon(
                    Icons.image_not_supported,
                    color: Color(0xFFC3C6D1),
                  )
                : null,
          ),
          const SizedBox(width: 16),

          // Conteúdo
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Expanded(
                      child: Text(
                        occurrence.title,
                        style: GoogleFonts.inter(
                          fontSize: 18,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF1B1C1C),
                          height: 24 / 18,
                        ),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ),
                    const SizedBox(width: 8),
                    _buildOfflineBadge(),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Protocolo: Aguardando envio...',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w400,
                    color: const Color(0xFF7A6500),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    const Icon(
                      Icons.calendar_today,
                      size: 16,
                      color: Color(0xFF434750),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      DateFormat('dd/MM/yyyy').format(occurrence.createdAt),
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: const Color(0xFF434750),
                        letterSpacing: 0.12,
                      ),
                    ),
                    const SizedBox(width: 12),
                    const Icon(
                      Icons.cloud_off_rounded,
                      size: 16,
                      color: Color(0xFF7A6500),
                    ),
                    const SizedBox(width: 4),
                    Text(
                      'Offline',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: const Color(0xFF7A6500),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOfflineBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: const Color(0xFFFEF08A),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFD4A017), width: 1),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.sync_problem_rounded, size: 12, color: Color(0xFF854D0E)),
          const SizedBox(width: 4),
          Text(
            'Aguardando Rede',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF854D0E),
              letterSpacing: 0.1,
            ),
          ),
        ],
      ),
    );
  }
}
