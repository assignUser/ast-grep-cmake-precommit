This repository provides CMake language support for ast-grep, enabling users to write custom linting rules for CMake projects. See https://ast-grep.github.io/guide/scan-project.html for documentation of how `ast-grep scan` works. Please follow these guidelines when contributing:

## Code Standards

### Required Before Each Commit
- Run `pre-commit install; pre-commit run --all-files` before committing any changes to ensure proper code formatting
- This will run various hooks on all files to maintain consistent style
- Follow conventional commits format for commit messages: `type: description` or `type(scope): description` (where `scope` is optional)
  - Common types: feat, fix, docs, style, refactor, test, chore
  - Example: `docs: update README with installation instructions`

### Development Flow
- You have access to the Github MCP server with credentials to read from public repos and to comment and create issues in this repo
- ast-grep documentation can be found in this repo: https://github.com/ast-grep/ast-grep.github.io/
- CMake documentation can be found in this repo: https://github.com/Kitware/CMake
- Build the CMake parser: `tree-sitter build tree-sitter-cmake/`
- Test: `ast-grep test`

## Repository Structure

This repository provides CMake language integration for ast-grep, allowing users to write custom linting rules for CMake code:

- `rules/` - Contains example ast-grep rule definitions in YAML format that demonstrate common CMake linting patterns (users provide their own rules when using the hook)
- `rules-test/` - Contains test files and snapshots that validate the behavior of the example rules
- `utils/` - Contains utility functions and helper patterns that can be reused across multiple rules
- `sgconfig.yml` - Main ast-grep configuration file that specifies the CMake language integration
- `.github/` - GitHub-specific configuration including workflows and this instructions file
- `.pre-commit-config.yaml` - Pre-commit hooks configuration for code quality enforcement
- `.pre-commit-hooks.yaml` - Pre-commit hook definition for using this repository as a CMake integration hook in other projects
- `package.json` - Node.js package configuration for pre-commit hook installation
- `scripts/` - Contains the cmake-scan.js script that enables users to provide their own rule directories
- `tree-sitter-cmake/` - Vendored tree-sitter CMake grammar

The project provides CMake language integration for ast-grep where:
- Example rules are provided in the `rules/` directory for reference
- Users provide their own rule directories when using the pre-commit hook via `--rule-dirs` argument
- Tests are run against files in the `rules-test/` directory
- Utilities in `utils/` can be imported and used within rule definitions

## Reference material for ast-grep
- How to write tests for rules: https://ast-grep.github.io/guide/test-rule.html
- Rule reference: https://ast-grep.github.io/reference/yaml.html
- Rule objects for composite rules: https://ast-grep.github.io/reference/rule.html
- Collection of ast-grep examples: https://ast-grep.github.io/catalog

## Key Guidelines
CRITICAL: NEVER USE --no-verify WHEN COMMITTING CODE

 - Follow best practices and idiomatic patterns
 - Maintain existing code structure and organization
 - Write unit tests for new functionality.
 - We prefer simple, clean, maintainable solutions over clever or complex ones, even if the latter are more concise or performant. Readability and maintainability are primary concerns.
 - Make the smallest reasonable changes to get to the desired outcome. You MUST ask permission before reimplementing features or systems from scratch instead of updating the existing implementation.
 - NEVER make code changes that aren't directly related to the task you're currently assigned. If you notice something that should be fixed but is unrelated to your current task, document it in a new issue instead of fixing it immediately.
 - When writing comments, avoid referring to temporal context about refactors or recent changes. Comments should be evergreen and describe the code as it is, not how it evolved or was recently changed.
 - NEVER implement a mock mode for testing or for any purpose. We always use real data and real APIs, never mock implementations.
 - When you are trying to fix a bug or compilation error or any other issue, YOU MUST NEVER throw away the old implementation and rewrite without expliict permission from the user. If you are going to do this, YOU MUST STOP and get explicit permission from the user.
 - NEVER name things as 'improved' or 'new' or 'enhanced', etc. Code naming should be evergreen. What is new today will be "old" someday.
