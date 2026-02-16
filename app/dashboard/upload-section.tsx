"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function UploadSection({ userId }: { userId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setError("Seuls les fichiers PDF sont acceptés.");
      return;
    }

    setError(null);
    setUploading(true);

    const supabase = createClient();
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${userId}/${fileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("pdfs")
      .upload(filePath, file);

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    // Save reference in courses table
    const title = file.name.replace(/\.pdf$/i, "");
    const { error: dbError } = await supabase.from("courses").insert({
      user_id: userId,
      title,
      file_path: filePath,
    });

    if (dbError) {
      setError(dbError.message);
      setUploading(false);
      return;
    }

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    router.refresh();
  }

  return (
    <div className="mt-6">
      <label
        className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-foreground/20 px-4 py-8 text-sm transition-colors hover:border-foreground/40 ${
          uploading ? "pointer-events-none opacity-50" : ""
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleUpload}
          className="hidden"
          disabled={uploading}
        />
        {uploading ? "Upload en cours..." : "Clique ou glisse un PDF ici"}
      </label>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
