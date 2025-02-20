jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe("Config", () => {
  const OLD_ENV = process.env;
  const TEST_TOKEN = "test-token";
  const TEST_USERNAME = "test-user";

  const setupEnv = (nodeEnv = "production") => {
    process.env.NODE_ENV = nodeEnv;
    process.env.GH_PAT = TEST_TOKEN;
    process.env.GH_USERNAME = TEST_USERNAME;
  };

  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  describe("environment loading", () => {
    const testEnvLoading = (nodeEnv, shouldLoadDotenv) => {
      setupEnv(nodeEnv);

      const dotenv = require("dotenv");
      const config = require("../src/config");

      shouldLoadDotenv
        ? expect(dotenv.config).toHaveBeenCalled()
        : expect(dotenv.config).not.toHaveBeenCalled();

      expect(config.GH_PAT).toBe(TEST_TOKEN);
      expect(config.GH_USERNAME).toBe(TEST_USERNAME);
    };

    test("should not load dotenv in production environment", () => {
      testEnvLoading("production", false);
    });

    test("should load dotenv in non-production environment", () => {
      testEnvLoading("development", true);
    });
  });

  describe("missing variables", () => {
    const testMissingVar = (setupFunc, expectedError) => {
      setupFunc();
      expect(() => require("../src/config")).toThrow(expectedError);
    };

    test("should throw error if GH_PAT is missing", () => {
      testMissingVar(() => {
        process.env.GH_USERNAME = TEST_USERNAME;
      }, "GH_PAT environment variable is required");
    });

    test("should throw error if GH_USERNAME is missing", () => {
      testMissingVar(() => {
        process.env.GH_PAT = TEST_TOKEN;
      }, "GH_USERNAME environment variable is required");
    });
  });
});
