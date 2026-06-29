"use client";

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

export function HeroSection({
  hero,
  businessName,
  photosByCategory,
  theme,
  whatsApp = "",
  phone = "",
}: HeroSectionProps) {
  const backgroundUrl = getHeroBackground(
    hero.backgroundImageCategory,
    photosByCategory,
  );

  const allPhotos = Object.values(photosByCategory).flat();
  const fallbackImage = allPhotos[0] ?? null;
  const hasBackgroundImage = Boolean(backgroundUrl || fallbackImage);

  return (
    <section className="relative h-screen min-h-[600px] overflow-hidden">
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
                radial-gradient(ellipse at 80% 20%, ${theme.secondaryColor}99 0%, transparent 50%),
                radial-gradient(ellipse at 60% 80%, ${theme.primaryColor}66 0%, transparent 40%),
                linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.secondaryColor} 100%)
              `,
            }}
          />
        )}
      </div>

      {hasBackgroundImage && (
        <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      )}

      <nav className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-8 py-6">
        <span
          className="text-2xl font-bold text-white"
          style={{
            fontFamily: "var(--font-heading)",
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
          }}
        >
          {businessName}
        </span>
        {(whatsApp || phone) && (
          <a
            href={
              whatsApp
                ? `https://wa.me/${whatsApp.replace(/\D/g, "")}`
                : `tel:${phone}`
            }
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-white border border-white/40 backdrop-blur-sm hover:bg-white/20 transition-colors"
          >
            צור קשר
          </a>
        )}
      </nav>

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative z-10 mx-auto w-full max-w-5xl px-8 pb-24 pt-32 flex flex-col justify-end min-h-screen"
      >
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-6 h-1 w-20 origin-right rounded-full"
          style={{
            backgroundColor: "var(--color-accent, var(--color-primary))",
          }}
        />

        <h1
          className="text-right text-6xl font-bold leading-[1.1] text-white sm:text-7xl md:text-8xl"
          style={{
            fontFamily: "var(--font-heading)",
            textShadow: "0 4px 30px rgba(0,0,0,0.4)",
          }}
        >
          {hero.headline}
        </h1>

        <p
          className="mt-6 text-right text-xl text-white/85 sm:text-2xl max-w-xl mr-0 ml-auto"
          style={{ direction: "rtl" }}
        >
          {hero.subheadline}
        </p>

        {hero.ctaText && (
          <div className="mt-10 flex justify-end">
            <a
              href={buildCtaHref(hero.ctaAction, whatsApp, phone)}
              className="inline-block rounded-full px-10 py-5 text-xl font-bold text-white shadow-2xl transition-all hover:scale-105 hover:shadow-3xl active:scale-95"
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
    </section>
  );
}
