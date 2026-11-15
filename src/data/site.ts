/**
 * FİRMA BİLGİLERİ — sitenin tek bilgi kaynağı.
 * Buradaki bilgiler ketencimetal.com'daki mevcut içerikten alınmıştır.
 * Değiştirmek için yalnızca bu dosyayı düzenlemeniz yeterli.
 */
export const site = {
  name: "Ketenci Metal",
  legalName: "Ketenci Metal İnşaat San. ve Tic. Ltd. Şti.",
  url: "https://www.ketencimetal.com",
  foundedYear: 1998,
  incorporatedYear: 2021, // "Mart 2021 itibarıyla Ltd. Şti."
  phoneDisplay: "0541 273 82 53",
  phoneE164: "+905412738253",
  whatsapp: "905412738253",
  email: "ketencimetal@gmail.com",
  instagram: { handle: "@ketenci.metal", url: "https://www.instagram.com/ketenci.metal/" },
  address: {
    street: "Hürriyet Mahallesi 106. Sokak No:7/B",
    district: "Bağcılar",
    city: "İstanbul",
    country: "TR",
  },
  hours: {
    label: "Pazartesi – Cumartesi",
    open: "08:00",
    close: "19:00",
    closedLabel: "Pazar kapalı",
    /** 0 = Pazar … 6 = Cumartesi */
    days: [1, 2, 3, 4, 5, 6],
  },
  description:
    "Ketenci Metal, 1998'den beri İstanbul Bağcılar'da çelik konstrüksiyon, demir doğrama, ferforje ve mimari metal uygulamalarında ölçüye özel imalat ve montaj yapar.",
} as const;

export const fullAddress = `${site.address.street}, ${site.address.district} / ${site.address.city}`;

export const mapsQuery = encodeURIComponent(
  `${site.address.street} ${site.address.district} ${site.address.city}`,
);
export const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;
export const mapsEmbed = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;

/**
 * SAYISAL BİLGİLER
 * Yalnızca doğrulanmış değerler gösterilir. `value: null` olan satırlar sitede GÖRÜNMEZ.
 * Firma onayladığında değeri girmeniz yeterli (ör. tamamlanan proje sayısı).
 */
export type Stat = {
  value: number | null;
  suffix?: string;
  label: string;
  /** true ise yıl gibi binlik ayırıcı olmadan gösterilir */
  plain?: boolean;
};

const yearsActive = () => new Date().getFullYear() - site.foundedYear;

export const stats: Stat[] = [
  { value: site.foundedYear, label: "Kuruluş yılı", plain: true },
  { value: yearsActive(), suffix: "+", label: "Yıllık sektör deneyimi" },
  { value: 6, suffix: " gün", label: "Haftada çalışma (Pzt–Cmt)" },
  { value: site.incorporatedYear, label: "Ltd. Şti. olarak yapılanma", plain: true },
  // Firma onaylayınca doldurun:
  { value: null, suffix: "+", label: "Tamamlanan proje" },
  { value: null, suffix: "", label: "Uzman personel" },
];

export const nav = [
  { href: "/#hakkimizda", label: "Hakkımızda" },
  { href: "/#projeler", label: "Projeler" },
  { href: "/#surec", label: "Süreç" },
  { href: "/#teklif", label: "Teklif" },
  { href: "/#iletisim", label: "İletişim" },
] as const;
