This is a ast-grep based cmake linter repository. See https://ast-grep.github.io/guide/scan-project.html for documentation of how `ast-grep scan` works. Please follow these guidelines when contributing:

## Code Standards

### Required Before Each Commit
- Run `pre-commit install; pre-commit run --all-files` before committing any changes to ensure proper code formatting
- This will run various hooks on all files to maintain consistent style

### Development Flow
- Test: `ast-grep test`

## Repository Structure

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
