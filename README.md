# GitHub Notifications Automation 🚀

[![Mark Notifications as Done](https://github.com/reMRKableDev/gh-notifications-automation/actions/workflows/auto-mark-done.yml/badge.svg)](https://github.com/reMRKableDev/gh-notifications-automation/actions/workflows/auto-mark-done.yml)
[![tests](https://github.com/reMRKableDev/react-omdb-api/actions/workflows/test-coverage.yml/badge.svg)](https://github.com/reMRKableDev/react-omdb-api/actions/workflows/test-coverage.yml)
[![codecov](https://codecov.io/gh/reMRKableDev/gh-notifications-automation/graph/badge.svg?token=ZcOwgC81Pw)](https://codecov.io/gh/reMRKableDev/gh-notifications-automation)

This repo contains a script that automates the process of checking GitHub notifications and marking merged or closed PRs/issues as **_"done."_**

The script uses the GitHub API to streamline the workflow for developers managing large volumes of notifications.

## 🔧 Features

- Automatically fetches all unread GitHub notifications.
- Filters notifications for:
  - Closed Issues
  - Merged Pull Requests
- Marks processed notifications as "done."
- Skips notifications for organization-owned repositories (processes only personal repositories).
- Fully automated via GitHub Actions.

## 🚀 How It Works

1. The script fetches unread notifications using the GitHub API.
2. It filters notifications:
   - Only considers your personal repositories (skips organization-owned repos).
   - Processes notifications related to Pull Requests or Issues.
   - Checks if the PR/Issue is closed or merged.
3. Marks filtered notifications as done via the GitHub API.

## 🛠️ Setup

### 1. Clone this repo

```bash
git clone https://github.com/your-username/github-notifications-automation.git

cd github-notifications-automation
```

### 2. Install dependencies

```bash
# Using yarn
yarn install

# Using npm
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```plaintext
GH_PAT=your-personal-access-token
GITHUB_USERNAME=your-github-username
```

**Note:** You can generate a Personal Access Token (PAT) with the notifications scope in your GitHub account settings.

### 4. Run Script Locally

```bash
# Using yarn
yarn start

# Using npm
npm start
```

## 📜 Automate with GitHub Actions

This repo includes a GitHub Actions workflow to run the script periodically in the cloud.

### How to Set Up the Workflow

1. Add the following GitHub Secrets to your repository:
   - `GH_PAT` → Your GitHub Personal Access Token.
   - `GH_USERNAME` → Your GitHub username.
2. The included workflow (`auto-mark-done.yml`) will:
   - Run the automation every hour.
   - Process notifications and mark them as **_"done."_**

## 🚨 Testing

Jest is used for testing the GitHub API helper functions and core logic.

Run the tests using:

```bash
# Using yarn
yarn test

# Using npm
npm test
```

Run tests with coverage:

```bash
# Using yarn
yarn coverage

# Using npm
npm run coverage
```

The repo is currently configured with the following coverage thresholds:

- Branches: 80%
- Functions: 100%
- Lines: 89%
- Statements: 90%

## 📝 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

Let me know if you'd like me to adjust anything further! 😊

Made with ❤️ by [reMRKable Dev](https://remrkabledev.com)
