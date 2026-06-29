"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "@fontsource-variable/heebo";
import "@fontsource-variable/frank-ruhl-libre";
import "@fontsource-variable/rubik";
import "@fontsource/secular-one";
import type { WebsiteData } from "@/features/website/types";
import { HeroSection } from "@/features/website/components/hero-section";
import { AboutSection } from "@/features/website/components/about-section";
import { ServicesSection } from "@/features/website/components/services-section";
import { GallerySection } from "@/features/website/components/gallery-section";
import { ContactSection } from "@/features/website/components/contact-section";
import { StickyWhatsApp } from "@/features/website/components/sticky-whatsapp";

const HEADING_FONTS: Record<string, string> = {
  "frank-ruhl": "'Frank Ruhl Libre Variable', serif",
  secular: "'Secular One', sans-serif",
  rubik: "'Rubik Variable', sans-serif",
  heebo: "'Heebo Variable', sans-serif",
};

const BODY_FONT = "'Heebo Variable', sans-serif";

type WebsiteRendererProps = {
  websiteData: WebsiteData;
};

export function WebsiteRenderer({ websiteData }: WebsiteRendererProps) {
  const { theme } = websiteData;
  const headingFont =
    HEADING_FONTS[theme.fontHeading] ?? HEADING_FONTS.heebo;

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08 });
    let frame: number;

    function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    }

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <div
      dir="rtl"
      lang="he"
      className="min-h-screen antialiased"
      style={
        {
          "--color-primary": theme.primaryColor,
          "--color-secondary": theme.secondaryColor,
          "--color-accent": theme.accentColor,
          "--color-text": theme.textColor,
          "--color-bg": theme.bgColor,
          "--font-heading": headingFont,
          "--font-body": BODY_FONT,
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
        whatsApp={websiteData.contact.whatsApp}
        phone={websiteData.contact.phone}
      />
      <AboutSection
        about={websiteData.about}
        photosByCategory={websiteData.photosByCategory}
      />
      <ServicesSection services={websiteData.services} />
      <GallerySection gallery={websiteData.gallery} />
      <ContactSection contact={websiteData.contact} />
      {websiteData.contact.whatsApp && (
        <StickyWhatsApp whatsApp={websiteData.contact.whatsApp} />
      )}
    </div>
  );
}
