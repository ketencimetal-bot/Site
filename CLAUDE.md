# Ketenci Metal web sitesi — Claude için proje notları

Bu proje önceki bir Claude oturumunda sıfırdan yapıldı. Bu dosya o oturumdaki kararları ve
dikkat edilmesi gerekenleri özetler. Çalışmaya başlamadan önce tamamını oku.

## Firma ve kullanıcı
- Firma: **Ketenci Metal İnşaat San. ve Tic. Ltd. Şti.** — Bağcılar / İstanbul. 1998'de kuruldu,
  Mart 2021'den beri Ltd. Şti. Çelik konstrüksiyon, demir doğrama, ferforje, asma kat, merdiven,
  kapı, sundurma, mağaza/cafe metal dekorasyonu, alçıpan karkas.
- Eski site: http://www.ketencimetal.com/ (tek sayfa, gömülü base64 görselli, yavaş). Fotoğraflar
  ve metinler oradan alındı.
- Kullanıcı Türkçe yazıyor, kısa ve doğrudan istekler veriyor. Yanıtları Türkçe ver.
- Kullanıcı hızlı açılan bir site istiyor; performans her değişiklikte korunmalı.

## Teknoloji
Next.js 16.4 (App Router, Turbopack) · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion 14 · Lucide.
- **Statik çıktı** (`output: "export"`, `trailingSlash: true`): `npm run build` → `out/`. Sunucu yok.
- Next.js 16'da API'ler eğitim verinden farklı olabilir. Şüphede `node_modules/next/dist/docs/`
  altındaki belgeleri oku.
- `npm run build` = `next build && node scripts/flatten-segments.mjs`. Bu betik, Next 16 statik
  çıktısının prefetch dosyalarını iç içe klasöre yazıp tarayıcının düz adla istemesinden doğan 404'leri
  düzeltir. Kaldırma.

## Yapı
```
src/app/        layout.tsx (fontlar, metadata, JSON-LD), page.tsx, template.tsx (sayfa geçişi),
                globals.css (tasarım sistemi), not-found.tsx, sitemap.ts, robots.ts
src/components/ Navbar, Hero, Sparks (hero kaynak efekti), About, Projects + ProjectModal,
                Process, WhyUs, QuoteForm (+ quote/), Contact (+ contact/), Footer, WhatsAppFab, ui/
src/data/       site.ts (firma bilgisi, stats, nav), services.ts, projects.ts, content.ts
src/lib/forms.ts  form gönderimi, WhatsApp/mailto linkleri, doğrulama, teklif ön seçim olayı
public/img/     WebP görseller: ad.webp (≤1280px) + ad-s.webp (≤640px); mark.webp / mark-dark.webp logo
public/.htaccess  Apache: 404, gzip, önbellek; HTTPS yönlendirmesi yorum satırında
```

## Ana sayfa bölümleri (sırasıyla)
Hero → 01 Hakkımızda → 02 Projeler → 03 Süreç → 04 Neden Biz → 05 Teklif Al → 06 İletişim.
Menü: Hakkımızda, Projeler, Süreç, Teklif, İletişim.

## Tasarım sistemi
- Renkler (`globals.css @theme`): ink #111315, anthracite #202326, steel #858B91, mist #E9EAEB,
  paper, copper #B5581F (açık zeminde), copper-hot #E08A4F (koyu zeminde).
  Açık zeminde gri metin için `steel-ink`, koyu zeminde `steel-light` kullan (kontrast).
- Yazı: Archivo değişken font (wdth ekseni). `.font-display` = %64 genişlik, 800, BÜYÜK HARF.
  `.eyebrow` = IBM Plex Mono küçük etiket.
- Açık/koyu bölümler dönüşümlü (kullanıcı sitenin çok karanlık görünmesini istemedi).

## Kesin kurallar
1. **Gerçek olmayan firma bilgisi uydurma.** Doğrulanmamış sayılar `site.ts → stats` içinde
   `value: null` (görünmez). Proje `production` / `application` alanları boşsa gösterilmez.
   Lazer kesim / CNC gibi firmanın belirtmediği hizmetler bilinçli olarak eklenmedi.
