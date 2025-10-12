import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..", "..");
const imagesDir = path.join(projectRoot, "public", "images");

async function ensureDir(dir) {
  await mkdir(dir, { recursive: true });
}

async function fileExists(filePath) {
  try {
    await access(filePath, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function materializeStaticAssets() {
  console.log("🔍 Looking for Base64 files in:", imagesDir);
  await ensureDir(imagesDir);

  const heroBase64Sources = [
    "hero-preview.jpg",
    "hero-preview.webp",
    "hero-preview.avif",
    "hero-preview-blur.jpg",
  ];

  for (const fileName of heroBase64Sources) {
    const base64Path = path.join(imagesDir, `${fileName}.base64`);
    const targetPath = path.join(imagesDir, fileName);

    console.log(`➡️  Checking ${fileName}`);

    const base64Exists = await fileExists(base64Path);
    const targetExists = await fileExists(targetPath);

    if (!base64Exists) {
      console.log(`⚠️  Missing base64 file for ${fileName}`);
      continue;
    }

    if (targetExists) {
      console.log(`⏩ Skipping ${fileName} (already exists)`);
      continue;
    }

    const base64Content = await readFile(base64Path, "utf8");
    const buffer = Buffer.from(base64Content.replace(/\s+/g, ""), "base64");
    await writeFile(targetPath, buffer);
    console.log(`✅ Created ${fileName}`);
  }

  console.log("\n🎉 Done decoding base64 images.\n");
}

// ---- Windows-safe trigger check ----
const isDirectRun =
  import.meta.url === pathToFileURL(process.argv[1]).href ||
  import.meta.url.replace(/^file:\/\/\//, "file:///") ===
    pathToFileURL(process.argv[1]).href.replace(/^file:\/\/\//, "file:///");

if (isDirectRun) {
  materializeStaticAssets().catch((error) => {
    console.error("❌ Failed to generate static assets");
    console.error(error);
    process.exitCode = 1;
  });
} else {
  console.log("⚙️  Script imported as a module, not executed directly.");
}
