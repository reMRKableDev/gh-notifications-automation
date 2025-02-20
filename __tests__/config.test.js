jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

describe("Config", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  test("should not load dotenv in production environment", () => {
    process.env.NODE_ENV = "production";
    process.env.GH_PAT = "test-token";
    process.env.GH_USERNAME = "test-user";

    const dotenv = require("dotenv");
    const config = require("../src/config");

    expect(dotenv.config).not.toHaveBeenCalled();
    expect(config.GH_PAT).toBe("test-token");
    expect(config.GITHUB_USERNAME).toBe("test-user");
  });
  /* 
  test("should try to load dotenv in non-production environment", () => {
    process.env.NODE_ENV = "development";
    process.env.GH_PAT = "test-token";
    process.env.GH_USERNAME = "test-user";

    const dotenv = require("dotenv");
    const config = require("../src/config");

    expect(dotenv.config).toHaveBeenCalled();
    expect(config.GH_PAT).toBe("test-token");
    expect(config.GITHUB_USERNAME).toBe("test-user");
  });

  test("should throw error if GH_PAT is missing", () => {
    process.env.GH_USERNAME = "test-user";

    expect(() => require("../src/config")).toThrow(
      "GH_PAT environment variable is required"
    );
  });

  test("should throw error if GH_USERNAME is missing", () => {
    process.env.GH_PAT = "test-token";

    expect(() => require("../src/config")).toThrow(
      "GH_USERNAME environment variable is required"
    );
  }); */
});
