// decode-glb.js
import fs from "fs";
import path from "path";

const files = [
  { input: "public/models/hero-source.base64.txt", output: "public/models/hero-source.glb" },
  { input: "public/models/scene-optimized.base64.txt", output: "public/models/scene-optimized.glb" },
];

for (const file of files) {
  const inputPath = path.resolve(file.input);
  const outputPath = path.resolve(file.output);

  if (!fs.existsSync(inputPath)) {
    console.error(`❌ File not found: ${inputPath}`);
    continue;
  }

  console.log(`🔍 Reading ${inputPath}...`);
  const base64Data = fs.readFileSync(inputPath, "utf-8").replace(/\s+/g, "").trim();

  // Remove any data URL prefix if present
  const base64 = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;

  const buffer = Buffer.from(base64, "base64");
  fs.writeFileSync(outputPath, buffer);
  console.log(`✅ Wrote ${outputPath} (${buffer.length} bytes)`);
}

console.log("\n🎉 All done! Your .glb files are ready.");