"use client";

import { m, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import Sparks from "./Sparks";
import { btn, arrowMove } from "./ui/styles";
import { site } from "@/data/site";

const lines = ["Metal işlemede", "güç,", "tasarımda", "mükemmellik."];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-baslik"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink text-white"
    >
      {/* Arka plan görseli: sinematik yakınlaşma + parallax */}
      <m.div style={{ y: imgY }} className="absolute inset-0 -z-10">
        <img
          src="/img/konstruksiyon-xl.webp"
          srcSet="/img/konstruksiyon-s.webp 640w, /img/konstruksiyon.webp 1280w, /img/konstruksiyon-xl.webp 1400w"
          sizes="100vw"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="animate-kenburns size-full object-cover object-[70%_50%] saturate-[0.85]"
        />
      </m.div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(17_19_21/0.94)_0%,rgb(17_19_21/0.78)_42%,rgb(17_19_21/0.25)_75%,rgb(17_19_21/0.35)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      {/* Telefonda yazı görselin tamamına yayıldığı için daha koyu zemin: okunabilirlik */}
      <div className="absolute inset-0 -z-10 bg-ink/45 lg:hidden" />
      <Sparks anchor={{ x: 0.8, y: 0.66 }} />

      <div className="container-x relative z-[3] flex flex-1 flex-col justify-center pb-16 pt-32 sm:pt-40">
        <p className="eyebrow fade-up flex items-center gap-3 text-white/75" style={{ animationDelay: "0.1s" }}>
          <span className="h-px w-10 bg-copper-hot" aria-hidden />
          {site.foundedYear}&apos;den beri · {site.address.district} / {site.address.city}
        </p>

        <h1 id="hero-baslik" className="font-display mt-6 max-w-[16ch] text-[clamp(3.1rem,min(7vw,11.5svh),7.6rem)]">
          {lines.map((l, i) => (
            <span key={l} className="line-mask">
              <span
                style={{ animationDelay: `${0.08 * i}s` }}
                className={i === 1 ? "text-copper-hot" : ""}
              >
                {l}
              </span>
            </span>
          ))}
        </h1>

        <p
          className="fade-up mt-7 max-w-xl text-[1.05rem] leading-relaxed text-white/90 sm:text-lg"
          style={{ animationDelay: "0.15s" }}
        >
          Modern üretim teknolojileri, mühendislik çözümleri ve yüksek kalite standartlarıyla metal
          imalatında geleceği şekillendiriyoruz. Çelik konstrüksiyondan ferforjeye,{" "}
          <strong className="font-semibold text-white">ölçünüze göre imalat ve montaj.</strong>
        </p>

        <div className="fade-up mt-9 flex flex-col gap-3 xs:flex-row" style={{ animationDelay: "0.25s" }}>
          <a href="#teklif" className={btn.copper}>
            Teklif Al <ArrowRight className={`size-4 ${arrowMove}`} aria-hidden />
          </a>
          <a href="#projeler" className={btn.ghostLight}>
            Projelerimizi İnceleyin
          </a>
        </div>
      </div>

    </section>
  );
}
