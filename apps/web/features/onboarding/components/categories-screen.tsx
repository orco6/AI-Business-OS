"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type FormEvent, type KeyboardEvent, useState } from "react";

type CategoriesScreenProps = {
  categoriesLabel: string;
  suggestedCategories: string[];
  onNext: (selectedCategories: string[]) => void;
  onSkip: () => void;
};

export function CategoriesScreen({
  categoriesLabel,
  suggestedCategories,
  onNext,
  onSkip,
}: CategoriesScreenProps) {
  const [categories, setCategories] = useState(suggestedCategories);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(suggestedCategories),
  );
  const [customInput, setCustomInput] = useState("");

  function toggleCategory(category: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  function handleAddCustom() {
    const trimmed = customInput.trim();
    if (!trimmed) return;

    setCategories((prev) =>
      prev.includes(trimmed) ? prev : [...prev, trimmed],
    );
    setSelected((prev) => new Set(prev).add(trimmed));
    setCustomInput("");
  }

  function handleCustomKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddCustom();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onNext(categories.filter((category) => selected.has(category)));
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
            {categoriesLabel}
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            בחרנו את הקטגוריות המתאימות לעסק שלך - אשר, הוסף או הסר
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div
            role="group"
            aria-label={categoriesLabel}
            className="flex flex-wrap gap-2"
          >
            {categories.map((category) => {
              const isSelected = selected.has(category);
              return (
                <button
                  key={category}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => toggleCategory(category)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {category}
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex gap-2">
            <label htmlFor="custom-category" className="sr-only">
              הוסף קטגוריה
            </label>
            <input
              id="custom-category"
              type="text"
              dir="auto"
              value={customInput}
              onChange={(event) => setCustomInput(event.target.value)}
              onKeyDown={handleCustomKeyDown}
              placeholder="הוסף קטגוריה..."
              className={cn(
                "min-w-0 flex-1 rounded-2xl border border-border bg-card px-4 py-3 text-start text-base text-foreground shadow-sm outline-none transition-colors",
                "placeholder:text-muted-foreground/60",
                "focus:border-primary focus:ring-2 focus:ring-ring/25",
              )}
            />
            <Button
              type="button"
              onClick={handleAddCustom}
              className="shrink-0 px-5"
            >
              הוסף
            </Button>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <Button
              type="submit"
              size="lg"
              className="w-full shadow-sm transition-transform active:scale-[0.99]"
            >
              המשך
            </Button>

            <button
              type="button"
              onClick={onSkip}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              דלג
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
