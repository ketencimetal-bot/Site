/** Üretim süreci, "Neden biz" maddeleri ve teklif formu seçenekleri */

export const processSteps = [
  {
    title: "Proje ve ihtiyaç analizi",
    text: "İşinizi dinliyor, kullanım amacını ve beklentilerinizi netleştiriyoruz. Gerekirse yerinde keşif yapıyoruz.",
  },
  {
    title: "Teknik çizim ve mühendislik",
    text: "Ölçüler alınır; taşıyıcılık, birleşim detayları ve uygulama yöntemi çizim üzerinde planlanır.",
  },
  {
    title: "Malzeme seçimi",
    text: "Kullanım yeri, yük ve görünüm beklentisine göre profil, sac veya özel malzeme belirlenir.",
  },
  {
    title: "Kesim ve şekillendirme",
    text: "Malzemeler ölçüye göre kesilir, bükülür ve montaja hazır parçalar haline getirilir.",
  },
  {
    title: "Kaynak ve montaj",
    text: "Parçalar atölyede birleştirilir; büyük işler sahada monte edilecek modüller halinde hazırlanır.",
  },
  {
    title: "Yüzey işlemleri",
    text: "Temizlik, astar ve boya gibi yüzey işlemleriyle ürün kullanım ortamına hazırlanır.",
  },
  {
    title: "Kalite kontrol",
    text: "Ölçü, kaynak ve yüzey kontrolleri yapılır; ürün teslimata hazır hale getirilir.",
  },
  {
    title: "Teslimat ve uygulama",
    text: "Ekibimiz ürünü yerinde monte eder ve işi teslim eder.",
  },
];

export const whyUs = [
  {
    icon: "layers",
    title: "Kaliteli malzeme",
    text: "Kullanım yerine uygun malzemeyi seçiyor, uzun ömürlü sonuç için doğru profili kullanıyoruz.",
  },
  {
    icon: "ruler",
    title: "Hassas üretim",
    text: "Her iş ölçünüze göre üretilir; yerinde ölçü alır, çizime sadık kalırız.",
  },
  {
    icon: "users",
    title: "Deneyimli ekip",
    text: "1998'den bu yana atölyede ve sahada metal işçiliği yapıyoruz.",
  },
  {
    icon: "calendar",
    title: "Zamanında teslimat",
    text: "Kaliteli ve zamanında işçilik önceliğimizdir; takvimi baştan birlikte planlarız.",
  },
  {
    icon: "lightbulb",
    title: "Özel projelere çözüm",
    text: "Aklınızdaki iş listede yoksa sorun; ölçünüze göre üretip monte edebiliriz.",
  },
  {
    icon: "handshake",
    title: "Güvenilir iş ortaklığı",
    text: "Önceliğimiz daima müşterilerimizin memnuniyetini ve güvenini kazanmaktır.",
  },
] as const;

export const materialOptions = [
  "Siyah çelik / demir",
  "Galvaniz kaplı çelik",
  "Paslanmaz çelik",
  "Alüminyum",
  "Korten çelik",
  "Emin değilim, öneri istiyorum",
];
