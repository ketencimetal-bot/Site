import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/ui/MotionProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { site, mapsLink } from "@/data/site";
import { services } from "@/data/services";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false, // küçük etiketlerde kullanılıyor; kritik yükü hafifletmek için ön yüklenmez
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Ketenci Metal | Çelik Konstrüksiyon, Demir Doğrama – Bağcılar, İstanbul",
    template: "%s | Ketenci Metal",
  },
  description: site.description,
  keywords: [
    "çelik konstrüksiyon",
    "demir doğrama",
    "ferforje",
    "asma kat",
    "metal merdiven",
    "korkuluk",
    "metal imalat",
    "Bağcılar",
    "İstanbul",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: site.name,
    url: "/",
    title: "Ketenci Metal | Çelik Konstrüksiyon, Demir Doğrama – Bağcılar, İstanbul",
    description: site.description,
    images: [{ url: "/img/og.jpg", width: 1200, height: 630, alt: "Ketenci Metal çelik konstrüksiyon" }],
  },
  twitter: { card: "summary_large_image" },
  // Google Search Console sahiplik doğrulaması (silinirse doğrulama düşer)
  verification: { google: "oOVY88zao9ADUUlLq11qKgmG3e-ZImw0CZJqfnC2UsQ" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#111315",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

// Google için yapılandırılmış veri (yalnızca sitede yer alan doğrulanmış bilgiler)
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": `${site.url}/#isletme`,
      name: site.legalName,
      alternateName: site.name,
      description: site.description,
      url: `${site.url}/`,
      image: `${site.url}/img/og.jpg`,
      logo: `${site.url}/icon.png`,
      telephone: site.phoneE164,
      email: site.email,
      foundingDate: String(site.foundedYear),
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        addressLocality: site.address.district,
        addressRegion: site.address.city,
        addressCountry: site.address.country,
      },
      hasMap: mapsLink,
      areaServed: { "@type": "City", name: "İstanbul" },
      knowsAbout: services.map((s) => s.title),
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Metal imalat ve montaj hizmetleri",
        itemListElement: services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: s.title, areaServed: "İstanbul" },
        })),
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: site.hours.open,
          closes: site.hours.close,
        },
      ],
      sameAs: [site.instagram.url],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#site`,
      url: `${site.url}/`,
      name: site.name,
      inLanguage: "tr-TR",
      publisher: { "@id": `${site.url}/#isletme` },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${archivo.variable} ${plexMono.variable}`}>
      <body>
        <a
          href="#icerik"
          className="fixed left-3 top-3 z-[100] -translate-y-24 rounded-full bg-copper px-5 py-3 font-semibold text-white transition focus:translate-y-0"
        >
          İçeriğe geç
        </a>
        <MotionProvider>
          <Navbar />
          {children}
          <Footer />
          <WhatsAppFab />
        </MotionProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
