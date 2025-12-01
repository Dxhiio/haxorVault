# 🤝 Contributing to Hacking Vault

We welcome contributions from developers of all skill levels! Whether you're fixing a bug, adding a feature, or improving documentation, your help is appreciated.

## Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally.
3.  Follow the [Getting Started](./GETTING_STARTED.md) guide to set up your environment.

## Development Workflow

1.  **Create a Branch**: Always work on a new branch for your changes.
    ```bash
    git checkout -b feature/my-new-feature
    # or
    git checkout -b fix/bug-description
    ```
2.  **Make Changes**: Write clean, maintainable code.
3.  **Test**: Ensure your changes work as expected.
4.  **Commit**: Use descriptive commit messages.
    ```bash
    git commit -m "feat: add new glitch animation for insane difficulty"
    ```

## Code Style

*   **TypeScript**: Use strong typing whenever possible. Avoid `any`.
*   **Tailwind**: Use utility classes for styling. Avoid inline styles.
*   **Components**: Keep components small and focused. Use functional components with hooks.
*   **Formatting**: The project uses Prettier. Run `npm run lint` to check for issues.

## Pull Request Process

1.  Push your branch to your fork.
2.  Open a Pull Request (PR) against the `main` branch of the original repository.
3.  Describe your changes clearly in the PR description.
4.  Wait for review and address any feedback.

## Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub. Provide as much detail as possible, including steps to reproduce the bug.
