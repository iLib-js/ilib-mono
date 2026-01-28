// Copyright © 2021-2024, 2025-2026 JEDLSoft
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Dart port of ilib-env. Same API; platform chosen by conditional import:
// - VM (dart.library.io): platform_io — getPlatform() "dart", getLocale/getTimeZone from Platform
// - Browser (dart.library.html): platform_web — getPlatform() "browser", getBrowser detected, navigator/Intl
// - Node (compiled to JS, headless): platform_node — getPlatform() "node", getLocale/getTimeZone from process.env

import 'platform_node.dart' if (dart.library.io) 'platform_io.dart' if (dart.library.html) 'platform_web.dart' as _platform;

/// Returns the "top" scope used by ilib-env for caching.
/// Provided by the platform (VM/web/stub); in JS ilib-env this is global/window.
Object? top() => _platform.top();

/// Platform identifier. "dart" on VM, "browser" on web, "node" when run in Node.js, or override from [setPlatform].
String getPlatform() =>
    _platform.top()['platform'] as String? ?? _platform.getPlatformName();

/// Override platform (e.g. for tests). Pass null to clear.
void setPlatform(String? plat) {
  if (plat != null) {
    _platform.top()['platform'] = plat;
  } else {
    _platform.top().remove('platform');
  }
}

/// Browser name. Null on VM; on web returns firefox/chrome/safari/Edge/opera/ie/iOS (cached like JS).
String? getBrowser() {
  final scope = _platform.top();
  if (scope.containsKey('browser')) return scope['browser'] as String?;
  final b = _platform.getPlatformBrowser();
  scope['browser'] = b;
  return b;
}

/// Returns the named value from the scope, or null.
dynamic globalVar(String name) => _platform.top()[name];

/// Returns true if [name] is present in the scope.
bool isGlobal(String name) => _platform.top().containsKey(name);

/// Default locale (BCP-47). Uses [Platform.localeName] on VM, navigator on web, unless overridden.
String getLocale() {
  final scope = _platform.top();
  final over = scope['locale'] as String?;
  if (over != null) return over;
  final s = _platform.getPlatformLocale();
  if (s == 'en') return 'en-US';
  return s;
}

/// Override default locale. Pass null to clear and use platform again.
void setLocale(String? locale) {
  final scope = _platform.top();
  if (locale != null && locale.isNotEmpty) {
    final normalized = locale.replaceAll('_', '-');
    scope['locale'] = normalized == 'en' ? 'en-US' : normalized;
  } else {
    scope.remove('locale');
  }
}

/// Default time zone. IANA id when TZ is set on VM; on web uses Intl/navigator.
String getTimeZone() =>
    _platform.top()['tz'] as String? ?? _platform.getPlatformTimeZone();

/// Override default time zone. Pass null to clear.
void setTimeZone(String? zoneName) {
  final scope = _platform.top();
  if (zoneName != null) {
    scope['tz'] = zoneName;
  } else {
    scope.remove('tz');
  }
}

/// Clears cached overrides so platform defaults are used again.
void clearCache() {
  _platform.top().clear();
}
