import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/themes/app_colors.dart';
import '../viewmodels/meu_perfil_view_model.dart';

class MeuPerfilPage extends ConsumerWidget {
  const MeuPerfilPage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final perfilAsync = ref.watch(meuPerfilViewModelProvider);

    return Scaffold(
      backgroundColor: AppColors.backgroundGrey,
      appBar: AppBar(
        backgroundColor: AppColors.white,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.primary),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Meu Perfil',
          style: TextStyle(
            color: AppColors.primary,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: false,
      ),
      body: perfilAsync.when(
        data: (state) => _PerfilContent(state: state),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(
          child: Text(
            'Erro ao carregar perfil:\n$e',
            textAlign: TextAlign.center,
            style: const TextStyle(color: AppColors.error),
          ),
        ),
      ),
    );
  }
}

class _PerfilContent extends ConsumerWidget {
  final MeuPerfilState state;
  const _PerfilContent({required this.state});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final user = state.user;
    if (user == null) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Usuário não encontrado. A sessão pode ter expirado.'),
            const SizedBox(height: 16),
            FilledButton(
              onPressed: () {
                ref.read(meuPerfilViewModelProvider.notifier).signOut();
              },
              child: const Text('Fazer Login Novamente'),
            ),
          ],
        ),
      );
    }
    final userName = user.name ?? 'Cidadão';
    final userEmail = user.email;
    final prefeituraId = user.prefeituraId;

    // Gera as iniciais do avatar a partir do nome
    final initials = _buildInitials(userName);

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // ── Avatar + Nome + Email ───────────────────────────
          Center(
            child: Column(
              children: [
                // Avatar com iniciais
                Container(
                  width: 100,
                  height: 100,
                  decoration: const BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: LinearGradient(
                      colors: [AppColors.primary, AppColors.secondary],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      initials,
                      style: const TextStyle(
                        color: AppColors.white,
                        fontSize: 36,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 1.5,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Text(
                  userName,
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primary,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  userEmail,
                  style: const TextStyle(
                    fontSize: 14,
                    color: AppColors.greyDark,
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // ── Seção: Dados da Conta ──────────────────────────
          _SectionCard(
            children: [
              _InfoRow(
                icon: Icons.badge_outlined,
                label: 'Nome',
                value: userName,
              ),
              const Divider(height: 1, color: AppColors.greyLight),
              _InfoRow(
                icon: Icons.email_outlined,
                label: 'E-mail',
                value: userEmail,
              ),
              if (prefeituraId != null) ...[
                const Divider(height: 1, color: AppColors.greyLight),
                _InfoRow(
                  icon: Icons.location_city_outlined,
                  label: 'Prefeitura ID',
                  value: prefeituraId,
                ),
              ],
            ],
          ),

          const SizedBox(height: 16),

          // ── Ações ──────────────────────────────────────────
          _SectionCard(
            children: [
              // Editar Nome
              _ActionTile(
                icon: Icons.edit_outlined,
                label: 'Editar Nome',
                onTap: () => _showEditNameDialog(context, ref, userName),
              ),
              const Divider(height: 1, color: AppColors.greyLight),
              // Trocar de Cidade
              _ActionTile(
                icon: Icons.swap_horiz_rounded,
                label: 'Trocar de Cidade',
                onTap: () async {
                  await ref
                      .read(meuPerfilViewModelProvider.notifier)
                      .clearTenant();
                  if (context.mounted) {
                    context.go('/');
                  }
                },
              ),
            ],
          ),

          const SizedBox(height: 24),

          // ── Botão de Logout ─────────────────────────────────
          _LogoutButton(isSaving: state.isSaving),

          const SizedBox(height: 16),

          // ── Botão de Excluir Conta ──────────────────────────
          _DeleteAccountButton(isSaving: state.isSaving),

          const SizedBox(height: 32),
        ],
      ),
    );
  }

  /// Exibe o dialog de edição de nome.
  void _showEditNameDialog(BuildContext context, WidgetRef ref, String currentName) {
    final controller = TextEditingController(text: currentName);
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text(
          'Editar Nome',
          style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold),
        ),
        content: TextField(
          controller: controller,
          autofocus: true,
          decoration: const InputDecoration(
            labelText: 'Novo nome',
            border: OutlineInputBorder(),
          ),
          textCapitalization: TextCapitalization.words,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancelar'),
          ),
          FilledButton(
            style: FilledButton.styleFrom(backgroundColor: AppColors.primary),
            onPressed: () async {
              final newName = controller.text.trim();
              Navigator.of(ctx).pop();
              if (newName.isNotEmpty && newName != currentName) {
                await ref
                    .read(meuPerfilViewModelProvider.notifier)
                    .updateName(newName);
                if (context.mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('Nome atualizado com sucesso!'),
                      backgroundColor: AppColors.success,
                    ),
                  );
                }
              }
            },
            child: const Text('Salvar'),
          ),
        ],
      ),
    );
  }

  String _buildInitials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts.first[0]}${parts.last[0]}'.toUpperCase();
    } else if (parts.isNotEmpty && parts.first.isNotEmpty) {
      return parts.first[0].toUpperCase();
    }
    return '?';
  }
}

