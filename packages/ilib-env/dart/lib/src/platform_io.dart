// Copyright © 2025-2026 JEDLSoft
// VM implementation using dart:io.

import 'dart:io' show Platform;

/// Scope map used as "top" for caching (platform, locale, tz, browser).
/// On VM there is no JS-style global, so we use this map.
final Map<String, dynamic> _scope = <String, dynamic>{};

Map<String, dynamic> top() => _scope;

String getPlatformName() => 'dart';
String? getPlatformBrowser() => null;

/// Parse LANG/LC_ALL-style locale to BCP-47 (same logic as platform_node).
String _parseEnvLocale(String raw) {
  var s = raw;
  final dot = s.indexOf('.');
  if (dot >= 0) s = s.substring(0, dot);
  if (s == 'C') return 'en-US';
  final parts = s.replaceAll('_', '-').split('-');
  final out = <String>[];
  if (parts.isNotEmpty && (parts[0].length == 2 || parts[0].length == 3)) {
    out.add(parts[0].toLowerCase());
    if (parts.length > 1) {
      if (parts[1].length == 4) {
        out.add(parts[1][0].toUpperCase() + parts[1].substring(1).toLowerCase());
      } else if (parts[1].length == 2 || parts[1].length == 3) {
        out.add(parts[1].toUpperCase());
      }
      if (parts.length > 2 && (parts[2].length == 2 || parts[2].length == 3)) {
        out.add(parts[2].toUpperCase());
      }
    }
  }
  final result = out.join('-');
  return result.isEmpty ? 'en-US' : result;
}

String getPlatformLocale() {
  final lcAll = Platform.environment['LC_ALL'];
  if (lcAll != null && lcAll.isNotEmpty) return _parseEnvLocale(lcAll);
  final lang = Platform.environment['LANG'];
  if (lang != null && lang.isNotEmpty) return _parseEnvLocale(lang);
  final name = Platform.localeName;
  if (name.isEmpty || name == 'C') return 'en-US';
  return name.replaceAll('_', '-');
}

String getPlatformTimeZone() {
  return Platform.environment['TZ'] ?? 'local';
}
