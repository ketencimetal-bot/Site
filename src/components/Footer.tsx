import Link from "next/link";
import { nav, site, fullAddress } from "@/data/site";
import { InstagramIcon, WhatsAppIcon } from "./ui/BrandIcons";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Link href="/" className="flex items-center gap-3" aria-label="Ketenci Metal ana sayfa">
            <img src="/img/mark.webp" alt="" width={300} height={146} className="h-auto w-12" loading="lazy" />
            <span className="font-display text-2xl">Ketenci Metal</span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-steel-light">{site.description}</p>
          <div className="mt-6 flex gap-2">
            <a href={site.instagram.url} target="_blank" rel="noopener" aria-label="Instagram" className="grid size-11 place-items-center rounded-full ring-1 ring-white/15 transition hover:bg-white hover:text-ink">
              <InstagramIcon className="size-5" />
            </a>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener" aria-label="WhatsApp" className="grid size-11 place-items-center rounded-full ring-1 ring-white/15 transition hover:bg-[#1f9e55]">
              <WhatsAppIcon className="size-5" />
            </a>
          </div>
        </div>

        <nav aria-label="Alt menü" className="lg:col-span-3">
          <ul className="space-y-2.5 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link prefetch={false} href={n.href} className="text-white/80 transition hover:text-copper-hot">{n.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="space-y-2.5 text-sm not-italic text-white/80 lg:col-span-4">
          <p>{fullAddress}</p>
          <p><a href={`tel:${site.phoneE164}`} className="hover:text-copper-hot">{site.phoneDisplay}</a></p>
          <p><a href={`mailto:${site.email}`} className="break-all hover:text-copper-hot">{site.email}</a></p>
        </address>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-6 pb-28 text-xs text-steel-light sm:pb-6">
          © {site.foundedYear}–{new Date().getFullYear()} {site.legalName}
        </div>
      </div>
    </footer>
  );
}
