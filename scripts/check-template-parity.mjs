/**
 * Pemeriksa paritas visual antar template katalog.
 *
 * Cara kerja:
 *   1. (opsional) build produksi
 *   2. jalankan `next start` di port bebas
 *   3. untuk setiap template, ambil `/parity-check?template=<id>`
 *   4. normalisasi HTML (buang tag <script> yang berisi hash chunk &
 *      build id, sisanya dibiarkan persis)
 *   5. bandingkan dengan snapshot di `scripts/parity-snapshots/<id>.html`
 *
 * Kegunaan: memastikan migrasi ke `InvitationLayout` (Fase F4/F5) tidak
 * mengubah satu pixel pun pada template yang sudah dimigrasi.
 *
 * Pemakaian:
 *   node scripts/check-template-parity.mjs            # cek semua template
 *   node scripts/check-template-parity.mjs --update   # tulis ulang snapshot
 *   node scripts/check-template-parity.mjs aruna      # cek satu template
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SNAPSHOT_DIR = join("scripts", "parity-snapshots");
const UPDATE = process.argv.includes("--update");
const only = process.argv
  .slice(2)
  .filter((a) => !a.startsWith("--"));

const TEMPLATE_IDS = [
  "aruna",
  "mahardika",
  "puspaningrat",
  "azzahra",
  "seruni",
  "elan",
  "kala",
  "senja",
  "verdant",
  "terra",
  "heritage",
  "celestial",
  "parisian",
  "blossom",
  "balinese",
  "mono",
  "arabesque",
  "retro",
];

const PORT = 3987 + (process.pid % 200);
const BASE = `http://127.0.0.1:${PORT}`;

/** Buang bagian yang memang berubah tiap build (hash chunk & build id). */
function normalize(html) {
  const body = html.slice(html.indexOf("<body"), html.indexOf("</body>") + 7);
  return body.replace(/<script[\s\S]*?<\/script>/g, "").trim();
}

async function waitForServer(url, timeoutMs = 60000, headers = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { redirect: "manual", headers });
      if (res.status > 0) return true;
    } catch {
      /* server belum siap */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

function startServer() {
  // Panggil CLI Next.js secara langsung lewat node — `npx` tidak bisa
  // di-spawn di Windows tanpa ekstensi `.cmd`.
  const nextBin = join("node_modules", "next", "dist", "bin", "next");
  const child = spawn(process.execPath, [nextBin, "start", "--port", String(PORT)], {
    stdio: "ignore",
    detached: false,
  });
  return child;
}

async function main() {
  if (!existsSync(".next")) {
    console.error("Folder .next belum ada — jalankan `npm run build` dulu.");
    process.exit(1);
  }
  if (!existsSync(SNAPSHOT_DIR)) mkdirSync(SNAPSHOT_DIR, { recursive: true });

  const server = startServer();
  const cleanup = () => {
    try {
      server.kill("SIGTERM");
    } catch {
      /* sudah mati */
    }
  };
  process.on("exit", cleanup);

  const ready = await waitForServer(`${BASE}/parity-check?template=aruna`, 60000, {
    "x-parity-check": "1",
  });
  if (!ready) {
    console.error("Server tidak siap dalam batas waktu.");
    cleanup();
    process.exit(1);
  }

  const ids = only.length > 0 ? only : TEMPLATE_IDS;
  let failed = 0;

  for (const id of ids) {
    const res = await fetch(`${BASE}/parity-check?template=${id}`, {
      headers: { "x-parity-check": "1" },
    });
    if (!res.ok) {
      console.error(`FAIL  ${id.padEnd(14)} HTTP ${res.status}`);
      failed += 1;
      continue;
    }
    const dom = normalize(await res.text());
    const file = join(SNAPSHOT_DIR, `${id}.html`);

    if (UPDATE) {
      writeFileSync(file, dom);
      console.log(`UPD   ${id.padEnd(14)} snapshot ditulis (${dom.length} byte)`);
      continue;
    }

    if (!existsSync(file)) {
      console.log(`SKIP  ${id.padEnd(14)} belum ada snapshot (jalankan --update)`);
      continue;
    }
    const expected = readFileSync(file, "utf8");
    if (expected === dom) {
      console.log(`OK    ${id.padEnd(14)} identik dengan snapshot`);
    } else {
      console.error(`FAIL  ${id.padEnd(14)} BERUBAH vs snapshot`);
      const a = expected.split("\n");
      const b = dom.split("\n");
      let shown = 0;
      for (let i = 0; i < Math.max(a.length, b.length) && shown < 8; i++) {
        if (a[i] !== b[i]) {
          console.error(`        - ${(a[i] ?? "(tak ada)").slice(0, 150)}`);
          console.error(`        + ${(b[i] ?? "(tak ada)").slice(0, 150)}`);
          shown += 1;
        }
      }
      failed += 1;
    }
  }

  cleanup();
  process.exit(failed > 0 ? 1 : 0);
}

main();
