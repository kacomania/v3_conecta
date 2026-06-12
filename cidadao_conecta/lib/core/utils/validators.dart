class Validators {
  static String? validateCPF(String? value) {
    if (value == null || value.isEmpty) {
      return 'CPF é obrigatório';
    }

    final numericCPF = value.replaceAll(RegExp(r'[^0-9]'), '');

    if (numericCPF.length != 11) {
      return 'CPF inválido';
    }

    // Check for repeated digits
    if (RegExp(r'^(\d)\1*$').hasMatch(numericCPF)) {
      return 'CPF inválido';
    }

    List<int> digits = numericCPF.split('').map(int.parse).toList();

    int calc1 = 0;
    for (int i = 0; i < 9; i++) {
      calc1 += digits[i] * (10 - i);
    }
    int rest1 = calc1 % 11;
    int check1 = rest1 < 2 ? 0 : 11 - rest1;
    if (digits[9] != check1) return 'CPF inválido';

    int calc2 = 0;
    for (int i = 0; i < 10; i++) {
      calc2 += digits[i] * (11 - i);
    }
    int rest2 = calc2 % 11;
    int check2 = rest2 < 2 ? 0 : 11 - rest2;
    if (digits[10] != check2) return 'CPF inválido';

    return null; // CPF is valid
  }
}
