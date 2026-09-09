"use client";

import { useRef, useState } from "react";
import { ACCEPTED_EXT, processUploadedFile, UploadError, type DesignSource } from "@/lib/customizer/upload";

interface Props {
  onSource: (source: DesignSource) => void;
  compact?: boolean;
}

export function UploadDropzone({ onSource, compact = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [drag, setDrag] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    setWarnings([]);
    try {
      const source = await processUploadedFile(file);
      setWarnings(source.warnings);
      onSource(source);
    } catch (err) {
      setError(err instanceof UploadError ? err.message : "A fájl feldolgozása nem sikerült.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div>
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          void handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed text-center transition ${compact ? "px-4 py-5" : "px-6 py-10"} ${drag ? "border-accent bg-accent/5" : "border-line hover:border-foreground/50"}`}
      >
        <input ref={inputRef} type="file" accept={ACCEPTED_EXT.map((e) => `.${e}`).join(",")} className="sr-only" onChange={(e) => void handleFiles(e.target.files)} disabled={busy} />
        <span className="text-sm font-semibold">{busy ? "Feldolgozás…" : "Kép feltöltése"}</span>
        <span className="mt-1 text-xs text-muted">Húzd ide, vagy kattints · PNG, JPG, WebP, SVG · max 10 MB</span>
      </label>
      {error ? (
        <p role="alert" className="mt-2 text-xs text-red-700">
          {error}
        </p>
      ) : null}
      {warnings.map((w) => (
        <p key={w} className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {w}
        </p>
      ))}
    </div>
  );
}
