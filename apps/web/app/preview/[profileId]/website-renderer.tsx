"use client";

import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { AnimatePresence, motion } from "motion/react";
import "@fontsource-variable/heebo";
import type { NavbarConfig, NavLink, WebsiteData } from "@/features/website/types";
import { HeroSection } from "@/features/website/components/hero-section";
import { NumbersSection } from "@/features/website/components/numbers-section";
import { AboutSection } from "@/features/website/components/about-section";
import { MenuSection } from "@/features/website/components/menu-section";
import { ServicesSection } from "@/features/website/components/services-section";
import { SocialProofSection } from "@/features/website/components/social-proof-section";
import { GallerySection } from "@/features/website/components/gallery-section";
import { ContactSection } from "@/features/website/components/contact-section";
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
        {menuOpen && (
          <motion.div
            key={menuKey}
            role="dialog"
            aria-modal="true"
            aria-label="תפריט ניווט"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 999999,
              opacity: 1,
              background:
                "linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(20,20,30,0.95) 100%)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="סגור תפריט"
              style={{
                position: "absolute",
                top: "24px",
                left: "24px",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "transparent",
                color: "white",
                fontSize: "18px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                touchAction: "manipulation",
              }}
            >
              ✕
            </button>

            <nav
              aria-label="קישורי ניווט"
              style={{
                position: "relative",
                zIndex: 1,
                display: "flex",
                flexDirection: "column",
                gap: 0,
                width: "100%",
                padding: "0 2.5rem",
                textAlign: "right",
              }}
            >
              {navbar.links.map((link, index) => (
                <Fragment key={`${link.href}-${index}`}>
                  {index > 0 && (
                    <div
                      aria-hidden="true"
                      style={{
                        height: "1px",
                        backgroundColor: "rgba(255,255,255,0.08)",
                        margin: "0.5rem 0",
                      }}
                    />
                  )}
                  <a
                    href={link.href}
                    onClick={(e) => {
                      if (link.href.startsWith("#")) {
                        e.preventDefault();
                        handleNavClick(link.href);
                      } else {
                        setMenuOpen(false);
                      }
                    }}
                    style={{
                      color: "#ffffff",
                      fontSize: "2.5rem",
                      fontWeight: 900,
                      textDecoration: "none",
                      letterSpacing: "-0.02em",
                      fontFamily: "var(--font-heading)",
                      padding: "0.5rem 0",
                      display: "block",
                      touchAction: "manipulation",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    {link.label}
                  </a>
                </Fragment>
              ))}
            </nav>

            <a
              href={navbar.ctaHref}
              onClick={(e) => {
                if (navbar.ctaHref.startsWith("#")) {
                  e.preventDefault();
                  handleNavClick(navbar.ctaHref);
                } else {
                  setMenuOpen(false);
                }
              }}
              target={navbar.ctaHref.startsWith("http") ? "_blank" : undefined}
              rel={navbar.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
              style={{
                position: "absolute",
                bottom: "3rem",
                zIndex: 1,
                backgroundColor: "var(--color-primary)",
                color: "white",
                padding: "1rem 3rem",
                borderRadius: "9999px",
                fontSize: "1.1rem",
                fontWeight: 700,
                textDecoration: "none",
                touchAction: "manipulation",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              {navbar.ctaText}
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
