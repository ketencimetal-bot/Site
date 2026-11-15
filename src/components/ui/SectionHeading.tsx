import Reveal from "./Reveal";

type Props = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  id: string;
  tone?: "light" | "dark";
  className?: string;
};

/** Bölüm başlığı: numara + üst etiket + büyük başlık + açıklama */
export default function SectionHeading({ index, eyebrow, title, lead, id, tone = "light", className = "" }: Props) {
  const dark = tone === "dark";
  return (
    <div className={`grid gap-6 lg:grid-cols-12 lg:items-end ${className}`}>
      <div className="lg:col-span-7">
        <Reveal>
          <p className={`eyebrow flex items-center gap-3 ${dark ? "text-steel-light" : "text-steel-ink"}`}>
            <span className={dark ? "text-copper-hot" : "text-copper"}>{index}</span>
            <span className={`h-px w-8 ${dark ? "bg-white/25" : "bg-ink/20"}`} aria-hidden />
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 id={id} className="font-display mt-5 text-[clamp(2.6rem,6.2vw,5.8rem)]">
            {title}
          </h2>
        </Reveal>
      </div>
      {lead && (
        <Reveal delay={0.1} className="lg:col-span-5 lg:pb-2">
          <p className={`max-w-xl text-[1.05rem] leading-relaxed ${dark ? "text-steel-light" : "text-steel-ink"}`}>{lead}</p>
        </Reveal>
      )}
    </div>
  );
}
