"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";

import type { ServiceItem } from "@/features/website/types";

type ServicesSectionProps = {
  services: ServiceItem[];
};

const SECTION_LABEL = "מה אנחנו מציעים";

const cardClassName =
  "flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-10 transition-colors duration-500 ease-out hover:border-white/20 hover:bg-white/10";

function ServiceCardContent({ service }: { service: ServiceItem }) {
  return (
    <>
      <h3
        className="text-lg font-bold leading-snug"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {service.name}
      </h3>
      <p className="text-sm leading-[1.5] text-white/80">{service.description}</p>
      {service.price && (
        <p
          className="mt-auto text-base font-semibold leading-[1.5]"
          style={{ color: "var(--color-primary)" }}
        >
          {service.price}
        </p>
      )}
    </>
  );
}

export function ServicesSection({ services }: ServicesSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0 });

  if (services.length === 0) return null;

  return (
    <section ref={ref} className="bg-[#111827] px-6 py-16 text-white sm:py-32 lg:py-40">
      <div className="mx-auto max-w-5xl">
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
            className="text-5xl font-black leading-[1.15] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            השירותים שלנו
          </h2>
        </motion.div>

        {/* Mobile: horizontal scroll snap */}
        <div
          className="scroll-hide flex gap-4 overflow-x-auto pb-4 sm:hidden"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {services.map((service, index) => (
            <motion.article
              key={`mob-${service.name}-${index}`}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0 }}
              className={`${cardClassName} shrink-0 text-right`}
              style={{ scrollSnapAlign: "start", width: "75vw" }}
            >
              <ServiceCardContent service={service} />
            </motion.article>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden grid-cols-3 gap-8 sm:grid">
          {services.map((service, index) => (
            <motion.article
              key={`desk-${service.name}-${index}`}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: index * 0.08 }}
              className={`${cardClassName} text-right`}
            >
              <ServiceCardContent service={service} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
