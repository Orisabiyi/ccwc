#! /usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";

import { byteCount, lineCount, wordCount } from "./utils.js";

const program = new Command();

program
  .name("ccwc")
  .description("Re-implementation of the classic wc unix tool in Node.js")
  .version("1.0.0");

program
  .argument("[filepath]")
  .option("-w, --word")
  .option("-l, --line")
  .option("-c, --byte")
  .option("-m, --character")
  .action(async (filepath) => {
    const options = program.opts();

    let total = 0;
    let resolvedPath;
    let content;
    let stat;

    let contentInput = "";

    if (filepath) {
      resolvedPath = path.resolve(filepath);
      stat = fs.statSync(resolvedPath);

      content = fs.createReadStream(resolvedPath, { encoding: "utf8" });

      if (stat.isDirectory()) {
        console.error(
          `Error reading file: ${filepath}, this is directory. Provide a file`,
        );
        process.exit(1);
      }

      for await (const chunk of content) {
        contentInput += chunk;
      }
    } else {
      content = process.stdin;
      content.setEncoding("utf8");

      for await (const chunk of content) {
        contentInput += chunk;
      }
    }

    if (options.byte) {
      try {
        let statSize;

        if (stat) {
          statSize = await byteCount(stat, filepath);
        } else {
          statSize = Buffer.byteLength(contentInput);
        }

        console.log(statSize.toString());
      } catch (error) {
        console.log(`Error reading file: ${error.message}`);
      }
    }

    if (options.line) {
      try {
        const total = await lineCount(contentInput, filepath);
        console.log(total);
      } catch (error) {
        console.log(error);
      }
    }

    if (options.word) {
      try {
        const total = await wordCount(contentInput);
        console.log(`${total} ${filepath || ""}`);
      } catch (error) {
        console.log(error);
      }
    }

    if (options.character) {
      for await (const chunk of content) {
        total += chunk.split("").length;
      }

      console.log(`\t${total} ${filepath || ""}`);
    }

    if (!options.byte && !options.line && !options.word && !options.character) {
      try {
        const response = await Promise.all([
          lineCount(contentInput, filepath),
          wordCount(contentInput),
          byteCount(stat, filepath),
        ]);

        console.log(
          response.toString().replaceAll(",", "").replaceAll(filepath, ""),
          filepath,
        );
      } catch (error) {
        console.log(error);
      }
    }
  });

program.parse(process.argv);
