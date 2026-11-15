"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/** Kaydırırken içindeki görseli hafifçe kaydıran (parallax) çerçeve. */
export default function ParallaxImage({
  children,
  className = "",
  amount = 40,
}: {
  children: React.ReactNode;
  className?: string;
  amount?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);
  return (
    <div ref={ref} className={`relative overflow-hidden bg-mist ${className}`}>
      <m.div style={{ y, scale: 1.15 }} className="absolute inset-0">
        {children}
      </m.div>
    </div>
  );
}
