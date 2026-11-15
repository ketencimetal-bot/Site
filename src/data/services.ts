/**
 * HİZMETLER — firmanın mevcut sitesinde belirttiği iş alanları.
 * Hakkımızda bölümünde liste olarak, teklif formunda seçenek olarak kullanılır.
 */
export type Service = { slug: string; title: string };

export const services: Service[] = [
  { slug: "celik-konstruksiyon", title: "Çelik Konstrüksiyon" },
  { slug: "asma-kat", title: "Asma Kat ve Ara Kat" },
  { slug: "demir-dograma", title: "Demir Doğrama" },
  { slug: "ferforje", title: "Ferforje" },
  { slug: "metal-merdiven", title: "Metal Merdiven" },
  { slug: "korkuluk-kupeste", title: "Korkuluk ve Küpeşte" },
  { slug: "kapi-sistemleri", title: "Kapı Sistemleri" },
  { slug: "sundurma-depo", title: "Sundurma ve Depo" },
  { slug: "mimari-dekorasyon", title: "Mağaza ve Cafe Dekorasyonu" },
  { slug: "ozel-tasarim", title: "Özel Metal Tasarımlar" },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
