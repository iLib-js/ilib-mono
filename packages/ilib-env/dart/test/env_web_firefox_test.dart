// Copyright © 2021-2023, 2025-2026 JEDLSoft
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Web Firefox tests for ilib_env. Run with: dart test --platform firefox test/env_web_firefox_test.dart

import 'package:ilib_env/ilib_env.dart';
import 'package:test/test.dart';

bool get _isWeb => identical(0, 0.0);
bool get _isFirefox => _isWeb && getPlatform() == 'browser' && getBrowser() == 'firefox';
String? get _skipReason => !_isWeb ? 'Web only; run with --platform firefox' : (!_isFirefox ? 'Run with --platform firefox' : null);

void main() {
  group('testEnv (web firefox)', () {
    setUp(() {
      if (_isWeb) clearCache();
    });

    test('getBrowser returns firefox', () {
      expect(getBrowser(), equals('firefox'));
    }, skip: _skipReason);

    test('getLocale and getTimeZone from browser (Firefox has no --lang; run Chrome/Edge for explicit kl-GL)', () {
      clearCache();
      expect(getLocale(), isNotEmpty);
      expect(getTimeZone(), isNotEmpty);
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

    test('browser: getBrowser returns firefox, clearCache, getBrowser still firefox', () {
      clearCache();
      expect(getBrowser(), equals('firefox'));
      clearCache();
      expect(getBrowser(), equals('firefox'));
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
