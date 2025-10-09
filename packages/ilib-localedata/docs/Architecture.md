# ilib-localedata Architecture

## Glossary

Before diving into the architecture, here are the key terms used throughout this document:

- **Basename**: A category or type of locale data (e.g., "info", "numbers", "dates", "currencies"). Each basename represents a different aspect of locale information that can be loaded and cached independently. Typically, each independent ilib package will have its own basename. For example, the package ilib-name which parses and formats person names, uses the basename "name" for its data.

- **Raw Data**: The unprocessed content loaded directly from files. This could be JSON strings, JavaScript code, or any other file format. Raw data has not been parsed or interpreted yet.

- **Parsed Data**: Data that has been loaded from files and converted into JavaScript objects. For JS files, this means executing the file content; for JSON files, this means parsing the JSON string. Parsed data is organized by locale and basename.

- **Merged Data**: The final result after combining parsed data from multiple locales using CSS-like cascading rules. For example, merging "root" (base) data with "en" (language) data and "en-US" (specific locale) data to create the complete locale information.

- **Locale**: A language, script, and region identifier (e.g., "en-US", "fr-CA", "zh-Hans-CN"). Locales can have parent-child relationships (e.g., "en-US" inherits from "en", which inherits from "root").

- **Root**: A directory path containing locale data files. Multiple roots can be specified to allow overriding default data that comes with ilib packages (which is typically drawn from the Unicode CLDR data) with custom data that your company would like to see.

- **Sublocale**: A component of a locale identifier. For "en-US", the sublocales would be ["root", "en", "und-US", "en-US"] in order of specificity. Locale data for each sublocale can exist independently and is merged together to form the "merged" data for a locale. The reason for this is that data for sublocales can be shared. For example, the data for the "root" and "en" sublocales are both shared by the locales "en-US" and "en-GB". In this way, you can form thousands of different locales, such as "en-KR" (English for South Korea) which will merge together English data and Korean regional settings to get something reasonable, even though that is not a commonly used locale.

## Overview

The `ilib-localedata` package implements a sophisticated, layered caching system for locale data that prevents race conditions, optimizes performance, and maintains clean separation of concerns. This document outlines the architecture, design philosophies, and implementation details.

## Data Structure in Files

The locale data system supports two different file organization strategies, each with their own advantages:

### Hierarchical Directory Structure (Recommended for Independent ilib Packages)

Many independent ilib packages structure their data using a hierarchical directory approach where:
- **Directories are named after locale parts** (e.g., `zh/Hans/CN/`)
- **Files are named after their basename** (e.g., `name.json`, `info.json`)
- **Locale is derived from the directory path**: `zh/Hans/CN/name.json` → locale `"zh-Hans-CN"`, basename `"name"`

**Example Structure**:
```
locale/
├── en/
│   ├── US/
│   │   ├── name.json
│   │   └── info.json
│   └── GB/
│       ├── name.json
│       └── info.json
├── zh/
│   ├── Hans/
│   │   └── CN/
│   │       ├── name.json
│   │       └── info.json
│   └── Hant/
│       └── TW/
│           ├── name.json
│           └── info.json
├── name.json
└── info.json
```

**Advantages**:
- **Intuitive organization**: Locale hierarchy is visually clear
- **Easy maintenance**: Adding new locales requires only new directories
- **Scalable**: Supports thousands of locales without file naming conflicts
- **Package independence**: Each ilib package can have its own basename files

### Flat File Structure (Currently Supported)

JS files in the locale data system can contain data in three different formats, all of which are equivalent in terms of functionality:

### 1. Function Format

JS files can export a function that returns locale data. This format allows for dynamic data generation if needed and provides the same data structure as other formats.

### 2. Object Format

JS files can export an object directly containing locale data. This is the most readable and commonly used format, providing the same data structure as function and string formats.

### 3. String Format

JS files can export a JSON string containing locale data. This format is useful for data that was originally JSON and provides the same data structure as function and object formats.

**Important Notes:**
- All three formats produce identical results when processed
- The function format allows for dynamic data generation if needed
- The object format is most readable and commonly used
- The string format is useful for data that was originally JSON
- Javascript files may be written as commonjs modules or as ESM. Typescript modules are not supported yet, but you can easily transpile them to js modules and load them that way.
- **In-memory data storage** uses the same structure when calling `LocaleData.cacheData()`

