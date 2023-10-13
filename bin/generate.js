#!/usr/bin/env node
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
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
function getRoutes() {
    var _a;
    try {
        var manifest = node_path_1.default.join(buildFolder, "server", "functions-config-manifest.json");
        var data = node_fs_1.default.readFileSync(manifest, "utf8");
        var jsonObject = JSON.parse(data);
        return Object.keys((_a = jsonObject.functions) !== null && _a !== void 0 ? _a : {});
    }
    catch (error) {
        console.error(error);
        return [];
    }
}
function getAppVersion() {
    try {
        var manifest = node_path_1.default.join(buildFolder, "server", "functions-config-manifest.json");
        var data = node_fs_1.default.readFileSync(manifest, "utf8");
        var jsonObject = JSON.parse(data);
        return jsonObject.version;
    }
    catch (error) {
        return "0.0.0";
    }
}
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
    if (!(/\.(js|ts)$/i.test(args.entry))) {
        return console.log("entry is not a javascript file!");
    }
    var entryFileName = args.entry.replace(/\.(js|ts)/gi, "");
    var outputFile = entryFileName + ".js";
    var entryPath = node_path_1.default.join(process.cwd(), args.entry);
    var publicFolder = node_path_1.default.join(process.cwd(), "public");
    var publicFiles = getFiles(publicFolder).filter(function (f) { return !f.endsWith(outputFile); });
    var staticFolder = node_path_1.default.join(buildFolder, "static");
    var staticFiles = getFiles(staticFolder).map(function (f) { return node_path_1.default.join("/_next", "static", f); });
    var appRoutes = getRoutes().filter(function (r) { return !r.startsWith("/api"); });
    var version = "v".concat(getAppVersion(), ".").concat(buildId);
    (0, compile_1.default)(entryPath, publicFolder, outputFile, version, __spreadArray(__spreadArray(__spreadArray([], appRoutes, true), publicFiles, true), staticFiles, true));
});
