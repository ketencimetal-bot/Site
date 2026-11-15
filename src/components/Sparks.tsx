"use client";

import { useEffect, useRef } from "react";

/**
 * Kaynak efekti (canvas).
 * - İmlecin ucunda küçük bir kaynak arkı ve üstünde kısa kıvılcımlar.
 * - Arkasında kısa bir dikiş kalır: beyaz → sarı → turuncu → kırmızı → gri soğur ve hızla kaybolur.
 *   Fare ne kadar hızlı çekilirse çekilsin iz en fazla TRAIL piksel uzar.
 * Dokunmatik cihazlarda / fare yokken görseldeki noktada kendiliğinden kısa dikişler atılır.
 * Hero ekranda değilken ve "hareketi azalt" açıkken çalışmaz.
 */

const STOPS: [number, [number, number, number]][] = [
  [0, [255, 252, 235]],
  [80, [255, 220, 130]],
  [260, [255, 130, 42]],
  [560, [196, 52, 18]],
  [900, [92, 90, 88]],
];
const LIFE = 1300; // ms — dikiş bu sürede tamamen kaybolur
const TRAIL = 100; // px — görünen en uzun iz

function colorAt(age: number): [number, number, number] {
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i];
    const [t0, c0] = STOPS[i - 1];
    if (age <= t1) {
      const k = (age - t0) / (t1 - t0);
      return [c0[0] + (c1[0] - c0[0]) * k, c0[1] + (c1[1] - c0[1]) * k, c0[2] + (c1[2] - c0[2]) * k];
    }
  }
  return STOPS[STOPS.length - 1][1];
}

export default function Sparks({ anchor = { x: 0.8, y: 0.62 } }: { anchor?: { x: number; y: number } }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const host = cv.parentElement as HTMLElement;
    type Bead = { x: number; y: number; t: number; d: number; r: number };
    type Spark = { x: number; y: number; px: number; py: number; vx: number; vy: number; l: number; dl: number };
    const beads: Bead[] = [];
    const sparks: Spark[] = [];
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let W = 0, H = 0, raf = 0, visible = true;
    let mouse: { x: number; y: number } | null = null;
    let lastMove = 0;
    const tip = { x: 0, y: 0 };
    let last: { x: number; y: number } | null = null;
    let dist = 0;

    const size = () => {
      const r = host.getBoundingClientRect();
      W = r.width; H = r.height;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const weldTo = (x: number, y: number, now: number) => {
      if (!last) { last = { x, y }; return; }
      const dx = x - last.x, dy = y - last.y;
      const d = Math.hypot(dx, dy);
      const step = 1.6;
      const n = Math.floor(d / step);
      for (let i = 1; i <= n; i++) {
        dist += step;
        beads.push({ x: last.x + (dx * i) / n, y: last.y + (dy * i) / n, t: now, d: dist, r: 1.7 + Math.sin(dist * 0.7) * 0.45 });
      }
      if (n > 0) last = { x, y };
    };

    const spawnSparks = (x: number, y: number, n: number, s = 1) => {
      for (let i = 0; i < n; i++) {
        if (sparks.length > 90) sparks.shift();
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
        const sp = s * (0.8 + Math.random() * 2.8);
        sparks.push({ x, y, px: x, py: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.6, l: 1, dl: 0.03 + Math.random() * 0.035 });
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const r = host.getBoundingClientRect();
      mouse = { x: e.clientX - r.left, y: e.clientY - r.top };
      lastMove = performance.now();
    };
    const onLeave = () => { mouse = null; last = null; };
    const onDown = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      spawnSparks(e.clientX - r.left, e.clientY - r.top, 20, 1.2);
    };

    // Otomatik kısa dikiş (fare yokken)
    const CYCLE = 3600, RUN = 1500;
    const autoTip = (t: number) => {
      const k = (t % CYCLE) / RUN;
      if (k > 1) return null;
      const len = Math.min(W * 0.08, 90);
      return { x: W * anchor.x - len / 2 + len * k, y: H * anchor.y + Math.sin(k * 30) * 1 };
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;

      // Aktif uç: fare hareket ediyorsa fare; fare sahnede değilse otomatik dikiş
      let target: { x: number; y: number } | null = null;
      if (mouse && now - lastMove < 120) target = mouse;
      else if (!mouse) target = autoTip(now);

      if (target) {
        if (!last) { tip.x = target.x; tip.y = target.y; }
        tip.x += (target.x - tip.x) * 0.45;
        tip.y += (target.y - tip.y) * 0.45;
        weldTo(tip.x, tip.y, now);
        if (Math.random() < 0.55) spawnSparks(tip.x, tip.y, Math.random() < 0.6 ? 1 : 2);
      } else {
        last = null;
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, W, H);

      // Dikiş (kısa iz, hızlı soğuma)
      let cut = 0;
      for (let i = 0; i < beads.length; i++) {
        const b = beads[i];
        const age = now - b.t;
        const behind = dist - b.d;
        if (age > LIFE || behind > TRAIL) { cut = i + 1; continue; }
        const tail = behind > TRAIL - 18 ? 1 - (behind - (TRAIL - 18)) / 18 : 1;
        const fade = (age < 900 ? 1 : 1 - (age - 900) / (LIFE - 900)) * tail;
        const [r, g, bl] = colorAt(age);
        ctx.globalCompositeOperation = age < 560 ? "lighter" : "source-over";
        ctx.fillStyle = `rgba(${r | 0},${g | 0},${bl | 0},${0.95 * fade})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, 6.283);
        ctx.fill();
      }
      if (cut) beads.splice(0, cut);

      ctx.globalCompositeOperation = "lighter";

      // Kıvılcımlar (uçtan yukarı, küçük alanda)
      ctx.lineCap = "round";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        p.px = p.x; p.py = p.y;
        p.vy += 0.16; p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy; p.l -= p.dl;
        if (p.l <= 0) { sparks.splice(i, 1); continue; }
        const L = p.l;
        ctx.strokeStyle = `rgba(255,${Math.round(120 + 135 * L)},${Math.round(40 + 190 * L * L)},${Math.min(1, L * 1.4)})`;
        ctx.lineWidth = 0.5 + L * 1.1;
        ctx.beginPath(); ctx.moveTo(p.px - p.vx, p.py - p.vy); ctx.lineTo(p.x, p.y); ctx.stroke();
      }

      // Kaynak arkı
      if (target) {
        const R = 16 * (0.75 + Math.random() * 0.25);
        const g = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, R);
        g.addColorStop(0, "rgba(255,255,255,0.95)");
        g.addColorStop(0.2, "rgba(210,228,255,0.6)");
        g.addColorStop(0.55, "rgba(255,150,60,0.16)");
        g.addColorStop(1, "rgba(255,120,40,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(tip.x, tip.y, R, 0, 6.283); ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    size();
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(host);
    const ro = new ResizeObserver(size);
    ro.observe(host);
    host.addEventListener("pointermove", onMove, { passive: true });
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf); io.disconnect(); ro.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, [anchor.x, anchor.y]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-[2] size-full" />;
}
