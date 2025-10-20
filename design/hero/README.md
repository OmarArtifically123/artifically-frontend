# Hero Artwork Source

This directory stores the scalable source artwork for the hero imagery that powers the responsive JPEG derivatives used across the marketing site.

## Exporting JPEG Derivatives

The repository already includes the required tooling to convert the SVG source into the three responsive JPEG renditions expected by the application (`hero-desktop.jpg`, `hero-tablet.jpg`, and `hero-mobile.jpg`).

1. Ensure dependencies are installed:
   ```bash
   npm install
   ```
2. From the project root, run the export script:
   ```bash
   npm run assets:hero
   ```

The script pipes the SVG through the `sharp` CLI and writes the resized JPEGs into `public/images/` with the correct filenames and progressive encoding settings. Re-run the command whenever `hero-source.svg` changes.

> **Windows note:** the exporter invokes the locally installed `sharp-cli` via Node, so no `npx` shim is required. You still need to run the command from a shell where `node` is available.

## Editing the Source

- `hero-source.svg` is authored at 2400×1350 so it can downscale cleanly to all target widths.
- Keep gradients and glow effects vector-based to maintain crisp exports.
- When introducing photographic elements, consider embedding linked images via data URIs so the automated export pipeline remains self-contained.