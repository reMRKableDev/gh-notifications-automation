const { GITHUB_API, HEADERS } = require("./config");
const logger = require("./logger");

const fetchGitHub = async (url, options = {}) => {
  try {
    const response = await fetch(`${GITHUB_API}${url}`, {
      headers: HEADERS,
      ...options,
    });

    if (!response.ok) {
      logger.info("Response:", response);
      logger.info(
        "Response headers:",
        JSON.stringify([...response.headers.entries()])
      );
      logger.error(`GitHub API error: ${response.statusText} (URL: ${url})`);
      return null;
    }

    const text = await response.text();
    logger.info(`Response body length: ${text.length}`);

    if (!text || text.trim() === "") {
      logger.error(`Empty response from GitHub API (URL: ${url})`);
      return null;
    }

    try {
      return JSON.parse(text);
    } catch (parseError) {
      logger.error(`JSON parse error: ${parseError.message}`);
      logger.info(`Response text: ${text.substring(0, 100)}...`);
      return null;
    }
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
