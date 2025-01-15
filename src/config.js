if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
console.log("🚀 ~ process.env.NODE_ENV:", process.env.NODE_ENV);
console.log("🚀 ~ process.env.GH_TOKEN:", process.env.GH_TOKEN);
console.log("🚀 ~ process.env.GH_USERNAME:", process.env.GH_USERNAME);

console.log("🚀 ~ secrets.GH_TOKEN:", secrets.GH_TOKEN);
console.log("🚀 ~ secrets.GH_USERNAME:", secrets.GH_USERNAME);
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
