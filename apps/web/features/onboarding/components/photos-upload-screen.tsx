"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  useRef,
  useState,
} from "react";

const MAX_PHOTOS_PER_CATEGORY = 10;

type PhotosUploadScreenProps = {
  categories: string[];
  businessName: string;
  profileId: string;
  onNext: (uploadedPhotos: Record<string, string[]>) => void;
  onSkip: () => void;
};

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function PhotosUploadScreen({
  categories,
  businessName: _businessName,
  profileId,
  onNext,
  onSkip,
}: PhotosUploadScreenProps) {
  const [photosByCategory, setPhotosByCategory] = useState<
    Record<string, string[]>
  >(() => Object.fromEntries(categories.map((category) => [category, []])));
  const [isUploading, setIsUploading] = useState(false);
  const [dragOverCategory, setDragOverCategory] = useState<string | null>(
    null,
  );
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  async function addPhotos(category: string, files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (imageFiles.length === 0) return;

    const dataUrls = await Promise.all(imageFiles.map(readFileAsDataUrl));

    setPhotosByCategory((prev) => {
      const current = prev[category] ?? [];
      const remaining = MAX_PHOTOS_PER_CATEGORY - current.length;
      if (remaining <= 0) return prev;

      return {
        ...prev,
        [category]: [...current, ...dataUrls.slice(0, remaining)],
      };
    });
  }

  async function handleFilesSelected(
    category: string,
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const files = event.target.files;
    if (!files) return;

    await addPhotos(category, files);
    event.target.value = "";
  }

  function handleDragOver(category: string, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOverCategory(category);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOverCategory(null);
  }

  function handleDrop(category: string, event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOverCategory(null);
    void addPhotos(category, event.dataTransfer.files);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUploading(true);

    try {
      const uploadEntries = await Promise.all(
        categories
          .filter((category) => (photosByCategory[category] ?? []).length > 0)
          .map(async (category) => {
            const photos = photosByCategory[category] ?? [];
            const response = await fetch("/api/upload", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ images: photos, category, profileId }),
            });

            if (!response.ok) {
              throw new Error("Upload failed");
            }

            const data = (await response.json()) as { urls: string[] };
            return [category, data.urls] as const;
          }),
      );

      const urlsByCategory = Object.fromEntries(uploadEntries);
      onNext(urlsByCategory);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <main className="flex min-h-[100svh] flex-col px-6 py-10">
      <header className="mx-auto flex w-full max-w-md items-center gap-3">
        <div className="relative">
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full bg-primary"
          >
            <span className="size-3 rounded-full bg-primary-foreground" />
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -start-0.5 size-3 rounded-full border-2 border-background bg-emerald-500"
          />
        </div>
        <span className="text-sm font-medium tracking-tight text-muted-foreground">
          העוזר שלך
        </span>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col pt-8">
        <header className="mb-8 text-start">
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            תמונות לאתר שלך
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            תמונות אמיתיות מגדילות אמון ומביאות יותר לקוחות
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="flex flex-col gap-8">
            {categories.map((category) => {
              const photos = photosByCategory[category] ?? [];
              const inputId = `photos-${category}`;

              return (
                <section key={category} aria-labelledby={inputId}>
                  <label
                    htmlFor={inputId}
                    className="mb-3 block text-sm font-medium text-foreground"
                  >
                    {category}
                  </label>

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => inputRefs.current[category]?.click()}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        inputRefs.current[category]?.click();
                      }
                    }}
                    onDragOver={(event) => handleDragOver(category, event)}
                    onDragLeave={handleDragLeave}
                    onDrop={(event) => handleDrop(category, event)}
                    className={cn(
                      "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors",
                      dragOverCategory === category
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card hover:border-primary/40",
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">
                      גרור תמונות לכאן או לחץ לבחירה
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      עד 10 תמונות לקטגוריה
                    </p>
                  </div>

                  <input
                    ref={(element) => {
                      inputRefs.current[category] = element;
                    }}
                    id={inputId}
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={(event) =>
                      void handleFilesSelected(category, event)
                    }
                  />

                  {photos.length > 0 ? (
                    <ul
                      className="mt-3 flex flex-wrap gap-2"
                      aria-label={`תצוגה מקדימה - ${category}`}
                    >
                      {photos.map((photo, index) => (
                        <li key={`${category}-${index}`}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo}
                            alt={`${category} ${index + 1}`}
                            className="size-20 rounded-lg object-cover"
                            width={80}
                            height={80}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              );
            })}
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <Button
              type="submit"
              size="lg"
              disabled={isUploading}
              className="w-full shadow-sm transition-transform active:scale-[0.99]"
            >
              {isUploading ? "מעלה תמונות..." : "המשך"}
            </Button>

            <button
              type="button"
              onClick={onSkip}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              דלג, אוסיף אחר כך
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
