import { useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MAX_FILES = 5;
const MAX_SIZE = 5 * 1024 * 1024;
const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({
  urls,
  onChange,
  userId,
}: {
  urls: string[];
  onChange: (urls: string[]) => void;
  userId: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_FILES - urls.length;
    const list = Array.from(files).slice(0, remaining);
    if (list.length === 0) {
      toast.error(`Max ${MAX_FILES} images`);
      return;
    }
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of list) {
        if (!ACCEPT.includes(file.type)) {
          toast.error(`${file.name}: only JPG, PNG, WEBP allowed`);
          continue;
        }
        if (file.size > MAX_SIZE) {
          toast.error(`${file.name}: max 5MB`);
          continue;
        }
        const ext = file.name.split(".").pop() ?? "jpg";
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error } = await supabase.storage.from("review-images").upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (error) {
          toast.error(error.message);
          continue;
        }
        const { data } = supabase.storage.from("review-images").getPublicUrl(path);
        uploaded.push(data.publicUrl);
      }
      if (uploaded.length) onChange([...urls, ...uploaded]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/40 px-4 py-6 text-sm font-medium text-muted-foreground transition hover:border-primary hover:text-primary">
        {uploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Upload className="h-5 w-5" />}
        <span>{uploading ? "Uploading…" : `Add photos (${urls.length}/${MAX_FILES})`}</span>
        <input
          type="file"
          accept={ACCEPT.join(",")}
          multiple
          className="hidden"
          disabled={uploading || urls.length >= MAX_FILES}
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </label>
      {urls.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {urls.map((u, i) => (
            <div key={u} className="relative aspect-square overflow-hidden rounded-md border border-border bg-muted">
              <img src={u} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(urls.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white transition hover:bg-black"
                aria-label="Remove"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
