const { GITHUB_API, HEADERS } = require("./config");
async function fetchGitHub(url, options = {}) {
  const response = await fetch(`${GITHUB_API}${url}`, {
    headers: HEADERS,
    ...options,
  });

  if (!response.ok) {
    console.error(`GitHub API error: ${response.statusText} (URL: ${url})`);
    return null;
  }

  return response.json();
}

async function getNotifications() {
  return fetchGitHub("/notifications");
}

async function getIssueOrPRStatus(repoOwner, repoName, issueOrPrNumber, type) {
  return fetchGitHub(
    `/repos/${repoOwner}/${repoName}/${type}/${issueOrPrNumber}`
  );
}

async function markAsDone(threadId) {
  return fetchGitHub(`/notifications/threads/${threadId}`, { method: "PATCH" });
}

module.exports = { getNotifications, getIssueOrPRStatus, markAsDone };
