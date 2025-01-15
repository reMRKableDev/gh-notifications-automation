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

test("getNotifications should return notifications", async () => {
  const type = "Issue";

  fetchMock.mockResponseOnce(
    JSON.stringify([{ id: "123", subject: { type } }])
  );

  const notifications = await getNotifications();
  expect(notifications.length).toBe(1);
  expect(notifications[0].subject.type).toBe(type);
});

test("getIssueOrPRStatus should return closed PR", async () => {
  const state = "closed";

  fetchMock.mockResponseOnce(JSON.stringify({ state, merged_at: null }));

  const status = await getIssueOrPRStatus("owner", "repo", "42", "pulls");
  expect(status.state).toBe(state);
  expect(status.merged_at).toBeNull();
});

test("markAsDone should call GitHub API", async () => {
  const threadId = "123";

  fetchMock.mockResponseOnce(JSON.stringify({}));

  await markAsDone(threadId);
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining(`/notifications/threads/${threadId}`),
    expect.objectContaining({ method: "PATCH" })
  );
});
