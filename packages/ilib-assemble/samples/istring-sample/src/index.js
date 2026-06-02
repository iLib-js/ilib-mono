#!/usr/bin/env node
/**
 * Sample application using ilib-istring
 *
 * This sample demonstrates how ilib-assemble scans source code
 * for ilib imports and assembles the locale data.
 */

import IString from 'ilib-istring';

// Create some internationalized strings
const greeting = new IString("Hello, {name}!");
console.log(greeting.format({ name: "World" }));

