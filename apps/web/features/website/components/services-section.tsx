"use client";

import { motion } from "motion/react";
import type { ServiceItem } from "@/features/website/types";

type ServicesSectionProps = {
  services: ServiceItem[];
};

function ServiceCardContent({ service }: { service: ServiceItem }) {
  return (
    <>
      <h3
        className="text-lg font-bold leading-snug"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {service.name}
      </h3>
      <p className="text-sm leading-relaxed opacity-80">{service.description}</p>
      {service.price && (
        <p
          className="mt-auto text-base font-semibold"
          style={{ color: "var(--color-primary)" }}
        >
          {service.price}
        </p>
      )}
    </>
  );
}

export function ServicesSection({ services }: ServicesSectionProps) {
  if (services.length === 0) return null;

  return (
    <section
      className="px-6 py-20"
      style={{
        backgroundColor:
          "color-mix(in srgb, var(--color-bg) 92%, var(--color-primary))",
      }}
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center text-3xl font-bold sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          השירותים שלנו
        </motion.h2>

        {/* Mobile: horizontal scroll snap */}
        <div
          className="scroll-hide flex gap-4 overflow-x-auto pb-4 sm:hidden"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {services.map((service, index) => (
            <motion.article
              key={`mob-${service.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: 0 }}
              className="flex shrink-0 flex-col gap-3 rounded-2xl border border-black/5 bg-[var(--color-bg)] p-5 shadow-sm"
              style={{ scrollSnapAlign: "start", width: "75vw" }}
            >
              <ServiceCardContent service={service} />
            </motion.article>
          ))}
        </div>

        {/* Desktop: grid */}
        <div className="hidden grid-cols-3 gap-6 sm:grid">
          {services.map((service, index) => (
            <motion.article
              key={`desk-${service.name}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="flex flex-col gap-3 rounded-2xl border border-black/5 bg-[var(--color-bg)] p-5 shadow-sm"
            >
              <ServiceCardContent service={service} />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
