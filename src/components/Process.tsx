"use client";

import { m, useScroll, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionHeading from "./ui/SectionHeading";
import { processSteps } from "@/data/content";

export default function Process() {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // Ekranın ortasından geçen adım aktif olur
  useEffect(() => {
    const items = listRef.current?.querySelectorAll<HTMLElement>("[data-step]");
    if (!items) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.step))),
      { rootMargin: "-48% 0px -48% 0px" },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="surec" aria-labelledby="surec-baslik" className="section-y bg-paper">
      <div className="container-x">
        <SectionHeading
          id="surec-baslik"
          index="03"
          eyebrow="Üretim sürecimiz"
          title={
            <>
              Fikirden
              <br />
              montaja 8 adım
            </>
          }
          lead="Her işte aynı disiplinle ilerliyoruz."
        />

        <ol ref={listRef} className="relative mx-auto mt-16 max-w-3xl lg:mt-20">
          <span className="absolute bottom-3 left-[1.375rem] top-3 w-px bg-ink/12" aria-hidden />
          <m.span style={{ scaleY: fill }} className="absolute bottom-3 left-[1.375rem] top-3 w-px origin-top bg-copper" aria-hidden />
          {processSteps.map((s, i) => {
            const on = i <= active;
            return (
              <m.li
                key={s.title}
                data-step={i}
                className="relative grid grid-cols-[2.75rem_1fr] gap-5 pb-10 last:pb-0 sm:gap-8"
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <span
                  className={`relative z-10 grid size-11 place-items-center rounded-full font-mono text-sm transition-all duration-500 ${
                    on ? "bg-copper text-white shadow-[0_0_0_6px_rgb(181_88_31/0.15)]" : "bg-white text-steel-ink ring-1 ring-ink/15"
                  }`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pt-1.5">
                  <h3 className={`font-display text-[1.9rem] transition-colors duration-500 sm:text-[2.3rem] ${on ? "text-ink" : "text-steel"}`}>{s.title}</h3>
                  <p className="mt-2 max-w-lg leading-relaxed text-steel-ink">{s.text}</p>
                </div>
              </m.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
