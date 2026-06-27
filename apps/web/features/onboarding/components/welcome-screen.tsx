"use client";

import { Button } from "@/components/ui/button";

function cleanMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/_(.*?)_/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/^\s*[-*+]\s/gm, "")
    .trim();
}

type WelcomeScreenProps = {
  welcomeMessage: string;
  businessName: string;
  onNext?: () => void;
};

export function WelcomeScreen({
  welcomeMessage,
  businessName,
  onNext,
}: WelcomeScreenProps) {
  const cleanMessage = cleanMarkdown(welcomeMessage);

  return (
    <main className="flex min-h-[100svh] flex-col bg-white px-6 py-16">
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
        <section className="w-full" aria-labelledby="welcome-title">
          <div className="onboarding-enter mx-auto flex w-full max-w-md flex-col gap-10 text-start">
            <span
              aria-hidden="true"
              className="size-4 rounded-full bg-emerald-500 animate-pulse"
            />

            <div className="flex flex-col gap-4">
              <h1
                id="welcome-title"
                className="text-pretty text-2xl font-medium tracking-tight text-foreground"
              >
                הכל מוכן, {businessName}
              </h1>

              <hr className="border-t border-border" />

              <p className="max-w-sm text-pretty text-base font-light leading-[1.75] text-muted-foreground">
                {cleanMessage}
              </p>
            </div>

            <Button
              type="button"
              size="lg"
              className="mt-2 w-full shadow-sm transition-transform active:scale-[0.99]"
              onClick={onNext}
            >
              בואו נתחיל
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}
