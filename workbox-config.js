module.exports = {
  globDirectory: "build/",
  globPatterns: [
    "**/*.{json,ico,html,png,txt,wasm,js,css,mp3,wasm-webpack-file-loader}",
  ],
  swDest: "build/sw.js",
  //ignoreURLParametersMatching: [/^utm_/, /^fbclid$/],
  swSrc: "src/sw-template.js",
  maximumFileSizeToCacheInBytes: 13000000,
};
