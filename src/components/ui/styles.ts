/** Tekrar kullanılan buton / etiket sınıfları */
const base =
  "group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full px-6 text-[0.95rem] font-semibold tracking-wide transition-[background,color,box-shadow,transform] duration-300 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50";

export const btn = {
  copper: `${base} bg-copper text-white hover:bg-copper-deep shadow-[0_10px_30px_-12px_rgb(181_88_31/0.8)]`,
  light: `${base} bg-white text-ink hover:bg-mist`,
  dark: `${base} bg-ink text-white hover:bg-anthracite`,
  ghostLight: `${base} text-white ring-1 ring-inset ring-white/35 hover:bg-white hover:text-ink`,
  ghostDark: `${base} text-ink ring-1 ring-inset ring-ink/20 hover:bg-ink hover:text-white`,
  whatsapp: `${base} bg-[#1f9e55] text-white hover:bg-[#178246]`,
};

export const arrowMove = "transition-transform duration-300 group-hover:translate-x-1";
