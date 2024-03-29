module.exports = {
    roots: ["src"],
    setupFilesAfterEnv: ["./jest.setup.ts"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
    testPathIgnorePatterns: ["node_modules/"],
    transform: {
      "^.+\\.(ts|js|tsx)?$": "ts-jest",
    },
    testMatch: ["**/*.test.(js|ts|tsx)"],
    moduleNameMapper: {
      // Mocks out all these file formats when tests are run.
      "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
        "identity-obj-proxy",
      "\\.(css|less|scss|sass)$": "identity-obj-proxy"
    }
  };