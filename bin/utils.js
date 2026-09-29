import fs from "fs";

export async function wordCount(resolvedPath) {
  try {
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
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
}

export async function lineCount(content, total, filepath) {
  try {
    for await (const chunk of content) {
      total += (chunk.match(/\n/g) || []).length;
    }

    return `${total} ${filepath || ""}`;
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
}

export async function byteCount(stat, filepath) {
  try {
    if (stat.isFile()) {
      return ` ${stat.size} ${filepath}`;
    }
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
}
