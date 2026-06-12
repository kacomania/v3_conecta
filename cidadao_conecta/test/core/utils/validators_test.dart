import 'package:flutter_test/flutter_test.dart';
import 'package:cidadao_conecta/core/utils/validators.dart';

void main() {
  group('Validators - CPF', () {
    test('Deve retornar erro para CPF com todos os números iguais', () {
      final result = Validators.validateCPF('111.111.111-11');
      expect(result, isNotNull);
      expect(result, 'CPF inválido');
    });

    test('Deve retornar erro para CPF com lógica matemática inválida', () {
      final result = Validators.validateCPF('123.456.789-00');
      expect(result, isNotNull);
      expect(result, 'CPF inválido');
    });

    test('Deve retornar null para CPF válido', () {
      // Usando um CPF gerado aleatoriamente para o teste
      final result = Validators.validateCPF('52998224725');
      expect(result, isNull);
    });

    test('Deve retornar erro se for vazio ou nulo', () {
      expect(Validators.validateCPF(''), 'CPF é obrigatório');
      expect(Validators.validateCPF(null), 'CPF é obrigatório');
    });
  });
}
