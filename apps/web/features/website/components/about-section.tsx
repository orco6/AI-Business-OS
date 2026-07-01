"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Check } from "lucide-react";

import type { AboutSection as AboutData } from "@/features/website/types";

type AboutSectionProps = {
  about: AboutData;
  photosByCategory: Record<string, string[]>;
};

const SECTION_LABEL = "פרק א׳ — הסיפור שלנו";

export function AboutSection({ about, photosByCategory }: AboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0, margin: "-40px" });

  const aboutImage =
    Object.values(photosByCategory).flat()[1] ??
    Object.values(photosByCategory).flat()[0] ??
    null;

  return (
    <section
      ref={ref}
      id="about"
      className="relative overflow-hidden px-6 py-20 sm:py-32 lg:py-40"
    >
      {/* Ghost chapter numeral — structural anchor, works on any theme color */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-4 right-0 select-none text-[9rem] font-black leading-none tracking-tighter opacity-[0.045] sm:-top-8 sm:text-[14rem] lg:text-[19rem]"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-text)",
        }}
      >
        01
      </span>

      <div className="relative mx-auto grid max-w-5xl items-start gap-14 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <motion.div
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col text-right"
        >
          <div className="flex items-center gap-3">
            <span
              className="h-px w-8 shrink-0"
              style={{ backgroundColor: "var(--color-primary)" }}
              aria-hidden="true"
            />
            <span
              className="text-sm font-semibold leading-[1.3] tracking-wide text-[var(--color-primary)]"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {SECTION_LABEL}
            </span>
          </div>

          <h2
            className="mb-8 mt-5 text-4xl font-black leading-[1.1] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {about.title}
          </h2>

          <p className="max-w-[62ch] text-pretty text-lg font-normal leading-[1.7] opacity-90">
            {about.story}
          </p>

          {about.highlights.length > 0 && (
            <ul className="mt-10 grid grid-cols-1 gap-x-8 gap-y-4 border-t border-current/10 pt-8 sm:grid-cols-2">
              {about.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--color-primary) 15%, transparent)",
                    }}
                    aria-hidden="true"
                  >
                    <Check
                      className="size-3"
                      style={{ color: "var(--color-primary)" }}
                      strokeWidth={3}
                    />
                  </span>
                  <span className="text-[15px] font-medium leading-snug opacity-85">
                    {h}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </motion.div>

        {aboutImage && (
          <motion.div
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            {/* Offset frame — decorative depth cue that works with any accent color */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -start-4 hidden aspect-[3/4] w-full rounded-3xl border-2 sm:block"
              style={{ borderColor: "var(--color-primary)", opacity: 0.35 }}
            />

            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src={aboutImage}
                alt={about.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>

            {about.ownerName && (
              <div
                className="absolute inset-x-4 -bottom-6 flex items-center gap-3 rounded-2xl bg-[var(--color-bg)] px-5 py-4 text-right shadow-lg sm:-bottom-7"
                style={{ border: "1px solid color-mix(in srgb, var(--color-text) 8%, transparent)" }}
              >
                <span
                  className="h-8 w-1 shrink-0 rounded-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                  aria-hidden="true"
                />
                <p className="text-sm font-semibold leading-snug opacity-90">
                  {about.ownerName}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
