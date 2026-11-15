"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { useState } from "react";
import { fullAddress, mapsEmbed, mapsLink } from "@/data/site";
import { btn } from "../ui/styles";

/**
 * Google Maps alanı. Hız ve gizlilik için harita yalnızca ziyaretçi isteyince yüklenir.
 * İsterseniz `mapsEmbed` yerine Google Haritalar > Paylaş > "Harita yerleştir" ile alınan
 * iframe adresini site.ts'e yazabilirsiniz.
 */
export default function MapEmbed() {
  const [load, setLoad] = useState(false);
  return (
    <div className="relative h-[360px] overflow-hidden rounded-3xl bg-anthracite text-white sm:h-[440px]">
      {load ? (
        <iframe
          title={`Ketenci Metal konumu: ${fullAddress}`}
          src={mapsEmbed}
          className="size-full border-0 grayscale-[0.3]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="bg-blueprint-dark relative flex size-full flex-col items-center justify-center p-6 text-center">
          {/* Stilize harita çizgileri */}
          <svg className="absolute inset-0 size-full opacity-30" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden>
            <g fill="none" stroke="#858b91" strokeWidth="1.2">
              <path d="M-10 210 C 80 190, 140 240, 230 200 S 360 120, 420 140" />
              <path d="M40 -10 C 70 80, 120 120, 110 320" />
              <path d="M-10 90 L 420 60" />
              <path d="M260 -10 C 240 90, 300 180, 280 320" />
              <path d="M-10 150 C 120 140, 200 100, 420 230" strokeOpacity=".5" />
            </g>
          </svg>
          <span className="relative grid size-16 place-items-center rounded-full bg-copper shadow-[0_0_0_12px_rgb(181_88_31/0.2)]">
            <MapPin className="size-7" aria-hidden />
          </span>
          <p className="font-display relative mt-6 text-3xl">Atölyemiz</p>
          <p className="relative mt-2 max-w-xs text-steel-light">{fullAddress}</p>
          <div className="relative mt-6 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => setLoad(true)} className={btn.light}>
              Haritayı göster
            </button>
            <a href={mapsLink} target="_blank" rel="noopener" className={btn.ghostLight}>
              Yol tarifi <ExternalLink className="size-4" aria-hidden />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
