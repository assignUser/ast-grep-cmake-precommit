# CMake Language Test

This directory contains test files to verify that the CMake custom language configuration works correctly.

## Test Files

### deprecated-link-directories.cmake
A test file that demonstrates the `deprecated-link-directories` rule which detects usage of the deprecated `link_directories()` command.

#### Expected Results
When running `ast-grep scan rules-test/deprecated-link-directories.cmake`, you should see:
- 3 warnings for `link_directories()` usage on lines 7, 8, and 16-19

#### Manual Test
```bash
ast-grep scan rules-test/deprecated-link-directories.cmake
```

This should output warnings for the deprecated `link_directories()` calls while ignoring the proper `target_link_libraries()` usage.

## Setup Requirements

Before testing, ensure the CMake parser is built:
```bash
mkdir -p parsers
cd parsers
git clone https://github.com/uyha/tree-sitter-cmake.git
cd tree-sitter-cmake
tree-sitter generate
tree-sitter build
```

The parser library `cmake.so` should be created in `parsers/tree-sitter-cmake/cmake.so`.
