if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
module.exports = {
  GITHUB_API: "https://api.github.com",
  GITHUB_TOKEN: process.env.GH_TOKEN,
  GITHUB_USERNAME: process.env.GH_USERNAME,
  HEADERS: {
    Authorization: `Bearer ${process.env.GH_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "GH-Notification-Automation",
  },
};
