# CMake Integration for ast-grep

This repository provides CMake language support for [ast-grep](https://ast-grep.github.io/), enabling you to write custom linting rules for your CMake projects.

## Features

- **Custom CMake Language Support**: Uses tree-sitter-cmake parser to enable ast-grep to understand CMake syntax
- **Flexible Rule System**: Bring your own rules - define linting rules using ast-grep's powerful pattern matching
- **Pre-commit Hook Integration**: Can be used as a pre-commit hook in your CMake projects with your custom rules
- **Example Rules**: Includes reference rules demonstrating common CMake linting patterns

## Setup

### Local Development and Testing

For local development and testing:

1. Install dependencies:
   ```bash
   npm install -g @ast-grep/cli tree-sitter-cli
   ```

2. Build the CMake parser:
   ```bash
   tree-sitter build tree-sitter-cmake/
   ```

3. Test with your own rules:
   ```bash
   # Test your rules directory
   node scripts/cmake-scan.js --rule-dirs ./your-rules-dir -- your-cmake-files.txt
   ```

### Using as a Pre-commit Hook

To use this CMake integration in your project as a pre-commit hook, you need to provide your own rules:

1. Create a directory for your CMake rules in your project (e.g., `cmake-rules/`):
   ```yaml
   # Example rule: cmake-rules/my-cmake-rule.yml
   id: my-cmake-rule
   message: Custom CMake rule message
   severity: warning
   language: cmake
   rule:
     pattern: some_cmake_command($$$)
   ```

2. Add to your `.pre-commit-config.yaml`:
   ```yaml
   repos:
     - repo: https://github.com/assignUser/cmake-linter
       rev: <ref>  # Use a specific tag/commit, not 'main'
       hooks:
         - id: cmake-lint
           args: [--rule-dirs, ./cmake-rules, --]
   ```

3. Install the hook:
   ```bash
   pre-commit install
   ```

4. Run manually (optional):
   ```bash
   pre-commit run cmake-lint --all-files
   ```

### Advanced Usage

You can specify multiple rule directories and utility directories:

```yaml
repos:
  - repo: https://github.com/assignUser/cmake-linter
    rev: <ref>
    hooks:
      - id: cmake-lint
        args: [--rule-dirs, ./cmake-rules, ./shared-rules, --util-dirs, ./cmake-utils, --]
```

## Usage

### Writing Your Own Rules

Create rules in your project's rule directory. Example rule:

```yaml
id: cmake-minimum-version
message: CMake minimum version should be specified
severity: warning
language: cmake
rule:
  pattern: cmake_minimum_required($$$)
```

For rule writing guidance, see the [ast-grep rule documentation](https://ast-grep.github.io/reference/yaml.html).

### Example Rules

This repository includes example rules in the `rules/` directory that demonstrate common CMake linting patterns:

- `cmake-minimum-version-*.yml` - Check CMake minimum version requirements
- `deprecated-commands.yml` - Detect usage of deprecated CMake commands
- `avoid-directory-wide-functions.yml` - Prefer target-specific functions
- `no-hardcoded-absolute-paths.yml` - Avoid hard-coded absolute paths
- `prefer-find-package.yml` - Prefer find_package over manual library finding

These can serve as a starting point for your own rules.

### Direct Usage with ast-grep

Once you have the CMake parser built, you can also use ast-grep directly:

```bash
# Scan with your rule directory
ast-grep scan -c sgconfig.yml --rule-dirs ./your-rules-dir

# Use inline patterns for quick testing  
ast-grep run -p 'cmake_minimum_required($$$)' -l cmake CMakeLists.txt
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

### Testing Your Rules

You can test your rules using ast-grep's test functionality:

1. Create test files in a `rules-test/` directory alongside your rules
2. Run `ast-grep test` to validate your rules against test cases

See the [ast-grep test documentation](https://ast-grep.github.io/guide/test-rule.html) for details.
