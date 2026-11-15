import { site } from "@/data/site";

/**
 * FORM GÖNDERİMİ
 * ----------------------------------------------------------------------------
 * Site statik olduğu için kendi sunucusu yoktur. Formları e-postaya düşürmek için
 * `.env.local` dosyasına bir form servisi adresi yazın ve siteyi yeniden derleyin:
 *
 *   NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/XXXXXXX
 *
 * Adres, `multipart/form-data` POST kabul eden herhangi bir servis olabilir
 * (Formspree, Getform, Basin veya kendi PHP/Node betiğiniz). İstek 2xx dönerse
 * başarılı sayılır.
 *
 * Adres TANIMLI DEĞİLSE formlar hiçbir şeyi "gönderilmiş gibi" göstermez:
 * kullanıcıya talebi WhatsApp veya e-posta ile iletmesi için hazır mesaj sunulur.
 */
export const FORM_ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";
export const hasFormBackend = FORM_ENDPOINT.length > 0;

export async function submitForm(data: FormData): Promise<{ ok: boolean; error?: string }> {
  if (!hasFormBackend) return { ok: false, error: "no-backend" };
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    return res.ok ? { ok: true } : { ok: false, error: `HTTP ${res.status}` };
  } catch {
    return { ok: false, error: "network" };
  }
}

export const whatsappLink = (text: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}`;

export const mailtoLink = (subject: string, body: string) =>
  `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/** Türkiye telefon numarası: 05xx…, +90 5xx…, 0212… (boşluk/parantez/tire serbest) */
export function isValidPhone(v: string) {
  const d = v.replace(/[\s()\-.]/g, "");
  return /^(\+?90|0)?[2-5]\d{9}$/.test(d);
}

export function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
}

/** Hizmet / malzeme ön seçimi: bileşenler arası olay */
export type QuotePrefill = { service?: string; material?: string; note?: string };
export const QUOTE_EVENT = "ketenci:quote-prefill";

export function requestQuote(prefill: QuotePrefill) {
  window.dispatchEvent(new CustomEvent<QuotePrefill>(QUOTE_EVENT, { detail: prefill }));
  const target = document.getElementById("teklif-kart") ?? document.getElementById("teklif");
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}
