#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_fs_1 = __importDefault(require("node:fs"));
var node_path_1 = __importDefault(require("node:path"));
var yargs_1 = __importDefault(require("yargs"));
var compile_1 = __importDefault(require("./compile"));
var args = yargs_1.default.argv;
var buildFolder = node_path_1.default.join(process.cwd(), ".next");
var buildIdFile = node_path_1.default.join(buildFolder, "BUILD_ID");
function getFiles(dir, files, baseDir) {
    if (files === void 0) { files = []; }
    if (baseDir === void 0) { baseDir = dir; }
    var fileList = node_fs_1.default.readdirSync(dir);
    for (var _i = 0, fileList_1 = fileList; _i < fileList_1.length; _i++) {
        var file = fileList_1[_i];
        var name = "".concat(dir, "/").concat(file);
        if (node_fs_1.default.statSync(name).isDirectory()) {
            getFiles(name, files, baseDir);
        }
        else {
            files.push(node_path_1.default.relative(baseDir, name));
        }
    }
    return files;
}
node_fs_1.default.readFile(buildIdFile, "utf8", function (error, buildId) {
    if (error)
        return console.error(error);
    if (args instanceof Promise) {
        return console.log("args was a Promise!");
    }
    if (typeof args.entry !== "string") {
        return console.log("entry is not specified! use --entry parameter");
    }
    var entryPath = node_path_1.default.join(process.cwd(), args.entry);
    var outputPath = node_path_1.default.join(process.cwd(), "public");
    var staticFiles = node_path_1.default.join(buildFolder, "static");
    var cachedFiles = getFiles(staticFiles).map(function (f) { return node_path_1.default.join("/_next/", f); });
    (0, compile_1.default)(entryPath, outputPath, "sw.js", buildId, cachedFiles);
});
