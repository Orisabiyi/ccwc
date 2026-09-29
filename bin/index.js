#! /usr/bin/env node

import { Command } from "commander";
import fs from "fs";
import path from "path";

import { word } from "./utils.js";

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

    // data
    let fileData = "";

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
    } else {
      content = process.stdin;
      content.setEncoding("utf8");
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
        for await (const chunk of content) {
          total += (chunk.match(/\n/g) || []).length;
        }

        console.log(`\t ${total} ${filepath || ""}`);
      } catch (error) {
        console.log(`Error reading file: ${error.message}`);
      }
    }

    if (options.word) {
      // let content;
      // let inputText = "";

      // if (resolvedPath) {
      //   content = fs.readFileSync(resolvedPath, { encoding: "utf-8" });
      // } else {
      //   content = process.stdin;
      //   content.setEncoding("utf8");
      // }

      // for await (const chunk of content) {
      //   inputText += chunk;
      // }

      // const total = inputText.match(/\S+/g).length;

      const total = await word(resolvedPath);

      console.log(`\t${total} ${filepath || ""}`);
    }

    if (options.character) {
      for await (const chunk of content) {
        total += chunk.split("").length;
      }

      console.log(`\t${total} ${filepath || ""}`);
    }

    if (!options.byte && !options.line && !options.word && !options.character) {
      console.log(fileData);
    }
  });

program.parse(process.argv);
