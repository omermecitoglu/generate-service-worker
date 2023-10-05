import webpack from "webpack";

export default function compile(entryPath: string, outputPath: string, fileName: string, buildId: string, files: string[]) {
  const compiler = webpack({
    entry: entryPath,
    output: {
      filename: fileName,
      path: outputPath,
    },
    mode: "production",
    target: "webworker",
    plugins: [
      new webpack.DefinePlugin({
        BUILD_ID: JSON.stringify(buildId),
        STATIC_FILES: JSON.stringify(files),
      }),
    ],
  });

  compiler.run((err, stats) => {
    if (err) return console.error(err);
    if (stats) {
      console.log(stats.toString({ colors: true }));
    }
  });
}