The system automatically detects and handles all three formats during parsing, ensuring consistent behavior regardless of the input format.

## Core Design Philosophies

### 1. Promise Caching to Prevent Race Conditions
The most critical design principle is **caching promises rather than data** at the file loading layer. This prevents race conditions where multiple concurrent requests for the same data could result in:
- Duplicate file loading operations
- Inconsistent data states
- Wasted resources

By caching the promise to load data, subsequent requests wait on the same promise, ensuring data consistency and preventing redundant operations.

### 2. Layered Architecture with Clear Responsibilities
Each layer has a single, well-defined responsibility and only interacts with the layer directly below it. This creates a clean separation of concerns and makes the system easier to understand, test, and maintain.

### 3. Cache-First Approach
All layers implement a cache-first strategy where cached data is returned immediately if available. This minimizes file I/O operations and improves performance for frequently accessed locale data.

### 4. Fallback Mechanisms
The system implements intelligent fallback strategies:
- Try `.js` files first (pre-assembled data)
- Fall back to individual `.json` files if needed (flat structure only)
- Use root locale data as a final fallback

**Note**: Currently only flat file structures are supported (e.g., `en-US.json`). Hierarchical directory structures (e.g., `en/US/info.json`) used by many independent ilib packages are not yet supported but are planned for future versions.

## Architecture Layers

### Layer 1: Loader
**File**: `ilib-loader` package  
**Responsibility**: Platform-specific file loading operations

The Loader is the lowest level abstraction that handles the actual file system operations. Different platforms (Node.js, browser, etc.) implement different loaders, but all must support:
- Asynchronous file loading (`loadFile()`)
- Optional synchronous file loading (`loadFileSync()`)
- Error handling for missing files

**Key Methods**:
- `loadFile(path, options)` - Async file loading
- `loadFileSync(path, options)` - Sync file loading
- `supportsSync()` - Check if sync operations are supported

### Layer 2: FileCache
**File**: `src/FileCache.js`  
**Responsibility**: Promise caching and raw file data storage

FileCache sits above the Loader and implements the critical promise caching mechanism. It ensures that:
- Multiple requests for the same file wait on the same promise
- Raw file data is cached after the promise resolves
- Failed file loads are cached as `null` to prevent retry loops

**Key Methods**:
- `loadFile(path)` - Returns cached promise or creates new one
- `loadFileSync(path)` - Returns cached data or loads synchronously
- `clearCache()` - Clears all cached promises and data

**Cache Strategy**:
The FileCache implements a sophisticated promise caching mechanism that prevents race conditions by ensuring multiple requests for the same file wait on the same promise. When a file is requested, the cache first checks if a promise for that file already exists. If found, it returns the existing promise, allowing multiple callers to wait on the same file load operation. If no promise exists, it creates a new one, caches it, and returns it to the caller.

### Layer 3: ParsedDataCache
**File**: `src/ParsedDataCache.js`  
**Responsibility**: Data parsing, caching, and file discovery

ParsedDataCache handles all file-related operations and implements intelligent caching. It:
- Checks its cache before loading files
- Handles both `.js` and `.json` file formats
- Parses raw file data into structured locale data
- Caches parsed data by locale and basename
- Implements file discovery logic (no hard-coded basename lists)

**Key Methods**:
- `getParsedData(locale, roots, basename)` - Main async interface
- `getParsedDataSync(locale, roots, basename)` - Main sync interface
- `storeData(unparsedData, root)` - Store pre-parsed data
- `hasParsedData(root, basename, locale)` - Check cache status

**File Discovery Strategy**:

The system follows a hierarchical approach to locate locale data files:

1. **Primary Search**: First attempts to load pre-assembled data from `.js` files named after the full locale specifier
2. **Fallback Search**: If no `.js` file is found, falls back to searching hierarchical `.json` files
3. **Hierarchical Traversal**: For each fallback locale in the hierarchy, constructs directory paths by converting locale components to directory names
4. **Basename Resolution**: Locates files with the requested basename within the appropriate locale directory structure
5. **Data Extraction**: Loads and parses the found file, extracting the relevant locale data

### Layer 4: MergedDataCache
**File**: `src/MergedDataCache.js`  
**Responsibility**: Data merging and final result caching

MergedDataCache operates purely on already-parsed data from ParsedDataCache. It:
- Combines data from multiple locales using CSS-like cascading
- Implements configurable merge strategies
- Caches final merged results
- Never touches files directly

