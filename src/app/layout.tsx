import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import MotionProvider from "@/components/ui/MotionProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { site } from "@/data/site";

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
    default: "Ketenci Metal | Çelik Konstrüksiyon ve Metal İmalat – Bağcılar, İstanbul",
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
    title: "Ketenci Metal | Metal İşlemede Güç, Tasarımda Mükemmellik",
    description: site.description,
    images: [{ url: "/img/og.jpg", width: 1200, height: 630, alt: "Ketenci Metal çelik konstrüksiyon" }],
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#111315",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "HomeAndConstructionBusiness",
  name: site.legalName,
  alternateName: site.name,
  url: site.url,
  image: `${site.url}/img/og.jpg`,
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
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: site.hours.open,
      closes: site.hours.close,
    },
  ],
  sameAs: [site.instagram.url],
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
