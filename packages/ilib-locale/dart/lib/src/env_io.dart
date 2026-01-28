// Uses dart:io Platform when running on VM.
// Copyright © 2025-2026 JEDLSoft

import 'dart:io' show Platform;

String getLocale() => Platform.localeName.replaceAll('_', '-');
