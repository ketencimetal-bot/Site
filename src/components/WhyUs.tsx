import { Layers, Ruler, Users, CalendarCheck, Lightbulb, Handshake } from "lucide-react";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import { whyUs } from "@/data/content";

const icons = { layers: Layers, ruler: Ruler, users: Users, calendar: CalendarCheck, lightbulb: Lightbulb, handshake: Handshake };

export default function WhyUs() {
  return (
    <section id="neden-biz" aria-labelledby="neden-baslik" className="section-y bg-anthracite text-white">
      <div className="container-x">
        <SectionHeading
          id="neden-baslik"
          index="04"
          eyebrow="Neden biz?"
          tone="dark"
          title={
            <>
              Güvenle
              <br />
              <span className="text-copper-hot">çalışmanız</span> için
            </>
          }
          lead="Ölçüye sadık, zamanında ve özenli işçilik."
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {whyUs.map((w, i) => {
            const Icon = icons[w.icon];
            return (
              <Reveal as="li" key={w.title} delay={(i % 3) * 0.07} className="group bg-anthracite p-8 transition-colors duration-500 hover:bg-graphite sm:p-10">
                <Icon className="size-7 text-copper-hot" strokeWidth={1.6} aria-hidden />
                <h3 className="font-display mt-6 text-[2rem]">{w.title}</h3>
                <p className="mt-3 leading-relaxed text-steel-light">{w.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
