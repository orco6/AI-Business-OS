"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type FormEvent, type ReactNode, useState } from "react";

export type ContactDetails = {
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  hours: string;
  ownerName: string;
};

type ContactDetailsScreenProps = {
  onNext: (details: ContactDetails) => void;
  onSkip: () => void;
};

const inputClassName = cn(
  "w-full rounded-2xl border border-border bg-card px-4 py-3 text-start text-base text-foreground shadow-sm outline-none transition-colors",
  "placeholder:text-muted-foreground/60",
  "focus:border-primary focus:ring-2 focus:ring-ring/25",
);

function parseLocation(value: string): Pick<ContactDetails, "city" | "address"> {
  const trimmed = value.trim();
  if (!trimmed) return { city: "", address: "" };

  const separatorIndex = trimmed.indexOf(" / ");
  if (separatorIndex === -1) return { city: "", address: trimmed };

  return {
    city: trimmed.slice(0, separatorIndex).trim(),
    address: trimmed.slice(separatorIndex + 3).trim(),
  };
}

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            {" "}
            *
          </span>
        ) : null}
      </label>
      {children}
    </div>
  );
}

export function ContactDetailsScreen({
  onNext,
  onSkip,
}: ContactDetailsScreenProps) {
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [location, setLocation] = useState("");
  const [hours, setHours] = useState("");
  const [ownerName, setOwnerName] = useState("");

  const isValid = phone.trim().length >= 9;

  function buildDetails(): ContactDetails {
    const { city, address } = parseLocation(location);

    return {
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      address,
      city,
      hours: hours.trim(),
      ownerName: ownerName.trim(),
    };
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValid) return;
    onNext(buildDetails());
  }

  return (
    <main className="flex min-h-[100svh] flex-col px-6 py-10">
      <header className="mx-auto flex w-full max-w-md items-center gap-3">
        <div className="relative">
          <span
            aria-hidden="true"
            className="flex size-9 items-center justify-center rounded-full bg-primary"
          >
            <span className="size-3 rounded-full bg-primary-foreground" />
          </span>
          <span
            aria-hidden="true"
            className="absolute -bottom-0.5 -start-0.5 size-3 rounded-full border-2 border-background bg-emerald-500"
          />
        </div>
        <span className="text-sm font-medium tracking-tight text-muted-foreground">
          העוזר שלך
        </span>
      </header>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col pt-8">
        <header className="mb-6 text-start">
          <h1 className="text-balance text-3xl font-semibold tracking-tight">
            איך לקוחות יוכלו להגיע אליך?
          </h1>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
          <div className="flex flex-col gap-4">
            <Field id="contact-phone" label="טלפון" required>
              <input
                id="contact-phone"
                type="tel"
                dir="ltr"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="050-0000000"
                required
                className={inputClassName}
              />
            </Field>

            <Field id="contact-whatsapp" label="WhatsApp">
              <input
                id="contact-whatsapp"
                type="tel"
                dir="ltr"
                value={whatsapp}
                onChange={(event) => setWhatsapp(event.target.value)}
                placeholder="050-0000000 (אם שונה מהטלפון)"
                className={inputClassName}
              />
            </Field>

            <Field id="contact-location" label="עיר / כתובת">
              <input
                id="contact-location"
                type="text"
                dir="auto"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="תל אביב / רחוב הרצל 1"
                className={inputClassName}
              />
            </Field>

            <Field id="contact-hours" label="שעות פעילות">
              <input
                id="contact-hours"
                type="text"
                dir="auto"
                value={hours}
                onChange={(event) => setHours(event.target.value)}
                placeholder="א׳-ה׳ 9:00-18:00, ו׳ 9:00-14:00"
                className={inputClassName}
              />
            </Field>

            <Field id="contact-owner" label="שם בעל העסק">
              <input
                id="contact-owner"
                type="text"
                dir="auto"
                value={ownerName}
                onChange={(event) => setOwnerName(event.target.value)}
                placeholder="השם שיופיע באתר"
                className={inputClassName}
              />
            </Field>
          </div>

          <div className="mt-auto flex flex-col gap-3 pt-8">
            <Button
              type="submit"
              size="lg"
              disabled={!isValid}
              className="w-full shadow-sm transition-transform active:scale-[0.99] disabled:opacity-40"
            >
              המשך
            </Button>

            <button
              type="button"
              onClick={onSkip}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              דלג, אמשיך אחר כך
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
