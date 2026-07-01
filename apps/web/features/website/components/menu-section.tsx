"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import type { MenuSection as MenuData } from "@/features/website/types";

type MenuSectionProps = {
  menu: MenuData;
  primaryColor: string;
  whatsApp?: string;
};

type MenuMode = "photos" | "manual" | "url";

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

function resolveMenuMode(menu: MenuData): MenuMode | null {
  const photos = menu.menuPhotos ?? [];
  const categories = menu.categories ?? [];
  const hasItems = categories.some((category) => category.items.length > 0);

  if (menu.displayMode === "photos" && photos.length > 0) return "photos";
  if (menu.displayMode === "manual" && hasItems) return "manual";
  if (menu.displayMode === "url" && menu.menuUrl) return "url";

  if (photos.length > 0) return "photos";
  if (hasItems) return "manual";
  if (menu.menuUrl) return "url";

  return null;
}

function ReservationButton({
  menu,
  whatsApp,
}: {
  menu: MenuData;
  whatsApp: string;
}) {
  if (!menu.hasReservations) return null;

  return (
    <a
      href={buildReservationHref(menu, whatsApp)}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block rounded-full px-6 py-3 text-base font-bold text-white no-underline transition-opacity hover:opacity-90"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      הזמן מקום
    </a>
  );
}

