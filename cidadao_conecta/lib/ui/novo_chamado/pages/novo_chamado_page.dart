import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../routing/route_names.dart';
import '../../../core/di/providers.dart';
import '../../../domain/entities/draft_solicitacao.dart';
import '../../../domain/entities/categoria_entity.dart';
import '../viewmodels/novo_chamado_view_model.dart';
import '../../home/viewmodels/home_view_model.dart';

class NovoChamadoPage extends ConsumerStatefulWidget {
  const NovoChamadoPage({super.key});

  @override
  ConsumerState<NovoChamadoPage> createState() => _NovoChamadoPageState();
}

class _NovoChamadoPageState extends ConsumerState<NovoChamadoPage> {
  bool _isCapturingLocation = false;

  @override
  Widget build(BuildContext context) {
    final draftState = ref.watch(novoChamadoViewModelProvider);
    final draft = draftState.value ?? DraftSolicitacao();
    final isLoading = draftState.isLoading;
    final viewModel = ref.read(novoChamadoViewModelProvider.notifier);
    
    final homeStateAsync = ref.watch(homeViewModelProvider);
    final categoriesState = homeStateAsync.whenData((state) => state.categorias);

    return Scaffold(
      backgroundColor: const Color(0xFFFFFFFF),
      appBar: AppBar(
        backgroundColor: const Color(0xFFFFFFFF),
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFF003B73)),
        title: const Text(
          'Nova Solicitação',
          style: TextStyle(
            fontFamily: 'Inter',
            fontSize: 20,
            fontWeight: FontWeight.w600,
            color: Color(0xFF003B73),
          ),
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(color: const Color(0xFFD9D9D9), height: 1.0),
        ),
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                _buildLabel('Título da Ocorrência'),
                const SizedBox(height: 8),
                _buildTextField(
                  initialValue: draft.titulo,
                  onChanged: viewModel.updateTitulo,
                  hint: 'Ex: Poste com luz queimada',
                ),
                const SizedBox(height: 24),

                _buildLabel('Categoria'),
                const SizedBox(height: 8),
                _buildDropdown(draft.idCategoria, viewModel.updateCategoria, categoriesState),
                const SizedBox(height: 24),

                _buildLabel('Localização'),
                const SizedBox(height: 8),
                _buildLocationCard(draft.latitude, draft.longitude, viewModel),
                const SizedBox(height: 24),

                _buildLabel('Descrição'),
                const SizedBox(height: 8),
                _buildTextField(
                  initialValue: draft.descricao,
                  onChanged: viewModel.updateDescricao,
                  hint: 'Descreva o problema...',
                  maxLines: 4,
                ),
                const SizedBox(height: 24),

                _buildLabel('Fotos Anexadas'),
                const SizedBox(height: 8),
                _buildPhotoGallery(draft.fotos, viewModel),
                const SizedBox(height: 16),

                // Somente câmera conforme solicitado e limite de 3 fotos
                if (draft.fotos.length < 3)
                  _buildSecondaryButton(
                    icon: Icons.camera_alt_outlined,
                    label: 'Tirar Foto',
                    onPressed: () async {
                      final photoPath = await context.pushNamed<String>(RouteNames.camera);
                      if (photoPath != null) {
                        viewModel.addFoto(photoPath);
                      }
                    },
                  ),
                const SizedBox(height: 48),

                _buildPrimaryButton(
                  label: isLoading ? 'Enviando...' : 'Enviar Solicitação',
                  onPressed: isLoading
                      ? null
                      : () => _onSubmit(context, draft, viewModel),
                ),
              ],
            ),
          ),
          if (isLoading)
            Container(
              color: const Color(0x66000000),
              child: const Center(
                child: CircularProgressIndicator(
                  valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF003B73)),
                ),
              ),
            ),
        ],
      ),
    );
  }

  // ─── Validação e submit ────────────────────────────────────────────────────

  Future<void> _onSubmit(
    BuildContext context,
    DraftSolicitacao draft,
    NovoChamadoViewModel viewModel,
  ) async {
    final erros = <String>[];

    if (draft.titulo.trim().length < 5 || draft.titulo.trim().length > 60) {
      erros.add('• Título deve ter entre 5 e 60 caracteres');
    }
    if (draft.idCategoria == null) {
      erros.add('• Selecione uma categoria');
    }
    if (draft.descricao.trim().length < 5 ||
        draft.descricao.trim().length > 600) {
      erros.add('• Descrição deve ter entre 5 e 600 caracteres');
    }
    if (draft.latitude == null || draft.longitude == null) {
      erros.add('• Capture a localização do chamado');
    }
    if (draft.fotos.isEmpty) {
      erros.add('• Adicione pelo menos uma foto');
    }

    if (erros.isNotEmpty) {
      _showValidationAlert(context, erros: erros);
      return;
    }

    // O recurso de criação de chamados offline foi abortado pelo Tech Lead.
    // O app agora exige conexão para prosseguir.

    // Modal de Loading de Análise (IA — só executa se ONLINE)
    if (!context.mounted) return;
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        content: Row(
          children: const [
            CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF003B73))),
            SizedBox(width: 16),
            Expanded(
              child: Text(
                'Analisando relato...\nIsso pode levar em média 30 segundos.',
                style: TextStyle(fontFamily: 'Inter', fontSize: 14),
              ),
            ),
          ],
        ),
      ),
    );

    try {
      final repo = ref.read(occurrenceRepositoryProvider);
      final tenant = ref.read(currentTenantProvider).value;
      final prefeituraId = tenant?.id;
      if (prefeituraId == null) throw Exception('Prefeitura não selecionada');

      // Buscar duplicatas
      final duplicates = await repo.findDuplicates(
        draft.descricao, 
        draft.latitude!, 
        draft.longitude!, 
        prefeituraId
      );

      // Fecha loading
      if (context.mounted) Navigator.of(context).pop();

      if (duplicates.isNotEmpty) {
        if (!context.mounted) return;
        final shouldCreateNew = await _showDuplicatesModal(context, duplicates, repo, viewModel);
        if (shouldCreateNew == null || !shouldCreateNew) {
          // Apoiou ou cancelou
          return;
        }
      }

      // Proceder com a criação normal
      if (!context.mounted) return;
      
      showDialog(
        context: context,
        barrierDismissible: false,
        builder: (ctx) => const Center(
          child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF003B73))),
        ),
      );
      
      final protocolId = await viewModel.submitAndGetProtocol();
      
      if (context.mounted) {
        Navigator.of(context).pop(); // fecha loading
        _showSuccessPopup(context, protocolId);
      }
    } catch (e) {
      if (context.mounted) {
        Navigator.of(context).pop(); // fecha modal que estiver aberto
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Erro ao enviar: $e',
              style: const TextStyle(
                fontFamily: 'Inter',
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: const Color(0xFFBA1A1A),
            behavior: SnackBarBehavior.floating,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(4)),
            ),
          ),
        );
      }
    }
  }

  Future<bool?> _showDuplicatesModal(BuildContext context, List<Map<String, dynamic>> duplicates, dynamic repo, NovoChamadoViewModel viewModel) {
    return showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        title: const Text(
          'Chamados Semelhantes',
          style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.w600, color: Color(0xFF003B73)),
        ),
        content: SizedBox(
          width: double.maxFinite,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                'Encontramos chamados parecidos na sua região. Você pode apoiar um deles para dar mais força ao pedido!',
                style: TextStyle(fontFamily: 'Inter', fontSize: 14),
              ),
              const SizedBox(height: 16),
              Flexible(
                child: ListView.builder(
                  shrinkWrap: true,
                  itemCount: duplicates.length,
                  itemBuilder: (listCtx, index) {
                    final dup = duplicates[index];
                    return Card(
                      margin: const EdgeInsets.symmetric(vertical: 4),
                      child: ListTile(
                        title: Text(dup['title'] ?? 'Sem título', style: const TextStyle(fontWeight: FontWeight.bold)),
                        subtitle: Text('Distância: ${(dup['distance_meters'] as num).toStringAsFixed(0)}m'),
                        trailing: const Icon(Icons.arrow_forward_ios, size: 16, color: Color(0xFF003B73)),
                        onTap: () {
                          _showDuplicateDetail(context, ctx, dup, repo, viewModel);
                        },
                      ),
                    );
                  },
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Recusar e abrir novo', style: TextStyle(color: Color(0xFF003B73))),
          ),
        ],
      ),
    );
  }

  void _showDuplicateDetail(BuildContext rootContext, BuildContext duplicateModalCtx, Map<String, dynamic> dup, dynamic repo, NovoChamadoViewModel viewModel) {
    showDialog(
      context: duplicateModalCtx,
      builder: (detailCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        title: Text(
          dup['title'] ?? 'Detalhes do Chamado',
          style: const TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold, color: Color(0xFF003B73)),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Distância: ${(dup['distance_meters'] as num).toStringAsFixed(0)}m', style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14, color: Color(0xFF434750))),
            const SizedBox(height: 12),
            Text(dup['description'] ?? 'Sem descrição detalhada.', style: const TextStyle(fontFamily: 'Inter', fontSize: 14, color: Color(0xFF1B1C1C))),
          ],
        ),
        actionsAlignment: MainAxisAlignment.spaceBetween,
        actions: [
          TextButton(
            onPressed: () => Navigator.of(detailCtx).pop(),
            child: const Text('Voltar', style: TextStyle(color: Color(0xFF434750))),
          ),
          ElevatedButton(
            onPressed: () async {
              try {
                showDialog(
                  context: detailCtx,
                  barrierDismissible: false,
                  builder: (c) => const Center(child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF003B73)))),
                );
                
                await repo.supportOccurrence(dup['id']);
                
                if (detailCtx.mounted) {
                  Navigator.of(detailCtx).pop(); // fecha o loading
                  Navigator.of(detailCtx).pop(); // fecha o modal de detalhes
                  Navigator.of(duplicateModalCtx).pop(false); // fecha o modal de lista
                  
                  // Limpa o form
                  viewModel.reset();
                  
                  _showSuccessSupportPopup(rootContext, dup['id'].toString().split('-').first.toUpperCase());
                }
              } catch (e) {
                if (detailCtx.mounted) {
                  Navigator.of(detailCtx).pop(); // fecha o loading
                  ScaffoldMessenger.of(rootContext).showSnackBar(
                    SnackBar(content: Text('Erro ao apoiar: $e')),
                  );
                }
              }
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF003B73)),
            child: const Text('Apoiar Chamado', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showSuccessPopup(BuildContext context, String protocol) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        title: const Text(
          'Sucesso!',
          style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold, color: Color(0xFF388E3C)),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Sua solicitação foi registrada com sucesso.',
              style: TextStyle(fontFamily: 'Inter', fontSize: 14),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            const Text(
              'Seu protocolo é:',
              style: TextStyle(fontFamily: 'Inter', fontSize: 14),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFE8EEF4),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                protocol,
                style: const TextStyle(fontFamily: 'Inter', fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF003B73)),
              ),
            ),
          ],
        ),
        actionsAlignment: MainAxisAlignment.center,
        actions: [
          OutlinedButton.icon(
            onPressed: () {
              Clipboard.setData(ClipboardData(text: protocol));
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Protocolo copiado!')));
            },
            icon: const Icon(Icons.copy),
            label: const Text('Copiar'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              context.go('/');
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF003B73)),
            child: const Text('OK', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showSuccessSupportPopup(BuildContext context, String protocol) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        title: const Text(
          'Apoio Registrado!',
          style: TextStyle(fontFamily: 'Inter', fontWeight: FontWeight.bold, color: Color(0xFF388E3C)),
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text(
              'Você apoiou este chamado com sucesso.',
              style: TextStyle(fontFamily: 'Inter', fontSize: 14),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 16),
            const Text(
              'Protocolo apoiado:',
              style: TextStyle(fontFamily: 'Inter', fontSize: 14),
            ),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: const Color(0xFFE8EEF4),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Text(
                protocol,
                style: const TextStyle(fontFamily: 'Inter', fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF003B73)),
              ),
            ),
          ],
        ),
        actionsAlignment: MainAxisAlignment.center,
        actions: [
          OutlinedButton.icon(
            onPressed: () {
              Clipboard.setData(ClipboardData(text: protocol));
              ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Protocolo copiado!')));
            },
            icon: const Icon(Icons.copy),
            label: const Text('Copiar'),
          ),
          ElevatedButton(
            onPressed: () {
              Navigator.of(ctx).pop();
              context.go('/');
            },
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF003B73)),
            child: const Text('OK', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showValidationAlert(
    BuildContext context, {
    required List<String> erros,
  }) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        title: Row(
          children: const [
            Icon(
              Icons.warning_amber_rounded,
              color: Color(0xFFF4A12B),
              size: 24,
            ),
            SizedBox(width: 8),
            Text(
              'Atenção',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: Color(0xFF1B1C1C),
              ),
            ),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Verifique os seguintes itens:',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14,
                color: Color(0xFF434750),
              ),
            ),
            const SizedBox(height: 12),
            ...erros.map(
              (item) => Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text(
                  item,
                  style: const TextStyle(
                    fontFamily: 'Inter',
                    fontSize: 14,
                    fontWeight: FontWeight.w500,
                    color: Color(0xFF1B1C1C),
                  ),
                ),
              ),
            ),
          ],
        ),
        actions: [
          ElevatedButton(
            onPressed: () => Navigator.of(ctx).pop(),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF003B73),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
              elevation: 0,
            ),
            child: const Text(
              'Entendi',
              style: TextStyle(
                fontFamily: 'Inter',
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── Widgets de construção ─────────────────────────────────────────────────

  Widget _buildLabel(String text) {
    return Text(
      text,
      style: const TextStyle(
        fontFamily: 'Inter',
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: Color(0xFF1B1C1C),
        letterSpacing: 0.12,
      ),
    );
  }

  Widget _buildDropdown(
    String? value,
    Function(String) onChanged,
    AsyncValue<List<CategoriaEntity>> categoriesState,
  ) {
    return Container(
      decoration: BoxDecoration(
        color: const Color(0xFFFFFFFF),
        border: Border.all(color: const Color(0xFFD9D9D9), width: 1),
        borderRadius: BorderRadius.circular(4),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: categoriesState.when(
        data: (categories) {
          if (categories.isEmpty) {
            return const Padding(
              padding: EdgeInsets.symmetric(vertical: 16),
              child: Text(
                'Nenhuma categoria disponível',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 14,
                  color: Color(0xFF434750),
                ),
              ),
            );
          }
          return DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: value,
              isExpanded: true,
              hint: const Text(
                'Selecione uma categoria',
                style: TextStyle(
                  fontFamily: 'Inter',
                  fontSize: 14,
                  color: Color(0xFF434750),
                ),
              ),
              items: categories.map((cat) {
                return DropdownMenuItem(
                  value: cat.id,
                  child: Text(cat.nome),
                );
              }).toList(),
              onChanged: (val) {
                if (val != null) onChanged(val);
              },
            ),
          );
        },
        loading: () => const Padding(
          padding: EdgeInsets.symmetric(vertical: 16),
          child: Text('Carregando categorias...'),
        ),
        error: (error, _) => Padding(
          padding: EdgeInsets.symmetric(vertical: 16),
          child: Text(
            'Erro ao carregar: $error',
            style: const TextStyle(color: Colors.red),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField({
    required String initialValue,
    required Function(String) onChanged,
    required String hint,
    int maxLines = 1,
  }) {
    return TextFormField(
      initialValue: initialValue,
      onChanged: onChanged,
      maxLines: maxLines,
      style: const TextStyle(
        fontFamily: 'Inter',
        fontSize: 14,
        color: Color(0xFF1B1C1C),
      ),
      decoration: InputDecoration(
        hintText: hint,
        hintStyle: const TextStyle(
          fontFamily: 'Inter',
          fontSize: 14,
          color: Color(0xFF434750),
        ),
        filled: true,
        fillColor: const Color(0xFFFFFFFF),
        contentPadding: const EdgeInsets.all(16),
        enabledBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: Color(0xFFD9D9D9), width: 1),
          borderRadius: BorderRadius.circular(4),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: const BorderSide(color: Color(0xFF003B73), width: 2),
          borderRadius: BorderRadius.circular(4),
        ),
      ),
    );
  }

  Widget _buildPhotoGallery(
    List<String> fotos,
    NovoChamadoViewModel viewModel,
  ) {
    if (fotos.isEmpty) {
      return Container(
        height: 100,
        decoration: BoxDecoration(
          color: const Color(0xFFFBF9F8),
          border: Border.all(color: const Color(0xFFD9D9D9), width: 1),
          borderRadius: BorderRadius.circular(4),
        ),
        child: const Center(
          child: Text(
            'Nenhuma foto anexada',
            style: TextStyle(
              fontFamily: 'Inter',
              fontSize: 14,
              color: Color(0xFF434750),
            ),
          ),
        ),
      );
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: fotos.length,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 3,
        crossAxisSpacing: 8,
        mainAxisSpacing: 8,
      ),
      itemBuilder: (context, index) {
        return Stack(
          children: [
            Container(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(4),
                border: Border.all(color: const Color(0xFFD9D9D9), width: 1),
                image: DecorationImage(
                  image: FileImage(File(fotos[index])),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            Positioned(
              top: 4,
              right: 4,
              child: GestureDetector(
                onTap: () => viewModel.removeFoto(index),
                child: Container(
                  decoration: const BoxDecoration(
                    color: Color(0x99000000),
                    shape: BoxShape.circle,
                  ),
                  padding: const EdgeInsets.all(4),
                  child: const Icon(Icons.close, color: Colors.white, size: 16),
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  Widget _buildSecondaryButton({
    required IconData icon,
    required String label,
    required VoidCallback onPressed,
  }) {
    return OutlinedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon, color: const Color(0xFF003B73), size: 20),
      label: Text(
        label,
        style: const TextStyle(
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: FontWeight.w600,
          color: Color(0xFF003B73),
        ),
      ),
      style: OutlinedButton.styleFrom(
        side: const BorderSide(color: Color(0xFF003B73), width: 1),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
        padding: const EdgeInsets.symmetric(vertical: 14),
      ),
    );
  }

  Widget _buildPrimaryButton({
    required String label,
    required VoidCallback? onPressed,
  }) {
    return ElevatedButton(
      onPressed: onPressed,
      style: ElevatedButton.styleFrom(
        backgroundColor: const Color(0xFF003B73),
        disabledBackgroundColor: const Color(0xFFD9D9D9),
        foregroundColor: Colors.white,
        disabledForegroundColor: const Color(0xFF434750),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
        padding: const EdgeInsets.symmetric(vertical: 16),
        elevation: 0,
      ),
      child: Text(
        label,
        style: const TextStyle(
          fontFamily: 'Inter',
          fontSize: 14,
          fontWeight: FontWeight.w600,
          letterSpacing: 0.28,
        ),
      ),
    );
  }

  Widget _buildLocationCard(
    double? lat,
    double? lng,
    NovoChamadoViewModel viewModel,
  ) {
    final bool hasLocation = lat != null && lng != null;

    return Container(
      decoration: BoxDecoration(
        color: hasLocation ? const Color(0xFFE6F4EA) : const Color(0xFFEAF2FF),
        border: Border.all(
          color: hasLocation
              ? const Color(0xFFA8D5B5)
              : const Color(0xFFD5E3FF),
          width: 1,
        ),
        borderRadius: BorderRadius.circular(8),
      ),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      child: Row(
        children: [
          Icon(
            hasLocation ? Icons.location_on : Icons.location_off_outlined,
            color: hasLocation
                ? const Color(0xFF2E7D32)
                : const Color(0xFF165EAE),
            size: 24,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              hasLocation
                  ? 'Localização capturada ✓\nLat: ${lat.toStringAsFixed(5)}, Lng: ${lng.toStringAsFixed(5)}'
                  : 'Localização ainda não capturada',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 14,
                color: hasLocation
                    ? const Color(0xFF1B5E20)
                    : const Color(0xFF434750),
              ),
            ),
          ),
          const SizedBox(width: 8),
          _isCapturingLocation
              ? const SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      Color(0xFF003B73),
                    ),
                  ),
                )
              : OutlinedButton(
                  onPressed: () => _capturarLocalizacao(viewModel),
                  style: OutlinedButton.styleFrom(
                    side: const BorderSide(color: Color(0xFFD9D9D9), width: 1),
                    backgroundColor: Colors.white,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    padding: const EdgeInsets.symmetric(
                      horizontal: 16,
                      vertical: 8,
                    ),
                    minimumSize: Size.zero,
                    tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  ),
                  child: Text(
                    hasLocation ? 'Atualizar' : 'Capturar',
                    style: const TextStyle(
                      fontFamily: 'Inter',
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF003B73),
                    ),
                  ),
                ),
        ],
      ),
    );
  }

  Future<void> _capturarLocalizacao(NovoChamadoViewModel viewModel) async {
    setState(() => _isCapturingLocation = true);
    try {
      await viewModel.capturarLocalizacao();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              'Erro ao capturar localização: $e',
              style: const TextStyle(
                fontFamily: 'Inter',
                color: Colors.white,
                fontWeight: FontWeight.w500,
              ),
            ),
            backgroundColor: const Color(0xFFBA1A1A),
            behavior: SnackBarBehavior.floating,
            shape: const RoundedRectangleBorder(
              borderRadius: BorderRadius.all(Radius.circular(4)),
            ),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isCapturingLocation = false);
    }
  }
}
