"use client"

import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  className?: string;
  label?: string;
}

export function ImageUpload({ onUploadSuccess, className, label = "Upload Image" }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressAndConvertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1000; // Resize to max 1000px
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Quality 0.6 is plenty for web and makes strings much shorter
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
          resolve(compressedBase64);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setSuccess(false);

    try {
      // Magic happens here: Even if file is 20MB, it becomes small and safe
      const compressedData = await compressAndConvertToBase64(file);
      onUploadSuccess(compressedData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error("Compression failed", error);
      alert("Failed to process image. Try a different one.");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("relative", className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button
        type="button"
        disabled={loading}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "h-12 w-full border rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 transition-all group",
          success 
            ? "bg-green-500/10 border-green-500/50 text-green-500" 
            : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-primary/30"
        )}
      >
        {loading ? (
          <Loader2 className="size-4 animate-spin text-primary" />
        ) : success ? (
          <>
            <CheckCircle2 className="size-4" />
            Done!
          </>
        ) : (
          <>
            <Upload className="size-4 group-hover:text-primary transition-colors" />
            {label}
          </>
        )}
      </Button>
    </div>
  );
}
