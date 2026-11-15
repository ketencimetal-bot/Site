"use client";

import { CircleCheck, LoaderCircle, Mail, Send } from "lucide-react";
import { useState } from "react";
import { Field, ErrorText, inputCls, describedBy } from "../quote/fields";
import { btn } from "../ui/styles";
import { WhatsAppIcon } from "../ui/BrandIcons";
import { hasFormBackend, isValidEmail, isValidPhone, mailtoLink, submitForm, whatsappLink } from "@/lib/forms";

type D = { name: string; phone: string; email: string; message: string; consent: boolean };
type E = Partial<Record<keyof D, string>>;

export default function ContactForm() {
  const [d, setD] = useState<D>({ name: "", phone: "", email: "", message: "", consent: false });
  const [e, setE] = useState<E>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error" | "ready">("idle");

  const set = <K extends keyof D>(k: K, v: D[K]) => {
    setD((p) => ({ ...p, [k]: v }));
    if (e[k]) setE((x) => ({ ...x, [k]: undefined }));
    if (status === "ready") setStatus("idle");
  };

  const validate = () => {
    const x: E = {};
    if (d.name.trim().length < 3) x.name = "Lütfen adınızı yazın.";
    if (!isValidPhone(d.phone)) x.phone = "Geçerli bir telefon numarası girin.";
    if (d.email.trim() && !isValidEmail(d.email)) x.email = "E-posta adresi geçerli görünmüyor.";
    if (d.message.trim().length < 10) x.message = "Mesajınız en az 10 karakter olmalı.";
    if (!d.consent) x.consent = "Devam etmek için onay verin.";
    setE(x);
    return !Object.values(x).some(Boolean);
  };

  const text = `Merhaba, web sitenizden yazıyorum.\n\n${d.message.trim()}\n\nAd Soyad: ${d.name}\nTelefon: ${d.phone}${d.email ? `\nE-posta: ${d.email}` : ""}`;

  const onSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) {
      setTimeout(() => document.querySelector<HTMLElement>("#iletisim-form [aria-invalid='true']")?.focus(), 20);
      return;
    }
    if (!hasFormBackend) {
      setStatus("ready");
      return;
    }
    setStatus("sending");
    const fd = new FormData();
    fd.append("_subject", `İletişim formu – ${d.name}`);
    Object.entries(d).forEach(([k, v]) => k !== "consent" && fd.append(k, String(v)));
    const r = await submitForm(fd);
    setStatus(r.ok ? "sent" : "error");
  };

  if (status === "sent")
    return (
      <div role="status" className="flex h-full flex-col items-start justify-center rounded-3xl bg-white p-8 ring-1 ring-ink/8 sm:p-10">
        <CircleCheck className="size-12 text-copper" strokeWidth={1.6} aria-hidden />
        <p className="font-display mt-6 text-4xl">Mesajınız ulaştı</p>
        <p className="mt-3 text-steel-ink">Teşekkürler, en kısa sürede size dönüş yapacağız.</p>
      </div>
    );

  return (
    <form id="iletisim-form" noValidate onSubmit={onSubmit} className="grid gap-5 rounded-3xl bg-white p-6 ring-1 ring-ink/8 sm:grid-cols-2 sm:p-10">
      <p className="font-display text-[2rem] sm:col-span-2">Bize yazın</p>
      <Field id="c-name" label="Ad soyad" error={e.name}>
        <input id="c-name" value={d.name} onChange={(x) => set("name", x.target.value)} autoComplete="name" className={inputCls} aria-invalid={!!e.name} aria-describedby={describedBy("c-name", e.name)} />
      </Field>
      <Field id="c-phone" label="Telefon" error={e.phone}>
        <input id="c-phone" type="tel" inputMode="tel" value={d.phone} onChange={(x) => set("phone", x.target.value)} autoComplete="tel" placeholder="05xx xxx xx xx" className={`${inputCls} font-mono`} aria-invalid={!!e.phone} aria-describedby={describedBy("c-phone", e.phone)} />
      </Field>
      <div className="sm:col-span-2">
        <Field id="c-email" label="E-posta" optional error={e.email}>
          <input id="c-email" type="email" inputMode="email" value={d.email} onChange={(x) => set("email", x.target.value)} autoComplete="email" className={inputCls} aria-invalid={!!e.email} aria-describedby={describedBy("c-email", e.email)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field id="c-msg" label="Mesajınız" error={e.message}>
          <textarea id="c-msg" rows={5} value={d.message} onChange={(x) => set("message", x.target.value)} className={`${inputCls} resize-y`} aria-invalid={!!e.message} aria-describedby={describedBy("c-msg", e.message)} />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <label className="flex cursor-pointer items-start gap-3">
          <input type="checkbox" checked={d.consent} onChange={(x) => set("consent", x.target.checked)} className="mt-0.5 size-5 accent-[var(--color-copper)]" aria-invalid={!!e.consent} aria-describedby={describedBy("c-consent", e.consent)} />
          <span className="text-sm text-steel-ink">Bilgilerimin yalnızca benimle iletişime geçilmesi amacıyla kullanılmasını kabul ediyorum.</span>
        </label>
        <ErrorText id="c-consent-err" error={e.consent} />
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800 sm:col-span-2">
          Mesaj gönderilemedi. Lütfen tekrar deneyin veya WhatsApp / telefon ile ulaşın.
        </p>
      )}

      {status === "ready" || status === "error" ? (
        <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2" role="status">
          <p className="text-sm text-steel-ink sm:col-span-2">Mesajınız hazır. Göndermek için bir kanal seçin:</p>
          <a href={whatsappLink(text)} target="_blank" rel="noopener" className={btn.whatsapp}>
            <WhatsAppIcon className="size-5" /> WhatsApp ile gönder
          </a>
          <a href={mailtoLink(`Web sitesi mesajı – ${d.name}`, text)} className={btn.ghostDark}>
            <Mail className="size-4" aria-hidden /> E-posta ile gönder
          </a>
        </div>
      ) : (
        <button type="submit" className={`${btn.copper} sm:col-span-2 sm:justify-self-start`} disabled={status === "sending"}>
          {status === "sending" ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
          {status === "sending" ? "Gönderiliyor…" : "Mesajı gönder"}
        </button>
      )}
    </form>
  );
}
