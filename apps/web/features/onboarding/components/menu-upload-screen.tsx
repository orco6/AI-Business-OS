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
import {
  type MenuDisplayMode,
} from "@/features/onboarding/components/business-specific-screen";

const MAX_MENU_PHOTOS = 20;
const MENU_PHOTO_CATEGORY = "תפריט";

const DEFAULT_CATEGORIES = ["ראשונות", "עיקריות", "קינוחים", "משקאות"];

export type MenuItemEntry = {
  category: string;
  name: string;
  description: string;
  price: string;
};

export type MenuUploadData = {
  menuPhotos?: string[];
  menuItems?: MenuItemEntry[];
  menuCategories?: string[];
};

type MenuUploadScreenProps = {
  menuDisplayMode: MenuDisplayMode;
  menuTypes?: string;
  profileId: string;
  onNext: (data: MenuUploadData) => void;
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

function parseMenuCategories(menuTypes?: string): string[] {
  if (!menuTypes?.trim()) return DEFAULT_CATEGORIES;

  const parsed = menuTypes
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : DEFAULT_CATEGORIES;
}

function emptyItem(): Omit<MenuItemEntry, "category"> {
  return { name: "", description: "", price: "" };
}

export function needsMenuUploadScreen(
  businessType: string,
  menuDisplayMode?: MenuDisplayMode,
): boolean {
  if (businessType !== "restaurant") return false;
  return (
    menuDisplayMode === "העלה תמונות" ||
    menuDisplayMode === "הזן מנות ידנית"
  );
}

export function MenuUploadScreen({
  menuDisplayMode,
  menuTypes,
  profileId,
  onNext,
  onSkip,
}: MenuUploadScreenProps) {
  const isPhotoMode = menuDisplayMode === "העלה תמונות";

  const [menuPhotos, setMenuPhotos] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<string[]>(() =>
    parseMenuCategories(menuTypes),
  );
  const [activeCategory, setActiveCategory] = useState(
    () => parseMenuCategories(menuTypes)[0] ?? DEFAULT_CATEGORIES[0],
  );
  const [itemsByCategory, setItemsByCategory] = useState<
    Record<string, Omit<MenuItemEntry, "category">[]>
  >(() =>
    Object.fromEntries(
      parseMenuCategories(menuTypes).map((category) => [category, [emptyItem()]]),
    ),
  );
  const [newCategoryName, setNewCategoryName] = useState("");

  async function addMenuPhotos(files: FileList | File[]) {
    const imageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (imageFiles.length === 0) return;

    const dataUrls = await Promise.all(imageFiles.map(readFileAsDataUrl));

    setMenuPhotos((prev) => {
      const remaining = MAX_MENU_PHOTOS - prev.length;
      if (remaining <= 0) return prev;
      return [...prev, ...dataUrls.slice(0, remaining)];
    });
  }

  async function handlePhotoFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const files = event.target.files;
    if (!files) return;
    await addMenuPhotos(files);
    event.target.value = "";
  }

  function handlePhotoDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(true);
  }

  function handlePhotoDragLeave(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
  }

  function handlePhotoDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragOver(false);
    void addMenuPhotos(event.dataTransfer.files);
  }

  function updateItem(
    category: string,
    index: number,
    field: keyof Omit<MenuItemEntry, "category">,
    value: string,
  ) {
    setItemsByCategory((prev) => {
      const items = [...(prev[category] ?? [])];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, [category]: items };
    });
  }

  function addItem(category: string) {
    setItemsByCategory((prev) => ({
      ...prev,
      [category]: [...(prev[category] ?? []), emptyItem()],
    }));
  }

  function removeItem(category: string, index: number) {
    setItemsByCategory((prev) => {
      const items = (prev[category] ?? []).filter((_, i) => i !== index);
      return {
        ...prev,
        [category]: items.length > 0 ? items : [emptyItem()],
      };
    });
  }

  function addCategory() {
    const name = newCategoryName.trim();
    if (!name || categories.includes(name)) return;

    setCategories((prev) => [...prev, name]);
    setItemsByCategory((prev) => ({ ...prev, [name]: [emptyItem()] }));
    setActiveCategory(name);
    setNewCategoryName("");
  }

  function getValidManualItems(): MenuItemEntry[] {
    return categories.flatMap((category) =>
      (itemsByCategory[category] ?? [])
        .filter((item) => item.name.trim().length > 0)
        .map((item) => ({
          category,
          name: item.name.trim(),
          description: item.description.trim(),
          price: item.price.trim(),
        })),
    );
  }

  function isValid(): boolean {
    if (isPhotoMode) return menuPhotos.length > 0;

    return getValidManualItems().length > 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid()) return;

    setIsUploading(true);
    try {
      if (isPhotoMode) {
        const response = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images: menuPhotos,
            category: MENU_PHOTO_CATEGORY,
            profileId,
          }),
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = (await response.json()) as { urls: string[] };
        onNext({ menuPhotos: data.urls });
        return;
      }

      const validItems = getValidManualItems();
      onNext({
        menuItems: validItems,
        menuCategories: categories,
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
        <header className="mb-6 text-start">
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            {isPhotoMode ? "העלה את התפריט שלך" : "הזן את התפריט ידנית"}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            {isPhotoMode
              ? "צלם או סרוק את התפריט — נציג אותו באתר בגלריה מלאה"
              : "הוסף מנות לפי קטגוריה — שם, תיאור ומחיר בלבד"}
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          {isPhotoMode ? (
            <div className="flex flex-col gap-4">
              <div
                role="button"
                tabIndex={0}
                onClick={() => photoInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    photoInputRef.current?.click();
                  }
                }}
                onDragOver={handlePhotoDragOver}
                onDragLeave={handlePhotoDragLeave}
                onDrop={handlePhotoDrop}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 text-center transition-colors",
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/40",
                )}
              >
                <p className="text-sm font-medium text-foreground">
                  גרור תמונות תפריט לכאן או לחץ לבחירה
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  עד {MAX_MENU_PHOTOS} תמונות · JPG, PNG
                </p>
              </div>

              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(event) => void handlePhotoFilesSelected(event)}
              />

              {menuPhotos.length > 0 ? (
                <ul
                  className="flex flex-wrap gap-2"
                  aria-label="תצוגה מקדימה — תפריט"
                >
                  {menuPhotos.map((photo, index) => (
                    <li key={`menu-photo-${index}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo}
                        alt={`תפריט ${index + 1}`}
                        className="size-24 rounded-lg object-cover"
                        width={96}
                        height={96}
                      />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div
                className="flex gap-2 overflow-x-auto pb-1"
                role="tablist"
                aria-label="קטגוריות תפריט"
              >
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors",
                      activeCategory === category
                        ? "border-primary bg-primary/10 font-medium text-foreground"
                        : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {(itemsByCategory[activeCategory] ?? [emptyItem()]).map(
                  (item, index) => (
                    <div
                      key={`${activeCategory}-${index}`}
                      className="flex flex-col gap-2 rounded-2xl border border-border bg-card p-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          מנה {index + 1}
                        </span>
                        {(itemsByCategory[activeCategory]?.length ?? 0) > 1 ? (
                          <button
                            type="button"
                            onClick={() => removeItem(activeCategory, index)}
                            className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                          >
                            הסר
                          </button>
                        ) : null}
                      </div>
                      <input
                        type="text"
                        dir="auto"
                        value={item.name}
                        onChange={(event) =>
                          updateItem(
                            activeCategory,
                            index,
                            "name",
                            event.target.value,
                          )
                        }
                        placeholder="שם המנה"
                        className={inputClassName}
                        aria-label={`שם מנה ${index + 1}`}
                      />
                      <input
                        type="text"
                        dir="auto"
                        value={item.description}
                        onChange={(event) =>
                          updateItem(
                            activeCategory,
                            index,
                            "description",
                            event.target.value,
                          )
                        }
                        placeholder="תיאור קצר (אופציונלי)"
                        className={inputClassName}
                        aria-label={`תיאור מנה ${index + 1}`}
                      />
                      <input
                        type="text"
                        dir="auto"
                        value={item.price}
                        onChange={(event) =>
                          updateItem(
                            activeCategory,
                            index,
                            "price",
                            event.target.value,
                          )
                        }
                        placeholder="מחיר (למשל: 68₪)"
                        className={inputClassName}
                        aria-label={`מחיר מנה ${index + 1}`}
                      />
                    </div>
                  ),
                )}
              </div>

              <Button
                type="button"
                className="w-full border border-border bg-card text-foreground hover:bg-muted"
                onClick={() => addItem(activeCategory)}
              >
                + הוסף מנה ל{activeCategory}
              </Button>

              <div className="flex gap-2">
                <input
                  type="text"
                  dir="auto"
                  value={newCategoryName}
                  onChange={(event) => setNewCategoryName(event.target.value)}
                  placeholder="קטגוריה חדשה..."
                  className={cn(inputClassName, "flex-1")}
                  aria-label="שם קטגוריה חדשה"
                />
                <Button
                  type="button"
                  className="shrink-0 border border-border bg-card text-foreground hover:bg-muted"
                  onClick={addCategory}
                  disabled={!newCategoryName.trim()}
                >
                  הוסף
                </Button>
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <Button
              type="submit"
              size="lg"
              disabled={!isValid() || isUploading}
              className="w-full shadow-sm transition-transform active:scale-[0.99] disabled:opacity-40"
            >
              {isUploading ? "שומר..." : "המשך"}
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
