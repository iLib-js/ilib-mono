// Copyright © 2021-2023, 2025-2026 JEDLSoft
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// VM-only tests for ilib_env. Run with: dart test test/env_vm_test.dart
// These tests expect platform_io (getPlatform() == "dart", getBrowser() == null).

import 'package:ilib_env/ilib_env.dart';
import 'package:test/test.dart';

void main() {
  group('testEnv (VM)', () {
    setUp(() {
      clearCache();
    });

    test('GetPlatformDefault', () {
      expect(getPlatform(), equals('dart'));
    });

    test('SetPlatform', () {
      setPlatform('mock');
      expect(getPlatform(), equals('mock'));
      setPlatform(null);
      expect(getPlatform(), equals('dart'));
    });

    test('GetBrowserNull', () {
      expect(getBrowser(), isNull);
    });

    test('GetLocaleAndTimeZoneFromEnv (run via pnpm run test:dart:vm)', () {
      clearCache();
      expect(getLocale(), equals('kl-GL'));
      expect(getTimeZone(), equals('America/Nuuk'));
    });

    test('GetLocaleDefault', () {
      final loc = getLocale();
      expect(loc, isNotEmpty);
      // Platform.localeName → BCP-47; often "en-US" or similar
      expect(loc.length, greaterThanOrEqualTo(2));
    });

    test('SetLocale', () {
      setLocale('ja-JP');
      expect(getLocale(), equals('ja-JP'));
    });

    test('SetLocaleClear', () {
      setLocale('ja-JP');
      setLocale(null);
      expect(getLocale(), isNotEmpty);
    });

    test('GetTimeZoneDefault', () {
      final tz = getTimeZone();
      expect(tz, isNotEmpty);
    });

    test('SetTimeZone', () {
      setTimeZone('Europe/London');
      expect(getTimeZone(), equals('Europe/London'));
    });

    test('SetTimeZoneReset', () {
      final tz = getTimeZone();
      setTimeZone('Europe/London');
      expect(getTimeZone(), equals('Europe/London'));
      setTimeZone(null);
      expect(getTimeZone(), equals(tz));
    });

    test('TopReturnsMap', () {
      final scope = top();
      expect(scope, isNotNull);
      expect(scope, isA<Map<String, dynamic>>());
    });

    test('IsGlobalNot', () {
      expect(isGlobal('asdfasdfasdf'), isFalse);
    });

    test('GlobalVarViaTop', () {
      final scope = top() as Map<String, dynamic>;
      scope['testGlobalNumber'] = 42;
      expect(globalVar('testGlobalNumber'), equals(42));
      expect(isGlobal('testGlobalNumber'), isTrue);
    });

    test('GlobalVarUndefined', () {
      expect(globalVar('testGlobalNumber2'), isNull);
    });

    test('ClearingTheCache', () {
      setLocale('af-ZA');
      expect(getLocale(), equals('af-ZA'));
      expect(isGlobal('locale'), isTrue);
      expect(globalVar('locale'), equals('af-ZA'));

      clearCache();

      expect(isGlobal('locale'), isFalse);
      expect(globalVar('locale'), isNull);
    });

    test('SetPlatformMock', () {
      clearCache();
      setPlatform('mock');
      expect(getPlatform(), equals('mock'));
      expect(top(), isNotNull);
    });
  });
}
