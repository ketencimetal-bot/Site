"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "./ui/Modal";
import { btn } from "./ui/styles";
import { WhatsAppIcon } from "./ui/BrandIcons";
import type { Project, ProjectCategory } from "@/data/projects";
import { getService } from "@/data/services";
import { requestQuote, whatsappLink } from "@/lib/forms";

type Props = {
  project: Project | null;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  catLabel: (c: ProjectCategory) => string;
};

export default function ProjectModal({ project, index, total, onClose, onPrev, onNext, catLabel }: Props) {
  // Seçili görsel, proje değişince kendiliğinden 0'a döner
  const [sel, setSel] = useState<{ id?: string; i: number }>({ i: 0 });
  const img = sel.id === project?.id ? sel.i : 0;
  const setImg = (i: number) => setSel({ id: project?.id, i });

  // Klavye okları ile projeler arası geçiş
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [project, onNext, onPrev]);

  const service = project ? getService(project.service) : undefined;

  // Mobilde kaydırma hareketi
  const [sx, setSx] = useState<number | null>(null);

  return (
    <Modal open={!!project} onClose={onClose} labelledBy="proje-baslik">
      {project && (
        <div className="grid lg:grid-cols-[1.35fr_1fr]">
          <div
            className="relative bg-ink"
            onTouchStart={(e) => setSx(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (sx === null) return;
              const dx = e.changedTouches[0].clientX - sx;
              if (Math.abs(dx) > 50) (dx < 0 ? onNext : onPrev)();
              setSx(null);
            }}
          >
            <AnimatePresence mode="wait">
              <m.img
                key={project.id + img}
                src={`/img/${project.images[img]}.webp`}
                alt={project.title}
                className="h-[48svh] w-full object-contain sm:h-[60svh] lg:h-[82svh]"
                initial={{ opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              />
            </AnimatePresence>
            {total > 1 && (
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                <button type="button" onClick={onPrev} aria-label="Önceki proje" className="grid size-12 place-items-center rounded-full bg-white/90 text-ink transition hover:bg-copper hover:text-white">
                  <ArrowLeft className="size-5" aria-hidden />
                </button>
                <span className="rounded-full bg-ink/70 px-3 py-1.5 font-mono text-xs text-white">
                  {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                </span>
                <button type="button" onClick={onNext} aria-label="Sonraki proje" className="grid size-12 place-items-center rounded-full bg-white/90 text-ink transition hover:bg-copper hover:text-white">
                  <ArrowRight className="size-5" aria-hidden />
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col p-6 sm:p-10">
            <div className="flex flex-wrap gap-1.5 pr-12">
              {project.categories.map((c) => (
                <span key={c} className="rounded-full bg-mist px-3 py-1 font-mono text-[0.65rem] uppercase tracking-wider text-steel-ink">
                  {catLabel(c)}
                </span>
              ))}
            </div>
            <h3 id="proje-baslik" className="font-display mt-5 text-[clamp(2.2rem,4vw,3.4rem)]">
              {project.title}
            </h3>
            <p className="mt-4 leading-relaxed text-steel-ink">{project.description}</p>

            {project.images.length > 1 && (
              <div className="mt-6 flex gap-2">
                {project.images.map((im, i) => (
                  <button
                    key={im}
                    type="button"
                    onClick={() => setImg(i)}
                    aria-label={`Görsel ${i + 1}`}
                    aria-current={i === img}
                    className={`size-16 overflow-hidden rounded-lg ring-2 ${i === img ? "ring-copper" : "ring-transparent"}`}
                  >
                    <img src={`/img/${im}-s.webp`} alt="" className="size-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10 text-[0.95rem]">
              {project.materials?.length ? (
                <Row label="Kullanılan malzemeler">
                  <span className="flex flex-wrap gap-1.5">
                    {project.materials.map((x) => (
                      <span key={x} className="rounded-md bg-ink px-2 py-0.5 text-sm text-white">{x}</span>
                    ))}
                  </span>
                </Row>
              ) : null}
              {project.production && <Row label="Üretim detayları">{project.production}</Row>}
              {project.application && <Row label="Uygulama bilgileri">{project.application}</Row>}
              {service && <Row label="Hizmet">{service.title}</Row>}
            </dl>

            <div className="mt-8 grid gap-3 sm:mt-auto sm:pt-8">
              <button
                type="button"
                className={btn.copper}
                onClick={() => {
                  onClose();
                  setTimeout(() => requestQuote({ service: project.service, note: `Referans proje: ${project.title}` }), 80);
                }}
              >
                Benzer proje için teklif al
              </button>
              <a
                href={whatsappLink(`Merhaba, sitenizdeki "${project.title}" projesine benzer bir iş için bilgi almak istiyorum.`)}
                target="_blank"
                rel="noopener"
                className={btn.ghostDark}
              >
                <WhatsAppIcon className="size-4 text-[#1f9e55]" /> WhatsApp&apos;tan sor
              </a>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[9.5rem_1fr] gap-4 py-3.5">
      <dt className="eyebrow pt-1 !text-[0.64rem] text-steel-ink">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}
