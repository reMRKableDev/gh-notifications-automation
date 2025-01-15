const GITHUB_API_URL = "https://api.github.com";
const HEADERS = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "GH-Notification-Automation",
};

// 1️⃣ Fetch all unread notifications
const fetchNotifications = async () => {
  const response = await fetch(`${GITHUB_API_URL}/notifications`, {
    headers: HEADERS,
  });

  if (!response.ok) {
    console.error("Error fetching notifications:", response.statusText);
    return [];
  }

  return response.json();
};

// 2️⃣ Check if a PR/Issue is merged or closed
const checkIfMergedOrClosed = async (notification) => {
  const { subject, repo } = notification;

  if (subject.type !== "PullRequest" && subject.type !== "Issue") return false;

  const url = `${GITHUB_API}/repos/${repo.owner.login}/${repo.name}/${
    subject.type === "PullRequest" ? "pulls" : "issues"
  }/${subject.url.split("/").pop()}`;

  const response = await fetch(url, {
    headers: HEADERS,
  });

  if (!response.ok) {
    console.error("Error fetching PR/Issue:", response.statusText);
    return false;
  }

  const data = await response.json();
  return data.state === "closed" || data.merged_at !== null;
};

// 3️⃣ Mark notification as "done"
const markAsDone = async (threadId) => {
  const response = await fetch(
    `${GITHUB_API_URL}/notifications/threads/${threadId}`,
    {
      method: "PATCH",
      headers: HEADERS,
    }
  );

  if (response.ok) {
    console.log(`Marked as done: ${threadId}`);
  } else {
    console.error(`Error marking ${threadId} as done:`, response.statusText);
  }
};

(async () => {
  const notifications = await fetchNotifications();

  for (const notification of notifications) {
    if (await checkIfMergedOrClosed(notification)) {
      await markAsDone(notification.id);
    }
  }
  console.log("✅ Done processing notifications.");
})();
