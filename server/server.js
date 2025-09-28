// server/server.js - Re-enabling SSR with better error handling
import fs from "fs";
import path from "path";
import http from "http";
import { fileURLToPath, pathToFileURL } from "url";

const isProd = process.env.NODE_ENV === "production";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const setDefaultHeaders = (res) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
};

async function createDevServer() {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  const requestListener = async (req, res) => {
    setDefaultHeaders(res);
    const url = req.url || "/";

    if (url.startsWith("/rsc/features")) {
      try {
        const mod = await vite.ssrLoadModule("/server/entry-server.jsx");
        await mod.renderFeatureHighlightsRSC(res);
      } catch (error) {
        vite.ssrFixStacktrace(error);
        console.error("RSC dev render failed", error);
        res.statusCode = 500;
        res.end("RSC render failed");
      }
      return;
    }

    try {
      let resolved = false;
      await new Promise((resolve, reject) => {
        vite.middlewares(req, res, async () => {
          try {
            const requestUrl = req.originalUrl || req.url || "/";
            const templatePath = path.resolve(__dirname, "../index.html");
            let template = fs.readFileSync(templatePath, "utf-8");
            template = await vite.transformIndexHtml(requestUrl, template);
            
            // Re-enable SSR with fallback to client-only on error
            try {
              const { render } = await vite.ssrLoadModule("/server/entry-server.jsx");
              await render({ req, res, template, manifest: null, isProd: false });
              console.log(`✅ SSR successful for: ${requestUrl}`);
            } catch (ssrError) {
              console.warn(`⚠️ SSR failed for ${requestUrl}, falling back to client-only:`, ssrError.message);
              
              // Fallback to client-only rendering
              const clientOnlyTemplate = template
                .replace(
                  '<!--app-html-->',
                  '<div class="initial-loading"><div class="loading-spinner"></div><p>Loading Artifically...</p></div>'
                )
                .replace(
                  '<!--app-fallback-->',
                  '<script>window.__SSR_DISABLED__ = true;</script>'
                );

              res.statusCode = 200;
              res.setHeader("Content-Type", "text/html; charset=utf-8");
              res.setHeader("X-SSR-Fallback", "true");
              res.end(clientOnlyTemplate);
            }
            
            resolved = true;
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      });
      if (!resolved) {
        res.statusCode = 404;
        res.end();
      }
    } catch (error) {
      vite.ssrFixStacktrace(error);
      console.error(error);
      res.statusCode = 500;
      res.end(error.stack);
    }
  };

  const port = Number(process.env.PORT) || 4173;
  return new Promise((resolve) => {
    const server = http.createServer(requestListener);
    server.listen(port, () => {
      console.log(`🚀 Dev server (SSR enabled with fallback) listening on http://localhost:${port}`);
      resolve(server);
    });
  });
}

const serveStaticFile = (filePath, res) => {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    return false;
  }

  const stream = fs.createReadStream(filePath);
  stream.on("error", (error) => {
    console.error("Static file error", error);
    if (!res.headersSent) {
      res.statusCode = 500;
    }
    res.end();
  });
  stream.pipe(res);
  return true;
};

async function createProdServer() {
  const clientDist = path.resolve(__dirname, "../dist/client");
  const serverDist = path.resolve(__dirname, "../dist/server");
  const templatePath = path.join(clientDist, "index.html");
  const template = fs.readFileSync(templatePath, "utf-8");
  const clientOnlyTemplate = template
    .replace(
      "<!--app-html-->",
      '<div class="initial-loading"><div class="loading-spinner"></div><p>Loading Artifically...</p></div>'
    )
    .replace(
      "<!--app-fallback-->",
      '<script>window.__SSR_DISABLED__ = true;</script>'
    );

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
    } catch (error) {
      console.warn("⚠️ Unable to parse ssr-manifest.json, continuing to look for alternatives", error);
    }
  }
  if (!manifest) {
    console.warn("⚠️ ssr-manifest.json not found, falling back to client-only rendering.");
  }

  const entryUrl = pathToFileURL(path.join(serverDist, "entry-server.js")).href;
  let render = null;
  let renderFeatureHighlightsRSC = null;
  try {
    ({ render, renderFeatureHighlightsRSC } = await import(entryUrl));
  } catch (error) {
    console.error("⚠️ Failed to load SSR entry module, falling back to client-only", error);
  }

  const sendClientOnly = (res) => {
    if (res.headersSent) {
      return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("X-SSR-Fallback", "true");
    res.end(clientOnlyTemplate);
  };

  const requestListener = async (req, res) => {
    setDefaultHeaders(res);
    const url = (req.url || "/").split("?")[0];
    if (url.startsWith("/rsc/features")) {
      if (renderFeatureHighlightsRSC) {
        try {
          await renderFeatureHighlightsRSC(res);
        } catch (error) {
          console.error("RSC prod render failed", error);
          res.statusCode = 500;
          res.end("RSC render failed");
        }
      } else {
        console.warn("RSC renderer unavailable, returning empty response");
        res.statusCode = 204;
        res.end();
      }
      return;
    }
    const filePath = path.join(clientDist, url === "/" ? "index.html" : url);

    if (url !== "/" && serveStaticFile(filePath, res)) {
      return;
    }

    if (!render || !manifest) {
      sendClientOnly(res);
      return;
    }

    try {
      await render({ req, res, template, manifest, isProd: true });
    } catch (error) {
      console.error("SSR render failed in production, falling back to client-only", error);
      sendClientOnly(res);
    }
  };

  const port = Number(process.env.PORT) || 4173;
  return new Promise((resolve) => {
    const server = http.createServer(requestListener);
    server.listen(port, () => {
      console.log(`SSR server listening on http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function createServer() {
  if (!isProd) {
    return createDevServer();
  }
  return createProdServer();
}

if (process.env.NODE_ENV !== "test") {
  createServer();
}

export default createServer;