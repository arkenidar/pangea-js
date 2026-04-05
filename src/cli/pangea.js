#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import process from "node:process";
import { exec } from "../core/runtime.js";

function printUsage() {
  console.error("Usage:");
  console.error("  pangea <file>");
  console.error('  pangea -e "<code>"');
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  let code = "";

  if (args[0] === "-e") {
    if (!args[1]) {
      console.error("Missing code after -e");
      printUsage();
      process.exitCode = 1;
      return;
    }
    code = args[1];
  } else {
    const filePath = args[0];
    code = await readFile(filePath, "utf8");
  }

  try {
    exec(code);
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}

main();
