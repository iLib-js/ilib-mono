// Copyright © 2012-2015, 2018, 2021-2022, 2025-2026 JEDLSoft
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// See the License for the specific language governing permissions and
// limitations under the License.

import 'a1toa3langmap.dart' as lang;
import 'a2toa3regmap.dart' as reg;
import 'package:ilib_env/ilib_env.dart' show getLocale;
import 'scripts.dart';

/// BCP-47 locale specifier: language, region, script, variant.
///
/// Language is ISO 639-1 (2-letter), region is ISO 3166-1 (2-letter),
/// script is ISO 15924 (4-letter), variant is free-form.
/// Each part is optional; dashes separate parts in the spec string.
class Locale {
  /// ISO 639-1 language code (e.g. "en").
  String? language;

  /// ISO 3166-1 region code (e.g. "US").
  String? region;

  /// ISO 15924 script code (e.g. "Latn").
  String? script;

  /// Variant subtag (e.g. extension or variant).
  String? variant;

  /// Cached BCP-47 spec string.
  String? _spec;

  /// Data maps (mirror of JS static fields).
  static const Map<String, String> a2toa3regmap = reg.a2toa3regmap;
  static const Map<String, String> a1toa3langmap = lang.a1toa3langmap;
  static const List<String> iso15924 = iso15924Scripts;

  /// Creates a locale from a BCP-47 spec string, another [Locale]-like object,
  /// or from explicit language/region/variant/script.
  ///
  /// - [Locale()] or [Locale(null)] → host locale via [getLocale].
  /// - [Locale("en-US")] → parse spec.
  /// - [Locale("en", "US")] → language + region.
  /// - [Locale(language, region, variant, script)] → all four.
  Locale([Object? languageOrSpec, String? region, String? variant, String? script]) {
    if (region == null && variant == null && script == null) {
      final spec = languageOrSpec ?? getLocale();
      if (spec is String) {
        _parseSpec(spec);
      } else if (spec is Locale) {
        language = spec.language;
        this.region = spec.region;
        this.script = spec.script;
        this.variant = spec.variant;
      } else if (spec is Map) {
        language = spec['language'] as String?;
        this.region = spec['region'] as String?;
        this.script = spec['script'] as String?;
        this.variant = spec['variant'] as String?;
      } else {
        language = null;
        this.region = null;
        this.script = null;
        this.variant = null;
      }
      _normUndefined();
    } else {
      _setFromParts(
        languageOrSpec is String ? languageOrSpec : null,
        region,
        variant,
        script,
      );
    }
    _genSpec();
  }

  void _normUndefined() {
    language = language == null || language!.isEmpty ? null : language;
    region = region == null || region!.isEmpty ? null : region;
    script = script == null || script!.isEmpty ? null : script;
    variant = variant == null || variant!.isEmpty ? null : variant;
  }

  void _parseSpec(String spec) {
    final parts = spec.split(RegExp(r'[-_]'));
    for (var i = 0; i < parts.length; i++) {
      if (_isExtensionSingleton(parts[i]) && i < parts.length - 1) {
        final v = variant;
        variant = (v != null && v.isNotEmpty ? '$v-' : '') + parts.sublist(i).join('-');
        break;
      }
      if (_isLanguageCode(parts[i])) {
        language = parts[i];
      } else if (_isRegionCode(parts[i])) {
        region = parts[i];
      } else if (_isScriptCode(parts[i])) {
        script = parts[i];
      } else if (parts[i].isNotEmpty) {
        // Match JS: empty string is falsy, so "v ? v + '-' + p : p" yields p when v is ""
        final v = variant;
        variant = (v != null && v.isNotEmpty) ? '$v-${parts[i]}' : parts[i];
      }
    }
    _normUndefined();
  }

