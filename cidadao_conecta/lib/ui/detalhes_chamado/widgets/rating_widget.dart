import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class RatingWidget extends StatefulWidget {
  final int? initialRating;
  final String? initialFeedback;
  final bool isReadOnly;
  final Future<void> Function(int rating, String? feedback)? onSubmit;

  const RatingWidget({
    super.key,
    this.initialRating,
    this.initialFeedback,
    this.isReadOnly = false,
    this.onSubmit,
  });

  @override
  State<RatingWidget> createState() => _RatingWidgetState();
}

class _RatingWidgetState extends State<RatingWidget> {
  int _currentRating = 0;
  final TextEditingController _feedbackController = TextEditingController();
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _currentRating = widget.initialRating ?? 0;
    _feedbackController.text = widget.initialFeedback ?? '';
  }

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    if (_currentRating == 0) return;
    if (widget.onSubmit == null) return;

    setState(() => _isLoading = true);
    try {
      await widget.onSubmit!(_currentRating, _feedbackController.text);
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border.all(color: const Color(0xFFC3C6D1)),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            widget.isReadOnly ? 'Sua Avaliação' : 'Como você avalia este atendimento?',
            style: GoogleFonts.inter(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: const Color(0xFF1B1C1C),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List.generate(5, (index) {
              final starValue = index + 1;
              return IconButton(
                icon: Icon(
                  starValue <= _currentRating ? Icons.star : Icons.star_border,
                  color: const Color(0xFFEAB308),
                  size: 40,
                ),
                onPressed: widget.isReadOnly || _isLoading
                    ? null
                    : () {
                        setState(() {
                          _currentRating = starValue;
                        });
                      },
              );
            }),
          ),
          const SizedBox(height: 16),
          if (widget.isReadOnly && _feedbackController.text.isNotEmpty) ...[
            Text(
              'Seu comentário:',
              style: GoogleFonts.inter(
                fontSize: 14,
                fontWeight: FontWeight.w600,
                color: const Color(0xFF434750),
              ),
            ),
            const SizedBox(height: 8),
            Text(
              _feedbackController.text,
              style: GoogleFonts.inter(
                fontSize: 14,
                color: const Color(0xFF434750),
              ),
            ),
          ] else if (!widget.isReadOnly) ...[
            TextField(
              controller: _feedbackController,
              enabled: !_isLoading,
              maxLines: 3,
              decoration: InputDecoration(
                hintText: 'Deixe um comentário (opcional)',
                hintStyle: GoogleFonts.inter(color: const Color(0xFF737781)),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: Color(0xFFC3C6D1)),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: Color(0xFF003B73)),
                ),
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: (_currentRating == 0 || _isLoading) ? null : _handleSubmit,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF00254D),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                  ),
                ),
                child: _isLoading
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          color: Colors.white,
                          strokeWidth: 2,
                        ),
                      )
                    : Text(
                        'Enviar Avaliação',
                        style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
