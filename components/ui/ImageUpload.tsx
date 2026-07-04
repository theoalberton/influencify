"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ImageUpload({
  bucket,
  name,
  label,
  defaultUrl,
  shape = "circle",
}: {
  bucket: "avatars" | "logos";
  name: string;
  label: string;
  defaultUrl?: string | null;
  shape?: "circle" | "square";
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

      const { error: uploadError } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: true,
      });

      if (uploadError) {
        setError(uploadError.message);
        return;
      }

      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
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
      <div className="mt-2 flex items-center gap-4">
        <div
          className={`flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden bg-slate-100 text-xs text-slate-400 ring-1 ring-slate-200 ${
            shape === "circle" ? "rounded-full" : "rounded-lg"
          }`}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            "Sem foto"
          )}
        </div>
        <div>
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
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {uploading ? "Enviando..." : "Escolher imagem"}
          </button>
          {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
}
