"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function ImageUpload({
  bucket,
  name,
  label,
  defaultUrl,
}: {
  bucket: "avatars" | "logos";
  name: string;
  label: string;
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
    <div className="flex flex-col items-center">
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
        className="group relative h-28 w-28 shrink-0 rounded-full disabled:cursor-wait"
        aria-label={label}
      >
        <span className="absolute inset-0 rounded-full bg-[#d8d2c3] p-[1.5px]">
          <span className="block h-full w-full rounded-full bg-white p-[3px]">
            <span className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#f0ede4] text-[#d8d2c3]">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="" className="h-full w-full object-cover" />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" className="h-9 w-9">
                  <path
                    d="M12 12a4 4 0 100-8 4 4 0 000 8zM4 20c0-3.3 3.6-6 8-6s8 2.7 8 6"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </span>
          </span>
        </span>

        <span
          className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition group-hover:opacity-100 ${uploading ? "opacity-100" : ""}`}
        >
          {uploading ? (
            <svg className="h-6 w-6 animate-spin text-white" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-white">
              <path
                d="M4 8h2.5l1-2h5l1 2H16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 012-2z"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
              <circle cx="10" cy="13" r="3" stroke="currentColor" strokeWidth={1.5} />
            </svg>
          )}
        </span>

        <span className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#004741] text-white shadow ring-2 ring-white transition group-hover:bg-[#00614f]">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
            <path
              d="M4 8h2.5l1-2h5l1 2H16a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2v-8a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinejoin="round"
            />
            <circle cx="10" cy="13" r="2.6" stroke="currentColor" strokeWidth={1.8} />
          </svg>
        </span>
      </button>

      <p className="mt-2 text-sm font-medium text-[#113b34]">{label}</p>
      <p className="text-xs text-[#85918a]">{uploading ? "Enviando..." : "Toque para escolher uma imagem"}</p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
