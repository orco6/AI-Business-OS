"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "motion/react";

import type { AboutSection as AboutData } from "@/features/website/types";

type AboutSectionProps = {
  about: AboutData;
  photosByCategory: Record<string, string[]>;
};

const SECTION_LABEL = "הסיפור שלנו";

export function AboutSection({ about, photosByCategory }: AboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0, margin: "-40px" });

  const aboutImage =
    Object.values(photosByCategory).flat()[1] ??
    Object.values(photosByCategory).flat()[0] ??
    null;

  return (
    <section ref={ref} className="px-6 py-16 sm:py-32 lg:py-40">
      <div className="mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
        <motion.div
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col text-right"
        >
          <span
            className="text-sm font-semibold leading-[1.3] tracking-wide text-[var(--color-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {SECTION_LABEL}
          </span>

          <h2
            className="mb-10 mt-5 text-5xl font-black leading-[1.15] tracking-[-0.03em] sm:mb-16 sm:text-6xl lg:mb-20 lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {about.title}
          </h2>

          <p className="max-w-[65ch] text-pretty text-lg font-normal leading-[1.625] opacity-90">
            {about.story}
          </p>

          {about.ownerName && (
            <div className="mt-6 flex items-center gap-3">
              <span
                className="h-1 w-16 shrink-0 rounded-full bg-[var(--color-primary)]"
                aria-hidden="true"
              />
              <p className="text-base font-medium leading-[1.5] opacity-75">
                {about.ownerName}
              </p>
            </div>
          )}

          {about.highlights.length > 0 && (
            <div className="mt-8 flex items-center gap-8 text-sm text-gray-500">
              {about.highlights.slice(0, 2).map((h) => (
                <span key={h}>{h}</span>
              ))}
            </div>
          )}
        </motion.div>

        {aboutImage && (
          <motion.div
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
              <Image
                src={aboutImage}
                alt={about.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