  void _setFromParts(String? lang, String? reg, String? var_, String? scr) {
    if (lang != null && lang.isNotEmpty) {
      language = lang.trim().toLowerCase();
    } else {
      language = null;
    }
    if (reg != null && reg.isNotEmpty) {
      region = reg.trim().toUpperCase();
    } else {
      region = null;
    }
    if (var_ != null && var_.isNotEmpty) {
      variant = var_.trim();
    } else {
      variant = null;
    }
    if (scr != null && scr.isNotEmpty) {
      script = scr.trim();
    } else {
      script = null;
    }
  }

  void _genSpec() {
    _spec = [language, script, region, variant].whereType<String>().where((s) => s.isNotEmpty).join('-');
  }

  /// ISO 639 language code.
  String? getLanguage() => language;

  /// ISO 639 alpha-3 language code.
  String? getLanguageAlpha3() => Locale.languageAlpha1ToAlpha3(language);

  /// ISO 3166 region code.
  String? getRegion() => region;

  /// ISO 3166 alpha-3 region code.
  String? getRegionAlpha3() => Locale.regionAlpha2ToAlpha3(region);

  /// ISO 15924 script code.
  String? getScript() => script;

  /// Variant subtag.
  String? getVariant() => variant;

  /// Full BCP-47 spec string.
  String getSpec() {
    if (_spec == null) _genSpec();
    return _spec ?? '';
  }

  /// Language + script only (e.g. "en-Latn").
  String getLangSpec() {
    if (language == null) return '';
    return script != null ? '$language-$script' : language!;
  }

  @override
  String toString() => getSpec();

  /// Value equality of all components.
  bool equals(Locale other) =>
      language == other.language &&
      region == other.region &&
      script == other.script &&
      variant == other.variant;

  /// True if every present component is a valid ISO code.
  bool isValid() {
    if (language == null && script == null && region == null) return false;
    if (language != null && (!_isLanguageCode(language!) || !a1toa3langmap.containsKey(language))) return false;
    if (script != null && (!_isScriptCode(script!) || !iso15924.contains(script))) return false;
    if (region != null && (!_isRegionCode(region!) || !a2toa3regmap.containsKey(region))) return false;
    return true;
  }

  // --- Static helpers (mirror of JS Locale._* and Locale.regionAlpha2ToAlpha3 etc.) ---

  static bool _notLower(String str) {
    if (str.isEmpty) return true;
    final ch = str.codeUnitAt(0);
    return ch < 97 || ch > 122;
  }

  static bool _notUpper(String str) {
    if (str.isEmpty) return true;
    final ch = str.codeUnitAt(0);
    return ch < 65 || ch > 90;
  }

  static bool _notDigit(String str) {
    if (str.isEmpty) return true;
    final ch = str.codeUnitAt(0);
    return ch < 48 || ch > 57;
  }

  static bool _isLanguageCode(String? str) {
    if (str == null || str.length < 2 || str.length > 3) return false;
    for (var i = 0; i < str.length; i++) {
      if (_notLower(str[i])) return false;
    }
    return true;
  }

  static bool _isRegionCode(String? str) {
    if (str == null || str.length < 2 || str.length > 3) return false;
    if (str.length == 2) {
      for (var i = 0; i < str.length; i++) {
        if (_notUpper(str[i])) return false;
      }
    } else {
      for (var i = 0; i < str.length; i++) {
        if (_notDigit(str[i])) return false;
      }
    }
    return true;
  }

  static bool _isScriptCode(String? str) {
    if (str == null || str.length != 4) return false;
    if (_notUpper(str[0])) return false;
    for (var i = 1; i < 4; i++) {
      if (_notLower(str[i])) return false;
    }
    return true;
  }

  static bool _isExtensionSingleton(String? str) {
    if (str == null || str.length != 1) return false;
    return !_notLower(str[0]);
  }

  /// Alpha-2 → alpha-3 region code.
  static String? regionAlpha2ToAlpha3(String? alpha2) =>
      alpha2 != null ? (a2toa3regmap[alpha2] ?? alpha2) : null;

  /// Alpha-1 → alpha-3 language code.
  static String? languageAlpha1ToAlpha3(String? alpha1) =>
      alpha1 != null ? (a1toa3langmap[alpha1] ?? alpha1) : null;
}
