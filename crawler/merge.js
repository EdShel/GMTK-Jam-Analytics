import fs from "node:fs";
import path from "node:path";

const OUTPUT_FILE = path.resolve("../webapp/public/data.json");
const TEMP_DIR = path.resolve("./temp");

fs.writeFileSync(OUTPUT_FILE, "[");

const allFiles = fs.readdirSync(TEMP_DIR);
for (let i = 0; i < allFiles.length; i++) {
  const file = allFiles[i];
  const filePath = path.join(TEMP_DIR, file);
  const content = fs.readFileSync(filePath, "utf-8");
  const trimmedContent = content.trim().slice(1, -1);
  fs.appendFileSync(
    OUTPUT_FILE,
    i === allFiles.length - 1 ? `${trimmedContent}]` : `${trimmedContent},`
  );
}
console.log(`Merged ${allFiles.length} files into ${OUTPUT_FILE}`);
