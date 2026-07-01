"use client";

import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { MapPin, Phone } from "lucide-react";

import type { ContactSection as ContactData } from "@/features/website/types";

type ContactSectionProps = {
  contact: ContactData;
};

function whatsAppLink(number: string): string {
  const digits = number.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function ContactSection({ contact }: ContactSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0 });

  const fullAddress = [contact.address, contact.city]
    .filter(Boolean)
    .join(", ");

  return (
    <section
      ref={ref}
      id="contact"
      className="px-6 py-16 text-white sm:py-32 lg:py-40"
      style={{ backgroundColor: "#111827" }}
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="grid gap-10 md:grid-cols-2"
        >
          <div className="flex flex-col gap-6">
            <h2
              className="mb-10 text-5xl font-black leading-[1.15] tracking-[-0.03em] sm:mb-16 sm:text-6xl lg:mb-20 lg:text-7xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {contact.title || "צור קשר"}
            </h2>

            {fullAddress && (
              <p className="flex items-start gap-3 text-lg opacity-90">
                <MapPin className="mt-1 size-5 shrink-0" aria-hidden="true" />
                {fullAddress}
              </p>
            )}

            {contact.hours && (
              <p className="text-base opacity-80">
                <span className="font-medium">שעות פעילות: </span>
                {contact.hours}
              </p>
            )}

            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              {contact.whatsApp && (
                <a
                  href={whatsAppLink(contact.whatsApp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-lg font-semibold text-white transition-all duration-500 ease-out hover:scale-105 active:scale-95"
                >
                  WhatsApp
                </a>
              )}

              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 text-lg font-semibold text-white transition-colors duration-500 ease-out hover:bg-white/10"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  {contact.phone}
                </a>
              )}
            </div>
          </div>

          {contact.googleMapsUrl && fullAddress && (
            <motion.div
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="overflow-hidden rounded-2xl"
            >
              <iframe
                title="מיקום העסק"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed&hl=he`}
                className="h-64 w-full border-0 md:h-full md:min-h-[280px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
