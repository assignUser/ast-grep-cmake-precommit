# CMake Linter

This repository provides AST-based linting for CMake files using [ast-grep](https://ast-grep.github.io/).

## Features

- **Custom CMake Language Support**: Uses tree-sitter-cmake parser to enable ast-grep to understand CMake syntax
- **Pattern-based Rules**: Define linting rules using ast-grep's powerful pattern matching
- **Pre-commit Hook Integration**: Can be used as a pre-commit hook in your CMake projects
- **CI Integration**: Automatically builds the CMake parser and runs linting

## Setup

### Local Development

For local development and testing:

1. Install dependencies:
   ```bash
   pipx install ast-grep-cli
   npm install -g tree-sitter-cli
   ```

2. Build the CMake parser:
   ```bash
   tree-sitter build tree-sitter-cmake/
   ```

3. Test the setup:
   ```bash
   ast-grep scan
   ```

### Using as a Pre-commit Hook

To use cmake-linter in your project as a pre-commit hook:

1. Add to your `.pre-commit-config.yaml`:
   ```yaml
   repos:
     - repo: https://github.com/assignUser/cmake-linter
       rev: <ref>  # don't use 'main' as it won't be updated
       hooks:
         - id: cmake-lint
   ```

2. Install the hook:
   ```bash
   pre-commit install
   ```

3. Run manually (optional):
   ```bash
   pre-commit run cmake-lint --all-files
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
2. Build the CMake parser: `tree-sitter build tree-sitter-cmake/`
3. Run `pre-commit install && pre-commit run --all-files` before committing
4. Test rules with `ast-grep test`
