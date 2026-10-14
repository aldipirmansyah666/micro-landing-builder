/**
 * Patches @opennextjs/cloudflare's `load-manifest` build plugin so that
 * Next.js 16.4's standalone `.next/server/preview-props.json` is inlined
 * into the Worker bundle instead of throwing at runtime:
 *
 *   Error: Unexpected loadManifest(/.next/server/preview-props.json) call!
 *
 * Root cause (upstream: opennextjs/opennextjs-cloudflare#1355, fix PR #1356):
 * - Next 16.4 moved preview props out of `prerender-manifest.json` into a
 *   standalone `preview-props.json` (PREVIEW_PROPS_MANIFEST).
 * - `NextNodeServer.getPreviewProps()` loads it UNCONDITIONALLY via
 *   `loadManifestFromRelativePath({ manifest: "server/preview-props.json" })`
 *   (no `handleMissing: true`), so it must be inlined — a `{}` fallback
 *   would drop the real draft-mode keys.
 * - The adapter's glob only matches `** /{*-manifest,required-server-files,
 *   prefetch-hints}.json`, and `preview-props.json` does not end in
 *   `-manifest.json`, so it is never inlined and the patched `loadManifest()`
 *   throws `Unexpected loadManifest(...) call!` on every dynamic route.
 *
 * Fix (mirrors upstream PR #1356, same pattern as #1160 for prefetch-hints):
 * - Expand the glob to `** /{*-manifest,required-server-files,
 *   prefetch-hints,preview-props}.json` in:
 *   `node_modules/@opennextjs/cloudflare/dist/cli/build/patches/plugins/load-manifest.js`
 *
 * This script is idempotent and runs via `postinstall` plus before every
 * `opennextjs-cloudflare build` (preview/deploy/upload), so CI and fresh
 * clones get the fix automatically until the upstream release includes it.
 * Safe to remove once `@opennextjs/cloudflare` ships the upstream fix.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, "..");

const target = join(
  projectRoot,
  "node_modules",
  "@opennextjs",
  "cloudflare",
  "dist",
  "cli",
  "build",
  "patches",
  "plugins",
  "load-manifest.js",
);

const OLD_GLOB = "**/{*-manifest,required-server-files,prefetch-hints}.json";
const NEW_GLOB =
  "**/{*-manifest,required-server-files,prefetch-hints,preview-props}.json";

function main() {
  if (!existsSync(target)) {
    console.warn(
      `[patch-opennext] skip: ${target} not found (deps not installed yet?)`,
    );
    return;
  }
  const src = readFileSync(target, "utf-8");
  if (src.includes(NEW_GLOB)) {
    console.log("[patch-opennext] already patched: preview-props in glob.");
    return;
  }
  if (!src.includes(OLD_GLOB)) {
    console.warn(
      "[patch-opennext] WARNING: expected glob pattern not found — upstream may have changed. " +
        "Verify manually: https://github.com/opennextjs/opennextjs-cloudflare/pull/1356",
    );
    process.exitCode = 1;
    return;
  }
  writeFileSync(target, src.replaceAll(OLD_GLOB, NEW_GLOB), "utf-8");
  console.log(
    `[patch-opennext] patched load-manifest glob to include preview-props:\n  ${OLD_GLOB}\n  -> ${NEW_GLOB}`,
  );
}

main();
