"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import type {
  HeroSection as HeroData,
  NavbarConfig,
  ThemeConfig,
} from "@/features/website/types";

type HeroSectionProps = {
  hero: HeroData;
  businessName: string;
  photosByCategory: Record<string, string[]>;
  theme: ThemeConfig;
  navbar: NavbarConfig;
  whatsApp?: string;
  phone?: string;
  menuOpen?: boolean;
  onMenuOpen: () => void;
};

const SCROLL_SOLID_THRESHOLD = 60;

const DEFAULT_NAVBAR: NavbarConfig = {
  links: [{ label: "צור קשר", href: "#contact" }],
  ctaText: "צור קשר",
  ctaHref: "#contact",
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
  navbar = DEFAULT_NAVBAR,
  whatsApp = "",
  phone = "",
  menuOpen = false,
  onMenuOpen,
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

  const navTextClass = scrolled ? "text-[var(--color-text)]" : "text-white";

  return (
    <section className="relative h-dvh min-h-0 sm:min-h-[600px]">
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
        <button
          type="button"
          onClick={onMenuOpen}
          className={`rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-primary)] ${navTextClass}`}
          aria-label="פתח תפריט"
          aria-expanded={menuOpen}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            minWidth: "44px",
            minHeight: "44px",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            alignItems: "center",
            justifyContent: "center",
            touchAction: "manipulation",
            WebkitTapHighlightColor: "transparent",
            WebkitAppearance: "none",
          }}
        >
          <span
            style={{
              display: "block",
              width: "24px",
              height: "2px",
              backgroundColor: scrolled ? "#111" : "white",
            }}
          />
          <span
            style={{
              display: "block",
              width: "24px",
              height: "2px",
              backgroundColor: scrolled ? "#111" : "white",
            }}
          />
          <span
            style={{
              display: "block",
              width: "24px",
              height: "2px",
              backgroundColor: scrolled ? "#111" : "white",
            }}
          />
        </button>

        <div className="ms-auto flex items-center gap-4">
          <span
            className={`text-xl font-bold leading-[1.2] transition-colors duration-200 sm:text-2xl ${navTextClass}`}
            style={{
              fontFamily: "var(--font-heading)",
              textShadow: scrolled ? "none" : "0 2px 10px rgba(0,0,0,0.3)",
            }}
          >
            {businessName}
          </span>

          <a
            href={navbar.ctaHref}
            target={navbar.ctaHref.startsWith("http") ? "_blank" : undefined}
            rel={navbar.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
            className={`hidden rounded-full px-5 py-2 text-sm font-semibold transition-all duration-300 hover:scale-105 sm:inline-block ${
              scrolled
                ? "text-white"
                : "text-[var(--color-text)] bg-white/90 backdrop-blur-sm"
            }`}
            style={
              scrolled
                ? {
                    backgroundColor: theme.primaryColor,
                    boxShadow: `0 4px 16px ${theme.primaryColor}66`,
                  }
                : undefined
            }
          >
            {navbar.ctaText}
          </a>
        </div>
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
