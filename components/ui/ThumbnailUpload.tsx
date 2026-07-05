"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ThumbnailUpload({
  name,
  label,
  hint,
  defaultUrl,
}: {
  name: string;
  label: string;
  hint?: string;
  defaultUrl?: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(defaultUrl ?? null);
  const [url, setUrl] = useState(defaultUrl ?? "");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Sessão expirada, recarregue a página.");
        return;
      }

      const ext = file.name.split(".").pop();
      const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("campaign-images").upload(path, file, {
        upsert: true,
      });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { data } = supabase.storage.from("campaign-images").getPublicUrl(path);
      setUrl(data.publicUrl);
    } catch {
      setError("Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <input type="hidden" name={name} value={url} />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="group relative mt-1 block aspect-video w-full max-w-sm overflow-hidden rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-indigo-400 disabled:cursor-wait"
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-400">
            <svg viewBox="0 0 24 24" fill="none" className="h-8 w-8">
              <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth={1.5} />
              <path d="M3 15l4.5-4.5a2 2 0 012.8 0L15 15" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
              <circle cx="16" cy="9" r="1.5" stroke="currentColor" strokeWidth={1.5} />
            </svg>
            <span className="text-xs font-medium">Adicionar thumbnail</span>
            <span className="text-[11px]">1280 x 720 recomendado</span>
          </div>
        )}

        <span
          className={`absolute inset-0 flex items-center justify-center bg-black/40 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100 ${
            uploading ? "opacity-100" : ""
          }`}
        >
          {uploading ? "Enviando..." : "Trocar imagem"}
        </span>
      </button>

      {hint && !error && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
