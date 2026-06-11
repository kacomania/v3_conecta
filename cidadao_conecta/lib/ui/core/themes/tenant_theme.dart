import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

class TenantTheme {
  final ThemeData themeData;

  TenantTheme({required this.themeData});

  factory TenantTheme.defaultTheme() {
    return TenantTheme.fromColors(
      primaryColorHex: '#003B73',
      secondaryColorHex: '#005B9F',
    );
  }

  factory TenantTheme.fromColors({
    String? primaryColorHex,
    String? secondaryColorHex,
  }) {
    final primaryColor = _parseHexColor(primaryColorHex) ?? AppColors.primary;
    final secondaryColor = _parseHexColor(secondaryColorHex) ?? primaryColor;
    
    final baseTextTheme = GoogleFonts.interTextTheme();
    
    final textTheme = baseTextTheme.copyWith(
      displayLarge: baseTextTheme.displayLarge?.copyWith(
        color: primaryColor,
        fontWeight: FontWeight.bold,
      ),
      titleLarge: baseTextTheme.titleLarge?.copyWith(
        color: primaryColor,
        fontWeight: FontWeight.bold,
      ),
      bodyLarge: baseTextTheme.bodyLarge?.copyWith(
        color: AppColors.black,
      ),
      bodyMedium: baseTextTheme.bodyMedium?.copyWith(
        color: AppColors.greyDark,
      ),
    );

    final inputDecorationTheme = InputDecorationTheme(
      fillColor: AppColors.white,
      filled: true,
      hintStyle: GoogleFonts.inter(color: AppColors.greyDark),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: AppColors.greyLight),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: AppColors.greyLight),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: BorderSide(color: primaryColor, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: AppColors.error),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(8),
        borderSide: const BorderSide(color: AppColors.error, width: 2),
      ),
    );

    final theme = ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primaryColor,
        primary: primaryColor,
        secondary: secondaryColor,
        // ignore: deprecated_member_use
        background: AppColors.backgroundGrey,
        surface: AppColors.white,
        error: AppColors.error,
      ),
      scaffoldBackgroundColor: AppColors.white,
      textTheme: textTheme,
      inputDecorationTheme: inputDecorationTheme,
    );

    return TenantTheme(themeData: theme);
  }

  static Color? _parseHexColor(String? hexString) {
    if (hexString == null || hexString.isEmpty) return null;
    final buffer = StringBuffer();
    if (hexString.length == 6 || hexString.length == 7) buffer.write('ff');
    buffer.write(hexString.replaceFirst('#', ''));
    
    final parsed = int.tryParse(buffer.toString(), radix: 16);
    if (parsed == null) return null;
    return Color(parsed);
  }
}
