# Developing Stratobater

This guide outlines the development workflow and verification steps.

## Prerequisites

-   **Node.js** (v18+)
-   **npm** or **yarn**
-   **Docker** (for containerization tasks)

## Verification Steps (Before Committing)

Before creating a commit, you **MUST** ensure the following pass locally:

### 1. Type Checking
Ensure there are no TypeScript errors.

```bash
# From within the web/ directory
npm run type-check  # or "tsc --noEmit" if script is not defined
```

### 2. Linting
Verify code style and catch potential issues.

```bash
# From within the web/ directory
npm run lint
```

### 3. Build Check
Confirm the project builds successfully.

```bash
# From within the web/ directory
npm run build
```

## Running Locally

To start the development server:

```bash
# From within the web/ directory
npm run dev
```

## Running via Docker

To build and run the containerized app:

```bash
docker-compose up --build
```
