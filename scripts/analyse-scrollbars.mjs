import next from "next";
import { createServer } from "http";
import { chromium } from "playwright";
import { rm } from "fs/promises";
import path from "path";

const PORT = 3419;
const HOST = "127.0.0.1";

async function main() {
  const distDir = ".next-analyse-temp";
  const app = next({
    dev: true,
    dir: process.cwd(),
    conf: {
      distDir,
    },
  });
  await app.prepare();

  const handle = app.getRequestHandler();
  const server = createServer((req, res) => {
    handle(req, res).catch((error) => {
      console.error("Request handler error", error);
      res.statusCode = 500;
      res.end("Internal error");
    });
  });

  await new Promise((resolve) => server.listen(PORT, HOST, resolve));

  const browser = await chromium.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.goto(`http://${HOST}:${PORT}/`, { waitUntil: "networkidle" });

  const scrollables = await page.evaluate(() => {
    const entries = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
    while (walker.nextNode()) {
      const el = walker.currentNode;
      if (!(el instanceof HTMLElement)) {
        continue;
      }
      const style = window.getComputedStyle(el);
      const overflowY = style.overflowY;
      const overflow = style.overflow;
      const isScrollable =
        (overflowY === "auto" || overflowY === "scroll" || overflow === "auto" || overflow === "scroll") &&
        el.scrollHeight > el.clientHeight + 2 &&
        el.clientHeight >= window.innerHeight * 0.4;
      if (isScrollable) {
        entries.push({
          tag: el.tagName.toLowerCase(),
          classList: [...el.classList],
          id: el.id,
          clientHeight: el.clientHeight,
          scrollHeight: el.scrollHeight,
          overflowY,
          overflow,
        });
      }
    }
    const rootScrollable = {
      tag: "html",
      classList: [],
      id: "",
      clientHeight: document.documentElement.clientHeight,
      scrollHeight: document.documentElement.scrollHeight,
      overflowY: window.getComputedStyle(document.documentElement).overflowY,
      overflow: window.getComputedStyle(document.documentElement).overflow,
    };
    return { rootScrollable, entries };
  });

  console.log(JSON.stringify(scrollables, null, 2));

  await browser.close();
  await new Promise((resolve, reject) => {
    server.close((err) => (err ? reject(err) : resolve()));
  });
  if (typeof app.close === "function") {
    await app.close();
  }
  await rm(path.join(process.cwd(), distDir), { recursive: true, force: true });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
