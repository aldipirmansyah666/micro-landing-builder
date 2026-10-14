// default open-next.config.ts file created by @opennextjs/cloudflare
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
// import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// NOTE (fix: resolve OpenNext manifest preview-props error):
// Next.js 16.4 emits a standalone `.next/server/preview-props.json` that
// `NextNodeServer.getPreviewProps()` loads unconditionally at runtime.
// @opennextjs/cloudflare <= 1.20.11 inlines manifests via the glob
// `**/{*-manifest,required-server-files,prefetch-hints}.json`, which misses
// `preview-props.json` (it doesn't end in `-manifest`), so the Worker throws
// `Unexpected loadManifest(/.next/server/preview-props.json) call!` on every
// dynamic route. Upstream fix: opennextjs/opennextjs-cloudflare#1356.
// Until that ships, `scripts/patch-opennext-load-manifest.mjs` (run via
// `postinstall` and before each `opennextjs-cloudflare build`) expands the
// glob to also include `preview-props`, so the real draft-mode keys are
// inlined. Do NOT "fix" this by returning `{}` — the manifest is required.
// Safe to remove the patch script once the adapter release includes #1356.
export default defineCloudflareConfig({
	// For best results consider enabling R2 caching
	// See https://opennext.js.org/cloudflare/caching for more details
	// incrementalCache: r2IncrementalCache
});
