import Reveal from "./ui/Reveal";
import Counter from "./ui/Counter";
import Img from "./ui/Img";
import ParallaxImage from "./ui/ParallaxImage";
import { site, stats } from "@/data/site";
import { services } from "@/data/services";

export default function About() {
  const visibleStats = stats.filter((s) => s.value !== null);

  return (
    <section id="hakkimizda" aria-labelledby="hakkimizda-baslik" className="section-y bg-white">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-steel-ink">
              <span className="text-copper">01</span>
              <span className="h-px w-8 bg-ink/20" aria-hidden />
              Hakkımızda
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="hakkimizda-baslik" className="font-display mt-5 text-[clamp(2.6rem,6.2vw,5.8rem)]">
              {site.foundedYear}&apos;den bugüne
              <br />
              <span className="text-copper">metale</span> biçim veriyoruz.
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="mt-8 max-w-2xl space-y-5 text-[1.06rem] leading-relaxed text-steel-ink">
            <p>
              Mart {site.incorporatedYear}&apos;den bu yana{" "}
              <strong className="font-semibold text-ink">{site.legalName}</strong> olarak çalışıyoruz. Ana işimiz
              çelik yapılar ve çelik konstrüksiyon; bunun yanında demir doğrama, ferforje ile cafe ve mağaza metal
              dekorasyonu yapıyoruz.
            </p>
            <p>Her işi ölçünüze göre atölyemizde üretip yerinde monte ediyoruz.</p>
          </Reveal>

          <Reveal delay={0.15}>
            <h3 className="eyebrow mt-12 text-steel-ink">Ne yapıyoruz?</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {services.map((s) => (
                <li key={s.slug} className="rounded-full bg-mist px-4 py-2 text-[0.95rem] font-medium">
                  {s.title}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="grid grid-cols-5 gap-4 self-center lg:col-span-5">
          <ParallaxImage className="col-span-3 mt-12 aspect-[3/4] rounded-2xl" amount={40}>
            <Img name="asma-kat" alt="Ketenci Metal'in ürettiği çelik asma kat" sizes="(max-width:1024px) 60vw, 25vw" className="size-full object-cover" />
          </ParallaxImage>
          <ParallaxImage className="col-span-2 aspect-[3/5] rounded-2xl" amount={-30}>
            <Img name="celik-merdiven" alt="Çelik iç mekân merdiveni" sizes="(max-width:1024px) 40vw, 17vw" className="size-full object-cover" />
          </ParallaxImage>
        </div>
      </div>

      {/* Sayılar (yalnızca doğrulanmış değerler) */}
      <div className="container-x mt-20 lg:mt-28">
        <dl className="grid grid-cols-2 border-t border-ink/10 lg:grid-cols-4">
          {visibleStats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={0.06 * i}
              className={`py-8 pr-4 ${i % 2 === 1 ? "border-l border-ink/10 pl-5 lg:pl-8" : ""} ${i > 0 && i % 2 === 0 ? "lg:border-l lg:border-ink/10 lg:pl-8" : ""} ${i >= 2 ? "border-t border-ink/10 lg:border-t-0" : ""}`}
            >
              <dt className="sr-only">{s.label}</dt>
              <dd className="font-display text-[clamp(3rem,6vw,5.5rem)] text-ink">
                <Counter to={s.value as number} plain={s.plain} suffix={s.suffix} />
              </dd>
              <dd aria-hidden className="mt-3 text-sm text-steel-ink">{s.label}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
