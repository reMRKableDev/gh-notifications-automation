process.env.GH_PAT = "test-token";
process.env.GH_USERNAME = "test-user";

const fetchMock = require("jest-fetch-mock");
const {
  getNotifications,
  getIssueOrPRStatus,
  markAsRead,
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

const testApiError = async (apiCall) => {
  fetchMock.mockResponseOnce("", { status: 500 });

  const result = await apiCall();
  expect(result).toBeNull();
  expect(logger.info).toHaveBeenCalledWith("Response:", expect.any(Object));
  expect(logger.error).toHaveBeenCalledWith(
    expect.stringContaining("GitHub API error")
  );
};

const testEmptyResponse = async (apiCall) => {
  fetchMock.mockResponseOnce("", { status: 200 });

  const result = await apiCall();
  expect(result).toBeNull();
};

const testInvalidJson = async (apiCall) => {
  fetchMock.mockResponseOnce("Not valid JSON", { status: 200 });

  const result = await apiCall();
  expect(result).toBeNull();
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
    test("should return null when API returns non-200 status", async () => {
      await testApiError(() => getNotifications());
    });

    test("should handle network errors", async () => {
      await testNetworkError(() => getNotifications());
    });

    test("should handle empty responses", async () => {
      await testEmptyResponse(() => getNotifications());
    });

    test("should handle invalid JSON responses", async () => {
      await testInvalidJson(() => getNotifications());
    });

    test("should successfully return notifications", async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify([
          { id: TEST_VALUES.threadId, subject: { type: TEST_VALUES.type } },
        ])
      );

      const notifications = await getNotifications();
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("Response body length:")
      );
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

    test("should handle empty responses", async () => {
      await testEmptyResponse(makeStatusCall());
    });

    test("should handle invalid JSON responses", async () => {
      await testInvalidJson(makeStatusCall());
    });

    const testStatusType = async (type, state) => {
      fetchMock.mockResponseOnce(JSON.stringify({ state }));

      const status = await getIssueOrPRStatus(
        TEST_VALUES.owner,
        TEST_VALUES.repo,
        TEST_VALUES.issueNumber,
        type
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("Response body length:")
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

  describe("markAsRead", () => {
    test("should handle API errors gracefully when marking as done", async () => {
      await testApiError(() => markAsRead(TEST_VALUES.threadId));
    });

    test("should handle network errors when marking as done", async () => {
      await testNetworkError(() => markAsRead(TEST_VALUES.threadId));
    });

    test("should handle empty responses", async () => {
      await testEmptyResponse(() => markAsRead(TEST_VALUES.threadId));
    });

    test("should handle invalid JSON responses", async () => {
      await testInvalidJson(() => markAsRead(TEST_VALUES.threadId));
    });

    test("should call GitHub API", async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));

      await markAsRead(TEST_VALUES.threadId);
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining(
          `/notifications/threads/${TEST_VALUES.threadId}`
        ),
        expect.objectContaining({ method: "PATCH" })
      );
      expect(logger.info).toHaveBeenCalledWith(
        expect.stringContaining("Response body length:")
      );
    });
  });
});
