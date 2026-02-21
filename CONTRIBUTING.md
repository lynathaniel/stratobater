# Contributing to Stratobater

We follow a strict "Atomic Commit" workflow to ensure high code quality and easy debugging.

## Workflow

1.  **Small, Atomic Changes:** Focus on one small task at a time (e.g., "Add button," "Setup build"). Do not bundle unrelated changes.
2.  **Verify Locally:** Follow the steps in [DEVELOPING.md](./DEVELOPING.md) to ensure your changes work and build before committing.
3.  **Commit:** Stage your changes and write a commit message following the schema below.
4.  **Push:** Push your changes to the remote repository.

## Commit Schema

All commit messages must follow this format:

```text
[<type>]: <1 sentence description>
```

### Allowed Types

-   **feat**: A new feature (e.g., "Add play button")
-   **fix**: A bug fix (e.g., "Fix mobile scroll issue")
-   **docs**: Documentation only changes
-   **chore**: Maintenance, build config, or dependency updates (e.g., "Setup Vite")

### Example

```bash
git commit -m "[feat]: Add play button to Fretboard component"
```
