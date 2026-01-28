// Copyright © 2021-2023, 2025-2026 JEDLSoft
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Node tests for ilib_env. Run with: dart test --platform node test/env_node_test.dart

import 'package:ilib_env/ilib_env.dart';
import 'package:test/test.dart';

bool get _isWeb => identical(0, 0.0);
bool get _isNode => _isWeb && getPlatform() == 'node';
String? get _skipReason => !_isWeb ? 'Run with --platform node' : (!_isNode ? 'Run with --platform node' : null);

void main() {
  group('testEnv (node)', () {
    setUp(() {
      if (_isWeb) clearCache();
    });

    test('getPlatform returns node', () {
      expect(getPlatform(), equals('node'));
    }, skip: _skipReason);

    test('getBrowser returns null on Node', () {
      expect(getBrowser(), isNull);
    }, skip: _skipReason);

    test('getLocale and getTimeZone from LANG/TZ env (run via pnpm run test:dart:node)', () {
      clearCache();
      expect(getLocale(), equals('kl-GL'));
      expect(getTimeZone(), equals('America/Nuuk'));
    }, skip: _skipReason);

    test('platform: default → set → clearCache → default again', () {
      clearCache();
      final defaultPlatform = getPlatform();
      expect(defaultPlatform, equals('node'));

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

    test('browser: getBrowser null, clearCache, getBrowser still null', () {
      clearCache();
      expect(getBrowser(), isNull);
      clearCache();
      expect(getBrowser(), isNull);
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
