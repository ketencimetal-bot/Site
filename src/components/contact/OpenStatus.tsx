"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

/** İstanbul saatine göre "Şu an açığız / kapalıyız" göstergesi */
export default function OpenStatus({ tone = "light" }: { tone?: "light" | "dark" }) {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      try {
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: "Europe/Istanbul",
          weekday: "short",
          hour: "numeric",
          minute: "numeric",
          hourCycle: "h23",
        }).formatToParts(new Date());
        const g: Record<string, string> = {};
        parts.forEach((p) => (g[p.type] = p.value));
        const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g.weekday);
        const now = Number(g.hour) * 60 + Number(g.minute);
        const [oh, om] = site.hours.open.split(":").map(Number);
        const [ch, cm] = site.hours.close.split(":").map(Number);
        setOpen((site.hours.days as readonly number[]).includes(day) && now >= oh * 60 + om && now < ch * 60 + cm);
      } catch {
        setOpen(null);
      }
    };
    check();
    const t = setInterval(check, 60_000);
    return () => clearInterval(t);
  }, []);

  if (open === null) return null;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-wider ring-1 ring-inset ${
        tone === "dark" ? "ring-white/15 text-white/80" : "ring-ink/12 text-ink"
      }`}
    >
      <span className="relative flex size-2">
        {open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-60" />}
        <span className={`relative inline-flex size-2 rounded-full ${open ? "bg-emerald-500" : "bg-steel"}`} />
      </span>
      {open ? "Şu an açığız" : "Şu an kapalıyız"}
    </span>
  );
}
