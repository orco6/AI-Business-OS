"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type FormEvent, useState } from "react";

function ArrowStartIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

type OnboardingScreenProps = {
  onNext?: (businessName: string) => void;
};

export function OnboardingScreen({ onNext }: OnboardingScreenProps = {}) {
  const [businessName, setBusinessName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isValid = businessName.trim().length > 0;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5063/api/onboarding/start",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessName }),
        },
      );

      if (response.status === 200) {
        console.log("success");
        onNext?.(businessName.trim());
      } else {
        console.log("error");
      }
    } catch {
      console.log("error");
    } finally {
      setIsLoading(false);
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

      <div className="flex flex-1 items-center">
        <section className="w-full" aria-labelledby="onboarding-question">
          <div className="onboarding-enter mx-auto flex w-full max-w-md flex-col gap-5 text-start">
            <p className="text-base font-medium text-muted-foreground">
              נעים להכיר.
            </p>

            <h1
              id="onboarding-question"
              className="text-pretty text-3xl font-semibold leading-snug tracking-tight text-foreground sm:text-4xl"
            >
              איך קוראים לעסק שלך?
            </h1>

            <p className="max-w-sm text-pretty text-base leading-relaxed text-muted-foreground">
              כל מה שצריך עכשיו זה השם. את שאר העבודה — הנוכחות הדיגיטלית, התוכן
              והדרך ללקוחות חדשים — אני כבר לוקח על עצמי.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <label htmlFor="business-name" className="sr-only">
                שם העסק
              </label>
              <input
                id="business-name"
                name="business-name"
                type="text"
                autoComplete="organization"
                dir={businessName ? "auto" : "rtl"}
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                placeholder="שם העסק"
                className={cn(
                  "h-14 w-full rounded-2xl border border-border bg-card px-5 text-start text-lg text-foreground shadow-sm outline-none transition-colors",
                  "placeholder:text-muted-foreground/60",
                  "focus:border-primary focus:ring-2 focus:ring-ring/25",
                )}
              />

              <Button
                type="submit"
                size="lg"
                disabled={!isValid || isLoading}
                className="group mt-1 w-full shadow-sm transition-transform active:scale-[0.99] disabled:opacity-40"
              >
                {isLoading ? (
                  "רגע..."
                ) : (
                  <>
                    מתחילים
                    <ArrowStartIcon className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-sm text-muted-foreground">
              לוקח פחות מדקה, ואפשר לשנות הכל בהמשך.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
