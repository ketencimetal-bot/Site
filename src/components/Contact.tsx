import { Clock, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";
import Reveal from "./ui/Reveal";
import SectionHeading from "./ui/SectionHeading";
import ContactForm from "./contact/ContactForm";
import MapEmbed from "./contact/MapEmbed";
import OpenStatus from "./contact/OpenStatus";
import { WhatsAppIcon, InstagramIcon } from "./ui/BrandIcons";
import { site, fullAddress, mapsLink } from "@/data/site";

export default function Contact() {
  const items = [
    { icon: Phone, label: "Telefon", value: site.phoneDisplay, href: `tel:${site.phoneE164}` },
    { icon: WhatsAppIcon, label: "WhatsApp", value: site.phoneDisplay, href: `https://wa.me/${site.whatsapp}`, ext: true },
    { icon: Mail, label: "E-posta", value: site.email, href: `mailto:${site.email}` },
    { icon: MapPin, label: "Adres", value: fullAddress, href: mapsLink, ext: true },
    { icon: InstagramIcon, label: "Instagram", value: site.instagram.handle, href: site.instagram.url, ext: true },
  ];

  return (
    <section id="iletisim" aria-labelledby="iletisim-baslik" className="section-y bg-mist">
      <div className="container-x">
        <SectionHeading
          id="iletisim-baslik"
          index="06"
          eyebrow="İletişim"
          title={
            <>
              Hayal edin,
              <br />
              <span className="text-copper">gerçekleştirelim.</span>
            </>
          }
          lead="Aramanız yeterli. Ölçü ve ihtiyacınızı konuşalım; ya da formu doldurun, biz size dönelim."
        />

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-12">
          <div className="grid content-start gap-4 lg:col-span-5">

            <Reveal delay={0.05}>
              <ul className="divide-y divide-ink/8 overflow-hidden rounded-3xl bg-white ring-1 ring-ink/8">
                {items.map((it) => (
                  <li key={it.label}>
                    <a
                      href={it.href}
                      {...(it.ext ? { target: "_blank", rel: "noopener" } : {})}
                      className="group flex min-h-16 items-center gap-4 px-6 py-4 transition hover:bg-paper"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mist text-copper transition group-hover:bg-copper group-hover:text-white">
                        <it.icon className="size-5" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-steel-ink">{it.label}</span>
                        <span className="block break-words font-medium">{it.value}</span>
                      </span>
                      <ArrowUpRight className="size-4 shrink-0 text-steel transition group-hover:text-copper" aria-hidden />
                    </a>
                  </li>
                ))}
                <li className="flex items-start gap-4 px-6 py-5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-mist text-copper">
                    <Clock className="size-5" aria-hidden />
                  </span>
                  <span className="flex-1">
                    <span className="block font-mono text-[0.66rem] uppercase tracking-[0.16em] text-steel-ink">Çalışma saatleri</span>
                    <span className="block font-medium">
                      {site.hours.label}: {site.hours.open.replace(":", ".")} – {site.hours.close.replace(":", ".")}
                    </span>
                    <span className="block text-sm text-steel-ink">{site.hours.closedLabel}</span>
                    <span className="mt-3 block">
                      <OpenStatus />
                    </span>
                  </span>
                </li>
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <ContactForm />
          </Reveal>

          <Reveal className="lg:col-span-12">
            <MapEmbed />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
