# Contributing to Stratobater

We follow a **strict** "Micro-Atomic Commit" workflow. Each commit must represent a single, isolated logical step. Do not group multiple steps (like initialization + installation + config) into one commit.

## Workflow

1.  **Micro-Atomic Changes:** Break tasks down into their smallest components.
    *   **Bad:** "Initialize project, install deps, and configure tailwind" (Too large)
    *   **Good:**
        1.  `chore: Initialize Vite project`
        2.  `chore: Install dependencies`
        3.  `feat: Configure Tailwind CSS`
2.  **Verify Locally:** Follow the steps in [DEVELOPING.md](./DEVELOPING.md) to ensure your changes work and build before committing.
3.  **Commit:** Stage your changes and write a commit message following the schema below.
4.  **Push Immediately:** Always push your changes to the remote repository immediately after committing.

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
-   **style**: Code style changes (formatting, missing semi-colons, etc.)
-   **refactor**: A code change that neither fixes a bug nor adds a feature

### Examples of Granularity

**Scenario: Setting up a new component**
-   `feat: Create Fretboard directory structure`
-   `feat: Add basic Fretboard component file`
-   `feat: Add Fretboard styles`
-   `feat: Export Fretboard from index`

**Scenario: Project Setup**
-   `chore: Initialize Vite`
-   `chore: Add React plugin`
-   `chore: Install dependencies`
