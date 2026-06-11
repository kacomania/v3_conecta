import 'package:flutter/material.dart';
import '../../../domain/entities/categoria_entity.dart';

class CategoryGrid extends StatelessWidget {
  final List<CategoriaEntity> categorias;
  final Function(CategoriaEntity) onCategoryTap;

  const CategoryGrid({
    super.key,
    required this.categorias,
    required this.onCategoryTap,
  });

  IconData _getIconData(String iconName) {
    // Simple mapping for demonstration purposes
    switch (iconName) {
      case 'lightbulb': return Icons.lightbulb_outline;
      case 'warning': return Icons.warning_amber_rounded;
      case 'delete': return Icons.delete_outline;
      case 'park': return Icons.park_outlined;
      case 'traffic': return Icons.traffic_outlined;
      default: return Icons.category_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    if (categorias.isEmpty) {
      return const Center(child: Text('Nenhuma categoria disponível.'));
    }

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 16,
        mainAxisSpacing: 16,
        childAspectRatio: 1.1,
      ),
      itemCount: categorias.length,
      itemBuilder: (context, index) {
        final categoria = categorias[index];
        return Material(
          color: theme.colorScheme.surface,
          borderRadius: BorderRadius.circular(16),
          elevation: 1,
          child: InkWell(
            onTap: () => onCategoryTap(categoria),
            borderRadius: BorderRadius.circular(16),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(
                    _getIconData(categoria.icone),
                    size: 32,
                    color: theme.colorScheme.primary,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    categoria.nome,
                    textAlign: TextAlign.center,
                    style: theme.textTheme.titleSmall?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ),
        );
      },
    );
  }
}
