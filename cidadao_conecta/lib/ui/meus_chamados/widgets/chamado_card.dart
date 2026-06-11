import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../domain/entities/occurrence_entity.dart';
import 'package:intl/intl.dart';

class ChamadoCard extends StatelessWidget {
  final OccurrenceEntity occurrence;
  final VoidCallback onTap;

  const ChamadoCard({super.key, required this.occurrence, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8),
      child: Container(
        decoration: BoxDecoration(
          color: const Color(0xFFFBF9F8), // surface
          borderRadius: BorderRadius.circular(8),
          border: Border.all(
            color: const Color(0xFFC3C6D1),
            width: 1,
          ), // outline-variant
        ),
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Thumbnail
            Container(
              width: 96,
              height: 96,
              decoration: BoxDecoration(
                color: const Color(0xFFF0EDED), // surface-container
                borderRadius: BorderRadius.circular(8),
                image: (occurrence.imageUrls.isNotEmpty || occurrence.imageUrl != null)
                    ? DecorationImage(
                        image: NetworkImage(
                          occurrence.imageUrls.isNotEmpty 
                            ? occurrence.imageUrls.first 
                            : occurrence.imageUrl!
                        ),
                        fit: BoxFit.cover,
                      )
                    : null,
              ),
              child: (occurrence.imageUrls.isEmpty && occurrence.imageUrl == null)
                  ? const Icon(
                      Icons.image_not_supported,
                      color: Color(0xFFC3C6D1),
                    )
                  : null,
            ),
            const SizedBox(width: 16),

            // Content
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
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
                                color: const Color(0xFF1B1C1C), // on-surface
                                height: 24 / 18,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 8),
                          _buildStatusBadge(occurrence.status),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Protocolo: #${occurrence.id.split('-').first.toUpperCase()}',
                        style: GoogleFonts.inter(
                          fontSize: 14,
                          fontWeight: FontWeight.w400,
                          color: const Color(0xFF434750), // on-surface-variant
                        ),
                      ),
                    ],
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
                          letterSpacing: 0.12, // 0.01em
                        ),
                      ),
                      const SizedBox(width: 16),
                      if (occurrence.supportersCount > 0) ...[
                        const Icon(
                          Icons.thumb_up_alt_outlined,
                          size: 16,
                          color: Color(0xFF003B73),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          occurrence.supportersCount.toString(),
                          style: GoogleFonts.inter(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: const Color(0xFF003B73),
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
    );
  }

  Widget _buildStatusBadge(String status) {
    Color bgColor;
    Color textColor;
    String label;

    switch (status.toUpperCase()) {
      case 'PENDING':
        bgColor = const Color(0xFFFEF08A);
        textColor = const Color(0xFF854D0E);
        label = 'PENDENTE';
        break;
      case 'ANALYZING':
        bgColor = const Color(0xFFBFDBFE);
        textColor = const Color(0xFF003B73);
        label = 'EM ANÁLISE';
        break;
      case 'IN_PROGRESS':
        bgColor = const Color(0xFFE9D5FF);
        textColor = const Color(0xFF581C87);
        label = 'EM ANDAMENTO';
        break;
      case 'COMPLETED':
      case 'RESOLVED':
        bgColor = const Color(0xFFBBF7D0);
        textColor = const Color(0xFF166534);
        label = 'CONCLUÍDO';
        break;
      default:
        bgColor = const Color(0xFFF0EDED);
        textColor = const Color(0xFF434750);
        label = status.toUpperCase();
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        label,
        style: GoogleFonts.inter(
          fontSize: 12,
          fontWeight: FontWeight.w500,
          color: textColor,
          letterSpacing: 0.12,
        ),
      ),
    );
  }
}
