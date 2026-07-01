"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "motion/react";
import type { NumbersSection as NumbersData } from "@/features/website/types";

type NumbersSectionProps = { numbers: NumbersData };

export function NumbersSection({ numbers }: NumbersSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0 });
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isInView) setShow(true);
  }, [isInView]);

  // Fallback: show after 800ms regardless
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (numbers.stats.length === 0) return null;

  return (
    <section
      ref={ref}
      id="numbers"
      style={{ backgroundColor: "#0a0a0a", padding: "4rem 1.5rem", textAlign: "center" }}
    >
      <h2 style={{ color: "white", fontSize: "1.25rem", fontWeight: 700, marginBottom: "3rem", opacity: 0.6 }}>
        {numbers.title || "במספרים"}
      </h2>
      <div style={{ display: "flex", justifyContent: "center", gap: "3rem", flexWrap: "wrap" }}>
        {numbers.stats.map((stat, index) => (
          <div
            key={stat.label}
            style={{
              opacity: show ? 1 : 0,
              transform: show ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`,
              textAlign: "center",
              minWidth: "120px",
            }}
          >
            <div style={{
              fontSize: "3.5rem",
              fontWeight: 900,
              color: "var(--color-primary)",
              lineHeight: 1,
              marginBottom: "0.75rem",
              fontFamily: "var(--font-heading)",
            }}>
              {stat.value}
            </div>
            <div style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", fontWeight: 500 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
