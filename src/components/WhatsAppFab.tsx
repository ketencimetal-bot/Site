"use client";

import { AnimatePresence, m } from "framer-motion";
import { Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { WhatsAppIcon } from "./ui/BrandIcons";
import { site } from "@/data/site";
import { whatsappLink } from "@/lib/forms";

/** Sağ altta sabit "WhatsApp ile hızlı teklif" düğmesi (mobilde arama düğmesiyle birlikte) */
export default function WhatsAppFab() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.6);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <m.div
          className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 flex gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href={`tel:${site.phoneE164}`}
            className="flex min-h-14 flex-1 items-center justify-center gap-2 rounded-full bg-ink px-5 font-semibold text-white shadow-xl ring-1 ring-white/10 sm:hidden"
          >
            <Phone className="size-5" aria-hidden /> Ara
          </a>
          <a
            href={whatsappLink("Merhaba, hızlı teklif almak istiyorum.")}
            target="_blank"
            rel="noopener"
            className="group flex min-h-14 flex-[1.4] items-center justify-center gap-2.5 rounded-full bg-[#1f9e55] px-6 font-semibold text-white shadow-[0_15px_40px_-10px_rgb(31_158_85/0.7)] transition hover:bg-[#178246] sm:flex-none"
          >
            <WhatsAppIcon className="size-6" />
            <span>
              <span className="sm:hidden">WhatsApp teklif</span>
              <span className="hidden sm:inline">WhatsApp ile hızlı teklif</span>
            </span>
          </a>
        </m.div>
      )}
    </AnimatePresence>
  );
}
