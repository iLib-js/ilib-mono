# ilib_locale (Dart)

Dart port of [ilib-locale](https://github.com/ilib-js/ilib-locale): BCP-47 locale specifier (language, region, script, variant).

## Usage

```dart
import 'package:ilib_locale/ilib_locale.dart';

void main() {
  // From spec string
  var loc = Locale('en-US');
  print(loc.getLanguage());   // en
  print(loc.getRegion());    // US
  print(loc.getSpec());      // en-US

  // From components
  var loc2 = Locale('zh', 'CN', null, 'Hans');
  print(loc2.getSpec());     // zh-Hans-CN

  // Default (host locale; on VM uses Platform.localeName)
  var defaultLoc = Locale();
  print(defaultLoc.getSpec());

  // Alpha-3 codes
  print(loc.getLanguageAlpha3());  // eng
  print(loc.getRegionAlpha3());    // USA

  // Validity
  print(loc.isValid());  // true
}
```

## API

- **Locale([languageOrSpec, region?, variant?, script?])** – Build from BCP-47 string, another Locale, or (language, region, variant, script).
- **getLanguage()** / **getRegion()** / **getScript()** / **getVariant()** – Components.
- **getLanguageAlpha3()** / **getRegionAlpha3()** – ISO 639-1/3166-1 alpha-3 codes.
- **getSpec()** – Full BCP-47 string.
- **getLangSpec()** – Language + script (e.g. `en-Latn`).
- **equals(Locale other)** – Value equality.
- **isValid()** – True if all present components are valid ISO codes.

**getLocale()** – Returns the host locale (VM: `Platform.localeName`; web: `"en-US"`).

## Source layout

Converted from the JavaScript sources under `../src/`:

| JS                    | Dart                         |
|-----------------------|-----------------------------|
| `Locale.js`           | `lib/src/locale.dart`       |
| `a1toa3langmap.js`    | `lib/src/a1toa3langmap.dart`|
| `a2toa3regmap.js`     | `lib/src/a2toa3regmap.dart` |
| `scripts.js`          | `lib/src/scripts.dart`      |
| `ilib-env` getLocale  | `package:ilib_env` (re-exported from barrel) |

## Tests

From the `dart` directory:

```bash
dart pub get
dart test
```

Tests are in `test/locale_test.dart` and mirror the Jest tests in `../test/locale.test.js`. Platform-specific cases (browser/navigator, node/LANG) are skipped with a reason; the default-constructor and all spec/component tests run.

## License

Apache-2.0 (see parent directory).
