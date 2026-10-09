import fs from "node:fs";

const html = fs.readFileSync(new URL("../dist/index.html", import.meta.url), "utf8");
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)];
const requiredIds = ["grid", "wheel", "spin", "reset", "big", "bigImg", "bigNum"];

for (const id of requiredIds) {
  if (!html.includes(`id="${id}"`)) {
    throw new Error(`Missing required game element: #${id}`);
  }
}

if (!scripts.length) {
  throw new Error("No inline game script found.");
}

for (const [index, match] of scripts.entries()) {
  try {
    new Function(match[1]);
  } catch (error) {
    throw new Error(`Inline script ${index + 1} is invalid: ${error.message}`);
  }
}

console.log(
  `OK: ${scripts.length} inline script(s), all required game elements, ${Buffer.byteLength(html)} bytes.`,
);
