import fs from "fs";

export async function word(resolvedPath) {
  let content;
  let inputText = "";

  if (resolvedPath) {
    content = fs.readFileSync(resolvedPath, { encoding: "utf-8" });
  } else {
    content = process.stdin;
    content.setEncoding("utf8");
  }

  for await (const chunk of content) {
    inputText += chunk;
  }

  return inputText.match(/\S+/g)?.length ?? 0;
}
