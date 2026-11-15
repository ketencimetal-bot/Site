# Ketenci Metal — Web Sitesi

Next.js 16 · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide

Site **statik** olarak derlenir: `npm run build` sonrası oluşan `out/` klasörü herhangi bir
hostinge (cPanel, Apache, Nginx, Netlify, Vercel…) olduğu gibi yüklenebilir. Sunucu gerekmez.

## Komutlar

```bash
npm install        # ilk kurulum
npm run dev        # geliştirme: http://localhost:3000
npm run build      # yayın: out/ klasörünü üretir
```

## İçeriği düzenleme

Tüm metinler ve bilgiler `src/data/` altındadır — bileşen koduna dokunmanız gerekmez.

| Dosya | İçerik |
|---|---|
| `site.ts` | Firma adı, telefon, WhatsApp, e-posta, adres, çalışma saatleri, **sayısal bilgiler** |
| `services.ts` | Hizmet listesi (Hakkımızda bölümü ve teklif formu seçenekleri) |
| `projects.ts` | Proje galerisi, kategoriler, proje detayları |
| `content.ts` | Üretim süreci adımları, "Neden biz" maddeleri, formdaki malzeme seçenekleri |

**Doğrulanmamış bilgi gösterilmez:**
- `site.ts → stats`: `value: null` olan satırlar (ör. "Tamamlanan proje") sitede görünmez. Firma
  onayladığında sayıyı yazmanız yeterli.
- `projects.ts`: `production` (üretim detayları) ve `application` (uygulama bilgileri) alanları
  boşsa proje penceresinde gösterilmez.

**Görseller:** `public/img/` altında `ad.webp` (≤1280 px) ve `ad-s.webp` (≤640 px) çifti olarak
durur. Yeni proje için iki dosyayı ekleyip `projects.ts`e `images: ["ad"]` yazın.

## Formlar (teklif ve iletişim)

Site statik olduğu için formların e-postaya düşmesi için bir form servisi gerekir:

1. Formspree, Getform, Basin gibi bir servis hesabı açın (veya kendi PHP/Node betiğinizi yazın).
2. Proje klasöründe `.env.local` dosyası oluşturup adresi yazın:
   ```
   NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/XXXXXXX
   ```
3. `npm run build` ile yeniden derleyin.

Servis `multipart/form-data` POST kabul etmeli (teklif formu dosya ekleri gönderir; alan adı
`dosyalar`). 2xx yanıtı başarılı sayılır ve "Talebiniz bize ulaştı" ekranı gösterilir.

**Adres tanımlı değilken** formlar hiçbir şeyi gönderilmiş gibi göstermez: son adımda talebi
hazır mesaj olarak **WhatsApp** veya **e-posta** ile iletme seçenekleri sunulur.

## Yayına alma

- `out/` klasörünün **içeriğini** hostingin kök dizinine (`public_html` vb.) yükleyin.
- Apache/cPanel için `out/.htaccess` hazırdır: 404 sayfası, sıkıştırma ve önbellek ayarları.
  SSL aktifse dosyadaki HTTPS yönlendirme satırlarının başındaki `#` işaretlerini kaldırın.
- Nginx kullanıyorsanız `error_page 404 /404.html;` ve gzip ayarlarını ekleyin.

## Notlar

- `scripts/flatten-segments.mjs` derleme sonunda otomatik çalışır: Next.js 16 statik çıktısındaki
  sayfa ön yükleme dosyalarının adlandırma uyumsuzluğunu giderir.
- Animasyonlar işletim sistemindeki "hareketi azalt" tercihine uyar.
- Hizmet listesi firmanın mevcut sitesindeki iş alanlarından oluşturuldu. Lazer kesim / CNC gibi
  hizmetler veriliyorsa `services.ts`'e aynı formatta eklenebilir.
