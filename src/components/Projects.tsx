"use client";

import { AnimatePresence, m } from "framer-motion";
import { Maximize2 } from "lucide-react";
import { useMemo, useState, useCallback } from "react";
import SectionHeading from "./ui/SectionHeading";
import Img from "./ui/Img";
import ProjectModal from "./ProjectModal";
import { projects, projectCategories, type Project, type ProjectCategory } from "@/data/projects";

type Filter = "tumu" | ProjectCategory;

const catLabel = (c: ProjectCategory) => projectCategories.find((x) => x.id === c)?.label ?? c;

export default function Projects() {
  const [filter, setFilter] = useState<Filter>("tumu");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(
    () => (filter === "tumu" ? projects : projects.filter((p) => p.categories.includes(filter))),
    [filter],
  );
  const counts = useMemo(() => {
    const c: Record<string, number> = { tumu: projects.length };
    projects.forEach((p) => p.categories.forEach((k) => (c[k] = (c[k] ?? 0) + 1)));
    return c;
  }, []);

  const current = openId ? list.find((p) => p.id === openId) ?? projects.find((p) => p.id === openId) ?? null : null;
  const idx = current ? list.findIndex((p) => p.id === current.id) : -1;
  const go = useCallback(
    (d: number) => {
      if (idx < 0) return;
      setOpenId(list[(idx + d + list.length) % list.length].id);
    },
    [idx, list],
  );

  return (
    <section id="projeler" aria-labelledby="projeler-baslik" className="section-y relative bg-ink text-white">
      <div className="bg-blueprint-dark pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_60%)]" />
      <div className="container-x relative">
        <SectionHeading
          id="projeler-baslik"
          index="02"
          eyebrow="Projelerimiz"
          tone="dark"
          title={
            <>
              Sahadan
              <br />
              <span className="text-copper-hot">gerçek</span> işler
            </>
          }
          lead="Atölyemizde üretip yerinde monte ettiğimiz işlerden bir seçki. Kategoriye göre filtreleyin, detay için projeye dokunun."
        />

        {/* Filtre */}
        <div
          role="toolbar"
          aria-label="Proje kategorisi filtresi"
          className="no-scrollbar -mx-4 mt-12 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 lg:mt-16"
        >
          {projectCategories.map((c) => {
            const on = filter === c.id;
            const n = counts[c.id] ?? 0;
            return (
              <button
                key={c.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(c.id)}
                className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-5 text-sm font-medium transition duration-300 ${
                  on ? "bg-copper text-white" : "bg-white/5 text-white/80 ring-1 ring-inset ring-white/15 hover:bg-white/10 hover:text-white"
                }`}
              >
                {c.label}
                <span className={`font-mono text-[0.7rem] ${on ? "text-white/80" : "text-steel-light"}`}>{n}</span>
              </button>
            );
          })}
        </div>
        <p className="sr-only" aria-live="polite">
          {list.length} proje gösteriliyor
        </p>

        {/* Galeri */}
        <AnimatePresence mode="wait">
          <m.ul
            key={filter}
            className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3"
            initial="hide"
            animate="show"
            exit="exit"
            variants={{ show: { transition: { staggerChildren: 0.05 } }, exit: { opacity: 0, transition: { duration: 0.2 } } }}
          >
            {list.map((p) => (
              <m.li
                key={p.id}
                className="mb-4 break-inside-avoid"
                variants={{
                  hide: { opacity: 0, y: 30, scale: 0.98 },
                  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <ProjectCard p={p} onOpen={() => setOpenId(p.id)} />
              </m.li>
            ))}
          </m.ul>
        </AnimatePresence>
      </div>

      <ProjectModal
        project={current}
        index={idx}
        total={list.length}
        onClose={() => setOpenId(null)}
        onPrev={() => go(-1)}
        onNext={() => go(1)}
        catLabel={catLabel}
      />
    </section>
  );
}

function ProjectCard({ p, onOpen }: { p: Project; onOpen: () => void }) {
  const ratio = p.orientation === "port" ? "aspect-[3/4]" : p.orientation === "wide" ? "aspect-[16/9]" : "aspect-[4/3]";
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      className={`group relative block w-full overflow-hidden rounded-2xl bg-anthracite text-left ${ratio}`}
    >
      <Img
        name={p.images[0]}
        alt={p.title}
        sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
        className="absolute inset-0 size-full object-cover transition duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/10 to-transparent" />
      <span className="absolute right-4 top-4 grid size-11 scale-75 place-items-center rounded-full bg-white text-ink opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
        <Maximize2 className="size-4" aria-hidden />
      </span>
      <span className="absolute inset-x-0 bottom-0 p-5">
        <span className="flex flex-wrap gap-1.5">
          {p.categories.slice(0, 2).map((c) => (
            <span key={c} className="rounded-full bg-white/12 px-2.5 py-1 font-mono text-[0.62rem] uppercase tracking-wider text-white/85 backdrop-blur">
              {catLabel(c)}
            </span>
          ))}
        </span>
        <span className="font-display mt-3 block text-[1.7rem] text-white">{p.title}</span>
      </span>
    </button>
  );
}
