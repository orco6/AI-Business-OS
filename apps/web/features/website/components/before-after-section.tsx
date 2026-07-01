"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";

import type { BeforeAfterSection as BeforeAfterData } from "@/features/website/types";

type BeforeAfterSectionProps = {
  section: BeforeAfterData;
};

type BeforeAfterSliderProps = {
  beforeUrl: string;
  afterUrl: string;
  label?: string;
};

const BEFORE_PREFIX = "לפני - ";
const AFTER_PREFIX = "אחרי - ";

export function buildBeforeAfterSectionFromPhotos(
  photosByCategory: Record<string, string[]>,
  title = "לפני ואחרי",
): BeforeAfterData | null {
  const pairs = Object.entries(photosByCategory)
    .filter(([key]) => key.startsWith(BEFORE_PREFIX))
    .map(([key, beforeUrls]) => {
      const category = key.slice(BEFORE_PREFIX.length);
      const afterUrls = photosByCategory[`${AFTER_PREFIX}${category}`];
      if (!beforeUrls?.[0] || !afterUrls?.[0]) return null;

      return {
        beforeUrl: beforeUrls[0],
        afterUrl: afterUrls[0],
        label: category,
      };
    })
    .filter((pair): pair is NonNullable<typeof pair> => pair !== null)
    .slice(0, 4);

  if (pairs.length === 0) return null;

  return { title, pairs };
}

function BeforeAfterSlider({ beforeUrl, afterUrl, label }: BeforeAfterSliderProps) {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <figure className="flex flex-col gap-3">
      {label ? (
        <figcaption className="text-center text-sm font-medium text-white/70">
          {label}
        </figcaption>
      ) : null}

      <div
        className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl bg-black"
        style={{ touchAction: "none" }}
      >
        <Image
          src={afterUrl}
          alt={label ? `אחרי — ${label}` : "אחרי"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          draggable={false}
        />

        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}
        >
          <Image
            src={beforeUrl}
            alt={label ? `לפני — ${label}` : "לפני"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            draggable={false}
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 z-[1] w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)]"
          style={{ left: `${sliderValue}%`, transform: "translateX(-50%)" }}
        >
          <span className="absolute left-1/2 top-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-white/90 shadow-lg">
            <span className="flex gap-0.5">
              <span className="block size-0 border-y-[5px] border-y-transparent border-e-[6px] border-e-neutral-600" />
              <span className="block size-0 border-y-[5px] border-y-transparent border-s-[6px] border-s-neutral-600" />
            </span>
          </span>
        </div>

        <span className="pointer-events-none absolute left-3 top-3 z-[2] rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          לפני
        </span>
        <span className="pointer-events-none absolute right-3 top-3 z-[2] rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
          אחרי
        </span>

        <input
          type="range"
          min={0}
          max={100}
          value={sliderValue}
          onChange={(event) => setSliderValue(Number(event.target.value))}
          aria-label={label ? `החלק לפני ואחרי — ${label}` : "החלק לפני ואחרי"}
          className="absolute inset-0 z-[3] m-0 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
    </figure>
  );
}

export function BeforeAfterSection({ section }: BeforeAfterSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const pairs = section.pairs.slice(0, 4);
  if (pairs.length === 0) return null;

  const gridClassName =
    pairs.length === 1
      ? "grid grid-cols-1 gap-8"
      : "grid grid-cols-1 gap-8 sm:grid-cols-2";

  return (
    <section
      ref={ref}
      id="before-after"
      className="bg-[#0a0a0a] px-6 py-16 sm:py-32 lg:py-40"
      aria-labelledby="before-after-heading"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8 }}
          className="mb-10 flex flex-col items-center gap-5 text-center sm:mb-16"
        >
          <span
            className="text-sm font-semibold leading-[1.3] tracking-wide text-[var(--color-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            התוצאות מדברות
          </span>
          <h2
            id="before-after-heading"
            className="text-4xl font-black leading-[1.15] tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {section.title || "לפני ואחרי"}
          </h2>
          <p className="max-w-md text-sm text-white/60">
            גרור את הקו כדי לראות את ההבדל
          </p>
        </motion.div>

        <motion.div
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className={gridClassName}
        >
          {pairs.map((pair, index) => (
            <BeforeAfterSlider
              key={`${pair.beforeUrl}-${pair.afterUrl}-${index}`}
              beforeUrl={pair.beforeUrl}
              afterUrl={pair.afterUrl}
              label={pair.label}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
