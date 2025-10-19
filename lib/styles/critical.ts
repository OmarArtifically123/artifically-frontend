import { readFileSync } from "node:fs";
import { join } from "node:path";

let cachedStyles: string | null = null;

export function getCriticalStyles(): string {
  if (cachedStyles) {
    return cachedStyles;
  }

  const filePath = join(process.cwd(), "styles", "critical.css");
  cachedStyles = readFileSync(filePath, "utf8");
  return cachedStyles;
}