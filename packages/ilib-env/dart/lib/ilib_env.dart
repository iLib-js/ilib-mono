// Copyright © 2025-2026 JEDLSoft
//
// Dart port of ilib-env - environment detection for ilib.

library ilib_env;

export 'src/ilib_env.dart' show
  top,
  getPlatform,
  setPlatform,
  getBrowser,
  globalVar,
  isGlobal,
  getLocale,
  setLocale,
  getTimeZone,
  setTimeZone,
  clearCache;
