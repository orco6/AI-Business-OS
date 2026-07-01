"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView } from "motion/react";

import type { SocialProofSection as SocialProofData } from "@/features/website/types";

type SocialProofSectionProps = {
  socialProof: SocialProofData;
};

function StarRating({ stars }: { stars: number }) {
  return (
    <div className="flex gap-1" aria-label={`${stars} כוכבים`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={i < stars ? "text-[var(--color-primary)]" : "text-gray-200"}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </div>
  );
}

export function SocialProofSection({ socialProof }: SocialProofSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const hasScreenshots = socialProof.screenshotUrls.length > 0;
  const hasReviews = socialProof.reviews.length > 0;

  if (!hasScreenshots && !hasReviews) return null;

  return (
    <section ref={ref} id="social-proof" className="bg-white px-6 py-16 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-5xl">
        <motion.h2
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.8 }}
          className="mb-10 text-center text-3xl font-black leading-tight tracking-[-0.03em] sm:mb-12 sm:text-4xl"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {socialProof.title}
        </motion.h2>

        {hasScreenshots && (
          <motion.div
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-10 sm:mb-12"
          >
            {/* Mobile: horizontal scroll snap */}
            <div
              className="scroll-hide -mx-6 flex gap-4 overflow-x-auto px-6 pb-4 sm:hidden"
              style={{
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {socialProof.screenshotUrls.map((url, index) => (
                <div
                  key={`mob-screenshot-${index}`}
                  className="relative h-72 shrink-0 overflow-hidden rounded-2xl shadow-lg"
                  style={{ scrollSnapAlign: "start", width: "80vw" }}
                >
                  <Image
                    src={url}
                    alt={`המלצה ${index + 1}`}
                    fill
                    className="object-cover object-top"
                    sizes="80vw"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            {/* Desktop: 2-column grid */}
            <div className="hidden sm:grid sm:grid-cols-2 sm:justify-items-center sm:gap-8">
              {socialProof.screenshotUrls.map((url, index) => (
                <div
                  key={`desk-screenshot-${index}`}
                  className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl shadow-lg"
                >
                  <Image
                    src={url}
                    alt={`המלצה ${index + 1}`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 50vw, 384px"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {hasReviews && (
          <motion.div
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {socialProof.reviews.slice(0, 3).map((review, index) => (
              <article
                key={`review-${index}`}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 text-right shadow-sm sm:p-8"
              >
                <StarRating stars={review.stars} />
                <p className="flex-1 text-base leading-relaxed text-gray-700">
                  &ldquo;{review.text}&rdquo;
                </p>
                <p className="text-sm font-medium text-gray-500">— {review.author}</p>
              </article>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
