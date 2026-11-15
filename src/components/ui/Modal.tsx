"use client";

import { AnimatePresence, m } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useRef } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  children: React.ReactNode;
  /** "center": ortada pencere, "side": sağdan açılan panel */
  variant?: "center" | "side";
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** Erişilebilir modal: Escape ile kapanır, odak içeride kalır, kapanınca odak geri döner. */
export default function Modal({ open, onClose, labelledBy, children, variant = "center" }: Props) {
  const panel = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    const t = setTimeout(() => panel.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const els = Array.from(panel.current.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      html.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      lastFocus.current?.focus?.();
    };
  }, [open, onClose]);

  const side = variant === "side";

  return (
    <AnimatePresence>
      {open && (
        <m.div
          className={`fixed inset-0 z-[80] flex ${side ? "justify-end" : "items-end justify-center sm:items-center sm:p-6"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label="Pencereyi kapat"
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-ink/80 backdrop-blur-sm"
            onClick={onClose}
          />
          <m.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            className={
              side
                ? "relative h-full w-full max-w-xl overflow-y-auto bg-white text-ink shadow-2xl"
                : "relative max-h-[92svh] w-full max-w-6xl overflow-y-auto rounded-t-2xl bg-white text-ink shadow-2xl sm:rounded-2xl"
            }
            initial={side ? { x: "100%" } : { y: 60, opacity: 0 }}
            animate={side ? { x: 0 } : { y: 0, opacity: 1 }}
            exit={side ? { x: "100%" } : { y: 40, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="absolute right-3 top-3 z-10 grid size-11 place-items-center rounded-full bg-white/90 text-ink shadow-md ring-1 ring-ink/10 transition hover:bg-copper hover:text-white"
            >
              <X className="size-5" aria-hidden />
            </button>
            {children}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
