"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = __importDefault(require("webpack"));
function compile(entryPath, outputPath, fileName, buildId, files) {
    var compiler = (0, webpack_1.default)({
        entry: entryPath,
        output: {
            filename: fileName,
            path: outputPath,
        },
        mode: "production",
        target: "webworker",
        plugins: [
            new webpack_1.default.DefinePlugin({
                BUILD_ID: JSON.stringify(buildId),
                STATIC_FILES: JSON.stringify(files),
            }),
        ],
    });
    compiler.run(function (err, stats) {
        if (err)
            return console.error(err);
        if (stats) {
            console.log(stats.toString({ colors: true }));
        }
    });
}
exports.default = compile;
