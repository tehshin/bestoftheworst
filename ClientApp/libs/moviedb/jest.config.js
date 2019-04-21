module.exports = {
  name: "moviedb",
  preset: "../../jest.config.js",
  coverageDirectory: "../../coverage/libs/moviedb",
  snapshotSerializers: [
    "jest-preset-angular/AngularSnapshotSerializer.js",
    "jest-preset-angular/HTMLCommentSerializer.js"
  ]
};
