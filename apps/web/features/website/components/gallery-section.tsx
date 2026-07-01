"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "motion/react";

import type { GallerySection as GalleryData } from "@/features/website/types";

type GallerySectionProps = {
  gallery: GalleryData;
};

const SECTION_LABEL = "הגלריה שלנו";

const galleryImageLinkClassName =
  "group block overflow-hidden rounded-2xl transition-all duration-500 ease-out";

export function GallerySection({ gallery }: GallerySectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0 });

  const photos = gallery.photoUrls.slice(0, 9);
  if (photos.length === 0) return null;

  const galleryTitle = gallery.title || "גלריה";
  const [featuredPhoto, ...restPhotos] = photos;

  return (
    <section
      ref={ref}
      className="bg-[var(--color-bg)] py-16 sm:py-32 lg:py-40"
      aria-labelledby="gallery-heading"
    >
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8 }}
          className="mb-10 flex flex-col items-center gap-5 text-center sm:mb-16 lg:mb-20"
        >
          <span
            className="text-sm font-semibold leading-[1.3] tracking-wide text-[var(--color-primary)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {SECTION_LABEL}
          </span>
          <h2
            id="gallery-heading"
            className="text-5xl font-black leading-[1.15] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {galleryTitle}
          </h2>
        </motion.div>
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
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.7, delay: index * 0.04 }}
            className="relative shrink-0 overflow-hidden rounded-2xl"
            style={{ scrollSnapAlign: "start", width: "75vw", aspectRatio: "4/5" }}
          >
            <Image
              src={url}
              alt={`${galleryTitle} ${index + 1}`}
              fill
              className="object-cover"
              sizes="75vw"
              loading="lazy"
            />
          </motion.a>
        ))}
      </div>

      {/* Desktop: featured first + masonry grid — full bleed */}
      <div className="hidden w-full sm:block">
        <motion.a
          key="desk-featured"
          href="#lightbox-0"
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0 }}
          className={`${galleryImageLinkClassName} relative mb-4 aspect-[16/9] w-full`}
        >
          <Image
            src={featuredPhoto}
            alt={`${galleryTitle} 1`}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            loading="lazy"
            sizes="100vw"
          />
        </motion.a>

        {restPhotos.length > 0 && (
          <div className="columns-3 gap-4">
            {restPhotos.map((url, index) => {
              const photoIndex = index + 1;
              return (
                <motion.a
                  key={`desk-${photoIndex}`}
                  href={`#lightbox-${photoIndex}`}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.8, delay: photoIndex * 0.05 }}
                  className={`${galleryImageLinkClassName} mb-4 break-inside-avoid`}
                >
                  <Image
                    src={url}
                    alt={`${galleryTitle} ${photoIndex + 1}`}
                    width={400}
                    height={photoIndex % 3 === 0 ? 520 : 300}
                    className="h-auto w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    loading="lazy"
                    sizes="33vw"
                  />
                </motion.a>
              );
            })}
          </div>
        )}
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
          <div className="relative z-10 flex max-h-[90dvh] max-w-[90vw] items-center gap-4">
            {index > 0 && (
              <a
                href={`#lightbox-${index - 1}`}
                className="absolute -start-12 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors duration-500 ease-out hover:bg-white/40"
                aria-label="תמונה קודמת"
              >
                ‹
              </a>
            )}
            <Image
              src={url}
              alt={`${galleryTitle} ${index + 1}`}
              width={1200}
              height={900}
              className="max-h-[85dvh] w-auto max-w-[80vw] rounded-xl object-contain shadow-2xl"
            />
            {index < photos.length - 1 && (
              <a
                href={`#lightbox-${index + 1}`}
                className="absolute -end-12 rounded-full bg-white/20 p-3 text-white backdrop-blur-sm transition-colors duration-500 ease-out hover:bg-white/40"
                aria-label="תמונה הבאה"
              >
                ›
              </a>
            )}
          </div>
          <a
            href="#"
            className="absolute end-4 top-4 z-20 rounded-full bg-white/20 p-2 text-xl text-white backdrop-blur-sm transition-colors duration-500 ease-out hover:bg-white/40"
            aria-label="סגור"
          >
            ✕
          </a>
        </div>
      ))}
    </section>
  );
}
