/**
 * @type {import('semantic-release').GlobalConfig}
 */
module.exports = {
  repositoryUrl: "https://github.com/AwaludinAR/unestorage.git",
  branches: ["main", { name: "beta", channel: "beta", prerelease: true }],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "./CHANGELOG.md",
        changelogTitle: "# Changelog",
      },
    ],
    "@semantic-release/github",
    [
      "@semantic-release/npm",
      {
        npmPublish: true,
      },
    ],
  ],
};
