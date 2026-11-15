"use client";

import { FileText, ImageIcon, Trash2, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ErrorText } from "./fields";

export const MAX_FILES = 6;
export const MAX_MB = 10;
const ACCEPT = ".jpg,.jpeg,.png,.webp,.heic,.pdf,.dwg,.dxf";
const OK_EXT = /\.(jpe?g|png|webp|heic|pdf|dwg|dxf)$/i;

const fmt = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);

/** Sürükle-bırak dosya yükleme alanı: görsel, PDF, DWG/DXF; boyut ve adet kontrolü. */
export default function FileDrop({ files, onChange }: { files: File[]; onChange: (f: File[]) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string>();

  const previews = useMemo(
    () => files.map((f) => (f.type.startsWith("image/") && !/heic/i.test(f.type) ? URL.createObjectURL(f) : null)),
    [files],
  );
  useEffect(() => () => previews.forEach((u) => u && URL.revokeObjectURL(u)), [previews]);

  const add = (list: FileList | null) => {
    if (!list) return;
    const incoming = Array.from(list);
    const bad = incoming.find((f) => !OK_EXT.test(f.name));
    const big = incoming.find((f) => f.size > MAX_MB * 1024 * 1024);
    const accepted = incoming.filter((f) => OK_EXT.test(f.name) && f.size <= MAX_MB * 1024 * 1024);
    const merged = [...files, ...accepted.filter((a) => !files.some((f) => f.name === a.name && f.size === a.size))];
    if (merged.length > MAX_FILES) {
      setError(`En fazla ${MAX_FILES} dosya ekleyebilirsiniz.`);
      onChange(merged.slice(0, MAX_FILES));
      return;
    }
    setError(
      bad ? `"${bad.name}" desteklenmiyor. JPG, PNG, WEBP, HEIC, PDF, DWG veya DXF yükleyin.` : big ? `"${big.name}" ${MAX_MB} MB sınırını aşıyor.` : undefined,
    );
    onChange(merged);
  };

  return (
    <div>
      <label
        htmlFor="q-files"
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 py-10 text-center transition ${
          drag ? "border-copper bg-copper/5" : "border-ink/15 bg-paper hover:border-copper/60 hover:bg-white"
        }`}
      >
        <span className="grid size-14 place-items-center rounded-full bg-white shadow-sm ring-1 ring-ink/10">
          <Upload className="size-6 text-copper" aria-hidden />
        </span>
        <span className="mt-4 font-semibold">Dosyaları sürükleyin veya seçmek için dokunun</span>
        <span className="mt-1 text-sm text-steel-ink">
          Fotoğraf, teknik çizim veya PDF · en fazla {MAX_FILES} dosya, her biri {MAX_MB} MB
        </span>
        <input
          ref={input}
          id="q-files"
          type="file"
          multiple
          accept={ACCEPT}
          className="sr-only"
          onChange={(e) => {
            add(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      <ErrorText id="q-files-err" error={error} />

      {files.length > 0 && (
        <ul className="mt-4 grid gap-2 sm:grid-cols-2" aria-label="Eklenen dosyalar">
          {files.map((f, i) => (
            <li key={f.name + f.size} className="flex items-center gap-3 rounded-xl bg-white p-2.5 ring-1 ring-ink/10">
              <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-mist">
                {previews[i] ? (
                  <img src={previews[i]!} alt="" className="size-full object-cover" />
                ) : /\.pdf$/i.test(f.name) ? (
                  <FileText className="size-5 text-copper" aria-hidden />
                ) : (
                  <ImageIcon className="size-5 text-steel-ink" aria-hidden />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{f.name}</span>
                <span className="font-mono text-xs text-steel-ink">{fmt(f.size)}</span>
              </span>
              <button
                type="button"
                onClick={() => onChange(files.filter((_, j) => j !== i))}
                aria-label={`${f.name} dosyasını kaldır`}
                className="grid size-11 place-items-center rounded-full text-steel-ink transition hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="size-4" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
