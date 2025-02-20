const dotenv = require("dotenv");

if (process.env.NODE_ENV !== "production") {
  dotenv.config({ silent: true });
}

const GH_PAT = process.env.GH_PAT;
const GH_USERNAME = process.env.GH_USERNAME;

if (!GH_PAT) {
  throw new Error("GH_PAT environment variable is required");
}

if (!GH_USERNAME) {
  throw new Error("GH_USERNAME environment variable is required");
}

module.exports = {
  GITHUB_API: "https://api.github.com",
  GH_PAT,
  GH_USERNAME,
  HEADERS: {
    Authorization: `Bearer ${GH_PAT}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GH-Notification-Automation",
  },
};
