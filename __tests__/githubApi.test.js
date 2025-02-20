process.env.GITHUB_TOKEN = "test-token";
process.env.GITHUB_USERNAME = "test-user";

const fetchMock = require("jest-fetch-mock");
const {
  getNotifications,
  getIssueOrPRStatus,
  markAsDone,
} = require("../src/githubApi");
const logger = require("../src/logger");

jest.mock("../src/logger", () => ({
  info: jest.fn(),
  error: jest.fn(),
}));

jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

fetchMock.enableMocks();

const TEST_VALUES = {
  threadId: "123",
  owner: "owner",
  repo: "repo",
  issueNumber: "42",
  type: "Issue",
};

const testApiError = async (apiCall, errorType = "GitHub API error") => {
  fetchMock.mockResponseOnce("", { status: 500 });

  const result = await apiCall();
  expect(result).toBeNull();

  if (errorType === "GitHub API error") {
    expect(logger.info).toHaveBeenCalledWith("Response:", expect.any(Object));
  }
  expect(logger.error).toHaveBeenCalledWith(expect.stringContaining(errorType));
};

const testNetworkError = async (apiCall) => {
  fetchMock.mockReject(new Error("Network error"));

  const result = await apiCall();
  expect(result).toBeNull();
  expect(logger.error).toHaveBeenCalledWith(
    expect.stringContaining("Failed to fetch GitHub API")
  );
};

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

describe("GH API Helpers", () => {
  describe("getNotifications", () => {
    test("should return empty array when API returns non-200 status", async () => {
      await testApiError(() => getNotifications());
    });

    test("should handle network errors", async () => {
      await testNetworkError(() => getNotifications());
    });

    test("should successfully return notifications", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([
          { id: TEST_VALUES.threadId, subject: { type: TEST_VALUES.type } },
        ])
      );

      const notifications = await getNotifications();
      expect(notifications.length).toBe(1);
      expect(notifications[0].subject.type).toBe(TEST_VALUES.type);
    });
  });

  describe("getIssueOrPRStatus", () => {
    const makeStatusCall =
      (type = "pulls") =>
      () =>
        getIssueOrPRStatus(
          TEST_VALUES.owner,
          TEST_VALUES.repo,
          TEST_VALUES.issueNumber,
          type
        );

    test("should return null when API call fails with non-200 status", async () => {
      await testApiError(makeStatusCall());
    });

    test("should handle network errors", async () => {
      await testNetworkError(makeStatusCall());
    });

    const testStatusType = async (type, state) => {
      fetchMock.mockResponseOnce(JSON.stringify({ state }));

      const status = await getIssueOrPRStatus(
        TEST_VALUES.owner,
        TEST_VALUES.repo,
        TEST_VALUES.issueNumber,
        type
      );
      expect(status.state).toBe(state);
    };

    test("should return issue status", async () => {
      await testStatusType("issues", "closed");
    });

    test("should return PR status", async () => {
      await testStatusType("pulls", "open");
    });
  });

  describe("markAsDone", () => {
    test("should handle API errors gracefully when marking as done", async () => {
      await testApiError(() => markAsDone(TEST_VALUES.threadId));
    });

    test("should handle network errors when marking as done", async () => {
      await testNetworkError(() => markAsDone(TEST_VALUES.threadId));
    });

    test("should call GitHub API", async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));

      await markAsDone(TEST_VALUES.threadId);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(
          `/notifications/threads/${TEST_VALUES.threadId}`
        ),
        expect.objectContaining({ method: "PATCH" })
      );
    });
  });
});