**Key Methods**:
- `loadMergedData(locale, roots, basename)` - Load and merge data
- `loadMergedDataSync(locale, roots, basename)` - Sync version
- `storeData(data, root)` - Store pre-populated data
- `hasMergedData(locale, roots, basename)` - Check cache status

**Merge Strategy**:

The MergedDataCache implements CSS-like cascading where more specific locale data overrides less specific data. The system follows a predefined order: root locale data serves as the base, followed by language-specific data, then region-specific data, and finally the most specific locale combination. The cache supports configurable merge strategies, allowing users to choose between returning only the most specific data available or merging all data in the fallback chain order.

### Layer 5: LocaleData
**File**: `src/LocaleData.js`  
**Responsibility**: External API and user interface

LocaleData provides the public API for the package. It:
- Manages global root directories
- Handles user preferences and options
- Coordinates between different cache layers
- Provides backward compatibility

**Key Methods**:
- `loadData(params)` - Main data loading interface. May be either synchronous or asynchronous.
- `ensureLocale(locale, otherRoots)` - Pre-load locale data asynchronously
- `checkCache(locale, basename)` - Check if data is cached
- `cacheData(data, root)` - Store pre-populated data

## Data Flow Examples

### Example 1: First-time data loading
```
User calls LocaleData.loadData("en-US", "info")
    ↓
LocaleData creates MergedDataCache instance
    ↓
MergedDataCache calls ParsedDataCache.getParsedData("en-US", roots, "info")
    ↓
ParsedDataCache checks cache → Not found
    ↓
ParsedDataCache calls FileCache.loadFile("./locale/en-US.js")
    ↓
FileCache checks promise cache → Not found
    ↓
FileCache creates new promise and caches it
    ↓
Loader loads the file
    ↓
FileCache caches the raw data
    ↓
ParsedDataCache parses the data and caches it by locale/basename
    ↓
MergedDataCache receives parsed data and merges it
    ↓
MergedDataCache caches the merged result
    ↓
User receives the final merged data
```

### Example 2: Subsequent data loading (cache hit)
```
User calls LocaleData.loadData("en-US", "info") again
    ↓
LocaleData creates MergedDataCache instance
    ↓
MergedDataCache checks its own cache first → Found! Returns immediately
    ↓
User receives the cached merged data quickly without loading any new files, parsing the data, or merging it
```

### Example 3: Concurrent requests (race condition prevention)
```
Request A calls LocaleData.loadData("en-US", "info")
Request B calls LocaleData.loadData("en-US", "info") (concurrent)
    ↓
Both requests reach FileCache.loadFile("./locale/en-US.js")
    ↓
Request A creates promise, caches it, and waits on it
Request B finds cached promise and waits on it as well
    ↓
File loads once, both requests receive the same data
    ↓
No race condition, no duplicate file loading
```

## Caching Strategies

### FileCache (Promise Caching)
- **Purpose**: Prevent race conditions because multiple callers can wait on the same promise to load files
- **Storage**: `Map<filePath, Promise>`
- **Lifecycle**: Promises are cached permanently. If a promise is already resolved and another request comes in for the same file at some later
point in time, it can await the already resolved promise again, which will then resolve immediately and return the raw file data again.
- **Clear**: Only cleared explicitly via `clearCache()`

### ParsedDataCache (Parsed Data Caching)
- **Purpose**: Avoid re-parsing the same file data
- **Storage**: `DataCache` with keys `(root, basename, locale)`
- **Lifecycle**: Cached until explicitly cleared
- **Clear**: Cleared via `clearAllParsedData()`

### MergedDataCache (Merged Result Caching)
- **Purpose**: Avoid re-merging the same locale data
- **Storage**: `DataCache` with keys `merged:locale:basename:rootsHash`
- **Lifecycle**: Cached until explicitly cleared
- **Clear**: Cleared via `clearMergedData()`

## Configuration and Options

### Merge Options
- **`mostSpecific`**: Return only the most specific locale data (no merging)
- **`returnOne`**: Return the first file found (no merging)
- **`crossRoots`**: Merge data across all roots (default: false)

### Cache Options
- **`sync`**: Whether to prefer synchronous operations

## Error Handling

