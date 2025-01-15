const fetchMock = require("jest-fetch-mock");
const {
  getNotifications,
  getIssueOrPRStatus,
  markAsDone,
} = require("../src/githubApi");

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

describe("GH API Helpers", () => {
  describe("getNotifications", () => {
    test("should return empty array when API returns non-200 status", async () => {
      fetchMock.mockResponseOnce("", { status: 500 });

      const notifications = await getNotifications();
      expect(notifications).toEqual([]);
    });

    test("should successfully return notifications", async () => {
      const type = "Issue";

      fetchMock.mockResponseOnce(
        JSON.stringify([{ id: "123", subject: { type } }])
      );

      const notifications = await getNotifications();
      expect(notifications.length).toBe(1);
      expect(notifications[0].subject.type).toBe(type);
    });
  });

  describe("getIssueOrPRStatus", () => {
    test("should return null when API call fails with non-200 status", async () => {
      fetchMock.mockResponseOnce("", { status: 404 });

      const status = await getIssueOrPRStatus("owner", "repo", "42", "pulls");
      expect(status).toBeNull();
    });

    test("should return issue status", async () => {
      const state = "closed";

      fetchMock.mockResponseOnce(JSON.stringify({ state }));

      const status = await getIssueOrPRStatus("owner", "repo", "42", "issues");
      expect(status.state).toBe(state);
    });

    test("should return PR status", async () => {
      const state = "open";

      fetchMock.mockResponseOnce(JSON.stringify({ state }));

      const status = await getIssueOrPRStatus("owner", "repo", "42", "pulls");
      expect(status.state).toBe(state);
    });
  });

  describe("markAsDone", () => {
    test("should handle API errors gracefully when marking as done", async () => {
      fetchMock.mockResponseOnce("", { status: 500 });

      await markAsDone("123");
      expect(fetchMock).toHaveBeenCalled();
    });

    test("should call GitHub API", async () => {
      const threadId = "123";

      fetchMock.mockResponseOnce(JSON.stringify({}));

      await markAsDone(threadId);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(`/notifications/threads/${threadId}`),
        expect.objectContaining({ method: "PATCH" })
      );
    });
  });
});
