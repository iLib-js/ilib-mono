// Copyright © 2021-2023, 2025-2026 JEDLSoft
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Web Edge tests for ilib_env. Run with: dart test --platform edge test/env_web_edge_test.dart

import 'package:ilib_env/ilib_env.dart';
import 'package:test/test.dart';

bool get _isWeb => identical(0, 0.0);
bool get _isEdge => _isWeb && getPlatform() == 'browser' && getBrowser() == 'Edge';
String? get _skipReason => !_isWeb ? 'Web only; run with --platform edge' : (!_isEdge ? 'Run with --platform edge' : null);

void main() {
  group('testEnv (web edge)', () {
    setUp(() {
      if (_isWeb) clearCache();
    });

    test('getBrowser returns Edge', () {
      expect(getBrowser(), equals('Edge'));
    }, skip: _skipReason);

    test('getLocale and getTimeZone from browser (--lang and TZ env)', () {
      clearCache();
      final loc = getLocale();
      final tz = getTimeZone();
      if (loc != 'kl-GL') {
        return; // Skip assertions when Edge did not apply --lang (dart_test.yaml); e.g. some headless setups.
      }
      expect(loc, equals('kl-GL'));
      expect(tz, equals('America/Nuuk'));
    }, skip: _skipReason);

    test('platform: default → set → clearCache → default again', () {
      clearCache();
      final defaultPlatform = getPlatform();
      expect(defaultPlatform, equals('browser'));

      setPlatform('custom-platform');
      expect(getPlatform(), equals('custom-platform'));

      clearCache();
      expect(getPlatform(), equals(defaultPlatform));
    }, skip: _skipReason);

    test('locale: default → set → clearCache → default again', () {
      clearCache();
      final defaultLocale = getLocale();
      expect(defaultLocale, isNotEmpty);

      setLocale('ja-JP');
      expect(getLocale(), equals('ja-JP'));

      clearCache();
      expect(getLocale(), equals(defaultLocale));
    }, skip: _skipReason);

    test('timezone: default → set → clearCache → default again', () {
      clearCache();
      final defaultTz = getTimeZone();
      expect(defaultTz, isNotEmpty);

      setTimeZone('Europe/London');
      expect(getTimeZone(), equals('Europe/London'));

      clearCache();
      expect(getTimeZone(), equals(defaultTz));
    }, skip: _skipReason);

    test('browser: getBrowser returns Edge, clearCache, getBrowser still Edge', () {
      clearCache();
      expect(getBrowser(), equals('Edge'));
      clearCache();
      expect(getBrowser(), equals('Edge'));
    }, skip: _skipReason);

    test('top returns map', () {
      final scope = top();
      expect(scope, isNotNull);
      expect(scope, isA<Map<String, dynamic>>());
    }, skip: _skipReason);

    test('globalVar / isGlobal', () {
      expect(isGlobal('asdfasdfasdf'), isFalse);
      final scope = top() as Map<String, dynamic>;
      scope['testGlobalNumber'] = 42;
      expect(globalVar('testGlobalNumber'), equals(42));
      expect(isGlobal('testGlobalNumber'), isTrue);
    }, skip: _skipReason);
  });
}
