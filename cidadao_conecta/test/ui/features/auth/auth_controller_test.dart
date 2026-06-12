import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:cidadao_conecta/ui/features/auth/auth_controller.dart';
import 'package:cidadao_conecta/core/di/providers.dart';
import 'package:cidadao_conecta/domain/repositories/auth_repository.dart';
import 'package:cidadao_conecta/domain/models/app_user.dart';

import 'auth_controller_test.mocks.dart';

@GenerateMocks([AuthRepository])
void main() {
  group('AuthController - Sanitização (Trim)', () {
    late MockAuthRepository mockRepository;
    late ProviderContainer container;

    setUp(() {
      mockRepository = MockAuthRepository();
      container = ProviderContainer(
        overrides: [
          authRepositoryProvider.overrideWithValue(mockRepository),
        ],
      );
    });

    test('signUp deve aplicar trim nos campos de texto', () async {
      final authController = container.read(authControllerProvider.notifier);
      
      when(mockRepository.signUp(
        email: anyNamed('email'),
        password: anyNamed('password'),
        name: anyNamed('name'),
        cpf: anyNamed('cpf'),
        prefeituraId: anyNamed('prefeituraId'),
      )).thenAnswer((_) async => AppUser(id: '1', email: 'teste@email.com', name: 'Nome'));

      await authController.signUp(
        email: ' teste@email.com  ',
        password: 'senha123',
        name: '  Nome  ',
        cpf: ' 123.456.789-00 ',
        prefeituraId: 'pref-id',
      );

      verify(mockRepository.signUp(
        email: 'teste@email.com',
        password: 'senha123',
        name: 'Nome',
        cpf: '123.456.789-00',
        prefeituraId: 'pref-id',
      )).called(1);
    });

    test('signIn deve aplicar trim nos campos de texto', () async {
      final authController = container.read(authControllerProvider.notifier);
      
      when(mockRepository.signIn(
        email: anyNamed('email'),
        password: anyNamed('password'),
      )).thenAnswer((_) async => AppUser(id: '1', email: 'teste@email.com', name: 'Nome'));

      await authController.signIn(
        ' teste@email.com  ',
        'senha123',
      );

      verify(mockRepository.signIn(
        email: 'teste@email.com',
        password: 'senha123',
      )).called(1);
    });
  });
}