### File Loading Errors
- Missing files are handled gracefully (return `undefined`)
- File loading errors are caught and logged
- Failed loads are cached as `null` to prevent retry loops

### Parsing Errors
- Invalid JSON/JS content returns `undefined`
- Parsing errors are caught and logged
- Failed parsing doesn't affect the cache

### Merge Errors
- Invalid merge operations return empty objects `{}`
- Merge errors are caught and logged
- Fallback to root data when possible

## Performance Considerations

### Memory Usage
- Raw file data is cached in FileCache
- Parsed data is cached in ParsedDataCache
- Merged results are cached in MergedDataCache
- Total memory usage scales with the number of unique files and locales

### File I/O Optimization
- Files are only loaded once per session
- Parsed data is reused across multiple requests
- Merged results are cached to avoid re-computation

### Cache Invalidation
- Caches are cleared explicitly (usually for testing)
- No automatic expiration or size limits
- Manual cache management for long-running applications

## Testing Strategy

### Unit Testing
- Each layer is tested independently
- Mock implementations for lower layers
- Cache behavior verification
- Error condition testing

### Integration Testing
- End-to-end data flow testing
- Cache layer interaction testing
- Race condition testing
- Performance regression testing

## Future Considerations

### Potential Improvements
- Cache size limits and LRU eviction
- Automatic cache expiration
- Background cache warming
- Metrics and monitoring

### Hierarchical Directory Support

The system now supports both flat file structures and hierarchical directory structures, providing flexibility for different ilib package organizations.

**Implementation Details**:

**ParsedDataCache Enhancements**:
- **File Discovery**: `_loadFromJsonFiles` now traverses hierarchical directories
- **Locale Mapping**: Implements path-to-locale conversion (e.g., `zh/Hans/CN/` → `"zh-Hans-CN"`)
- **Basename Extraction**: Extracts basename from filename and locale from directory path

**File Discovery Strategy**:

The system follows a hierarchical approach to locate locale data files:

1. **Primary Search**: First attempts to load pre-assembled data from `.js` files named after the full locale specifier
2. **Fallback Search**: If no `.js` file is found, falls back to searching hierarchical `.json` files
3. **Hierarchical Traversal**: For each fallback locale in the hierarchy, constructs directory paths by converting locale components to directory names
4. **Basename Resolution**: Locates files with the requested basename within the appropriate locale directory structure
5. **Data Extraction**: Loads and parses the found file, extracting the relevant locale data

**Locale Path Conversion**:

The system converts locale specifiers to directory paths for hierarchical file organization. This conversion handles the complex nature of locale specifiers where components can appear in various orders and combinations:

- **Component Mapping**: Each part of a locale specifier (language, script, region, variant) maps to a directory level
- **Order Flexibility**: Locale components can appear in different orders, requiring intelligent parsing
- **Directory Structure**: Creates nested directories that mirror the locale hierarchy
- **Root Handling**: Special handling for root locale data, which exists at the top level
- **Fallback Support**: Maintains the locale fallback chain through directory traversal

**Data Structure Handling**:
- **Hierarchical files**: Data is structured directly without basename wrapper (e.g., `{"fieldNames": {...}}` in `address.json`)
- **Flat files**: Data is structured as `{"locale": {"basename": {...}}}` for backward compatibility
- **Automatic detection**: System detects file structure and parses accordingly
- **Basename extraction**: The basename is extracted from the filename, not from the data structure

**Benefits**:
- **Backward compatibility**: Existing flat file structures continue to work unchanged
- **Package integration**: Full support for independent ilib packages using hierarchical structures
- **Scalability**: Support for thousands of locales without file naming conflicts
- **Maintainability**: Easier to add new locales and basenames
- **Flexibility**: Packages can choose the structure that best fits their needs

### Extension Points
- Custom merge strategies
- Additional file format support
- Plugin architecture for custom loaders
- Advanced caching policies

## Conclusion

The layered architecture of `ilib-localedata` provides a robust, performant, and maintainable solution for locale data management. The promise caching mechanism prevents race conditions, while the clear separation of concerns makes the system easy to understand and extend.

Key benefits:
- **Race condition prevention** through promise caching
- **Performance optimization** through intelligent caching
- **Maintainability** through clean architecture
- **Flexibility** through configurable merge strategies
- **Reliability** through comprehensive error handling

This architecture serves as a solid foundation for future development and can be extended to support additional use cases while maintaining the core design principles.
