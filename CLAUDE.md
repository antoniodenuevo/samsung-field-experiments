# CLAUDE.md

This file provides guidance to AI assistants (Claude and others) working with this repository.

## Repository Overview

This is a newly initialized repository. Update this section with a description of the project once development begins.

**Repository:** `antoniodenuevo/f1eld-5am5ung`
**Primary branch:** `main` (or `master`)

---

## Project Structure

_To be filled in as the project grows. Document the top-level directory layout here._

```
/
├── CLAUDE.md        # This file — guidance for AI assistants
└── ...              # Add project structure as it develops
```

---

## Development Workflow

### Branching Strategy

- Feature branches follow the pattern: `<username>/<feature-name>` or `feature/<feature-name>`
- AI-generated branches follow the pattern: `claude/<description>-<session-id>`
- All changes should go through pull requests targeting the main branch
- Never force-push to `main`/`master`

### Commit Conventions

Write clear, imperative commit messages:

```
<type>: <short summary>

[optional body explaining why, not what]
```

Common types: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `ci`

Examples:
- `feat: add user authentication endpoint`
- `fix: resolve null pointer in payment handler`
- `docs: update API usage examples in README`

### Git Operations

```bash
# Create and switch to a feature branch
git checkout -b feature/my-feature

# Stage specific files (avoid git add -A to prevent accidental commits)
git add path/to/file

# Commit with a descriptive message
git commit -m "feat: describe what this commit does"

# Push and set upstream
git push -u origin feature/my-feature
```

---

## Code Conventions

_Update this section with language- and framework-specific conventions once the project stack is chosen._

### General Principles

- Prefer clarity over cleverness
- Keep functions small and focused on a single responsibility
- Avoid premature abstraction — extract helpers only when a pattern repeats 3+ times
- Delete dead code rather than commenting it out
- Validate inputs at system boundaries (user input, external APIs); trust internal code

### Security

- Never commit secrets, credentials, API keys, or `.env` files
- Validate and sanitize all external input
- Use parameterized queries for database access
- Keep dependencies up to date

---

## Testing

_Describe the test framework and how to run tests once they are set up._

```bash
# Example — replace with actual commands for this project
# npm test
# pytest
# cargo test
# go test ./...
```

### Testing Conventions

- Write tests alongside the code they cover
- Prefer unit tests for pure logic, integration tests for I/O boundaries
- Tests should be deterministic and isolated (no shared mutable state between tests)
- Name tests descriptively: `test_<unit>_<scenario>_<expected_result>`

---

## Build & Run

_Document build steps and how to run the project locally once set up._

```bash
# Install dependencies (example — adapt to the project)
# npm install / pip install -r requirements.txt / cargo build

# Run the application
# npm start / python main.py / ./target/debug/app
```

---

## Environment Setup

_List required environment variables and how to configure them._

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| _TBD_    | _TBD_       | _TBD_    | _TBD_   |

Copy `.env.example` to `.env` and fill in values before running locally.

---

## CI/CD

_Document CI/CD pipelines once they are configured._

---

## Key Conventions for AI Assistants

When working on this repository, AI assistants should:

1. **Read before writing** — Always read existing files before modifying them to understand current patterns and avoid breaking changes.
2. **Minimal changes** — Only make changes directly required by the task. Do not refactor surrounding code, add unsolicited comments, or introduce new abstractions.
3. **Match existing style** — Follow the formatting, naming, and patterns already present in the codebase.
4. **No guessing** — If a requirement is ambiguous, ask the user rather than making assumptions.
5. **Avoid security anti-patterns** — Never introduce command injection, SQL injection, XSS, hardcoded credentials, or other OWASP Top 10 vulnerabilities.
6. **Commit clearly** — Use descriptive commit messages following the conventions above.
7. **Branch correctly** — Develop on the designated branch (typically `claude/<description>-<session-id>` for AI work) and never push directly to main.
8. **Update this file** — When the project structure, stack, or workflows change significantly, update the relevant sections of this CLAUDE.md.

---

## Updating This File

Keep CLAUDE.md current as the project evolves:

- Add the project description and tech stack as soon as they are decided
- Document all non-obvious architectural decisions with a brief rationale
- Record any environment setup steps that are easy to forget
- Note deprecated patterns so AI assistants don't reintroduce them
