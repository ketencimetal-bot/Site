"use client";

import { m } from "framer-motion";
import { useEffect } from "react";

// İlk açılışta animasyon yok (içerik HTML ile hemen görünsün, hız için);
// yalnızca site içi sayfa geçişlerinde içerik yumuşakça belirir.
let firstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const animateIn = !firstLoad;
  useEffect(() => {
    firstLoad = false;
  }, []);

  return (
    <m.div
      initial={animateIn ? { opacity: 0, y: 18 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </m.div>
  );
}
