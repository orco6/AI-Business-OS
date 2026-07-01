"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import type { MenuSection as MenuData } from "@/features/website/types";

type MenuSectionProps = {
  menu: MenuData;
  primaryColor: string;
  whatsApp?: string;
};

function buildReservationHref(menu: MenuData, whatsApp: string): string {
  if (menu.reservationLink) return menu.reservationLink;

  const phone = menu.reservationPhone || whatsApp;
  if (phone) {
    const digits = phone.replace(/\D/g, "");
    const message = encodeURIComponent("היי, אשמח להזמין מקום");
    return `https://wa.me/${digits}?text=${message}`;
  }

  return "#contact";
}

export function MenuSection({ menu, primaryColor, whatsApp = "" }: MenuSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  if (!menu.menuUrl && !menu.hasReservations) return null;

  return (
    <section ref={ref} id="menu" className="bg-[#faf8f5] px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <motion.div
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center gap-8 text-center"
        >
          <h2
            className="text-5xl font-black leading-tight tracking-[-0.03em] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            התפריט שלנו
          </h2>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
              padding: "0 1rem",
            }}
          >
            {menu.menuUrl && (
              <a
                href={menu.menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "9999px",
                  border: "2px solid var(--color-primary)",
                  color: "var(--color-primary)",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                לצפייה בתפריט המלא ←
              </a>
            )}
            {menu.hasReservations && (
              <a
                href={buildReservationHref(menu, whatsApp)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "9999px",
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                הזמן מקום
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
