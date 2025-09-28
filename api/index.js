import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default async function handler(req, res) {
  try {
    const clientDist = path.resolve(__dirname, "../dist/client");
    const serverDist = path.resolve(__dirname, "../dist/server");

    const templatePath = path.join(clientDist, "index.html");
    const template = fs.readFileSync(templatePath, "utf-8");

    const { render } = await import(path.join(serverDist, "entry-server.js"));
    const manifest = JSON.parse(
      fs.readFileSync(path.join(clientDist, "ssr-manifest.json"), "utf-8")
    );

    await render({ req, res, template, manifest, isProd: true });
  } catch (error) {
    console.error("SSR error:", error);
    res.status(500).end("Internal Server Error");
  }
}
