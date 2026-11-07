// SVGR options used by react-native-svg-transformer.
// Keep the viewBox so illustrations scale to any size we give them, and
// don't let SVGO rename or merge gradient ids (the food art relies on them).
module.exports = {
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
            cleanupIds: false,
            inlineStyles: false,
          },
        },
      },
    ],
  },
};
