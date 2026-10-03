export async function wordCount(contentInput) {
  try {
    return contentInput.match(/\S+/g)?.length ?? 0;
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
}

export async function lineCount(content, filepath) {
  try {
    return `${(content.match(/\n/g) || []).length} ${filepath || ""}`;
  } catch (error) {
    throw new Error(`Error reading file: ${error.message}`);
  }
}

export async function byteCount(stat, filepath) {
  try {
    return ` ${stat.size} ${filepath}`;
  } catch (error) {
    return `Error reading file: ${error.message}`;
  }
}