2. **Formlar gönderilmiş gibi davranmaz.** `NEXT_PUBLIC_FORM_ENDPOINT` tanımlı değilse son adım,
   talebi WhatsApp / e-posta ile iletme seçenekleri sunar. Tanımlıysa multipart POST (dosyalar
   `dosyalar` alanında); yalnızca 2xx yanıtında "Talebiniz bize ulaştı" gösterilir.
3. **Hız:** hero içeriği JS'ye bağlı olmayan CSS animasyonlarıyla görünür (ilk boyamada gizlenmez).
   `template.tsx` ilk açılışta animasyon yapmaz. Plex Mono `preload: false`. Aynı sayfa hash
   bağlantılarında `prefetch={false}` veya düz `<a>` kullan (aksi halde RSC tekrar indirilir).
   Ölçülen son değerler (yavaş 4G + 4x CPU, telefon): FCP ~1.1 sn, LCP ~1.35 sn; masaüstü ~0.15 sn.
4. **Yatay taşma olmamalı.** `html { overflow-x: clip }` var; ayrıca animasyon başlangıç konumlarında
   yatay `x` kaydırma kullanma (mobil görünüm alanını genişletiyordu) — `y` kullan.

## Öğrenilmiş hatalar (tekrarlama)
- `-webkit-text-stroke` (kontur yazı) değişken fontta iç çizgiler/tırtık yapıyor → kaldırıldı, kullanma.
- Hero metnini kaydırmada `transform + opacity` ile hareket ettirmek yazıyı bulanıklaştırıyordu → kaldırıldı.
  (Arka plan görselinin parallax'ı duruyor.)
- Koyu bölümlerin içinde açılan modallar beyaz metni miras alıyordu → `Modal.tsx` panelinde `text-ink` var.
- Tailwind v4'te `@layer components` sınıflarına varyant (`sm:`, `[&:..]:`) uygulanmaz; gerekiyorsa `@utility`.
- `btn.*` sınıfları `inline-flex` içerir; `hidden sm:inline-flex` ile birleştirme — sarmalayıcı `<span className="hidden sm:block">` kullan.
- ESLint `react-hooks/set-state-in-effect` hatası verir: efekt içinde senkron `setState` yapma.

## Hero kaynak efekti (`Sparks.tsx`) — kullanıcının son istediği hali
Kullanıcı bunu birkaç tur ayarladı; değiştirmeden önce sor.
- İmlecin ucunda küçük kaynak arkı + kısa kıvılcımlar.
- Arkasında dikiş izi: beyaz → sarı → turuncu → kırmızı → gri, `LIFE = 1300` ms'de kaybolur.
- İz uzunluğu en fazla `TRAIL = 100` px (hızlı çekişte de uzamaz).
- Fotoğraf pikselleri üzerinde erime/kaynaşma efekti **istenmedi, kaldırıldı**.
- Fare yokken / dokunmatikte görseldeki noktada kendiliğinden kısa dikiş.

## Kullanıcının reddettiği / kaldırttığı şeyler
- Malzeme kataloğu bölümü ve Hizmetler kart bölümü + hizmet detay sayfaları (tekrar ediyordu).
- Hero altındaki bilgi şeridi, Hakkımızda'daki 3 kart, Neden Biz'deki büyük "yıl" sayacı,
  süreç bölümündeki büyük sabit panel, teklif formundaki "Hemen konuşmak" kutusu, iletişimdeki
  WhatsApp kutusu, footer'daki kayan hizmet şeridi.
- Uzun ve geniş kaynak izi, erime efekti.

## Açık işler
- Formlar henüz bir e-posta servisine bağlı değil (Formspree vb. — kullanıcı kararı bekliyor).
- Site yayına alınmadı. Hosting türü bilinmiyor; HTTPS yönlendirmesi `.htaccess`'te kapalı.
- Gerçek iPhone/Safari'de test edilmedi (Chrome mobil taklidiyle test edildi).

## Doğrulama
`npx tsc --noEmit && npx eslint src && npm run build` temiz geçmeli. Değişiklikten sonra `out/`
klasörünü bir statik sunucuyla açıp 390 px (telefon), 820 px (tablet) ve 1440 px (masaüstü)
genişlikte kontrol et; `document.documentElement.scrollWidth === innerWidth` olmalı.
