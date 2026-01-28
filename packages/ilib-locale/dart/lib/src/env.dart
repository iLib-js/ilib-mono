// Copyright © 2025-2026 JEDLSoft
//
// Minimal replacement for ilib-env getLocale: returns the host locale.
// Uses dart:io on VM, defaults to "en-US" on web.

import 'env_stub.dart' if (dart.library.io) 'env_io.dart' as _env;

/// Returns the current locale in BCP-47 form (e.g. "en-US").
/// On VM uses [Platform.localeName]; on web returns "en-US" unless overridden.
String getLocale() => _env.getLocale();
