const { GITHUB_API, HEADERS } = require("./config");

const fetchGitHub = async (url, options = {}) => {
  const response = await fetch(`${GITHUB_API}${url}`, {
    headers: HEADERS,
    ...options,
  });

  if (!response.ok) {
    console.error(`GitHub API error: ${response.statusText} (URL: ${url})`);
    return null;
  }

  return response.json();
};

const getNotifications = async () => fetchGitHub("/notifications");

const getIssueOrPRStatus = async (repoOwner, repoName, issueOrPrNumber, type) =>
  fetchGitHub(`/repos/${repoOwner}/${repoName}/${type}/${issueOrPrNumber}`);

const markAsDone = (threadId) =>
  fetchGitHub(`/notifications/threads/${threadId}`, { method: "PATCH" });

module.exports = { getNotifications, getIssueOrPRStatus, markAsDone };
