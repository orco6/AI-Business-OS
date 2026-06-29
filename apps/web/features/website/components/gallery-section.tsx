"use client";

import Image from "next/image";
import { motion } from "motion/react";
import type { GallerySection as GalleryData } from "@/features/website/types";

type GallerySectionProps = {
  gallery: GalleryData;
};

export function GallerySection({ gallery }: GallerySectionProps) {
  const photos = gallery.photoUrls.slice(0, 9);
  if (photos.length === 0) return null;

  return (
    <section className="py-20" aria-labelledby="gallery-heading">
      <div className="mx-auto max-w-5xl px-6">
        <motion.h2
          id="gallery-heading"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center text-3xl font-bold sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {gallery.title || "גלריה"}
        </motion.h2>
      </div>

      {/* Mobile: horizontal scroll snap */}
      <div
        className="scroll-hide flex gap-3 overflow-x-auto px-6 pb-4 sm:hidden"
        style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
      >
        {photos.map((url, index) => (
          <motion.a
            key={`mob-${index}`}
            href={`#lightbox-${index}`}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.04 }}
            className="relative shrink-0 overflow-hidden rounded-2xl"
            style={{ scrollSnapAlign: "start", width: "75vw", aspectRatio: "4/5" }}
          >
            <Image
              src={url}
              alt={`${gallery.title} ${index + 1}`}
              fill
              className="object-cover"
              sizes="75vw"
              loading="lazy"
            />
          </motion.a>
        ))}
      </div>

      {/* Desktop: CSS masonry columns */}
      <div className="mx-auto hidden max-w-5xl columns-3 gap-4 px-6 sm:block">
        {photos.map((url, index) => (
          <motion.a
            key={`desk-${index}`}
            href={`#lightbox-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group mb-4 block break-inside-avoid overflow-hidden rounded-2xl"
          >
            <Image
              src={url}
              alt={`${gallery.title} ${index + 1}`}
              width={400}
              height={index % 3 === 0 ? 520 : 300}
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
              loading="lazy"
              sizes="33vw"
            />
          </motion.a>
        ))}
      </div>

      {/* Native CSS lightbox - zero JS */}
      {photos.map((url, index) => (
        <div
          key={`lb-${index}`}
          id={`lightbox-${index}`}
          className="fixed inset-0 z-[100] hidden items-center justify-center bg-black/92 p-4 backdrop-blur-sm target:flex"
          role="dialog"
          aria-modal="true"
          aria-label={`תמונה ${index + 1}`}
        >
          <a href="#" className="absolute inset-0" aria-label="סגור גלריה" />
          <div className="relative z-10 flex max-h-[90vh] max-w-[90vw] items-center gap-4">
            {index > 0 && (
              <a
                href={`#lightbox-${index - 1}`}
                className="absolute -right-12 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm hover:bg-white/40"
                aria-label="תמונה קודמת"
              >
                ‹
              </a>
            )}
            <Image
              src={url}
              alt={`${gallery.title} ${index + 1}`}
              width={1200}
              height={900}
              className="max-h-[85vh] w-auto max-w-[80vw] rounded-xl object-contain shadow-2xl"
            />
            {index < photos.length - 1 && (
              <a
                href={`#lightbox-${index + 1}`}
                className="absolute -left-12 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm hover:bg-white/40"
                aria-label="תמונה הבאה"
              >
                ›
              </a>
            )}
          </div>
          <a
            href="#"
            className="absolute end-4 top-4 z-20 rounded-full bg-white/20 p-2 text-xl text-white backdrop-blur-sm hover:bg-white/40"
            aria-label="סגור"
          >
            ✕
          </a>
        </div>
      ))}
    </section>
  );
}
