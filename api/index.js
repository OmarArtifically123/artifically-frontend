import path from "path";
import fs from "fs";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
  const clientDist = path.resolve(__dirname, "../dist/client");
  const serverDist = path.resolve(__dirname, "../dist/server");
  const templatePath = path.join(clientDist, "index.html");

  const resolveEntryServerPath = () => {
    const directCandidates = [
      path.join(serverDist, "entry-server.js"),
      path.join(serverDist, "entry-server.mjs"),
    ];

    for (const candidate of directCandidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }

    const assetsDir = path.join(serverDist, "assets");
    if (fs.existsSync(assetsDir)) {
      const entryFromAssets = fs
        .readdirSync(assetsDir)
        .find((file) => file.startsWith("entry-server") && file.endsWith(".js"));

      if (entryFromAssets) {
        return path.join(assetsDir, entryFromAssets);
      }
    }

    return null;
  };

  let template = null;
  let clientOnlyTemplate = null;

  try {
    template = fs.readFileSync(templatePath, "utf-8");
    clientOnlyTemplate = template
      .replace(
        "<!--app-html-->",
        '<div class="initial-loading"><div class="loading-spinner"></div><p>Loading Artifically...</p></div>'
      )
      .replace(
        "<!--app-fallback-->",
        '<script>window.__SSR_DISABLED__ = true;</script>'
      );

    // Load SSR entry
    const entryPath = resolveEntryServerPath();

    if (!entryPath) {
      throw new Error("SSR entry-server bundle not found");
    }

    const { render } = await import(pathToFileURL(entryPath).href);

    // Load manifest with fallbacks
    const manifestCandidates = [
      path.join(clientDist, "ssr-manifest.json"),
      path.join(clientDist, ".vite/ssr-manifest.json")
    ];
    let manifest = null;

    for (const manifestPath of manifestCandidates) {
      if (!fs.existsSync(manifestPath)) {
        continue;
      }

      try {
        manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
        break;
      } catch (manifestError) {
        console.warn("⚠️ Failed to parse manifest", manifestError);
      }
    }

    if (!manifest) {
      console.warn("⚠️ ssr-manifest.json not found. Falling back to client rendering.");
      res.statusCode = 200;
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-SSR-Fallback", "true");
      res.end(clientOnlyTemplate);
      return;
    }

    // Run SSR
    await render({ req, res, template, manifest, isProd: true });
  } catch (error) {
    console.error("❌ SSR error:", error);
    if (!res.headersSent) {
      if (clientOnlyTemplate) {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        res.setHeader("X-SSR-Fallback", "true");
        res.end(clientOnlyTemplate);
      } else {
        res.statusCode = 500;
        res.end("Internal Server Error");
      }
    }
  }
}