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
  .argument("<filepath>")
  .option("-l, --line")
  .option("-w --word")
  .option("-c, --character")
  .action(async (filepath) => {
    const options = program.opts();

    if (options.character) {
      try {
        const resolvedPath = path.resolve(filepath);
        const stats = fs.statSync(resolvedPath);

        if (stats.isDirectory()) {
          console.error(
            `Error reading file: ${filepath}, this is directory. Provide a file`,
          );
          process.exit(1);
        }

        if (stats.isFile()) {
          console.log(`\t${stats.size} ${filepath}`);
        }
      } catch (error) {
        console.log(`Error reading file: ${error.message}`);
      }
    }

    if (options.line) {
      try {
        const resolvedPath = path.resolve(filepath);
        const stat = fs.statSync(resolvedPath);

        if (stat.isDirectory()) {
          console.error(
            `Error reading file: ${filepath}, this is directory. Provide a file`,
          );
          process.exit(1);
        }

        if (stat.isFile()) {
          let total = 0;
          const readStream = fs.createReadStream(resolvedPath, {
            encoding: "utf-8",
          });

          for await (const chunk of readStream) {
            total += (chunk.match(/\n/g) || []).length;
          }

          console.log(`\t ${total} ${filepath}`);
        }
      } catch (error) {
        console.log(`Error reading file: ${error.message}`);
      }
    }

    if (options.word) {
      console.log(options.word);
    }
  });

program.parse(process.argv);
