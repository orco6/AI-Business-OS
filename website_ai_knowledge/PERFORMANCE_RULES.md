# כללי ביצועים (Performance)

> חל על: כל רכיבי website, במיוחד `hero-section.tsx`, `gallery-section.tsx`, `about-section.tsx`  
> Stack: Next.js Image, Tailwind, motion/react

---

## LCP (Largest Contentful Paint)

| element | rule |
|---------|------|
| Hero image | `priority` prop — ✅ |
| Hero sizes | `100vw` |
| Hero format | Next.js auto WebP/AVIF |

**יעד**: LCP < 2.5s on 4G

---

## Image Loading Strategy

| context | loading | priority |
|---------|---------|----------|
| Hero background | eager | `priority` |
| About image | lazy | — |
| Gallery grid | lazy | — |
| Lightbox full-size | lazy (loaded on :target) | — |
| Map iframe | `loading="lazy"` — ✅ |

---

## Responsive Images (sizes)

| component | sizes attribute |
|-----------|-----------------|
| Hero | `100vw` |
| About | `(max-width: 768px) 100vw, 50vw` — ✅ |
| Gallery mobile | `75vw` — ✅ |
| Gallery desktop | `33vw` — ✅ |
| Lightbox | `80vw` max display |

### width/height

- Gallery desktop: explicit `width={400}` + variable height — prevents CLS ✅
- Lightbox: `width={1200} height={900}` — aspect hint ✅
- Hero: `fill` + container aspect via min-h ✅

---

## Image Count Budget

| section | max concurrent |
|---------|----------------|
| Hero | 1 (priority) |
| About | 1 |
| Gallery visible | 9 max, lazy loaded |
| Lightbox | 1 at a time |

---

## Formats

- Next.js Image Optimization: auto WebP/AVIF
- **אל תגיש** raw JPEG 4000px+ without optimization
- quality default (75) sufficient for business photos

---

## Animation Performance

| rule | detail |
|------|--------|
| Animate only | `transform`, `opacity` |
| will-change | avoid permanent; use sparingly |
| Ken Burns | CSS transform — GPU accelerated ✅ |
| motion whileInView | once: true — no repeat calculations ✅ |

---

## CSS Performance

| pattern | status |
|---------|--------|
| Ken Burns CSS keyframes | ✅ no JS |
| :target lightbox | ✅ zero JS |
| scroll-hide scrollbar | ✅ lightweight |
| backdrop-blur | use sparingly — hero nav + lightbox OK |

### backdrop-blur cost

- Hero nav: single element — OK
- Lightbox: single overlay — OK
- **Don't** blur large scrolling areas

---

## Font Performance

- `--font-heading` + `--font-body` (Heebo Variable): loaded via `@fontsource` ב-`website-renderer.tsx`.
- `font-display: swap`.
- font weights in use: 400, 500, 600, 700 — **אל תוסיף** weights נוספים.

---

## Third-party

| embed | rule |
|-------|------|
| Google Maps iframe | lazy load — ✅ |
| WhatsApp links | no SDK — direct link ✅ |

---

## CLS Prevention

| technique | where |
|-----------|-------|
| explicit dimensions | gallery grid images |
| `fill` + aspect container | hero, about |
| min-height on hero | `min-h-[600px]` — ✅ |
| reserved iframe height | `h-64 md:min-h-[280px]` — ✅ |

**יעד**: CLS < 0.1

---

## Mobile Gallery Scroll

- horizontal scroll: no JS carousel library needed ✅
- `-webkit-overflow-scrolling: touch` — ✅
- max 9 images in DOM — acceptable

---

## Preload (optional enhancement)

- lightbox: preload next image on :target — future enhancement
- **don't** preload all 9 gallery images

---

## Bundle

- motion/react: בשימוש — **אל תוסיף** GSAP, Locomotive, או modal libraries.
- Lenis: **כבר קיים** ב-`website-renderer.tsx` — לא מוסיפים scroll libs נוספות; לא משנים renderer בשיפור רכיב.
- lucide-react: import individual icons — ✅

---

## ✅ Do

- `priority` only on Hero LCP image
- `loading="lazy"` on below-fold images
- correct `sizes` for each breakpoint
- CSS animations over JS where possible
- Next.js Image for all photos

## ❌ Don't

- priority on gallery/about images
- unoptimized `<img>` tags
- loading all lightbox images eagerly
- smooth scroll libraries (GSAP, Locomotive) — Lenis כבר ב-renderer
- images > 200KB without compression
- animate layout properties
