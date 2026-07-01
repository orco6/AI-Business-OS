"use client";

import {
  Briefcase,
  Dumbbell,
  Plus,
  Scissors,
  ShoppingBag,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BusinessType = {
  id: string;
  icon: LucideIcon;
  label: string;
};

const BUSINESS_TYPES: BusinessType[] = [
  { id: "restaurant", icon: UtensilsCrossed, label: "מסעדה / בית קפה" },
  { id: "retail", icon: ShoppingBag, label: "חנות / קמעונאות" },
  { id: "services", icon: Briefcase, label: "שירותים מקצועיים" },
  { id: "beauty", icon: Scissors, label: "יופי וטיפוח" },
  { id: "fitness", icon: Dumbbell, label: "בריאות וכושר" },
  { id: "other", icon: Plus, label: "אחר" },
];

type BusinessTypeScreenProps = {
  errorMessage?: string;
  onNext: (businessType: string) => void;
};

export function BusinessTypeScreen({
  errorMessage,
  onNext,
}: BusinessTypeScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);

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
            מה סוג העסק שלך?
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            נתאים את הכל בדיוק בשבילך
          </p>
        </header>

        <div
          role="radiogroup"
          aria-label="סוג העסק"
          className="grid grid-cols-2 gap-3"
        >
          {BUSINESS_TYPES.map((type) => {
            const isSelected = selected === type.id;
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(type.id)}
                className={cn(
                  "flex flex-col items-center justify-center gap-3 rounded-2xl border bg-card p-5 text-center transition-all duration-200",
                  "hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border",
                )}
              >
                <Icon
                  className="h-7 w-7 text-muted-foreground"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
                <span className="text-sm font-medium leading-snug text-card-foreground">
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-8">
          <Button
            type="button"
            size="lg"
            disabled={!selected}
            className="group w-full shadow-sm transition-transform active:scale-[0.99] disabled:opacity-40"
            onClick={() => selected && onNext(selected)}
          >
            המשך
          </Button>
          {errorMessage ? (
            <p className="mt-3 text-center text-sm text-destructive">
              {errorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </main>
  );
}
