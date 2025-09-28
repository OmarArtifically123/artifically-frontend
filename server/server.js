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
              const clientOnlyTemplate = template.replace(
                '<!--app-html-->',
                '<div id="root"><div class="initial-loading"><div class="loading-spinner"></div><p>Loading Artifically...</p></div></div>'
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
  const template = fs.readFileSync(path.join(clientDist, "index.html"), "utf-8");
  const manifest = JSON.parse(
    fs.readFileSync(path.join(clientDist, "ssr-manifest.json"), "utf-8")
  );

  const entryUrl = pathToFileURL(path.join(serverDist, "entry-server.js")).href;
  const { render, renderFeatureHighlightsRSC } = await import(entryUrl);

  const requestListener = async (req, res) => {
    setDefaultHeaders(res);
    const url = (req.url || "/").split("?")[0];
    if (url.startsWith("/rsc/features")) {
      try {
        await renderFeatureHighlightsRSC(res);
      } catch (error) {
        console.error("RSC prod render failed", error);
        res.statusCode = 500;
        res.end("RSC render failed");
      }
      return;
    }
    const filePath = path.join(clientDist, url === "/" ? "index.html" : url);

    if (url !== "/" && serveStaticFile(filePath, res)) {
      return;
    }

    try {
      await render({ req, res, template, manifest, isProd: true });
    } catch (error) {
      console.error(error);
      res.statusCode = 500;
      res.end(error.stack);
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