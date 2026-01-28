// Copyright © 2025-2026 JEDLSoft
// Node.js implementation when Dart is compiled to JS and run in Node.
// Uses dart:js_util to read process.env (LANG, LC_ALL, TZ), matching JS ilib-env nodejs behavior.

import 'dart:js_util' as js_util;

/// Scope map used as "top" for caching (platform, locale, tz, browser).
/// In JS ilib-env, top() returns global; here we use a map so ilib-env can cache without polluting global.
final Map<String, dynamic> _scope = <String, dynamic>{};

Map<String, dynamic> top() => _scope;

String getPlatformName() => 'node';
String? getPlatformBrowser() => null;

/// Read LANG or LC_ALL from process.env via JS interop.
String? _getEnvLocale() {
  try {
    final gt = js_util.globalThis;
    final process = js_util.getProperty(gt, 'process');
    if (process == null) return null;
    final env = js_util.getProperty(process, 'env');
    if (env == null) return null;
    final lang = js_util.getProperty(env, 'LANG');
    if (lang is String && lang.isNotEmpty) return lang;
    final lcAll = js_util.getProperty(env, 'LC_ALL');
    if (lcAll is String && lcAll.isNotEmpty) return lcAll;
    return null;
  } catch (_) {
    return null;
  }
}

/// Parse locale string to BCP-47, matching JS parseLocale (LANG/LC_ALL form).
String getPlatformLocale() {
  final raw = _getEnvLocale();
  if (raw == null || raw.isEmpty) return 'en-US';
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

/// Read TZ from process.env.
String getPlatformTimeZone() {
  try {
    final gt = js_util.globalThis;
    final process = js_util.getProperty(gt, 'process');
    if (process == null) return 'local';
    final env = js_util.getProperty(process, 'env');
    if (env == null) return 'local';
    final tz = js_util.getProperty(env, 'TZ');
    if (tz is String && tz.isNotEmpty) return tz;
  } catch (_) {}
  return 'local';
}
