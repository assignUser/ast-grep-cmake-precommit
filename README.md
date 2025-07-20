# CMake Integration for ast-grep

This project adds CMake support to [ast-grep](https://ast-grep.github.io/), letting you craft custom linting rules for your CMake projects.

## Features

- **Custom CMake Language Support**: Uses the well maintained [tree-sitter-cmake](https://github.com/uyha/tree-sitter-cmake) parser to allow ast-grep to understand CMake syntax
- **Flexible Rule System**: Bring your own rules - define linting rules using ast-grep's powerful pattern matching
- **Pre-commit Hook**: The hook uses `language: node`, providing maximum portability between OSes
- **Example Rules**: Includes reference rules demonstrating common CMake linting patterns

## Using as a Pre-commit Hook

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
   When used through pre-commit ast-grep seems to leave behind ANSI Color codes on the command line. The only current fix seems to be to use `--color never` to suppress color completely.

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

> [!IMPORTANT]  
> The `--` separator at the end of the args-list is required. It marks the boundary between hook-specific arguments and ast-grep arguments, ensuring proper argument parsing. Always include `--` after your last directory argument, before any ast-grep arguments or as the last element, if you don't pass any direct arguments.

### Local Development of the hook

For local development of the hook use `pre-commit try-repo path/to/repo cmake-lint` to confirm that the hook works as expected.
You will need to add your args to `.pre-commit-hooks.yaml`, as `try-repo` does not support custom arguments.


## Writing Your Own Rules

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

### File Support

The linter recognizes these file patterns:
- `*.cmake`
- `**/CMakeLists.txt`

`*.cmake.in` is not supported as it's not valid CMake that ast-grep can parse.

### Testing Your Rules

You can test your rules using ast-grep's test functionality:

1. Create test files in a `rules-test/` directory alongside your rules
2. Run `ast-grep test` to validate your rules against test cases

See the [ast-grep test documentation](https://ast-grep.github.io/guide/test-rule.html) for details.
