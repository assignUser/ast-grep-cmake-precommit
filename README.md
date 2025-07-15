# CMake Linter

This repository provides AST-based linting for CMake files using [ast-grep](https://ast-grep.github.io/).

## Features

- **Custom CMake Language Support**: Uses tree-sitter-cmake parser to enable ast-grep to understand CMake syntax
- **Pattern-based Rules**: Define linting rules using ast-grep's powerful pattern matching
- **CI Integration**: Automatically builds the CMake parser and runs linting

## Setup

The repository automatically sets up the CMake parser during CI. For local development:

1. Install dependencies:
   ```bash
   pipx install ast-grep-cli
   npm install -g tree-sitter-cli
   ```

2. Build the CMake parser:
   ```bash
   mkdir -p parsers
   cd parsers
   git clone https://github.com/uyha/tree-sitter-cmake.git
   cd tree-sitter-cmake
   tree-sitter generate
   tree-sitter build
   ```

3. Test the setup:
   ```bash
   ast-grep scan
   ```

## Usage

### Scanning CMake Files

```bash
# Scan all CMake files in the current directory
ast-grep scan

# Scan specific files
ast-grep scan CMakeLists.txt

# Use inline rules for quick testing
ast-grep run -p 'cmake_minimum_required($$$)' -l cmake CMakeLists.txt
```

### Writing Rules

Create rules in the `rules/` directory. Example rule:

```yaml
id: cmake-minimum-version
message: CMake minimum version should be specified
severity: warning
language: cmake
rule:
  pattern: cmake_minimum_required($$$)
```

## File Support

The linter recognizes these file patterns:
- `*.cmake`
- `**/CMakeLists.txt`

## Contributing

1. Follow conventional commits format
2. Run `pre-commit install && pre-commit run --all-files` before committing
3. Test rules with `ast-grep test`