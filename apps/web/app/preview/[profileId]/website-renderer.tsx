"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence } from "motion/react";
import "@fontsource-variable/heebo";
import type { NavbarConfig, NavLink, WebsiteData } from "@/features/website/types";
import { HeroSection } from "@/features/website/components/hero-section";
import { NumbersSection } from "@/features/website/components/numbers-section";
import { AboutSection } from "@/features/website/components/about-section";
import {
  BeforeAfterSection,
  buildBeforeAfterSectionFromPhotos,
} from "@/features/website/components/before-after-section";
import { MenuSection } from "@/features/website/components/menu-section";
import { ServicesSection } from "@/features/website/components/services-section";
import { SocialProofSection } from "@/features/website/components/social-proof-section";
import { GallerySection } from "@/features/website/components/gallery-section";
import { ContactSection } from "@/features/website/components/contact-section";
import { HamburgerMenu } from "@/features/website/components/hamburger-menu";
import { StickyWhatsApp } from "@/features/website/components/sticky-whatsapp";

const HEEBO = "'Heebo Variable', sans-serif";

const DEFAULT_NAVBAR: NavbarConfig = {
  links: [{ label: "צור קשר", href: "#contact" }],
  ctaText: "צור קשר",
  ctaHref: "#contact",
};

function normalizeNavLink(link: NavLink | Record<string, string>): NavLink | null {
  const label = link.label ?? (link as Record<string, string>).Label ?? "";
  const href = link.href ?? (link as Record<string, string>).Href ?? "";
  if (!label || !href) return null;
  return { label, href };
}

function hasBeforeAfterSection(websiteData: WebsiteData): boolean {
  if ((websiteData.beforeAfter?.pairs.length ?? 0) > 0) return true;
  return Object.keys(websiteData.photosByCategory).some((key) =>
    key.startsWith("לפני - "),
  );
}

function resolveNavbar(websiteData: WebsiteData): NavbarConfig {
  const raw = websiteData.navbar;
  const rawLinks = raw?.links ?? (raw as { Links?: NavLink[] } | undefined)?.Links ?? [];
  const links = rawLinks
    .map((link) => normalizeNavLink(link))
    .filter((link): link is NavLink => link !== null);

  if (links.length > 0) {
    return {
      links,
      ctaText: raw?.ctaText ?? DEFAULT_NAVBAR.ctaText,
      ctaHref: raw?.ctaHref ?? DEFAULT_NAVBAR.ctaHref,
    };
  }

  const built: NavLink[] = [];
  if (websiteData.menu) built.push({ label: "תפריט", href: "#menu" });
  built.push({ label: "עלינו", href: "#about" });
  if (
    hasBeforeAfterSection(websiteData)
  ) {
    built.push({ label: "לפני ואחרי", href: "#before-after" });
  }
  if (websiteData.gallery.photoUrls.length > 0) {
    built.push({ label: "גלריה", href: "#gallery" });
  }
  built.push({ label: "צור קשר", href: "#contact" });

  return {
    links: built,
    ctaText: raw?.ctaText ?? DEFAULT_NAVBAR.ctaText,
    ctaHref: raw?.ctaHref ?? DEFAULT_NAVBAR.ctaHref,
  };
}

type WebsiteRendererProps = {
  websiteData: WebsiteData;
};

export function WebsiteRenderer({ websiteData }: WebsiteRendererProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuKey, setMenuKey] = useState(0);
  const lenisRef = useRef<Lenis | null>(null);
  const navLockRef = useRef(false);
  const { theme } = websiteData;
  const navbar = resolveNavbar(websiteData);
  const beforeAfterSection =
    websiteData.beforeAfter ??
    buildBeforeAfterSectionFromPhotos(websiteData.photosByCategory);

  const openMenu = useCallback(() => {
    setMenuKey((k) => k + 1);
    setMenuOpen(true);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = useCallback((href: string) => {
    if (navLockRef.current) return;
    navLockRef.current = true;
    setMenuOpen(false);
    setTimeout(() => {
      navLockRef.current = false;
    }, 500);

    if (!href.startsWith("#")) return;
    setTimeout(() => {
      const target = document.querySelector(href);
      if (target instanceof HTMLElement) {
        lenisRef.current?.scrollTo(target);
      }
    }, 350);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 });
    lenisRef.current = lenis;
    let frame: number;

    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  return (
    <div
      dir="rtl"
      lang="he"
      className="min-h-dvh antialiased"
      style={
        {
          "--color-primary": theme.primaryColor,
          "--color-secondary": theme.secondaryColor,
          "--color-accent": theme.accentColor,
          "--color-text": theme.textColor,
          "--color-bg": theme.bgColor,
          "--font-heading": HEEBO,
          "--font-body": HEEBO,
          backgroundColor: "var(--color-bg)",
          color: "var(--color-text)",
          fontFamily: "var(--font-body)",
        } as React.CSSProperties
      }
    >
      <HeroSection
        hero={websiteData.hero}
        businessName={websiteData.businessName}
        photosByCategory={websiteData.photosByCategory}
        theme={theme}
        navbar={navbar}
        whatsApp={websiteData.contact.whatsApp}
        phone={websiteData.contact.phone}
        menuOpen={menuOpen}
        onMenuOpen={openMenu}
      />
      {websiteData.numbers && (
        <NumbersSection numbers={websiteData.numbers} />
      )}
      <AboutSection
        about={websiteData.about}
        photosByCategory={websiteData.photosByCategory}
      />
      {beforeAfterSection && (
        <BeforeAfterSection section={beforeAfterSection} />
      )}
      {websiteData.menu && (
        <MenuSection
          menu={websiteData.menu}
          primaryColor={theme.primaryColor}
          whatsApp={websiteData.contact.whatsApp}
        />
      )}
      <ServicesSection services={websiteData.services} />
      {websiteData.socialProof && (
        <SocialProofSection socialProof={websiteData.socialProof} />
      )}
      <GallerySection gallery={websiteData.gallery} />
      <ContactSection contact={websiteData.contact} />
      {websiteData.contact.whatsApp && (
        <StickyWhatsApp whatsApp={websiteData.contact.whatsApp} />
      )}

      <AnimatePresence>
        {menuOpen ? (
          <HamburgerMenu
            menuKey={menuKey}
            navbar={navbar}
            contact={websiteData.contact}
            instagramUrl={websiteData.instagramUrl}
            onClose={() => setMenuOpen(false)}
            onNavClick={handleNavClick}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
