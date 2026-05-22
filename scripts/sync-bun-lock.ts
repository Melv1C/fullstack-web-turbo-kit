/* eslint-disable no-console */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

const rootDir = resolve(process.argv[2] ?? process.cwd());
const packagesDir = join(rootDir, "packages");
const bunLockPath = join(rootDir, "bun.lock");

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

if (!existsSync(bunLockPath)) {
  console.log("Skipped bun.lock: file not found");
  process.exit(0);
}

let bunLockText = readFileSync(bunLockPath, "utf8");

for (const entry of readdirSync(packagesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue;
  }

  const packageJsonPath = join(packagesDir, entry.name, "package.json");

  if (!existsSync(packageJsonPath)) {
    continue;
  }

  const { name, version } = JSON.parse(readFileSync(packageJsonPath, "utf8")) as {
    name?: string;
    version?: string;
  };

  if (!name || !version) {
    continue;
  }

  let matched = false;
  bunLockText = bunLockText.replace(
    new RegExp(`("name":\\s*"${escapeRegExp(name)}"[\\s\\S]*?"version":\\s*")([^"]+)(")`, "g"),
    (match, start: string, currentVersion: string, end: string) => {
      matched = true;
      if (currentVersion === version) {
        return match;
      }
      console.log(`Synced bun.lock ${name}: ${currentVersion} -> ${version}`);
      return `${start}${version}${end}`;
    },
  );

  if (!matched) {
    console.warn(`No match found in bun.lock for ${name}`);
  }
}

writeFileSync(bunLockPath, bunLockText);
console.log("bun.lock sync complete");
