#! /usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";

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
  .action(async (filepath, options) => {
    // const resolvedPath = path.resolve(filepath);
    // const stat = fs.statSync(resolvedPath);

    // let total = 0;
    // const content =
    //   filepath ?
    //     fs.createReadStream(resolvedPath, { encoding: "utf8" })
    //   : process.stdin;

    // content.setEncoding("utf8");

    let total = 0;
    let resolvedPath;
    let content;
    let stat;

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
    }

    if (options.byte) {
      try {
        if (stat.isFile()) {
          console.log(`\t${stat.size} ${filepath}`);
        }
      } catch (error) {
        console.log(`Error reading file: ${error.message}`);
      }
    }

    if (options.line) {
      try {
        if (stat.isFile()) {
          for await (const chunk of content) {
            total += (chunk.match(/\n/g) || []).length;
          }

          console.log(`\t ${total} ${filepath}`);
        }
      } catch (error) {
        console.log(`Error reading file: ${error.message}`);
      }
    }

    if (options.word) {
      const content = fs.readFileSync(resolvedPath, { encoding: "utf8" });
      const total = content.match(/\S+/g).length;

      console.log(`\t${total} ${filepath}`);
    }

    if (options.character) {
      for await (const chunk of content) {
        total += chunk.split("").length;
      }

      console.log(`\t${total} ${filepath}`);
    }
  });

program.parse(process.argv);
