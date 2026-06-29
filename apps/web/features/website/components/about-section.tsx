"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { AboutSection as AboutData } from "@/features/website/types";

type AboutSectionProps = {
  about: AboutData;
  photosByCategory: Record<string, string[]>;
};

export function AboutSection({ about, photosByCategory }: AboutSectionProps) {
  const aboutImage =
    Object.values(photosByCategory).flat()[1] ??
    Object.values(photosByCategory).flat()[0] ??
    null;

  return (
    <section className="px-6 py-20">
      <div className="mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-5"
        >
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {about.title}
          </h2>

          <p className="text-pretty text-lg leading-relaxed opacity-90">
            {about.story}
          </p>

          {about.ownerName && (
            <p className="text-base font-medium opacity-75">{about.ownerName}</p>
          )}

          <ul className="mt-2 flex flex-wrap gap-3">
            {about.highlights.map((highlight, index) => (
              <motion.li
                key={highlight}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="rounded-full px-4 py-2 text-sm font-medium"
                style={{
                  backgroundColor:
                    "color-mix(in srgb, var(--color-primary) 12%, transparent)",
                  color: "var(--color-primary)",
                }}
              >
                {highlight}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {aboutImage && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl"
          >
            <Image
              src={aboutImage}
              alt={about.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              loading="lazy"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}
