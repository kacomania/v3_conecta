import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:latlong2/latlong.dart';

class LocationPickerPage extends StatefulWidget {
  final double initialLat;
  final double initialLng;
  final bool isReadOnly;

  const LocationPickerPage({
    super.key,
    required this.initialLat,
    required this.initialLng,
    this.isReadOnly = false,
  });

  @override
  State<LocationPickerPage> createState() => _LocationPickerPageState();
}

class _LocationPickerPageState extends State<LocationPickerPage> {
  late LatLng _selectedPoint;
  late final MapController _mapController;

  @override
  void initState() {
    super.initState();
    _selectedPoint = LatLng(widget.initialLat, widget.initialLng);
    _mapController = MapController();
  }

  @override
  void dispose() {
    _mapController.dispose();
    super.dispose();
  }

  void _onTap(TapPosition tapPosition, LatLng point) {
    if (widget.isReadOnly) return;
    setState(() {
      _selectedPoint = point;
    });
  }

  void _confirm() {
    Navigator.of(context).pop(_selectedPoint);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFBF9F8),
      appBar: AppBar(
        backgroundColor: const Color(0xFF00254D),
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white),
          onPressed: () => Navigator.of(context).pop(),
        ),
        title: Text(
          widget.isReadOnly ? 'Localização da Ocorrência' : 'Escolher Localização',
          style: GoogleFonts.inter(
            fontSize: 18,
            fontWeight: FontWeight.w600,
            color: Colors.white,
          ),
        ),
        centerTitle: true,
        actions: [const SizedBox(width: 48)],
      ),
      body: Stack(
        children: [
          // Mapa Interativo
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: _selectedPoint,
              initialZoom: 16,
              onTap: widget.isReadOnly ? null : _onTap,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.cidadao.conecta',
              ),
              MarkerLayer(
                markers: [
                  Marker(
                    point: _selectedPoint,
                    width: 48,
                    height: 56,
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: const BoxDecoration(
                            color: Color(0xFF00254D),
                            shape: BoxShape.circle,
                            boxShadow: [
                              BoxShadow(
                                color: Color(0x44000000),
                                blurRadius: 8,
                                offset: Offset(0, 4),
                              ),
                            ],
                          ),
                          child: const Icon(
                            Icons.location_on,
                            color: Colors.white,
                            size: 22,
                          ),
                        ),
                        // Ponteiro triangular usando CustomPaint com ui.Path
                        CustomPaint(
                          size: const Size(12, 8),
                          painter: _TrianglePainter(
                            color: const Color(0xFF00254D),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),

          // Dica no topo (oculta no modo leitura)
          if (!widget.isReadOnly)
            Positioned(
              top: 16,
              left: 20,
              right: 20,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x22000000),
                      blurRadius: 8,
                      offset: Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const Icon(
                      Icons.touch_app,
                      size: 18,
                      color: Color(0xFF00254D),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        'Toque no mapa para mover o marcador',
                        style: GoogleFonts.inter(
                          fontSize: 13,
                          color: const Color(0xFF434750),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

          // Coordenadas selecionadas
          Positioned(
            bottom: 104,
            left: 20,
            right: 20,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.92),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(
                  color: const Color(0xFFC3C6D1),
                  width: 1,
                ),
              ),
              child: Text(
                'Lat: ${_selectedPoint.latitude.toStringAsFixed(6)}   '
                'Long: ${_selectedPoint.longitude.toStringAsFixed(6)}',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w500,
                  color: const Color(0xFF434750),
                ),
              ),
            ),
          ),

          // Botão de confirmação (oculto no modo leitura)
          if (!widget.isReadOnly)
            Positioned(
              bottom: 32,
              left: 20,
              right: 20,
              child: ElevatedButton.icon(
                onPressed: _confirm,
                icon: const Icon(Icons.check_circle_outline, size: 20),
                label: Text(
                  'Confirmar Localização',
                  style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF00254D),
                  foregroundColor: Colors.white,
                  minimumSize: const Size(double.infinity, 52),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(28),
                  ),
                  elevation: 4,
                ),
              ),
            ),
        ],
      ),
    );
  }
}

/// Ponteiro triangular embaixo do pino — usa ui.Path para evitar conflito com latlong2.Path
class _TrianglePainter extends CustomPainter {
  final Color color;
  const _TrianglePainter({required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    final path = ui.Path()
      ..moveTo(0, 0)
      ..lineTo(size.width, 0)
      ..lineTo(size.width / 2, size.height)
      ..close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
