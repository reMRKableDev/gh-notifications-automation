const { GH_USERNAME } = require("./config");
const {
  getNotifications,
  getIssueOrPRStatus,
  markAsRead,
} = require("./githubApi");
const logger = require("./logger");

const processNotifications = async () => {
  logger.info("🔄 Checking GitHub notifications...");

  const notifications = await getNotifications();
  if (!notifications) return;

  for (const notification of notifications) {
    const { repository, subject } = notification;

    if (repository.owner.login !== GH_USERNAME) {
      logger.info(`Skipping ${repository.full_name} (not owned by you)`);
      continue;
    }

    if (subject.type !== "PullRequest" && subject.type !== "Issue") continue;

    const issueOrPrNumber = subject.url.split("/").pop();
    const status = await getIssueOrPRStatus(
      repository.owner.login,
      repository.name,
      issueOrPrNumber,
      subject.type === "PullRequest" ? "pulls" : "issues"
    );

    if (status && (status.state === "closed" || status.merged_at !== null)) {
      await markAsRead(notification.id);
      logger.info(`Marked as done: ${subject.title}`);
    }
  }

  logger.info("✅ Done processing notifications.");
};

module.exports = { processNotifications };
