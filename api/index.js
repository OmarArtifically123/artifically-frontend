import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
  try {
    const clientDist = path.resolve(__dirname, "../dist/client");
    const serverDist = path.resolve(__dirname, "../dist/server");

    // Load index.html
    const templatePath = path.join(clientDist, "index.html");
    const template = fs.readFileSync(templatePath, "utf-8");

    // Load SSR entry
    const { render } = await import(path.join(serverDist, "entry-server.js"));

    // Load manifest
    const manifestPath = path.join(clientDist, "ssr-manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));

    // Run SSR
    await render({ req, res, template, manifest, isProd: true });
  } catch (error) {
    console.error("❌ SSR error:", error);
    res.statusCode = 500;
    res.end("Internal Server Error");
  }
}
