/**
 * PROJELER
 * Görseller firmanın mevcut sitesindeki iş fotoğraflarıdır.
 * Açıklamalar yalnızca fotoğrafta görüneni anlatır. Malzeme / üretim / uygulama
 * bilgileri firma tarafından doğrulanınca ilgili alanlara eklenmelidir —
 * boş bırakılan alanlar proje penceresinde GÖSTERİLMEZ.
 */
export type ProjectCategory = "celik" | "ic-mekan" | "dis-mekan" | "ozel" | "endustriyel";

export const projectCategories: { id: "tumu" | ProjectCategory; label: string }[] = [
  { id: "tumu", label: "Tümü" },
  { id: "celik", label: "Çelik Konstrüksiyon" },
  { id: "ic-mekan", label: "İç Mekân Metal İşleri" },
  { id: "dis-mekan", label: "Dış Mekân Metal İşleri" },
  { id: "ozel", label: "Özel İmalatlar" },
  { id: "endustriyel", label: "Endüstriyel Üretim" },
];

export type Project = {
  id: string;
  title: string;
  categories: ProjectCategory[];
  /** /img altındaki görsel adları (uzantısız). İlk görsel kapak olur. */
  images: string[];
  orientation: "land" | "port" | "wide";
  description: string;
  materials?: string[];
  production?: string; // Üretim detayları — firma doldurabilir
  application?: string; // Uygulama bilgileri (yer, süre vb.) — firma doldurabilir
  service: string; // services.ts slug
};

export const projects: Project[] = [
  {
    id: "konstruksiyon",
    title: "Çelik Taşıyıcı Konstrüksiyon",
    categories: ["celik", "endustriyel", "dis-mekan"],
    images: ["konstruksiyon"],
    orientation: "land",
    description:
      "Eğimli arazide kurulan çelik taşıyıcı iskelet. Kolon ve kirişlerden oluşan sistem, üst yapı için taşıyıcı zemin oluşturuyor.",
    materials: ["Çelik profil"],
    service: "celik-konstruksiyon",
  },
  {
    id: "asma-kat",
    title: "Asma Kat",
    categories: ["celik", "ic-mekan", "endustriyel"],
    images: ["asma-kat"],
    orientation: "land",
    description:
      "Mevcut iç mekânda yükseklikten yararlanan çelik asma kat. Taşıyıcı kirişler ve korkuluk iskeleti bir arada.",
    materials: ["Çelik profil"],
    service: "asma-kat",
  },
  {
    id: "celik-merdiven",
    title: "Çelik Merdiven",
    categories: ["ic-mekan", "ozel"],
    images: ["celik-merdiven"],
    orientation: "port",
    description:
      "Duvara bağlı, zikzak taşıyıcılı minimal çelik iç mekân merdiveni; ince dikmeli korkuluk ile.",
    materials: ["Çelik"],
    service: "metal-merdiven",
  },
  {
    id: "metal-raf",
    title: "Metal Raf Sistemi",
    categories: ["ic-mekan", "ozel"],
    images: ["metal-raf"],
    orientation: "port",
    description:
      "Mağaza için tavana kadar uzanan, aydınlatmalı metal raf ve teşhir sistemi.",
    materials: ["Metal profil"],
    service: "mimari-dekorasyon",
  },
  {
    id: "sundurma",
    title: "Çelik Sundurma",
    categories: ["celik", "dis-mekan"],
    images: ["sundurma"],
    orientation: "port",
    description: "Otopark girişi için çelik taşıyıcılı sundurma.",
    materials: ["Çelik profil"],
    service: "sundurma-depo",
  },
  {
    id: "halat-merdiven",
    title: "Tel Halat Korkuluklu Merdiven",
    categories: ["dis-mekan", "ozel"],
    images: ["halat-merdiven"],
    orientation: "land",
    description:
      "Bahçe kotları arasında dış merdiven; tel halat dolgulu metal korkuluk ve küpeşte.",
    materials: ["Metal profil", "Tel halat"],
    service: "korkuluk-kupeste",
  },
  {
    id: "bahce-merdiveni",
    title: "Bahçe Merdiveni",
    categories: ["dis-mekan"],
    images: ["bahce-merdiveni"],
    orientation: "port",
    description: "Bina cephesinde yükselen metal dış merdiven ve korkuluk sistemi.",
    materials: ["Metal"],
    service: "metal-merdiven",
  },
  {
    id: "bahce-citi",
    title: "Metal Bahçe Çiti",
    categories: ["dis-mekan"],
    images: ["bahce-citi"],
    orientation: "wide",
    description: "Yaya yolu boyunca uzanan dikey çubuklu metal bahçe çiti.",
    materials: ["Metal"],
    service: "ferforje",
  },
  {
    id: "bahce-kapisi",
    title: "Bahçe Kapısı",
    categories: ["dis-mekan"],
    images: ["bahce-kapisi"],
    orientation: "port",
    description: "Modern çizgide, dikey lamelli metal bahçe kapısı ve yan paneli.",
    materials: ["Metal"],
    service: "kapi-sistemleri",
  },
  {
    id: "bitki-kasasi",
    title: "Metal Bitki Kasası ve Çit",
    categories: ["dis-mekan", "ozel"],
    images: ["bitki-kasasi"],
    orientation: "land",
    description: "Yaya alanında metal bitki kasası ve onu çevreleyen metal çit.",
    materials: ["Metal"],
    service: "ozel-tasarim",
  },
  {
    id: "korten-basamak",
    title: "Korten Çelik Basamak ve Bitki Kasaları",
    categories: ["dis-mekan", "ozel"],
    images: ["korten-basamak"],
    orientation: "port",
    description:
      "Eğimli bahçede korten çelik basamaklar; basamak aralarında bitki kasaları.",
    materials: ["Korten çelik"],
    service: "ozel-tasarim",
  },
  {
    id: "koruma-kasasi",
    title: "Metal Kafesli Koruma Kasası",
    categories: ["dis-mekan", "ozel", "endustriyel"],
    images: ["koruma-kasasi"],
    orientation: "land",
    description: "Bina dış cephesinde ekipmanları koruyan metal kafesli kasa.",
    materials: ["Metal profil", "Kafes"],
    service: "demir-dograma",
  },
];

export const getProject = (id: string) => projects.find((p) => p.id === id);
