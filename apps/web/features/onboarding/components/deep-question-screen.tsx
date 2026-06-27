"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type FormEvent, useState } from "react";

type DeepQuestionScreenProps = {
  question: string;
  onNext: (answer: string) => void;
  onSkip: () => void;
};

export function DeepQuestionScreen({
  question,
  onNext,
  onSkip,
}: DeepQuestionScreenProps) {
  const [answer, setAnswer] = useState("");

  const isValid = answer.trim().length >= 10;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;

    onNext(answer.trim());
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
        <section className="w-full" aria-labelledby="deep-question">
          <div className="onboarding-enter mx-auto flex w-full max-w-md flex-col gap-5 text-start">
            <h1
              id="deep-question"
              className="text-pretty text-3xl font-semibold leading-snug tracking-tight text-foreground sm:text-4xl"
            >
              {question}
            </h1>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
              <label htmlFor="deep-question-answer" className="sr-only">
                {question}
              </label>
              <textarea
                id="deep-question-answer"
                name="deep-question-answer"
                dir={answer ? "auto" : "rtl"}
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="ספר לנו..."
                rows={4}
                className={cn(
                  "min-h-[120px] w-full resize-none rounded-2xl border border-border bg-card px-5 py-4 text-start text-lg text-foreground shadow-sm outline-none transition-colors",
                  "placeholder:text-muted-foreground/60",
                  "focus:border-primary focus:ring-2 focus:ring-ring/25",
                )}
              />

              <Button
                type="submit"
                size="lg"
                disabled={!isValid}
                className="mt-1 w-full shadow-sm transition-transform active:scale-[0.99] disabled:opacity-40"
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
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
