"use client";

import { motion } from "motion/react";
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
  const fullAddress = [contact.address, contact.city]
    .filter(Boolean)
    .join(", ");

  return (
    <section
      id="contact"
      className="px-6 py-20 text-white"
      style={{ backgroundColor: "#111827" }}
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid gap-10 md:grid-cols-2"
        >
          <div className="flex flex-col gap-6">
            <h2
              className="text-3xl font-bold sm:text-4xl"
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
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-lg font-semibold text-white transition-transform hover:scale-105 active:scale-95"
                >
                  WhatsApp
                </a>
              )}

              {contact.phone && (
                <a
                  href={`tel:${contact.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-white/10"
                >
                  <Phone className="size-5" aria-hidden="true" />
                  {contact.phone}
                </a>
              )}
            </div>
          </div>

          {contact.googleMapsUrl && fullAddress && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
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
