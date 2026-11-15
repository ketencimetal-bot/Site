/**
 * Derleme sonrası düzeltme (npm run build ile otomatik çalışır).
 *
 * Next.js 16 statik çıktısı, sayfa ön yükleme (prefetch) dosyalarını iç içe klasörlere yazıyor:
 *   out/hizmetler/ferforje/__next.hizmetler/$d$slug/__PAGE__.txt
 * Tarayıcı ise aynı dosyayı düz adla istiyor:
 *   out/hizmetler/ferforje/__next.hizmetler.$d$slug.__PAGE__.txt
 * Bu betik her iç içe dosyanın düz adlı bir kopyasını oluşturur; böylece sayfalar arası
 * geçişler 404 almadan, sayfa yeniden yüklenmeden çalışır.
 */
import { readdirSync, statSync, copyFileSync, existsSync } from "node:fs";
import { join, relative, sep } from "node:path";

const OUT = new URL("../out/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
let copied = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory()) continue;
    if (name.startsWith("__next.")) flatten(dir, p);
    else walk(p);
  }
}

function flatten(base, segDir) {
  const files = [];
  const collect = (d) => {
    for (const n of readdirSync(d)) {
      const p = join(d, n);
      statSync(p).isDirectory() ? collect(p) : files.push(p);
    }
  };
  collect(segDir);
  for (const f of files) {
    const flat = relative(base, f).split(sep).join(".");
    const target = join(base, flat);
    if (!existsSync(target)) {
      copyFileSync(f, target);
      copied++;
    }
  }
}

if (existsSync(OUT)) {
  walk(OUT);
  console.log(`flatten-segments: ${copied} prefetch dosyası düzleştirildi.`);
}
