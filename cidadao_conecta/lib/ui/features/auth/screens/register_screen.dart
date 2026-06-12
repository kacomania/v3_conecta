import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../core/components/custom_text_field.dart';
import '../../../core/components/primary_button.dart';
import '../../../../core/utils/validators.dart';
import '../auth_controller.dart';
import '../../../../core/di/providers.dart';
import 'widgets/prefeitura_dropdown.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({super.key});

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _nameController = TextEditingController();
  final _cpfController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  
  final _cpfMaskFormatter = MaskTextInputFormatter(
    mask: '###.###.###-##',
    filter: {"#": RegExp(r'[0-9]')},
  );

  bool _acceptedTerms = false;
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;

  @override
  void dispose() {
    _nameController.dispose();
    _cpfController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _submit() {
    final name = _nameController.text;
    final cpf = _cpfController.text;
    final email = _emailController.text;
    final password = _passwordController.text;
    final confirmPassword = _confirmPasswordController.text;
    
    final currentTenant = ref.read(currentTenantProvider).value;

    if (name.isEmpty || email.isEmpty || password.isEmpty || cpf.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Preencha todos os campos.')),
      );
      return;
    }

    final cpfError = Validators.validateCPF(cpf);
    if (cpfError != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(cpfError)),
      );
      return;
    }

    if (password != confirmPassword) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('As senhas não coincidem.')),
      );
      return;
    }

    if (currentTenant == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Selecione uma prefeitura.')),
      );
      return;
    }

    if (!_acceptedTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Você precisa aceitar os Termos de Uso e Política de Privacidade.')),
      );
      return;
    }

    ref.read(authControllerProvider.notifier).signUp(
      name: name,
      cpf: cpf,
      email: email,
      password: password,
      prefeituraId: currentTenant.id,
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);
    final isLoading = authState.isLoading;

    ref.listen<AsyncValue<void>>(authControllerProvider, (previous, next) {
      next.whenOrNull(
        data: (_) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Conta criada com sucesso!')),
          );
          // O roteador deve redirecionar para '/' automaticamente se isAuth ficar true,
          // mas como segurança extra, se não ficar (ex: precisa confirmar email), volta pro login.
          if (context.mounted && context.canPop()) {
            context.pop();
          }
        },
        error: (error, stackTrace) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Erro: ${error.toString()}')),
          );
        },
      );
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Criar Nova Conta'),
        elevation: 0,
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Text(
                'Cadastre-se',
                style: Theme.of(context).textTheme.displayLarge?.copyWith(fontSize: 28),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 32),
              const PrefeituraDropdown(),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Nome Completo',
                hintText: 'Digite seu nome completo',
                controller: _nameController,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'CPF',
                hintText: 'Digite seu CPF',
                controller: _cpfController,
                keyboardType: TextInputType.number,
                inputFormatters: [_cpfMaskFormatter],
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'E-mail',
                hintText: 'Digite seu e-mail',
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Senha',
                hintText: 'Crie uma senha',
                controller: _passwordController,
                obscureText: _obscurePassword,
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscurePassword ? Icons.visibility : Icons.visibility_off,
                  ),
                  onPressed: () {
                    setState(() {
                      _obscurePassword = !_obscurePassword;
                    });
                  },
                ),
              ),
              const SizedBox(height: 16),
              CustomTextField(
                label: 'Confirmar Senha',
                hintText: 'Repita a senha',
                controller: _confirmPasswordController,
                obscureText: _obscureConfirmPassword,
                suffixIcon: IconButton(
                  icon: Icon(
                    _obscureConfirmPassword ? Icons.visibility : Icons.visibility_off,
                  ),
                  onPressed: () {
                    setState(() {
                      _obscureConfirmPassword = !_obscureConfirmPassword;
                    });
                  },
                ),
              ),
              const SizedBox(height: 16),
              CheckboxListTile(
                value: _acceptedTerms,
                onChanged: (value) {
                  setState(() {
                    _acceptedTerms = value ?? false;
                  });
                },
                title: const Text(
                  'Li e aceito os Termos de Uso e Política de Privacidade',
                  style: TextStyle(fontSize: 14),
                ),
                controlAffinity: ListTileControlAffinity.leading,
                contentPadding: EdgeInsets.zero,
              ),
              const SizedBox(height: 16),
              PrimaryButton(
                label: 'Criar Conta',
                isLoading: isLoading,
                onPressed: _acceptedTerms ? _submit : null,
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: () => context.pop(),
                child: const Text('Já tem uma conta? Faça login'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
