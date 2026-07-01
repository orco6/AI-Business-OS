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

const MAX_SCREENSHOTS = 10;
const UPLOAD_CATEGORY = "social-proof";

export type BusinessStats = {
  yearsInBusiness: string;
  clientsServed: string;
  specialAchievement: string;
};

type SocialProofScreenProps = {
  profileId: string;
  onNext: (screenshots: string[], stats: BusinessStats) => void;
  onSkip: () => void;
};

const inputClassName = cn(
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-start text-base text-foreground shadow-sm outline-none transition-colors",
  "placeholder:text-muted-foreground/60",
  "focus:border-primary focus:ring-2 focus:ring-ring/25",
);

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function SocialProofScreen({
  profileId,
  onNext,
  onSkip,
}: SocialProofScreenProps) {
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [yearsInBusiness, setYearsInBusiness] = useState("");
  const [clientsServed, setClientsServed] = useState("");
  const [specialAchievement, setSpecialAchievement] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function addScreenshots(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (imageFiles.length === 0) return;

    const dataUrls = await Promise.all(imageFiles.map(readFileAsDataUrl));

    setScreenshots((prev) => {
      const remaining = MAX_SCREENSHOTS - prev.length;
      if (remaining <= 0) return prev;
      return [...prev, ...dataUrls.slice(0, remaining)];
    });
  }

  async function handleFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;

    await addScreenshots(files);
    event.target.value = "";
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    void addScreenshots(event.dataTransfer.files);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsUploading(true);

    try {
      let uploadedUrls: string[] = [];

      if (screenshots.length > 0) {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images: screenshots,
            category: UPLOAD_CATEGORY,
            profileId,
          }),
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = (await response.json()) as { urls: string[] };
        uploadedUrls = data.urls;
      }

      onNext(uploadedUrls, {
        yearsInBusiness: yearsInBusiness.trim(),
        clientsServed: clientsServed.trim(),
        specialAchievement: specialAchievement.trim(),
      });
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
            מה הלקוחות שלך אומרים עליך?
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            screenshots של וואטסאפ, גוגל, פייסבוק — זה מה שמוכר הכי טוב
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="flex flex-col gap-6">
            <section aria-labelledby="social-proof-upload">
              <label
                id="social-proof-upload"
                className="mb-3 block text-sm font-medium text-foreground"
              >
                צילומי מסך של המלצות
              </label>

              <div
                role="button"
                tabIndex={0}
                onClick={() => inputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition-colors",
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                <p className="text-sm font-medium text-foreground">
                  גרור תמונות לכאן או לחץ לבחירה
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  עד {MAX_SCREENSHOTS} תמונות
                </p>
              </div>

              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => void handleFilesSelected(event)}
              />

              {screenshots.length > 0 ? (
                <ul
                  className="mt-3 flex flex-wrap gap-2"
                  aria-label="תצוגה מקדימה - המלצות"
                >
                  {screenshots.map((screenshot, index) => (
                    <li key={`screenshot-${index}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={screenshot}
                        alt={`המלצה ${index + 1}`}
                        className="size-20 rounded-lg object-cover"
                        width={80}
                        height={80}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="years-in-business"
                  className="text-sm font-medium text-foreground"
                >
                  כמה שנים אתה בתחום?
                </label>
                <input
                  id="years-in-business"
                  type="text"
                  dir="auto"
                  value={yearsInBusiness}
                  onChange={(event) => setYearsInBusiness(event.target.value)}
                  placeholder="למשל: 8 שנים"
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="clients-served"
                  className="text-sm font-medium text-foreground"
                >
                  כמה לקוחות שירתת?
                </label>
                <input
                  id="clients-served"
                  type="text"
                  dir="auto"
                  value={clientsServed}
                  onChange={(event) => setClientsServed(event.target.value)}
                  placeholder="למשל: מעל 500 לקוחות"
                  className={inputClassName}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="special-achievement"
                  className="text-sm font-medium text-foreground"
                >
                  משהו מיוחד שגאה בו?
                </label>
                <input
                  id="special-achievement"
                  type="text"
                  dir="auto"
                  value={specialAchievement}
                  onChange={(event) =>
                    setSpecialAchievement(event.target.value)
                  }
                  placeholder="למשל: 98% ממליצים עלי"
                  className={inputClassName}
                />
              </div>
            </div>
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
              דלג, אמשיך אחר כך
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
