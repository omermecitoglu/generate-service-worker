#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import yargs from "yargs";
import compile from "./compile";

const args = yargs.argv;
const buildFolder = path.join(process.cwd(), ".next");
const buildIdFile = path.join(buildFolder, "BUILD_ID");

function getFiles(dir: string, files: string[] = [], baseDir: string = dir) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = `${dir}/${file}`;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files, baseDir);
    } else {
      files.push(path.relative(baseDir, name));
    }
  }
  return files;
}

fs.readFile(buildIdFile, "utf8", (error, buildId) => {
  if (error) return console.error(error);

  if (args instanceof Promise) {
    return console.log("args was a Promise!");
  }
  if (typeof args.entry !== "string") {
    return console.log("entry is not specified! use --entry parameter");
  }

  const entryPath = path.join(process.cwd(), args.entry);
  const outputPath = path.join(process.cwd(), "public");
  const staticFiles = path.join(buildFolder, "static");
  const cachedFiles = getFiles(staticFiles).map(f => path.join("/_next/", f));

  compile(entryPath, outputPath, "sw.js", buildId, cachedFiles);
});