/// Card de seção com sombra suave
class _SectionCard extends StatelessWidget {
  final List<Widget> children;
  const _SectionCard({required this.children});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.circular(12),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.06),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(children: children),
    );
  }
}

/// Linha de informação (ícone + label + valor)
class _InfoRow extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  const _InfoRow({required this.icon, required this.label, required this.value});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      child: Row(
        children: [
          Icon(icon, size: 20, color: AppColors.primary),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                label,
                style: const TextStyle(fontSize: 11, color: AppColors.greyDark),
              ),
              const SizedBox(height: 2),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 15,
                  color: AppColors.black,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

/// Item de ação clicável dentro de um card
class _ActionTile extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback onTap;
  const _ActionTile({required this.icon, required this.label, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        child: Row(
          children: [
            Icon(icon, size: 20, color: AppColors.primary),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                label,
                style: const TextStyle(
                  fontSize: 15,
                  color: AppColors.black,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            const Icon(Icons.chevron_right, size: 20, color: AppColors.greyDark),
          ],
        ),
      ),
    );
  }
}

/// Botão de Logout com destaque visual em vermelho
class _LogoutButton extends ConsumerWidget {
  final bool isSaving;
  const _LogoutButton({required this.isSaving});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.error,
          side: const BorderSide(color: AppColors.error, width: 1.5),
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
        onPressed: isSaving
            ? null
            : () async {
                final confirmed = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Sair da conta'),
                    content: const Text(
                      'Tem certeza que deseja sair da sua conta?',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.of(ctx).pop(false),
                        child: const Text('Cancelar'),
                      ),
                      FilledButton(
                        style: FilledButton.styleFrom(
                          backgroundColor: AppColors.error,
                        ),
                        onPressed: () => Navigator.of(ctx).pop(true),
                        child: const Text('Sair'),
                      ),
                    ],
                  ),
                );
                if (confirmed == true) {
                  await ref
                      .read(meuPerfilViewModelProvider.notifier)
                      .signOut();
                }
              },
        icon: isSaving
            ? const SizedBox(
                width: 18,
                height: 18,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AppColors.error,
                ),
              )
            : const Icon(Icons.logout_rounded),
        label: Text(
          isSaving ? 'Saindo...' : 'Sair / Logout',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}

/// Botão de Excluir Conta com destaque visual em vermelho (Danger Zone)
class _DeleteAccountButton extends ConsumerWidget {
  final bool isSaving;
  const _DeleteAccountButton({required this.isSaving});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return SizedBox(
      width: double.infinity,
      child: FilledButton.icon(
        style: FilledButton.styleFrom(
          backgroundColor: AppColors.error,
          padding: const EdgeInsets.symmetric(vertical: 16),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        ),
        onPressed: isSaving
            ? null
            : () async {
                final confirmed = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Excluir Conta Permanentemente'),
                    content: const Text(
                      'Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados pessoais serão removidos. Seus chamados permanecerão no sistema, mas de forma anônima.',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.of(ctx).pop(false),
                        child: const Text('Cancelar'),
                      ),
                      FilledButton(
                        style: FilledButton.styleFrom(
                          backgroundColor: AppColors.error,
                        ),
                        onPressed: () => Navigator.of(ctx).pop(true),
                        child: const Text('Excluir Conta'),
                      ),
                    ],
                  ),
                );
                if (confirmed == true) {
                  if (!context.mounted) return;
                  final doubleConfirmed = await showDialog<bool>(
                    context: context,
                    builder: (ctx) => AlertDialog(
                      title: const Text('Confirmação Final'),
                      content: const Text(
                        'Você tem certeza absoluta? Você não poderá recuperar sua conta.',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.of(ctx).pop(false),
                          child: const Text('Cancelar'),
                        ),
                        FilledButton(
                          style: FilledButton.styleFrom(
                            backgroundColor: AppColors.error,
                          ),
                          onPressed: () => Navigator.of(ctx).pop(true),
                          child: const Text('Sim, Excluir'),
                        ),
                      ],
                    ),
                  );
                  if (doubleConfirmed == true) {
                    await ref
                        .read(meuPerfilViewModelProvider.notifier)
                        .deleteAccount();
                  }
                }
              },
        icon: isSaving
            ? const SizedBox(
                width: 18,
                height: 18,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  color: AppColors.white,
                ),
              )
            : const Icon(Icons.delete_forever),
        label: Text(
          isSaving ? 'Aguarde...' : 'Excluir Minha Conta',
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
