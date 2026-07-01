"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type { HeroSection as HeroData, ThemeConfig } from "@/features/website/types";

type HeroSectionProps = {
  hero: HeroData;
  businessName: string;
  photosByCategory: Record<string, string[]>;
  theme: ThemeConfig;
  whatsApp?: string;
  phone?: string;
};

const SCROLL_SOLID_THRESHOLD = 60;

function getHeroBackground(
  category: string,
  photosByCategory: Record<string, string[]>,
): string | null {
  if (!category) return null;

  const exact = photosByCategory[category];
  if (exact?.[0]) return exact[0];

  const match = Object.entries(photosByCategory).find(([key]) =>
    key.toLowerCase().includes(category.toLowerCase()),
  );
  return match?.[1]?.[0] ?? null;
}

function buildCtaHref(
  action: string,
  whatsApp: string,
  phone: string,
): string {
  if (action === "whatsapp" && whatsApp) {
    const digits = whatsApp.replace(/\D/g, "");
    return `https://wa.me/${digits}`;
  }
  if (action === "phone" && phone) {
    return `tel:${phone}`;
  }
  return "#contact";
}

function buildNavContactHref(whatsApp: string, phone: string): string {
  if (whatsApp) {
    return `https://wa.me/${whatsApp.replace(/\D/g, "")}`;
  }
  return `tel:${phone}`;
}

export function HeroSection({
  hero,
  businessName,
  photosByCategory,
  theme,
  whatsApp = "",
  phone = "",
}: HeroSectionProps) {
  const [scrolled, setScrolled] = useState(false);

  const backgroundUrl = getHeroBackground(
    hero.backgroundImageCategory,
    photosByCategory,
  );

  const allPhotos = Object.values(photosByCategory).flat();
  const fallbackImage = allPhotos[0] ?? null;
  const hasBackgroundImage = Boolean(backgroundUrl || fallbackImage);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_SOLID_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-dvh min-h-0 overflow-hidden sm:min-h-[600px]">
      {/* Ken Burns - cinematic zoom, CSS only */}
      <div className="absolute inset-0 overflow-hidden">
        {hasBackgroundImage ? (
          <Image
            src={backgroundUrl ?? fallbackImage!}
            alt=""
            fill
            priority
            className="ken-burns object-cover"
            sizes="100vw"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse at 20% 50%, ${theme.primaryColor}dd 0%, transparent 60%),
                radial-gradient(ellipse at 60% 80%, ${theme.primaryColor}66 0%, transparent 40%),
                linear-gradient(135deg, ${theme.primaryColor} 0%, #111827 100%)
              `,
            }}
          />
        )}
      </div>

      <div className="hero-grain absolute inset-0 z-[1]" aria-hidden="true" />

      {hasBackgroundImage && (
        <div className="absolute inset-0 z-[1] bg-black/50" aria-hidden="true" />
      )}

      <nav
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-8 py-6 transition-colors duration-200 ${
          scrolled ? "bg-white/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <span
          className={`text-xl font-bold leading-[1.2] transition-colors duration-200 sm:text-2xl ${
            scrolled ? "text-[var(--color-text)]" : "text-white"
          }`}
          style={{
            fontFamily: "var(--font-heading)",
            textShadow: scrolled
              ? "none"
              : "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {businessName}
        </span>
        {(whatsApp || phone) && (
          <a
            href={buildNavContactHref(whatsApp, phone)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition-colors duration-500 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] ${
              scrolled
                ? "border border-black/10 text-[var(--color-text)] hover:bg-black/5"
                : "border border-white/40 text-white hover:bg-white/20"
            }`}
          >
            צור קשר
          </a>
        )}
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 mx-auto flex h-full min-h-0 w-full max-w-5xl flex-col justify-end px-8 pb-24 pt-32 sm:min-h-dvh"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6 h-1 w-20 origin-right rounded-full bg-[var(--color-primary)]"
        />

        <h1
          className="max-w-3xl text-right text-6xl font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-7xl md:text-8xl"
          style={{
            fontFamily: "var(--font-heading)",
            textShadow: "0 4px 30px rgba(0,0,0,0.4)",
          }}
        >
          {hero.headline}
        </h1>

        <p
          className="ms-auto me-0 mt-6 max-w-xl text-right text-xl font-normal leading-[1.6] text-white/85 sm:text-2xl"
          style={{ direction: "rtl" }}
        >
          {hero.subheadline}
        </p>

        {hero.ctaText && (
          <div className="mt-10 flex justify-end">
            <a
              href={buildCtaHref(hero.ctaAction, whatsApp, phone)}
              className="inline-block rounded-full px-8 py-4 text-lg font-semibold text-white transition-all duration-500 ease-out hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white sm:px-10 sm:py-5 sm:text-xl"
              style={{
                backgroundColor: "var(--color-primary)",
                boxShadow: `0 8px 32px ${theme.primaryColor}66`,
              }}
            >
              {hero.ctaText}
            </a>
          </div>
        )}
      </motion.div>

      {!scrolled && (
        <button
          type="button"
          onClick={scrollToContent}
          className="absolute inset-x-0 bottom-6 z-20 flex flex-col items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white"
          aria-label="גלול למטה"
        >
          <span className="text-sm font-medium leading-[1.3] text-white/75">
            גלול למטה
          </span>
          <span
            className="hero-scroll-line block h-8 w-px bg-white/60"
            aria-hidden="true"
          />
        </button>
      )}
    </section>
  );
}