function MenuPhotosGrid({
  photos,
  title,
}: {
  photos: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((index) =>
      index === null ? null : index > 0 ? index - 1 : photos.length - 1,
    );
  }, [photos.length]);

  const showNext = useCallback(() => {
    setActiveIndex((index) =>
      index === null ? null : index < photos.length - 1 ? index + 1 : 0,
    );
  }, [photos.length]);

  function handleTouchStart(clientX: number) {
    touchStartX.current = clientX;
  }

  function handleTouchEnd(clientX: number) {
    if (touchStartX.current === null) return;
    const delta = clientX - touchStartX.current;
    if (Math.abs(delta) > 50) {
      if (delta > 0) showNext();
      else showPrev();
    }
    touchStartX.current = null;
  }

  return (
    <>
      <p className="mb-6 text-center text-sm text-neutral-500">
        להגדלה לחץ על התמונה
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
        {photos.map((url, index) => (
          <button
            key={`${url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-neutral-200"
            aria-label={`תמונת תפריט ${index + 1}`}
          >
            <Image
              src={url}
              alt={`${title} ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          </button>
        ))}
      </div>

      {activeIndex !== null ? (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="תצוגת תפריט מלאה"
          onTouchStart={(event) =>
            handleTouchStart(event.touches[0]?.clientX ?? 0)
          }
          onTouchEnd={(event) =>
            handleTouchEnd(event.changedTouches[0]?.clientX ?? 0)
          }
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute end-4 top-4 z-10 rounded-full bg-white/20 p-2 text-xl text-white backdrop-blur-sm"
            aria-label="סגור"
          >
            ✕
          </button>

          {photos.length > 1 ? (
            <>
              <button
                type="button"
                onClick={showPrev}
                className="absolute start-2 z-10 rounded-full bg-white/20 p-3 text-2xl text-white backdrop-blur-sm sm:start-6"
                aria-label="תמונה קודמת"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={showNext}
                className="absolute end-2 z-10 rounded-full bg-white/20 p-3 text-2xl text-white backdrop-blur-sm sm:end-6"
                aria-label="תמונה הבאה"
              >
                ›
              </button>
            </>
          ) : null}

          <div className="relative max-h-[85dvh] max-w-[90vw]">
            <Image
              src={photos[activeIndex]}
              alt={`${title} ${activeIndex + 1}`}
              width={1200}
              height={1600}
              className="max-h-[85dvh] w-auto max-w-[90vw] rounded-xl object-contain"
              priority
            />
            {photos.length > 1 ? (
              <p className="mt-3 text-center text-sm text-white/70">
                {activeIndex + 1} / {photos.length}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}

function MenuManualTabs({ categories }: { categories: MenuData["categories"] }) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.name ?? "",
  );

  const activeItems =
    categories.find((category) => category.name === activeCategory)?.items ??
    categories[0]?.items ??
    [];

  return (
    <div className="flex flex-col gap-8">
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        role="tablist"
        aria-label="קטגוריות תפריט"
      >
        {categories.map((category) => (
          <button
            key={category.name}
            type="button"
            role="tab"
            aria-selected={activeCategory === category.name}
            onClick={() => setActiveCategory(category.name)}
            className="shrink-0 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors"
            style={
              activeCategory === category.name
                ? {
                    borderColor: "var(--color-primary)",
                    backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, white)",
                    color: "var(--color-primary)",
                  }
                : {
                    borderColor: "#e5e5e5",
                    backgroundColor: "white",
                    color: "#737373",
                  }
            }
          >
            {category.name}
          </button>
        ))}
      </div>

      <ul className="flex flex-col gap-6" role="tabpanel">
        {activeItems.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="flex items-start justify-between gap-4 border-b border-neutral-200/80 pb-6 last:border-0 last:pb-0"
          >
            <div className="min-w-0 flex-1 text-start">
              <p
                className="text-lg font-bold leading-snug text-neutral-900"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {item.name}
              </p>
              {item.description ? (
                <p className="mt-1 text-sm leading-relaxed text-neutral-500">
                  {item.description}
                </p>
              ) : null}
            </div>
            {item.price ? (
              <span
                className="shrink-0 text-base font-bold tabular-nums"
                style={{ color: "var(--color-primary)" }}
              >
                {item.price}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MenuUrlButton({ menuUrl }: { menuUrl: string }) {
  const [iframeOpen, setIframeOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setIframeOpen(true)}
        className="inline-block rounded-full border-2 px-8 py-4 text-lg font-bold transition-opacity hover:opacity-90"
        style={{
          borderColor: "var(--color-primary)",
          color: "var(--color-primary)",
        }}
      >
        לצפייה בתפריט המלא
      </button>

      {iframeOpen ? (
        <div className="fixed inset-0 z-[200] flex flex-col bg-neutral-950">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3">
            <button
              type="button"
              onClick={() => setIframeOpen(false)}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white"
            >
              ← חזרה
            </button>
            <a
              href={menuUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/70 underline"
            >
              פתח בחלון חדש
            </a>
          </div>
          <iframe
            src={menuUrl}
            title="תפריט מלא"
            className="min-h-0 flex-1 w-full border-0 bg-white"
          />
        </div>
      ) : null}
    </>
  );
}

export function MenuSection({ menu, whatsApp = "" }: MenuSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const mode = resolveMenuMode(menu);

  if (!mode) return null;

  const photos = menu.menuPhotos ?? [];
  const categories = menu.categories ?? [];
  const title = menu.title || "התפריט שלנו";

  return (
    <section ref={ref} id="menu" className="bg-[#faf8f5] px-6 py-12 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <motion.div
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-10 flex flex-col items-center gap-6 text-center sm:mb-14">
            <h2
              className="text-4xl font-black leading-tight tracking-[-0.03em] sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h2>
          </div>

          <div className="mx-auto max-w-3xl">
            {mode === "photos" ? (
              <MenuPhotosGrid photos={photos} title={title} />
            ) : null}

            {mode === "manual" ? (
              <MenuManualTabs categories={categories} />
            ) : null}

            {mode === "url" ? (
              <div className="flex justify-center py-4">
                <MenuUrlButton menuUrl={menu.menuUrl} />
              </div>
            ) : null}
          </div>

          {menu.hasReservations ? (
            <div className="mt-10 flex justify-center sm:mt-14">
              <ReservationButton menu={menu} whatsApp={whatsApp} />
            </div>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
