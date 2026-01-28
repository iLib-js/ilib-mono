// Copyright © 2025-2026 JEDLSoft
// Stub when dart:io and dart:html are not available.

/// Scope map used as "top" for caching.
final Map<String, dynamic> _scope = <String, dynamic>{};

Map<String, dynamic> top() => _scope;

String getPlatformName() => 'dart';
String? getPlatformBrowser() => null;

String getPlatformLocale() => 'en-US';
String getPlatformTimeZone() => 'local';
