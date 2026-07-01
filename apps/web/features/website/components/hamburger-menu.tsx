"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import type { ContactSection, NavbarConfig, NavLink } from "@/features/website/types";

type HamburgerMenuProps = {
  menuKey: number;
  navbar: NavbarConfig;
  contact: ContactSection;
  instagramUrl?: string;
  onClose: () => void;
  onNavClick: (href: string) => void;
};

function extractInstagramHandle(url: string): string {
  try {
    const pathname = new URL(url).pathname.replace(/\/$/, "");
    const handle = pathname.split("/").filter(Boolean)[0];
    return handle ? `@${handle}` : "Instagram";
  } catch {
    return "Instagram";
  }
}

function NavMenuLink({
  link,
  index,
  onNavClick,
  onClose,
}: {
  link: NavLink;
  index: number;
  onNavClick: (href: string) => void;
  onClose: () => void;
}) {
  return (
    <motion.a
      href={link.href}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        delay: 0.1 + index * 0.07,
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
      onClick={(event) => {
        if (link.href.startsWith("#")) {
          event.preventDefault();
          onNavClick(link.href);
        } else {
          onClose();
        }
      }}
      className="block py-3 text-3xl font-black leading-tight tracking-[-0.02em] text-white no-underline transition-opacity hover:opacity-80 sm:text-4xl"
      style={{
        fontFamily: "var(--font-heading)",
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {link.label}
    </motion.a>
  );
}

export function HamburgerMenu({
  menuKey,
  navbar,
  contact,
  instagramUrl = "",
  onClose,
  onNavClick,
}: HamburgerMenuProps) {
  const phone = contact.phone.trim();
  const hours = contact.hours.trim();
  const hasInstagram = instagramUrl.trim().length > 0;
  const instagramHandle = hasInstagram
    ? extractInstagramHandle(instagramUrl)
    : "";

  return (
    <motion.div
      key={menuKey}
      role="dialog"
      aria-modal="true"
      aria-label="תפריט ניווט"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[999999] flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, rgba(8,8,12,0.97) 0%, rgba(18,18,28,0.96) 50%, rgba(10,10,16,0.98) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="סגור תפריט"
        className="absolute left-6 top-6 flex size-11 items-center justify-center rounded-full border border-white/20 text-lg text-white transition-colors hover:bg-white/10"
        style={{ touchAction: "manipulation" }}
      >
        ✕
      </button>

      <div className="flex flex-1 flex-col justify-center px-8 pb-44 pt-24 sm:px-12">
        <nav aria-label="קישורי ניווט" className="w-full text-right">
          {navbar.links.map((link, index) => (
            <Fragment key={`${link.href}-${index}`}>
              {index > 0 ? (
                <div
                  aria-hidden="true"
                  className="my-2 h-px bg-white/10"
                />
              ) : null}
              <NavMenuLink
                link={link}
                index={index}
                onNavClick={onNavClick}
                onClose={onClose}
              />
            </Fragment>
          ))}
        </nav>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/30 px-8 pb-8 pt-5 backdrop-blur-md sm:px-12">
        <motion.a
          href={navbar.ctaHref}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          onClick={(event) => {
            if (navbar.ctaHref.startsWith("#")) {
              event.preventDefault();
              onNavClick(navbar.ctaHref);
            } else {
              onClose();
            }
          }}
          target={navbar.ctaHref.startsWith("http") ? "_blank" : undefined}
          rel={
            navbar.ctaHref.startsWith("http")
              ? "noopener noreferrer"
              : undefined
          }
          className="mb-5 flex w-full items-center justify-center rounded-full py-4 text-base font-bold text-white no-underline sm:text-lg"
          style={{
            backgroundColor: "var(--color-primary)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
            touchAction: "manipulation",
          }}
        >
          {navbar.ctaText}
        </motion.a>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="flex flex-col gap-3 text-sm text-white/75 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6"
        >
          {phone ? (
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 text-white/90 no-underline transition-opacity hover:opacity-80"
              onClick={onClose}
            >
              <span aria-hidden="true">📞</span>
              <span dir="ltr">{phone}</span>
            </a>
          ) : null}

          {hasInstagram ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/90 no-underline transition-opacity hover:opacity-80"
              onClick={onClose}
            >
              <span aria-hidden="true">📷</span>
              <span dir="ltr">{instagramHandle}</span>
            </a>
          ) : null}

          {hours ? (
            <p className="flex items-center gap-2 text-white/70">
              <span aria-hidden="true">🕐</span>
              <span>{hours}</span>
            </p>
          ) : null}
        </motion.div>
      </div>
    </motion.div>
  );
}
