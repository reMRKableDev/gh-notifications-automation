const { GITHUB_API, HEADERS } = require("./config");
const logger = require("./logger");

console.log("🚀 ~ HEADERS:", HEADERS);
console.log("🚀 ~ GITHUB_API:", GITHUB_API);
const fetchGitHub = async (url, options = {}) => {
  try {
    const response = await fetch(`${GITHUB_API}${url}`, {
      headers: HEADERS,
      ...options,
    });

    if (!response.ok) {
      logger.info("Response:", response);
      logger.error(`GitHub API error: ${response.statusText} (URL: ${url})`);
      return null;
    }

    return response.json();
  } catch (error) {
    logger.error(`Failed to fetch GitHub API: ${error.message} (URL: ${url})`);
    return null;
  }
};

const getNotifications = async () => fetchGitHub("/notifications");

const getIssueOrPRStatus = async (repoOwner, repoName, issueOrPrNumber, type) =>
  fetchGitHub(`/repos/${repoOwner}/${repoName}/${type}/${issueOrPrNumber}`);

const markAsDone = (threadId) =>
  fetchGitHub(`/notifications/threads/${threadId}`, { method: "PATCH" });

module.exports = { getNotifications, getIssueOrPRStatus, markAsDone };
