const { processNotifications } = require("./notificationService");

(async () => {
  await processNotifications();
})();
