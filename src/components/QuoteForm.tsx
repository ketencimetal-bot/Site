"use client";

import { AnimatePresence, m } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CircleCheck, LoaderCircle, Mail, Pencil, Phone, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "./ui/Reveal";
import { btn, arrowMove } from "./ui/styles";
import { WhatsAppIcon } from "./ui/BrandIcons";
import { Field, ErrorText, inputCls, describedBy } from "./quote/fields";
import FileDrop from "./quote/FileDrop";
import { services } from "@/data/services";
import { materialOptions } from "@/data/content";
import { site } from "@/data/site";
import {
  QUOTE_EVENT,
  hasFormBackend,
  isValidEmail,
  isValidPhone,
  mailtoLink,
  submitForm,
  whatsappLink,
  type QuotePrefill,
} from "@/lib/forms";

const OTHER = "diger";
const serviceOptions = [...services.map((s) => ({ id: s.slug, label: s.title })), { id: OTHER, label: "Diğer / emin değilim" }];

const STEPS = ["Hizmet", "Açıklama", "Malzeme", "Ölçüler", "Dosyalar", "İletişim", "Gönder"] as const;

type Data = {
  service: string;
  description: string;
  location: string;
  materials: string[];
  width: string;
  height: string;
  length: string;
  qty: string;
  unit: "cm" | "m";
  survey: boolean;
  files: File[];
  name: string;
  phone: string;
  email: string;
  company: string;
  consent: boolean;
};

const empty: Data = {
  service: "",
  description: "",
  location: "",
  materials: [],
  width: "",
  height: "",
  length: "",
  qty: "",
  unit: "cm",
  survey: false,
  files: [],
  name: "",
  phone: "",
  email: "",
  company: "",
  consent: false,
};

type Errors = Partial<Record<keyof Data | "measures", string>>;
type Status = "idle" | "sending" | "sent" | "error" | "handoff";

const num = (v: string) => Number(v.replace(",", "."));

function validate(step: number, d: Data): Errors {
  const e: Errors = {};
  if (step === 0 && !d.service) e.service = "Lütfen bir hizmet türü seçin.";
  if (step === 1 && d.description.trim().length < 20)
    e.description = "Lütfen işinizi en az 20 karakterle kısaca anlatın.";
  if (step === 2 && d.materials.length === 0) e.materials = "En az bir seçenek işaretleyin.";
  if (step === 3) {
    const dims = [d.width, d.height, d.length].filter((v) => v.trim() !== "");
    if (dims.some((v) => !(num(v) > 0))) e.measures = "Ölçüler sıfırdan büyük sayı olmalıdır.";
    else if (!d.survey && dims.length === 0)
      e.measures = "En az bir ölçü girin ya da yerinde ölçü (keşif) talep edin.";
    if (d.qty.trim() !== "" && !(Number.isInteger(num(d.qty)) && num(d.qty) >= 1)) e.qty = "Adet 1 veya daha büyük tam sayı olmalıdır.";
  }
  if (step === 5) {
    if (d.name.trim().length < 3) e.name = "Lütfen adınızı ve soyadınızı yazın.";
    if (!isValidPhone(d.phone)) e.phone = "Geçerli bir telefon numarası girin (ör. 0541 273 82 53).";
    if (d.email.trim() && !isValidEmail(d.email)) e.email = "E-posta adresi geçerli görünmüyor.";
    if (!d.consent) e.consent = "Devam etmek için onay kutusunu işaretleyin.";
  }
  return e;
}

const serviceLabel = (id: string) => serviceOptions.find((s) => s.id === id)?.label ?? "-";

function summary(d: Data) {
  const dims = [d.width && `G: ${d.width} ${d.unit}`, d.height && `Y: ${d.height} ${d.unit}`, d.length && `U/D: ${d.length} ${d.unit}`]
    .filter(Boolean)
    .join(", ");
  return [
    "Merhaba, web sitenizden teklif talebi:",
    "",
    `• Hizmet: ${serviceLabel(d.service)}`,
    `• Açıklama: ${d.description.trim()}`,
    d.location && `• Konum: ${d.location}`,
    `• Malzeme: ${d.materials.join(", ")}`,
    dims && `• Ölçüler: ${dims}`,
    d.qty && `• Adet: ${d.qty}`,
    d.survey && "• Yerinde ölçü (keşif) talep ediyorum.",
    d.files.length ? `• Ekler: ${d.files.length} dosya (bu mesaja ekleyeceğim)` : "",
    "",
    `Ad Soyad: ${d.name}`,
    `Telefon: ${d.phone}`,
    d.email && `E-posta: ${d.email}`,
    d.company && `Firma: ${d.company}`,
  ]
    .filter((x) => x !== false && x !== "")
    .join("\n");
}

