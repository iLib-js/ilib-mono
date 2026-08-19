# Loctool Documentation

Guides for using and extending [loctool](../README.md). Many sections
are still to be written; links below go to finished pages where they
exist.

## Getting started

- [ ] Installing loctool
- [ ] Setting up a project for localization
- [ ] The basic localize workflow (extract → translate → generate)
- [ ] Running loctool from npm scripts and CI

## Configuration

- [ ] Project config files (`loctool-config.json` / `project.json`)
- [ ] Locales, pseudo-locales, and locale mapping
- [ ] Resource file locations and naming
- [ ] Intermediate formats (XLIFF, PO)
- [ ] XLIFF versions and styles
- [ ] Common configuration examples

## Commands

Each loctool command has (or will have) its own guide. Use
`loctool <command> --help` for the option list shipped with your
install.

- [ ] `init` — create a new project config file
- [ ] `localize` — extract strings and generate localized resources
  (default command)
- [ ] `merge` — merge multiple XLIFF files into one
- [ ] `split` — split XLIFF files by language or project
- [ ] `generate` — generate localized files without re-extracting
- [ ] `convert` — convert between resource file formats (and to TMX)
- [x] [`select`](SelectCommand.md) — select translation units from
  XLIFF files by criteria
- [ ] `compare` — compare two XLIFF files by translation unit

## Plugins

- [x] [Writing a loctool plugin](Plugins.md) — SPI, file / file-type
  classes, and how plugins plug into localize
- [ ] Using existing plugins in a project
- [ ] Configuring plugins (file types, paths, options)
- [ ] Listing and choosing plugins for common project types

## Resources and translation memory

- [ ] XLIFF as the translation interchange format
- [ ] Working with translation directories
- [ ] Do-not-translate (DNT) strings
- [ ] Plurals, arrays, and ICU-style strings
- [ ] Pseudo-localization

## Troubleshooting and reference

- [ ] Common errors and how to fix them
- [ ] Logging and quiet / silent modes
- [ ] Command cheat sheet
- [ ] Glossary of loctool terms
