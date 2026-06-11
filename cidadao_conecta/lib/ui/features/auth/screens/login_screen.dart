import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/components/custom_text_field.dart';
import '../../../core/components/primary_button.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../../../core/di/providers.dart';
import '../auth_controller.dart';
import 'widgets/prefeitura_dropdown.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _submit() {
    final email = _emailController.text;
    final password = _passwordController.text;
    if (email.isNotEmpty && password.isNotEmpty) {
      ref.read(authControllerProvider.notifier).signIn(email, password);
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final isLoading = authState.isLoading;
    final tenantState = ref.watch(currentTenantProvider);

    ref.listen<AsyncValue<void>>(authControllerProvider, (previous, next) {
      next.whenOrNull(
        error: (error, stackTrace) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Erro: ${error.toString()}')),
          );
        },
      );
    });

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (tenantState.value?.logoUrl != null && tenantState.value!.logoUrl!.isNotEmpty)
                CachedNetworkImage(
                  imageUrl: tenantState.value!.logoUrl!,
                  height: 100,
                  fit: BoxFit.contain,
                  placeholder: (context, url) => const SizedBox(height: 100, child: Center(child: CircularProgressIndicator())),
                  errorWidget: (context, url, error) => const SizedBox(height: 100, child: Icon(Icons.error)),
                )
              else
                Column(
                  children: [
                    Text(
                      'Bem-vindo ao',
                      style: Theme.of(context).textTheme.bodyLarge,
                      textAlign: TextAlign.center,
                    ),
                    Text(
                      'Cidadão Conecta',
                      style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 32),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              const SizedBox(height: 32),
              const PrefeituraDropdown(),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'E-mail',
                hintText: 'Digite seu e-mail',
                controller: _emailController,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Senha',
                hintText: 'Digite sua senha',
                controller: _passwordController,
                obscureText: true,
              ),
              const SizedBox(height: 24),
              PrimaryButton(
                label: 'Entrar',
                isLoading: isLoading,
                onPressed: _submit,
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () => context.push('/register'),
                child: const Text('Não tem uma conta? Cadastre-se'),
              ),
              TextButton(
                onPressed: () => context.push('/recovery'),
                child: const Text('Esqueci minha senha'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
