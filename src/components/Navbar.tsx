"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { Menu, Phone, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { nav, site } from "@/data/site";
import { btn } from "./ui/styles";
import { InstagramIcon, WhatsAppIcon } from "./ui/BrandIcons";

export default function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // Kaydırma: arka plan, aşağı kaydırınca gizlen / yukarıda göster
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      setHidden(y > last && y > 500);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Aktif bölüm vurgusu
  useEffect(() => {
    if (!isHome) return;
    const ids = nav.map((n) => n.href.split("#")[1]);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [isHome]);

  // Mobil menü: kaydırmayı kilitle, Escape ile kapat
  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Sayfa değişince menüyü kapat (render sırasında durum düzeltmesi)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const solid = scrolled || !isHome || open;
  const light = !solid; // hero üzerinde beyaz metin
  const big = light; // sayfanın en üstünde, hero üzerindeyken büyük logo

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-500 ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${solid ? "bg-white/90 shadow-[0_1px_0_rgb(17_19_21/0.08)] backdrop-blur-xl" : "bg-transparent"}`}
      >
        <div
          className={`container-x flex items-center justify-between gap-6 transition-[height] duration-500 ${
            big ? "h-[84px] sm:h-[104px]" : "h-[72px]"
          }`}
        >
          <Link href="/" className="flex shrink-0 items-center gap-3 sm:gap-4" aria-label="Ketenci Metal ana sayfa">
            <img
              src={light ? "/img/mark.webp" : "/img/mark-dark.webp"}
              alt=""
              width={300}
              height={146}
              className={`h-auto transition-[width] duration-500 ${big ? "w-14 sm:w-20" : "w-11"}`}
            />
            <span className={`leading-none ${light ? "text-white" : "text-ink"}`}>
              <span
                className={`font-display block tracking-wide transition-[font-size] duration-500 ${
                  big ? "text-[1.6rem] sm:text-[2.15rem]" : "text-[1.35rem]"
                }`}
              >
                Ketenci Metal
              </span>
              <span
                className={`mt-1.5 block font-semibold uppercase tracking-[0.12em] transition-[font-size] duration-500 ${
                  big ? "text-[0.66rem] sm:text-[0.78rem]" : "text-[0.6rem]"
                } ${light ? "text-white/80" : "text-steel-ink"}`}
              >
                İnşaat San. Tic. Ltd. Şti.
              </span>
            </span>
          </Link>

          <nav aria-label="Ana menü" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {nav.map((n) => {
                const id = n.href.split("#")[1];
                const on = active === id;
                return (
                  <li key={n.href}>
                    <Link
                      href={n.href}
                      prefetch={false}
                      className={`relative py-2 text-[0.92rem] font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-copper after:transition-transform after:duration-500 ${
                        on ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
                      } ${light ? "text-white/85 hover:text-white" : "text-ink/75 hover:text-ink"} ${on && !light ? "text-ink" : ""}`}
                    >
                      {n.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${site.phoneE164}`}
              className={`hidden min-h-12 items-center gap-2 rounded-full px-4 text-sm font-semibold transition sm:inline-flex ${
                light ? "text-white hover:bg-white/10" : "text-ink hover:bg-mist"
              }`}
            >
              <Phone className="size-4" aria-hidden />
              <span className="tabular-nums">{site.phoneDisplay}</span>
            </a>
            <span className="hidden sm:block">
              <Link prefetch={false} href="/#teklif" className={`${btn.copper} !min-h-11 !px-5`}>
                Teklif Al
              </Link>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobil-menu"
              aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
              className={`grid size-12 place-items-center rounded-full ring-1 ring-inset transition lg:hidden ${
                light ? "text-white ring-white/30" : "text-ink ring-ink/15"
              }`}
            >
              {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobil-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink pt-[72px] text-white lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <nav aria-label="Mobil menü" className="container-x flex flex-1 flex-col overflow-y-auto py-6">
              <ul>
                {nav.map((n, i) => (
                  <m.li
                    key={n.href}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="border-b border-white/10"
                  >
                    <Link
                      href={n.href}
                      prefetch={false}
                      onClick={() => setOpen(false)}
                      className="font-display flex items-center justify-between py-4 text-[2.6rem]"
                    >
                      {n.label}
                      <span className="font-mono text-xs text-steel-light">0{i + 1}</span>
                    </Link>
                  </m.li>
                ))}
              </ul>
              <div className="mt-auto grid gap-3 pt-8">
                <Link prefetch={false} href="/#teklif" onClick={() => setOpen(false)} className={btn.copper}>
                  Teklif Al <ArrowRight className="size-4" aria-hidden />
                </Link>
                <div className="grid grid-cols-2 gap-3">
                  <a href={`tel:${site.phoneE164}`} className={btn.ghostLight}>
                    <Phone className="size-4" aria-hidden /> Ara
                  </a>
                  <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener" className={btn.whatsapp}>
                    <WhatsAppIcon className="size-4" /> WhatsApp
                  </a>
                </div>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener"
                  className="flex min-h-12 items-center justify-center gap-2 text-sm text-steel-light"
                >
                  <InstagramIcon className="size-4" /> {site.instagram.handle}
                </a>
              </div>
            </nav>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
