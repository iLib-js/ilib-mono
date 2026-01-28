// Copyright © 2025-2026 JEDLSoft
// Web implementation using dart:html and dart:js_util (same behavior as JS ilib-env in browser).

import 'dart:html' as html;
import 'dart:js_util' as js_util;

/// Scope map used as "top" for caching (platform, locale, tz, browser).
/// In JS ilib-env, top() returns window; here we use a map so ilib-env can cache there without polluting window.
final Map<String, dynamic> _scope = <String, dynamic>{};

Map<String, dynamic> top() => _scope;

String getPlatformName() => 'browser';

/// Detect browser from userAgent, matching JS ilib-env order and names.
String? getPlatformBrowser() {
  final ua = html.window.navigator.userAgent;
  if (ua.isEmpty) return null;
  if (ua.contains('Firefox')) return 'firefox';
  if (RegExp(r'Opera|OPR').hasMatch(ua)) return 'opera';
  if (ua.contains('Chrome')) return 'chrome';
  if (ua.contains(' .NET')) return 'ie';
  if (ua.contains('Safari')) return 'safari'; // Chrome checked above
  if (ua.contains('Edge')) return 'Edge';
  if (RegExp(r'iPad|iPhone|iPod').hasMatch(ua)) return 'iOS';
  return null;
}

/// Parse locale from navigator to BCP-47, matching JS parseLocale behavior.
String getPlatformLocale() {
  final nav = html.window.navigator;
  String raw = nav.language;
  if (raw.isEmpty) {
    // IE-style fallbacks
    raw = ((nav as dynamic).browserLanguage ?? (nav as dynamic).userLanguage ?? (nav as dynamic).systemLanguage) as String? ?? '';
  }
  if (raw.isEmpty) return 'en-US';
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

/// Timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, else "local" (matches JS).
String getPlatformTimeZone() {
  try {
    final gt = js_util.globalThis;
    final intl = js_util.getProperty(gt, 'Intl');
    if (intl == null) return 'local';
    final dtf = js_util.getProperty(intl, 'DateTimeFormat');
    if (dtf == null) return 'local';
    final formatter = js_util.callConstructor(dtf, []);
    if (formatter == null) return 'local';
    final opts = js_util.callMethod(formatter, 'resolvedOptions', []);
    if (opts == null) return 'local';
    final tz = js_util.getProperty(opts, 'timeZone');
    if (tz is String && tz != 'Etc/Unknown' && tz.isNotEmpty) {
      return tz;
    }
  } catch (_) {}
  // navigator.timeZone exists in some browsers but is non-standard; JS uses it as fallback.
  final nav = html.window.navigator;
  final ntz = (nav as dynamic).timeZone ?? (nav as dynamic).timezone;
  if (ntz is String && ntz.isNotEmpty) return ntz;
  return 'local';
}