export default function QuoteForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [d, setD] = useState<Data>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [flash, setFlash] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  const set = <K extends keyof Data>(k: K, v: Data[K]) => {
    setD((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  // Proje penceresinden veya ?hizmet= adresinden gelen ön seçim
  const applyPrefill = useCallback((p: QuotePrefill) => {
    setD((prev) => ({
      ...prev,
      service: p.service && serviceOptions.some((s) => s.id === p.service) ? p.service : prev.service,
      materials: p.material && !prev.materials.includes(p.material) ? [...prev.materials, p.material] : prev.materials,
      description: p.note && !prev.description.includes(p.note) ? (prev.description ? `${prev.description}\n${p.note}` : `${p.note}\n`) : prev.description,
    }));
    setStatus("idle");
    setStep(0);
    setFlash(true);
    setTimeout(() => setFlash(false), 1600);
  }, []);

  useEffect(() => {
    const onPrefill = (e: Event) => applyPrefill((e as CustomEvent<QuotePrefill>).detail);
    window.addEventListener(QUOTE_EVENT, onPrefill);
    const q = new URLSearchParams(window.location.search);
    const hizmet = q.get("hizmet");
    const malzeme = q.get("malzeme");
    // Hizmet sayfasından gelen ?hizmet=… / ?malzeme=… ön seçimi
    const t =
      hizmet || malzeme
        ? setTimeout(() => applyPrefill({ service: hizmet ?? undefined, material: malzeme ?? undefined }), 0)
        : undefined;
    return () => {
      clearTimeout(t);
      window.removeEventListener(QUOTE_EVENT, onPrefill);
    };
  }, [applyPrefill]);

  // Adım değişince başlığa odaklan (ekran okuyucu ve klavye için)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headRef.current?.focus({ preventScroll: true });
    const card = document.getElementById("teklif-kart");
    if (card && card.getBoundingClientRect().top < 0) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step, status]);

  const next = () => {
    const e = validate(step, d);
    setErrors(e);
    if (Object.values(e).some(Boolean)) {
      setTimeout(() => document.querySelector<HTMLElement>("#teklif-kart [aria-invalid='true'], #teklif-kart [role='alert']")?.focus?.(), 30);
      return;
    }
    setDir(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => {
    setErrors({});
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };
  const goTo = (s: number) => {
    setErrors({});
    setDir(s > step ? 1 : -1);
    setStep(s);
  };

  const send = async () => {
    // Son kontrol: tüm adımlar
    for (let s = 0; s < 6; s++) {
      const e = validate(s, d);
      if (Object.values(e).some(Boolean)) {
        setErrors(e);
        goTo(s);
        return;
      }
    }
    if (!hasFormBackend) return; // Bu durumda WhatsApp / e-posta düğmeleri gösterilir
    setStatus("sending");
    const fd = new FormData();
    fd.append("_subject", `Teklif talebi – ${serviceLabel(d.service)} – ${d.name}`);
    fd.append("hizmet", serviceLabel(d.service));
    fd.append("aciklama", d.description);
    fd.append("konum", d.location);
    fd.append("malzeme", d.materials.join(", "));
    fd.append("olculer", `G:${d.width || "-"} Y:${d.height || "-"} U/D:${d.length || "-"} (${d.unit})`);
    fd.append("adet", d.qty);
    fd.append("kesif", d.survey ? "Evet" : "Hayır");
    fd.append("ad_soyad", d.name);
    fd.append("telefon", d.phone);
    fd.append("email", d.email);
    fd.append("firma", d.company);
    d.files.forEach((f) => fd.append("dosyalar", f, f.name));
    const r = await submitForm(fd);
    setStatus(r.ok ? "sent" : "error");
  };

  const reset = () => {
    setD(empty);
    setErrors({});
    setStatus("idle");
    setDir(-1);
    setStep(0);
  };

  const progress = ((step + 1) / STEPS.length) * 100;
  const done = status === "sent" || status === "handoff";

  return (
    <section id="teklif" aria-labelledby="teklif-baslik" className="section-y relative overflow-hidden bg-white">
      <div className="bg-blueprint pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]" />
      <div className="container-x relative grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Sol: başlık ve adım listesi */}
        <div className="lg:col-span-4">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-steel-ink">
              <span className="text-copper">05</span>
              <span className="h-px w-8 bg-ink/20" aria-hidden />
              Teklif al
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 id="teklif-baslik" className="font-display mt-5 text-[clamp(2.6rem,6vw,5.2rem)]">
              Projenizi
              <br />
              <span className="text-copper">anlatın</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-md leading-relaxed text-steel-ink">
              Birkaç adımda ihtiyacınızı paylaşın; ölçü, malzeme ve fotoğraflarla birlikte en doğru teklifi hazırlayalım.
            </p>
          </Reveal>

          <ol className="mt-10 hidden space-y-1 lg:block" aria-label="Form adımları">
            {STEPS.map((s, i) => {
              const state = done || i < step ? "done" : i === step ? "now" : "next";
              return (
                <li key={s} className="flex items-center gap-4 py-2" aria-current={state === "now" ? "step" : undefined}>
                  <span
                    className={`grid size-9 place-items-center rounded-full font-mono text-xs transition-all duration-500 ${
                      state === "done" ? "bg-ink text-white" : state === "now" ? "bg-copper text-white shadow-[0_0_0_5px_rgb(181_88_31/0.15)]" : "bg-mist text-steel-ink"
                    }`}
                  >
                    {state === "done" ? <Check className="size-4" aria-hidden /> : i + 1}
                  </span>
                  <span className={`text-[0.95rem] transition-colors ${state === "next" ? "text-steel-ink" : "font-semibold text-ink"}`}>{s}</span>
                </li>
              );
            })}
          </ol>

        </div>

        {/* Sağ: form kartı */}
        <div className="lg:col-span-8">
          <div
            id="teklif-kart"
            className={`scroll-mt-24 overflow-hidden rounded-3xl bg-white shadow-[0_40px_80px_-40px_rgb(17_19_21/0.35)] ring-1 transition-[box-shadow] duration-700 ${
              flash ? "ring-2 ring-copper" : "ring-ink/8"
            }`}
          >
            {/* İlerleme */}
            <div className="border-b border-ink/8 px-5 pb-5 pt-6 sm:px-10">
              <div className="flex items-center justify-between text-sm">
                <span className="font-mono text-xs uppercase tracking-[0.16em] text-steel-ink">
                  {done ? "Tamamlandı" : `Adım ${step + 1} / ${STEPS.length}`}
                </span>
                <span className="font-semibold">{done ? "✓" : STEPS[step]}</span>
              </div>
              <div
                className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist"
                role="progressbar"
                aria-label="Form ilerlemesi"
                aria-valuemin={1}
                aria-valuemax={STEPS.length}
                aria-valuenow={done ? STEPS.length : step + 1}
              >
                <m.div className="h-full rounded-full bg-copper" animate={{ width: done ? "100%" : `${progress}%` }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} />
              </div>
            </div>

            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                if (step < STEPS.length - 1) next();
                else send();
              }}
              className="px-5 py-8 sm:px-10 sm:py-10"
            >
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <m.div
                  key={done ? status : step}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -40 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="min-h-[22rem]"
                >
                  {done ? (
                    <Done status={status} onReset={reset} headRef={headRef} />
                  ) : (
                    <>
                      <h3 ref={headRef} tabIndex={-1} className="font-display text-[2.1rem] outline-none sm:text-[2.6rem]">
                        {["Hangi hizmete ihtiyacınız var?", "Projenizi kısaca anlatın", "Hangi malzeme kullanılsın?", "Yaklaşık ölçüler", "Fotoğraf veya çizim ekleyin", "İletişim bilgileriniz", "Kontrol edin ve gönderin"][step]}
                      </h3>
                      <div className="mt-7">{renderStep()}</div>
                    </>
                  )}
                </m.div>
              </AnimatePresence>

              {!done && (
                <div className="mt-10 flex flex-col-reverse gap-3 border-t border-ink/8 pt-6 xs:flex-row xs:items-center xs:justify-between">
                  <button type="button" onClick={back} disabled={step === 0} className={`${btn.ghostDark} disabled:invisible`}>
                    <ArrowLeft className="size-4" aria-hidden /> Geri
                  </button>
                  {step < STEPS.length - 1 ? (
                    <button type="submit" className={btn.copper}>
                      İleri <ArrowRight className={`size-4 ${arrowMove}`} aria-hidden />
                    </button>
                  ) : hasFormBackend ? (
                    <button type="submit" className={btn.copper} disabled={status === "sending"}>
                      {status === "sending" ? (
                        <>
                          <LoaderCircle className="size-4 animate-spin" aria-hidden /> Gönderiliyor…
                        </>
                      ) : (
                        <>
                          Talebi gönder <ArrowRight className={`size-4 ${arrowMove}`} aria-hidden />
                        </>
                      )}
                    </button>
                  ) : null}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );

  function renderStep() {
    switch (step) {
      case 0:
        return (
          <fieldset aria-describedby={describedBy("q-service", errors.service)}>
            <legend className="sr-only">Hizmet türü</legend>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {serviceOptions.map((s) => {
                const on = d.service === s.id;
                return (
                  <label
                    key={s.id}
                    className={`relative flex min-h-14 cursor-pointer items-center gap-3 rounded-xl px-4 py-3 ring-1 ring-inset transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper ${
                      on ? "bg-ink text-white ring-ink" : "bg-paper ring-ink/10 hover:ring-ink/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="service"
                      value={s.id}
                      checked={on}
                      onChange={() => set("service", s.id)}
                      className="sr-only"
                    />
                    <span className={`grid size-5 shrink-0 place-items-center rounded-full ring-1 ${on ? "bg-copper ring-copper" : "ring-ink/25"}`}>
                      {on && <Check className="size-3 text-white" aria-hidden />}
                    </span>
                    <span className="text-[0.95rem] font-medium">{s.label}</span>
                  </label>
                );
              })}
            </div>
            <ErrorText id="q-service-err" error={errors.service} />
          </fieldset>
        );
      case 1:
        return (
          <div className="grid gap-6">
            <Field id="q-desc" label="Proje açıklaması" error={errors.description} hint="Ne yaptırmak istiyorsunuz, nerede kullanılacak, varsa özel istekleriniz.">
              <textarea
                id="q-desc"
                rows={6}
                value={d.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Örn. Dükkânımıza yaklaşık 40 m²'lik çelik asma kat ve merdiveni yaptırmak istiyoruz…"
                className={`${inputCls} resize-y`}
                aria-invalid={!!errors.description}
                aria-describedby={describedBy("q-desc", errors.description, "x")}
              />
              <span className="mt-1.5 block text-right font-mono text-xs text-steel-ink">{d.description.trim().length} karakter</span>
            </Field>
            <Field id="q-loc" label="Uygulama yeri (ilçe / şehir)" optional>
              <input id="q-loc" value={d.location} onChange={(e) => set("location", e.target.value)} placeholder="Örn. Bağcılar, İstanbul" className={inputCls} autoComplete="address-level2" />
            </Field>
          </div>
        );
      case 2:
        return (
          <fieldset aria-describedby={describedBy("q-mat", errors.materials)}>
            <legend className="mb-4 text-sm text-steel-ink">Birden fazla seçebilirsiniz.</legend>
            <div className="flex flex-wrap gap-2.5">
              {materialOptions.map((mat) => {
                const on = d.materials.includes(mat);
                return (
                  <label
                    key={mat}
                    className={`inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full px-5 text-[0.95rem] font-medium ring-1 ring-inset transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper ${
                      on ? "bg-copper text-white ring-copper" : "bg-paper ring-ink/12 hover:ring-ink/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={on}
                      onChange={() => set("materials", on ? d.materials.filter((x) => x !== mat) : [...d.materials, mat])}
                      aria-invalid={!!errors.materials}
                    />
                    {on && <Check className="size-4" aria-hidden />}
                    {mat}
                  </label>
                );
              })}
            </div>
            <ErrorText id="q-mat-err" error={errors.materials} />
          </fieldset>
        );
      case 3:
        return (
          <div className="grid gap-6">
            <div className="flex items-center gap-2" role="radiogroup" aria-label="Ölçü birimi">
              {(["cm", "m"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  role="radio"
                  aria-checked={d.unit === u}
                  onClick={() => set("unit", u)}
                  className={`min-h-11 rounded-full px-5 font-mono text-sm transition ${d.unit === u ? "bg-ink text-white" : "bg-paper ring-1 ring-inset ring-ink/12"}`}
                >
                  {u}
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {(
                [
                  ["width", "Genişlik"],
                  ["height", "Yükseklik"],
                  ["length", "Uzunluk / derinlik"],
                ] as const
              ).map(([k, l]) => (
                <Field key={k} id={`q-${k}`} label={`${l} (${d.unit})`}>
                  <input
                    id={`q-${k}`}
                    inputMode="decimal"
                    value={d[k]}
                    onChange={(e) => {
                      set(k, e.target.value.replace(/[^\d.,]/g, ""));
                      setErrors((x) => ({ ...x, measures: undefined }));
                    }}
                    placeholder="—"
                    className={`${inputCls} font-mono`}
                    aria-invalid={!!errors.measures}
                    aria-describedby={errors.measures ? "q-measures-err" : undefined}
                  />
                </Field>
              ))}
            </div>
            <ErrorText id="q-measures-err" error={errors.measures} />
            <div className="grid gap-4 sm:grid-cols-3">
              <Field id="q-qty" label="Adet" optional error={errors.qty}>
                <input id="q-qty" inputMode="numeric" value={d.qty} onChange={(e) => set("qty", e.target.value.replace(/\D/g, ""))} placeholder="1" className={`${inputCls} font-mono`} aria-invalid={!!errors.qty} aria-describedby={describedBy("q-qty", errors.qty)} />
              </Field>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-paper p-4 ring-1 ring-inset ring-ink/10 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper">
              <input
                type="checkbox"
                checked={d.survey}
                onChange={(e) => {
                  set("survey", e.target.checked);
                  setErrors((x) => ({ ...x, measures: undefined }));
                }}
                className="mt-0.5 size-5 accent-[var(--color-copper)]"
              />
              <span>
                <span className="font-semibold">Ölçüleri bilmiyorum, yerinde ölçü (keşif) istiyorum</span>
                <span className="mt-0.5 block text-sm text-steel-ink">Ekibimiz sizinle iletişime geçip ölçü için gün planlar.</span>
              </span>
            </label>
          </div>
        );
      case 4:
        return (
          <div>
            <p className="mb-5 text-steel-ink">Mekânın fotoğrafı, eskiz veya teknik çizim teklifi hızlandırır. Bu adım isteğe bağlıdır.</p>
            <FileDrop files={d.files} onChange={(f) => set("files", f)} />
          </div>
        );
      case 5:
        return (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="q-name" label="Ad soyad" error={errors.name}>
              <input id="q-name" value={d.name} onChange={(e) => set("name", e.target.value)} autoComplete="name" className={inputCls} aria-invalid={!!errors.name} aria-describedby={describedBy("q-name", errors.name)} />
            </Field>
            <Field id="q-phone" label="Telefon" error={errors.phone}>
              <input id="q-phone" type="tel" inputMode="tel" value={d.phone} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" placeholder="05xx xxx xx xx" className={`${inputCls} font-mono`} aria-invalid={!!errors.phone} aria-describedby={describedBy("q-phone", errors.phone)} />
            </Field>
            <Field id="q-email" label="E-posta" optional error={errors.email}>
              <input id="q-email" type="email" inputMode="email" value={d.email} onChange={(e) => set("email", e.target.value)} autoComplete="email" className={inputCls} aria-invalid={!!errors.email} aria-describedby={describedBy("q-email", errors.email)} />
            </Field>
            <Field id="q-company" label="Firma" optional>
              <input id="q-company" value={d.company} onChange={(e) => set("company", e.target.value)} autoComplete="organization" className={inputCls} />
            </Field>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl p-1 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-copper">
                <input
                  id="q-consent"
                  type="checkbox"
                  checked={d.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                  className="mt-0.5 size-5 accent-[var(--color-copper)]"
                  aria-invalid={!!errors.consent}
                  aria-describedby={describedBy("q-consent", errors.consent)}
                />
                <span className="text-sm leading-relaxed text-steel-ink">
                  Paylaştığım bilgilerin yalnızca teklif hazırlanması ve benimle iletişime geçilmesi amacıyla kullanılmasını kabul ediyorum.
                </span>
              </label>
              <ErrorText id="q-consent-err" error={errors.consent} />
            </div>
          </div>
        );
      default:
        return renderReview();
    }
  }

  function renderReview() {
    const rows: [string, string, number][] = [
      ["Hizmet", serviceLabel(d.service), 0],
      ["Açıklama", d.description.trim() + (d.location ? ` — ${d.location}` : ""), 1],
      ["Malzeme", d.materials.join(", "), 2],
      [
        "Ölçüler",
        [d.width && `G ${d.width}`, d.height && `Y ${d.height}`, d.length && `U/D ${d.length}`].filter(Boolean).join(" × ") +
          (d.width || d.height || d.length ? ` ${d.unit}` : "") +
          (d.qty ? ` · ${d.qty} adet` : "") +
          (d.survey ? (d.width || d.height || d.length ? " · " : "") + "Yerinde ölçü istendi" : ""),
        3,
      ],
      ["Dosyalar", d.files.length ? d.files.map((f) => f.name).join(", ") : "Eklenmedi", 4],
      ["İletişim", [d.name, d.phone, d.email, d.company].filter(Boolean).join(" · "), 5],
    ];
    const text = summary(d);
    return (
      <div>
        <dl className="divide-y divide-ink/8 overflow-hidden rounded-2xl ring-1 ring-ink/8">
          {rows.map(([k, v, s]) => (
            <div key={k} className="grid grid-cols-[1fr_auto] gap-3 bg-paper/60 px-5 py-4 sm:grid-cols-[8rem_1fr_auto]">
              <dt className="eyebrow pt-0.5 !text-[0.66rem] text-steel-ink">{k}</dt>
              <dd className="col-span-2 row-start-2 whitespace-pre-line break-words text-[0.95rem] sm:col-span-1 sm:row-start-1 sm:col-start-2">{v || "—"}</dd>
              <dd className="col-start-2 row-start-1 sm:col-start-3">
                <button type="button" onClick={() => goTo(s)} className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-sm font-semibold text-copper hover:bg-copper/10">
                  <Pencil className="size-3.5" aria-hidden /> Düzenle
                </button>
              </dd>
            </div>
          ))}
        </dl>

        {status === "error" && (
          <p role="alert" className="mt-6 rounded-xl bg-red-50 p-4 text-sm text-red-800">
            Talep gönderilemedi. Bağlantınızı kontrol edip tekrar deneyin ya da aşağıdaki seçeneklerle bize ulaşın.
          </p>
        )}

        {(!hasFormBackend || status === "error") && (
          <div className="mt-8 rounded-2xl bg-ink p-6 text-white sm:p-8">
            <p className="font-semibold">Talebinizi nasıl iletmek istersiniz?</p>
            <p className="mt-1.5 text-sm text-steel-light">
              Bilgileriniz hazır bir mesaja dönüştürüldü. Uygulama açılınca göndermeniz yeterli.
              {d.files.length > 0 && " Dosyalarınızı mesaja ayrıca eklemeyi unutmayın."}
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <a
                href={whatsappLink(text)}
                target="_blank"
                rel="noopener"
                className={btn.whatsapp}
                onClick={() => setStatus("handoff")}
              >
                <WhatsAppIcon className="size-5" /> WhatsApp ile gönder
              </a>
              <a
                href={mailtoLink(`Teklif talebi – ${serviceLabel(d.service)}`, text)}
                className={btn.light}
                onClick={() => setStatus("handoff")}
              >
                <Mail className="size-4" aria-hidden /> E-posta ile gönder
              </a>
            </div>
          </div>
        )}
      </div>
    );
  }
}

function Done({ status, onReset, headRef }: { status: Status; onReset: () => void; headRef: React.RefObject<HTMLHeadingElement | null> }) {
  const sent = status === "sent";
  return (
    <div className="flex flex-col items-start py-4" role="status">
      <m.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="grid size-20 place-items-center rounded-full bg-copper text-white shadow-[0_0_0_10px_rgb(181_88_31/0.12)]"
      >
        <CircleCheck className="size-10" aria-hidden strokeWidth={1.6} />
      </m.span>
      <h3 ref={headRef} tabIndex={-1} className="font-display mt-8 text-[2.4rem] outline-none sm:text-[3rem]">
        {sent ? "Talebiniz bize ulaştı" : "Mesajınız hazırlandı"}
      </h3>
      <p className="mt-4 max-w-lg leading-relaxed text-steel-ink">
        {sent
          ? `Teşekkürler! Talebinizi inceleyip en kısa sürede sizinle iletişime geçeceğiz. Acil durumlar için ${site.phoneDisplay} numarasından bize ulaşabilirsiniz.`
          : "Açılan uygulamada mesajı gönderdiğinizde talebiniz bize ulaşır. Uygulama açılmadıysa bizi doğrudan arayabilirsiniz."}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={`tel:${site.phoneE164}`} className={btn.dark}>
          <Phone className="size-4" aria-hidden /> {site.phoneDisplay}
        </a>
        <button type="button" onClick={onReset} className={btn.ghostDark}>
          <RotateCcw className="size-4" aria-hidden /> Yeni talep oluştur
        </button>
      </div>
    </div>
  );
}
