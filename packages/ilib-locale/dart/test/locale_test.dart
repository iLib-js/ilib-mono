// Copyright © 2012-2015, 2017-2018, 2020-2023, 2025-2026 JEDLSoft
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// See the License for the specific language governing permissions and
// limitations under the License.

import 'package:ilib_env/ilib_env.dart' show clearCache, getLocale, getPlatform;
import 'package:ilib_locale/ilib_locale.dart';
import 'package:test/test.dart';

void main() {
  group('testLocale', () {
    test('LocaleConstructor', () {
      final loc = Locale();
      expect(loc, isNotNull);
    });

    test('LocaleConstructorBrowser', () {
      clearCache();
      final loc = Locale();
      expect(loc, isNotNull);
      final spec = getLocale();
      expect(loc.getSpec(), equals(spec));
      final parts = spec.split('-');
      expect(loc.getLanguage(), equals(parts[0]));
      if (parts.length >= 2) {
        expect(loc.getRegion(), equals(parts[1]));
      }
    }, skip: getPlatform() != 'browser' ? 'Platform-specific: browser' : null);

    test('LocaleConstructorBrowserCLocale', () {
      // Cannot mock navigator.language to C in Dart test.
    }, skip: getPlatform() != 'browser' ? 'Platform-specific: browser' : 'Cannot mock navigator.language to C in Dart');

    test('LocaleConstructorBrowserLanguageOnly', () {
      clearCache();
      final loc = Locale();
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals(getLocale()));
    }, skip: getPlatform() != 'browser' ? 'Platform-specific: browser' : null);

    test('LocaleConstructorBrowserNoLocale', () {
      // Cannot mock navigator.language to undefined in Dart test.
    }, skip: getPlatform() != 'browser' ? 'Platform-specific: browser' : 'Cannot mock no locale in Dart');

    test('LocaleConstructorNode', () {
      clearCache();
      final loc = Locale();
      expect(loc, isNotNull);
      expect(loc.getLanguage(), isNotNull);
      expect(loc.getSpec(), isNotEmpty);
      if (getPlatform() == 'node' || getPlatform() == 'dart') {
        // With run-dart-test-with-env.js we get LANG=kl_GL.UTF-8
        final spec = getLocale();
        if (spec.startsWith('kl')) {
          expect(loc.getLanguage(), equals('kl'));
          expect(loc.getRegion(), equals('GL'));
        }
      }
    });

    test('LocaleConstructorNodeNonEnglish', () {
      // Requires LANG=ko_KR; run with env separately.
    }, skip: getPlatform() != 'node' ? 'Platform-specific: node' : 'Requires LANG=ko_KR; run separately');

    test('LocaleConstructorNodeLocaleWithCharset', () {
      // Requires LANG=de_DE.UTF8; run with env separately.
    }, skip: getPlatform() != 'node' ? 'Platform-specific: node' : 'Requires LANG=de_DE.UTF8; run separately');

    test('LocaleConstructorNodeCLocale', () {
      // Requires LANG=C; run with env separately.
    }, skip: getPlatform() != 'node' ? 'Platform-specific: node' : 'Requires LANG=C; run separately');

    test('LocaleConstructorNodeCLocaleWithCharset', () {
      // Requires LANG=C.UTF8; run with env separately.
    }, skip: getPlatform() != 'node' ? 'Platform-specific: node' : 'Requires LANG=C.UTF8; run separately');

    test('LocaleConstructorNodeLangOnly', () {
      // Requires LANG=es; run with env separately.
    }, skip: getPlatform() != 'node' ? 'Platform-specific: node' : 'Requires LANG=es; run separately');

    test('LocaleConstructorNodeNoPlatformSetting', () {
      // Requires unset LANG; run separately.
    }, skip: getPlatform() != 'node' ? 'Platform-specific: node' : 'Requires unset LANG; run separately');

    test('LocaleCopyConstructor', () {
      final loc2 = Locale('de', 'DE');
      final loc = Locale(loc2);
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('de'));
      expect(loc.getRegion(), equals('DE'));
      expect(loc.getVariant(), isNull);
    });

    test('LocaleConstructorFull', () {
      final loc = Locale('en', 'US', 'Midwest');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), equals('US'));
      expect(loc.getVariant(), equals('Midwest'));
    });

    test('LocaleConstructorSpecWithVariant', () {
      final loc = Locale('en-US-Midwest');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), equals('US'));
      expect(loc.getVariant(), equals('Midwest'));
      expect(loc.getScript(), isNull);
    });

    test('LocaleConstructorSpecWithScript', () {
      final loc = Locale('en-US-Latn');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), equals('US'));
      expect(loc.getScript(), equals('Latn'));
      expect(loc.getVariant(), isNull);
    });

    test('LocaleConstructorPartial', () {
      final loc = Locale('en', 'US');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), equals('US'));
      expect(loc.getVariant(), isNull);
    });

    test('LocaleConstructorSpecPartial', () {
      final loc = Locale('en-US');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), equals('US'));
      expect(loc.getVariant(), isNull);
    });

    test('LocaleConstructorSpecWithUnderscores1', () {
      final loc = Locale('zh_Hans_CN');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('zh'));
      expect(loc.getRegion(), equals('CN'));
      expect(loc.getScript(), equals('Hans'));
      expect(loc.getVariant(), isNull);
    });

    test('LocaleConstructorSpecWithUnderscores2', () {
      final loc = Locale('en_US');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), equals('US'));
      expect(loc.getVariant(), isNull);
    });

    test('LocaleConstructorShort', () {
      final loc = Locale('en');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), isNull);
      expect(loc.getVariant(), isNull);
    });

    test('LocaleConstructorUpperCaseLanguage', () {
      final loc = Locale('EN', 'US');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), equals('US'));
      expect(loc.getVariant(), isNull);
    });

    test('LocaleConstructorLowerCaseRegion', () {
      final loc = Locale('en', 'us');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), equals('US'));
      expect(loc.getVariant(), isNull);
    });

    test('LocaleConstructorSpecMissingRegion', () {
      final loc = Locale('en--Midwest');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), isNull);
      expect(loc.getVariant(), equals('Midwest'));
      expect(loc.getScript(), isNull);
    });

    test('LocaleConstructorSpecMissingLanguage', () {
      final loc = Locale('-US-Midwest');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), isNull);
      expect(loc.getRegion(), equals('US'));
      expect(loc.getVariant(), equals('Midwest'));
      expect(loc.getScript(), isNull);
    });

    test('LocaleConstructorSpecMissingLanguageAndVariant', () {
      final loc = Locale('-US');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), isNull);
      expect(loc.getRegion(), equals('US'));
      expect(loc.getVariant(), isNull);
      expect(loc.getScript(), isNull);
    });

    test('LocaleEqualsTrue', () {
      final loc1 = Locale('en-US');
      final loc2 = Locale('en', 'US');
      expect(loc1, isNotNull);
      expect(loc2, isNotNull);
      expect(loc1.equals(loc2), isTrue);
    });

    test('LocaleEqualsFalse', () {
      final loc1 = Locale('en-US');
      final loc2 = Locale('en', 'CA');
      expect(loc1, isNotNull);
      expect(loc2, isNotNull);
      expect(loc1.equals(loc2), isFalse);
    });

    test('LocaleEqualsMissing', () {
      final loc1 = Locale('en-US');
      final loc2 = Locale('en', 'US', 'govt');
      expect(loc1, isNotNull);
      expect(loc2, isNotNull);
      expect(loc1.equals(loc2), isFalse);
    });

    test('LocaleEqualsTrueFull', () {
      final loc1 = Locale('en-US-govt');
      final loc2 = Locale('en', 'US', 'govt');
      expect(loc1, isNotNull);
      expect(loc2, isNotNull);
      expect(loc1.equals(loc2), isTrue);
    });

    test('LocaleEqualsTrueShort', () {
      final loc1 = Locale('en');
      final loc2 = Locale('en');
      expect(loc1, isNotNull);
      expect(loc2, isNotNull);
      expect(loc1.equals(loc2), isTrue);
    });

    test('LocaleGetSpecLangOnly', () {
      final loc = Locale('en');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('en'));
    });

    test('LocaleGetSpecRegionOnly', () {
      final loc = Locale('CA');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('CA'));
    });

    test('LocaleGetSpecScriptOnly', () {
      final loc = Locale('Latn');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('Latn'));
    });

    test('LocaleGetSpecVariantOnly', () {
      final loc = Locale('asdfasdf');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('asdfasdf'));
    });

    test('LocaleGetSpecLangAndScript', () {
      final loc = Locale('Latn-en');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('en-Latn'));
    });

    test('LocaleGetSpecLangAndRegion', () {
      final loc = Locale('CA-en');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('en-CA'));
    });

    test('LocaleGetSpecLangAndVariant', () {
      final loc = Locale('asdf-en');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('en-asdf'));
    });

    test('LocaleGetSpecScriptAndRegion', () {
      final loc = Locale('CA-Latn');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('Latn-CA'));
    });

    test('LocaleGetSpecScriptAndVariant', () {
      final loc = Locale('asdf-Latn');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('Latn-asdf'));
    });

    test('LocaleGetSpecRegionAndVariant', () {
      final loc = Locale('asdf-CA');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('CA-asdf'));
    });

    test('LocaleGetSpecLangScriptRegion', () {
      final loc = Locale('CA-en-Latn');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('en-Latn-CA'));
    });

    test('LocaleGetSpecScriptRegionVariant', () {
      final loc = Locale('CA-asdf-Latn');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('Latn-CA-asdf'));
    });

    test('LocaleGetSpecLangScriptVariant', () {
      final loc = Locale('asdf-Latn-en');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('en-Latn-asdf'));
    });

    test('LocaleGetSpecLangRegionVariant', () {
      final loc = Locale('asdf-CA-en');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('en-CA-asdf'));
    });

    test('LocaleGetSpecAll', () {
      final loc = Locale('asdf-CA-Latn-en');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('en-Latn-CA-asdf'));
    });

    test('LocaleM49RegionCodeGetParts', () {
      final loc = Locale('en-001');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), equals('001'));
      expect(loc.getVariant(), isNull);
    });

    test('LocaleM49RegionCodeGetParts2', () {
      final loc = Locale('en-150');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), equals('150'));
      expect(loc.getVariant(), isNull);
    });

    test('LocaleM49RegionCodeGetSpec', () {
      final loc = Locale('en-001');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals('en-001'));
    });

    test('LocaleNoLocale', () {
      final loc = Locale('-');
      expect(loc, isNotNull);
      expect(loc.getSpec(), equals(''));
      expect(loc.getLanguage(), isNull);
      expect(loc.getRegion(), isNull);
      expect(loc.getScript(), isNull);
      expect(loc.getVariant(), isNull);
    });

    test('LocaleRegionMap1', () {
      expect(Locale.regionAlpha2ToAlpha3('SG'), equals('SGP'));
    });

    test('LocaleRegionMap2', () {
      expect(Locale.regionAlpha2ToAlpha3('VN'), equals('VNM'));
    });

    test('LocaleRegionMap3', () {
      expect(Locale.regionAlpha2ToAlpha3('KR'), equals('KOR'));
    });

    test('LocaleRegionMapEmpty', () {
      expect(Locale.regionAlpha2ToAlpha3(''), equals(''));
    });

    test('LocaleRegionMapUnknown', () {
      expect(Locale.regionAlpha2ToAlpha3('QQ'), equals('QQ'));
    });

    test('LocaleRegionMapWrongCase', () {
      expect(Locale.regionAlpha2ToAlpha3('sg'), equals('sg'));
    });

    test('LocaleRegionMapUndefined', () {
      expect(Locale.regionAlpha2ToAlpha3(null), isNull);
    });

    test('LocaleLanguageMap1', () {
      expect(Locale.languageAlpha1ToAlpha3('ko'), equals('kor'));
    });

    test('LocaleLanguageMap2', () {
      expect(Locale.languageAlpha1ToAlpha3('th'), equals('tha'));
    });

    test('LocaleLanguageMap3', () {
      expect(Locale.languageAlpha1ToAlpha3('hr'), equals('hrv'));
    });

    test('LocaleLanguageMapEmpty', () {
      expect(Locale.languageAlpha1ToAlpha3(''), equals(''));
    });

    test('LocaleLanguageMapUnknown', () {
      expect(Locale.languageAlpha1ToAlpha3('qq'), equals('qq'));
    });

    test('LocaleLanguageMapWrongCase', () {
      expect(Locale.languageAlpha1ToAlpha3('EN'), equals('EN'));
    });

    test('LocaleLanguageMapUndefined', () {
      expect(Locale.languageAlpha1ToAlpha3(null), isNull);
    });

    test('LocaleGetLanguageAlpha3_1', () {
      final loc = Locale('en-US');
      expect(loc, isNotNull);
      expect(loc.getLanguageAlpha3(), equals('eng'));
    });

    test('LocaleGetLanguageAlpha3_2', () {
      final loc = Locale('ru-RU');
      expect(loc, isNotNull);
      expect(loc.getLanguageAlpha3(), equals('rus'));
    });

    test('LocaleGetLanguageAlpha3_3', () {
      final loc = Locale('gv-GB');
      expect(loc, isNotNull);
      expect(loc.getLanguageAlpha3(), equals('glv'));
    });

    test('LocaleGetLanguageAlpha3NoLanguage', () {
      final loc = Locale('GB');
      expect(loc, isNotNull);
      expect(loc.getLanguageAlpha3(), isNull);
    });

    test('LocaleGetRegionAlpha3_1', () {
      final loc = Locale('en-US');
      expect(loc, isNotNull);
      expect(loc.getRegionAlpha3(), equals('USA'));
    });

    test('LocaleGetRegionAlpha3_2', () {
      final loc = Locale('ru-RU');
      expect(loc, isNotNull);
      expect(loc.getRegionAlpha3(), equals('RUS'));
    });

    test('LocaleGetRegionAlpha3_3', () {
      final loc = Locale('gv-GB');
      expect(loc, isNotNull);
      expect(loc.getRegionAlpha3(), equals('GBR'));
    });

    test('LocaleGetRegionAlpha3NoRegion', () {
      final loc = Locale('en');
      expect(loc, isNotNull);
      expect(loc.getRegionAlpha3(), isNull);
    });

    test('LocaleGetLanguageSpecSimple', () {
      final loc = Locale('en');
      expect(loc, isNotNull);
      expect(loc.getLangSpec(), equals('en'));
    });

    test('LocaleGetLanguageSpecLeaveOutRegionAndVariant', () {
      final loc = Locale('en-US-MILITARY');
      expect(loc, isNotNull);
      expect(loc.getLangSpec(), equals('en'));
    });

    test('LocaleGetLanguageSpecIncludeScript', () {
      final loc = Locale('zh-Hans');
      expect(loc, isNotNull);
      expect(loc.getLangSpec(), equals('zh-Hans'));
    });

    test('LocaleGetLanguageSpecIncludeScriptButNotOthers', () {
      final loc = Locale('zh-Hans-CN-GOVT');
      expect(loc, isNotNull);
      expect(loc.getLangSpec(), equals('zh-Hans'));
    });

    test('LocaleGetLanguageSpecLanguageAndScriptMissing', () {
      final loc = Locale('CN');
      expect(loc, isNotNull);
      expect(loc.getLangSpec(), equals(''));
    });

    test('LocaleGetLanguageSpecNoScriptWithoutLanguage', () {
      final loc = Locale('Hans-CN');
      expect(loc, isNotNull);
      expect(loc.getLangSpec(), equals(''));
    });

    test('LocaleConstructorCalledWithNonStrings', () {
      expect(Locale(4).getSpec(), equals(''));
      expect(Locale(true).getSpec(), equals(''));
      expect(Locale(<String, String>{}).getSpec(), equals(''));
      expect(Locale(<String, dynamic>{}).getSpec(), equals(''));
    });

    test('LocaleIsValidLocaleTrueFull', () {
      final loc = Locale('zh-Hans-CN');
      expect(loc, isNotNull);
      expect(loc.isValid(), isTrue);
    });

    test('LocaleIsValidLocaleTrueLang', () {
      final loc = Locale('de');
      expect(loc, isNotNull);
      expect(loc.isValid(), isTrue);
    });

    test('LocaleIsValidLocaleTrueScript', () {
      final loc = Locale('Latn');
      expect(loc, isNotNull);
      expect(loc.isValid(), isTrue);
    });

    test('LocaleIsValidLocaleTrueRegion', () {
      final loc = Locale('BE');
      expect(loc, isNotNull);
      expect(loc.isValid(), isTrue);
    });

    test('LocaleIsValidLocaleFalseScript', () {
      final loc = Locale('zh-Hank-CN');
      expect(loc, isNotNull);
      expect(loc.isValid(), isFalse);
    });

    test('LocaleIsValidLocaleFalseLanguage', () {
      final loc = Locale('zz-Hans-CN');
      expect(loc, isNotNull);
      expect(loc.isValid(), isFalse);
    });

    test('LocaleIsValidLocaleFalseRegion', () {
      final loc = Locale('zh-Hans-CQ');
      expect(loc, isNotNull);
      expect(loc.isValid(), isFalse);
    });

    test('LocaleIsValidLocaleTrueWithVariant', () {
      final loc = Locale('zh-Hans-CN-SHANGHAI');
      expect(loc, isNotNull);
      expect(loc.isValid(), isTrue);
    });

    test('LocaleIsValidLocaleFalseEmpty', () {
      final loc = Locale(' ');
      expect(loc, isNotNull);
      expect(loc.isValid(), isFalse);
    });

    test('LocaleIsValidLocaleTrueParts', () {
      final loc = Locale('zh', 'CN', 'Hans');
      expect(loc, isNotNull);
      expect(loc.isValid(), isTrue);
    });

    test('LocaleParsePrivateUseSubtag', () {
      final loc = Locale('en-x-pseudo');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), isNull);
      expect(loc.getScript(), isNull);
      expect(loc.getVariant(), equals('x-pseudo'));
    });

    test('LocaleParsePrivateUseSubtagLonger', () {
      final loc = Locale('en-x-sort-phonebook');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), isNull);
      expect(loc.getScript(), isNull);
      expect(loc.getVariant(), equals('x-sort-phonebook'));
    });

    test('LocaleParseUnicodeExtensionSubtag', () {
      final loc = Locale('de-DE-u-co-phonebk');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('de'));
      expect(loc.getRegion(), equals('DE'));
      expect(loc.getScript(), isNull);
      expect(loc.getVariant(), equals('u-co-phonebk'));
    });

    test('LocaleParseUnicodeExtensionSubtagWithScript', () {
      final loc = Locale('zh-Hans-CN-u-nu-hanidec');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('zh'));
      expect(loc.getScript(), equals('Hans'));
      expect(loc.getRegion(), equals('CN'));
      expect(loc.getVariant(), equals('u-nu-hanidec'));
    });

    test('LocaleParseTransformedExtensionSubtag', () {
      final loc = Locale('en-t-ja');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('en'));
      expect(loc.getRegion(), isNull);
      expect(loc.getScript(), isNull);
      expect(loc.getVariant(), equals('t-ja'));
    });

    test('LocaleParseMultipleVariants', () {
      final loc = Locale('sl-IT-nedis-rozaj');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('sl'));
      expect(loc.getRegion(), equals('IT'));
      expect(loc.getScript(), isNull);
      expect(loc.getVariant(), equals('nedis-rozaj'));
    });

    test('LocaleParseVariantWithExtension', () {
      final loc = Locale('ca-ES-valencia-u-co-trad');
      expect(loc, isNotNull);
      expect(loc.getLanguage(), equals('ca'));
      expect(loc.getRegion(), equals('ES'));
      expect(loc.getScript(), isNull);
      expect(loc.getVariant(), equals('valencia-u-co-trad'));
    });
  });
}
