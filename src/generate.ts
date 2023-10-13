#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import yargs from "yargs";
import compile from "./compile";

const args = yargs.argv;
const buildFolder = path.join(process.cwd(), ".next");
const buildIdFile = path.join(buildFolder, "BUILD_ID");

function getRoutes(): string[] {
  try {
    const manifest = path.join(buildFolder, "server", "functions-config-manifest.json");
    const data = fs.readFileSync(manifest, "utf8");
    const jsonObject = JSON.parse(data);
    return Object.keys(jsonObject.functions ?? {});
  } catch (error) {
    console.error(error);
    return [];
  }
}

function getAppVersion(): string {
  try {
    const packageJson = path.join(process.cwd(), "package.json");
    const data = fs.readFileSync(packageJson, "utf8");
    const jsonObject = JSON.parse(data);
    return jsonObject.version;
  } catch (error) {
    return "0.0.0";
  }
}

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
  if (!(/\.(js|ts)$/i.test(args.entry))) {
    return console.log("entry is not a javascript file!");
  }

  const entryFileName = args.entry.replace(/\.(js|ts)/gi, "");
  const outputFile = entryFileName + ".js";
  const entryPath = path.join(process.cwd(), args.entry);
  const publicFolder = path.join(process.cwd(), "public");
  const publicFiles = getFiles(publicFolder).filter(f => !f.endsWith(outputFile));
  const staticFolder = path.join(buildFolder, "static");
  const staticFiles = getFiles(staticFolder).map(f => path.join("/_next", "static", f));
  const appRoutes = getRoutes().filter(r => !r.startsWith("/api"));
  const version = `v${getAppVersion()}.${buildId}`;

  compile(entryPath, publicFolder, outputFile, version, [
    ...appRoutes,
    ...publicFiles,
    ...staticFiles,
  ]);
});
