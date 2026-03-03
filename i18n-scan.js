/* eslint-disable no-new-func */
const fs = require("fs");
const path = require("path");

const ROOT_DIR = process.cwd();
const DEFAULT_SCAN_DIRS = ["src", "app"]
  .map((dir) => path.join(ROOT_DIR, dir))
  .filter((dirPath) => fs.existsSync(dirPath));

const SOURCE_EXTS = new Set([".js", ".jsx", ".ts", ".tsx"]);

const isIgnoredDir = (dirName) =>
  dirName === "node_modules" ||
  dirName === ".next" ||
  dirName === ".git" ||
  dirName === "dist" ||
  dirName === "build" ||
  dirName === "coverage";

const walkFiles = (dirPath, out) => {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (isIgnoredDir(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      if (fullPath.includes(`${path.sep}src${path.sep}language${path.sep}`))
        continue;
      walkFiles(fullPath, out);
      continue;
    }

    if (!SOURCE_EXTS.has(path.extname(entry.name))) continue;
    out.push(fullPath);
  }
};

const decodeJsStringLiteral = (quote, raw) => {
  if (quote === "`" && raw.includes("${")) return null;
  const literal = `${quote}${raw}${quote}`;
  try {
    return Function(`"use strict"; return (${literal});`)();
  } catch {
    return null;
  }
};

const extractKeysFromSource = (sourceText) => {
  const found = new Set();

  const patterns = [
    // t("...")
    { quote: '"', re: /\bt\s*\(\s*"((?:\\.|[^"\\])*)"\s*(?=,|\))/g },
    { quote: "'", re: /\bt\s*\(\s*'((?:\\.|[^'\\])*)'\s*(?=,|\))/g },
    { quote: "`", re: /\bt\s*\(\s*`((?:\\.|[^`\\])*)`\s*(?=,|\))/g },
    // i18next.t("...")
    {
      quote: '"',
      re: /\bi18next\.t\s*\(\s*"((?:\\.|[^"\\])*)"\s*(?=,|\))/g,
    },
    {
      quote: "'",
      re: /\bi18next\.t\s*\(\s*'((?:\\.|[^'\\])*)'\s*(?=,|\))/g,
    },
    {
      quote: "`",
      re: /\bi18next\.t\s*\(\s*`((?:\\.|[^`\\])*)`\s*(?=,|\))/g,
    },
  ];

  for (const { quote, re } of patterns) {
    re.lastIndex = 0;
    let match;
    while ((match = re.exec(sourceText))) {
      const raw = match[1];
      if (!raw) continue;
      const decoded = decodeJsStringLiteral(quote, raw);
      if (typeof decoded !== "string") continue;
      if (decoded.includes("\n")) continue;
      found.add(decoded);
    }
  }

  return found;
};

const readExportedObject = (filePath, exportName) => {
  const content = fs.readFileSync(filePath, "utf8");
  const marker = `export const ${exportName} =`;
  const markerIndex = content.indexOf(marker);
  if (markerIndex === -1) {
    throw new Error(
      `Could not find export const ${exportName} in ${filePath}`
    );
  }

  const startIndex = content.indexOf("{", markerIndex + marker.length);
  if (startIndex === -1) {
    throw new Error(
      `Could not find opening { for export const ${exportName} in ${filePath}`
    );
  }

  let endIndexExclusive = null;
  const endWithNewline = content.match(/\n};\s*$/);
  if (endWithNewline) {
    // Match starts at the newline before the final "};"
    endIndexExclusive = endWithNewline.index + 2; // include the closing "}"
  } else {
    const endNoNewline = content.match(/};\s*$/);
    if (endNoNewline) {
      endIndexExclusive = endNoNewline.index + 1; // include the closing "}"
    }
  }

  if (
    typeof endIndexExclusive !== "number" ||
    endIndexExclusive <= startIndex
  ) {
    throw new Error(
      `Could not find closing }; for export const ${exportName} in ${filePath}`
    );
  }

  const objectLiteral = content.slice(startIndex, endIndexExclusive);
  // Parse object literal safely (we only evaluate an object literal from our own repo files).
  // eslint-disable-next-line no-eval
  return eval(`(${objectLiteral})`);
};

const writeEnglishFile = (filePath, englishObj) => {
  const keys = Object.keys(englishObj).sort();
  const sorted = {};
  for (const key of keys) sorted[key] = englishObj[key];
  const nextContent = `export const english = ${JSON.stringify(sorted, null, 2)};\n`;
  fs.writeFileSync(filePath, nextContent, "utf8");
};

const appendMissingKeysToArabicFile = (filePath, missingKeys) => {
  if (missingKeys.length === 0) return 0;

  let content = fs.readFileSync(filePath, "utf8");

  const endIndex =
    content.lastIndexOf("\n};") !== -1
      ? content.lastIndexOf("\n};")
      : content.lastIndexOf("};");

  if (endIndex === -1) {
    throw new Error(`Could not find end of export object in ${filePath}`);
  }

  let before = content.slice(0, endIndex);
  const after = content.slice(endIndex);

  // Ensure the previous last item ends with a comma.
  let trimEnd = before.length;
  while (trimEnd > 0 && /\s/.test(before[trimEnd - 1])) trimEnd--;
  const lastChar = before[trimEnd - 1];
  if (lastChar !== "," && lastChar !== "{") {
    before = before.slice(0, trimEnd) + "," + before.slice(trimEnd);
  }

  const lines = missingKeys
    .sort()
    .map((key, index, arr) => {
      const trailingComma = index === arr.length - 1 ? "" : ",";
      return `\t${JSON.stringify(key)}: ${JSON.stringify(key)}${trailingComma}`;
    })
    .join("\n");

  if (!before.endsWith("\n")) before += "\n";

  content = `${before}${lines}\n${after}`;
  fs.writeFileSync(filePath, content, "utf8");
  return missingKeys.length;
};

const main = () => {
  const scanDirs = DEFAULT_SCAN_DIRS;
  if (scanDirs.length === 0) {
    console.error("❌ No scan directories found (expected src/ or app/).");
    process.exit(1);
  }

  const files = [];
  for (const dirPath of scanDirs) walkFiles(dirPath, files);

  const scannedKeys = new Set();
  for (const filePath of files) {
    const text = fs.readFileSync(filePath, "utf8");
    for (const key of extractKeysFromSource(text)) scannedKeys.add(key);
  }

  const enPath = path.join(ROOT_DIR, "src", "language", "en.js");
  const arPath = path.join(ROOT_DIR, "src", "language", "ar.js");

  const english = readExportedObject(enPath, "english");
  const arabic = readExportedObject(arPath, "arabic");

  let addedToEnglish = 0;
  for (const key of scannedKeys) {
    if (!Object.prototype.hasOwnProperty.call(english, key)) {
      english[key] = key;
      addedToEnglish++;
    }
  }

  writeEnglishFile(enPath, english);

  const englishKeys = Object.keys(english);
  const missingInArabic = englishKeys.filter(
    (key) => !Object.prototype.hasOwnProperty.call(arabic, key)
  );

  const addedToArabic = appendMissingKeysToArabicFile(arPath, missingInArabic);

  console.log("✅ i18n scan complete");
  console.log(`- Files scanned: ${files.length}`);
  console.log(`- Keys found: ${scannedKeys.size}`);
  console.log(`- Added to en: ${addedToEnglish}`);
  console.log(`- Added to ar: ${addedToArabic}`);
};

main();
