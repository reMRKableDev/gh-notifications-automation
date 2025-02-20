# Contributing to GitHub Notifications Automation 🤝

First off, thank you for considering contributing to this project! This is an open-source project that aims to help developers manage their GitHub notifications more efficiently.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct (to be included in a separate file).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- Use a clear and descriptive title
- Describe the exact steps to reproduce the problem
- Provide specific examples to demonstrate the steps
- Describe the behavior you observed after following the steps
- Explain which behavior you expected to see instead and why
- Include logs if relevant

### Suggesting Enhancements

If you have an idea for a new feature or enhancement:

- Use a clear and descriptive title
- Provide a detailed description of the suggested enhancement
- Explain why this enhancement would be useful
- List some use cases if possible

### Pull Requests

- Fork the repo and create your branch from `main`
- If you've added code that should be tested, add tests
- Ensure the test suite passes
- Make sure your code follows the existing code style
- Include relevant documentation updates
- Issue the pull request!

## Development Setup

1. Fork and clone the repo
2. Install dependencies: `npm install`
3. Create a `.env` file with required environment variables:

```plaintext
GH_PAT=your-personal-access-token
GH_USERNAME=your-github-username
```

4. Run tests: `npm test`

## Testing

- Write Jest tests for any new functionality
- Make sure all tests pass before submitting a PR
- Aim to maintain or improve code coverage

## Style Guide

- Use ESLint configuration provided in the project
- Follow existing code formatting patterns
- Use meaningful variable and function names
- Include JSDoc comments for functions

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
