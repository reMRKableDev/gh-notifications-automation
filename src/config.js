if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

module.exports = {
  GITHUB_API: "https://api.github.com",
  GH_PAT: process.env.GITHUB_TOKEN,
  GITHUB_USERNAME: process.env.GITHUB_USERNAME,
  HEADERS: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GH-Notification-Automation",
  },
};
