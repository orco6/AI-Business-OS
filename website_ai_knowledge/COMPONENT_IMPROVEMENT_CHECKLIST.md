# רשימת בדיקה לשיפור רכיבים

> הרץ **לפני** ו**אחרי** כל שיפור ל-`hero-section.tsx`, `about-section.tsx`, `services-section.tsx`, `gallery-section.tsx`, `contact-section.tsx`, `sticky-whatsapp.tsx`
>
> **מקורות אמת:** גדלי טקסט → `TYPOGRAPHY.md` · ריווח → `SPACING_RULES.md` · motion → `ANIMATION_RULES.md` · צבע → `COLOR_AND_CONTRAST.md`

---

## לפני שמתחילים

- [ ] קראתי `README.md` — מבין שזה שיפור בלבד, לא ארכיטקטורה
- [ ] קראתי קובץ/קבצי knowledge רלוונטיים לרכיב
- [ ] בדקתי את הרכיב הקיים — יודע מה כבר מיושם
- [ ] השיפור מתמקד ב-execution quality (CSS, motion, UX) — לא props/schema חדשים

---

## Hero (`hero-section.tsx`)

> ר' `HERO_RULES.md`, `TYPOGRAPHY.md`, `ANIMATION_RULES.md`, `COLOR_AND_CONTRAST.md`, `COPYWRITING_RULES.md`

### Layout
- [ ] `h-screen min-h-[600px]`
- [ ] תוכן bottom-aligned, `text-right` RTL, `justify-end`
- [ ] `max-w-5xl px-8`

### Typography
- [ ] H1: `text-6xl sm:text-7xl md:text-8xl`, weight 700, lh 1.1
- [ ] Subheadline: max 2 sentences / 120 תווים, `max-w-xl`, opacity 85%
- [ ] accent line: h-1 (4px), w-16–24 (64–96px), origin-right

### Color/Contrast
- [ ] overlay ≥ `bg-black/50` on photo
- [ ] text-shadow on white text over image
- [ ] CTA uses `var(--color-primary)`

### Motion
- [ ] entrance ≤ 1000ms, easing `[0.25, 0.46, 0.45, 0.94]`
- [ ] Ken Burns 20s, disabled on `prefers-reduced-motion`
- [ ] single CTA in body (not multiple)

### Performance
- [ ] Hero image: `priority`, `sizes="100vw"`
- [ ] background alt="" (decorative)

### Accessibility
- [ ] focus-visible ring on CTA + nav link
- [ ] touch targets ≥ 44px on nav button

---

## Gallery (`gallery-section.tsx`)

> ר' `GALLERY_RULES.md`, `PERFORMANCE_RULES.md`, `ACCESSIBILITY_RULES.md`

### Layout
- [ ] max 9 photos
- [ ] desktop: 3-column masonry, `gap-4`, `rounded-2xl`
- [ ] mobile: horizontal scroll snap, 75vw, aspect 4/5

### Interaction
- [ ] hover scale `1.04` (default), max `1.08`, duration 500ms, overflow hidden
- [ ] no hover-only essential info
- [ ] lightbox backdrop ≥ 92% black

### Lightbox
- [ ] `role="dialog"`, `aria-modal`, aria-labels Hebrew
- [ ] nav arrows + close ≥ 44px touch
- [ ] image max 85vh / 80vw

### Performance
- [ ] grid images: `loading="lazy"`, correct `sizes`
- [ ] explicit width/height on grid images (CLS)

### Animation
- [ ] stagger ≤ 0.05s per item, `once: true`

---

## About (`about-section.tsx`)

> ר' `TYPOGRAPHY.md`, `SPACING_RULES.md`, `ANIMATION_RULES.md`

- [ ] `py-20 px-6`, `max-w-5xl`
- [ ] 2-col grid desktop, `gap-10`
- [ ] H2: text-3xl/4xl; story: text-lg, lh relaxed
- [ ] highlights: 12% primary tint badges
- [ ] image: aspect 4/5, rounded-2xl, lazy, alt=title
- [ ] scroll reveal: x ±20, 600ms, once

---

## Services (`services-section.tsx`)

> ר' `TYPOGRAPHY.md`, `SPACING_RULES.md`, `COLOR_AND_CONTRAST.md`

- [ ] tinted background: 8% primary mix
- [ ] H2 centered, mb-10
- [ ] mobile scroll snap 75vw cards
- [ ] desktop 3-col grid, gap-6
- [ ] card: p-5, rounded-2xl, border black/5
- [ ] stagger delay index * 0.08

---

## Contact (`contact-section.tsx`)

> ר' `COPYWRITING_RULES.md`, `COLOR_AND_CONTRAST.md`, `ACCESSIBILITY_RULES.md`

- [ ] dark bg `#111827`, white text
- [ ] WhatsApp: #25D366, `rel="noopener noreferrer"`
- [ ] phone shows actual number
- [ ] map iframe: lazy, title Hebrew
- [ ] buttons ≥ 44px, focus rings
- [ ] `id="contact"` for anchor links

---

## Sticky WhatsApp (`sticky-whatsapp.tsx`)

- [ ] visible only when whatsApp exists
- [ ] `size-14` (56×56px), `fixed bottom-6 end-6`
- [ ] pulse disabled on `prefers-reduced-motion`
- [ ] hover scale 1.10, `aria-label` בעברית
- [ ] `rel="noopener noreferrer"` on external link

---

## בדיקות cross-component

### Typography consistency
- [ ] H2 sections same scale (text-3xl/4xl) across about, services, gallery, contact
- [ ] no font size below 16px on body
- [ ] `--font-heading` on all headings

### Spacing consistency
- [ ] all sections `py-20`
- [ ] all containers `max-w-5xl`
- [ ] horizontal `px-6` (hero px-8 OK)

### Color rhythm
- [ ] light → tinted (services) → light → dark (contact)
- [ ] primary only on actions/accent

### Animation consistency
- [ ] all whileInView: `once: true`
- [ ] durations: 300–600ms sections, 800–1000ms hero only
- [ ] no bounce/elastic on business CTAs

### Accessibility
- [ ] all interactives have focus-visible
- [ ] contrast AA on all text
- [ ] alt text on content images
- [ ] semantic headings (single h1)

### Performance
- [ ] only hero has priority
- [ ] all other images lazy
- [ ] no new heavy libraries
- [ ] CLS < 0.1 (visual check)

### RTL
- [ ] hero/about/contact: `text-right`
- [ ] gallery/services headings: `text-center`
- [ ] logical properties (`start`/`end`) — לא `left`/`right` בשיפורים חדשים
- [ ] lightbox: close at `end-4`, arrows at `-start-12`/`-end-12`

---

## אחרי השיפור

- [ ] preview ב-`/preview/[profileId]` עם profile אמיתי
- [ ] בדיקה mobile 375px + desktop 1440px
- [ ] בדיקה עם/בלי תמונות hero
- [ ] keyboard tab through all links
- [ ] `prefers-reduced-motion` — Ken Burns off
- [ ] לא שיניתי architecture, JSON schema, או file structure
- [ ] אין סתירות עם קבצי knowledge אחרים

---

## red flags — עצור ותקן

| בעיה | fix reference |
|------|---------------|
| טקסט hero לא קריא | `COLOR_AND_CONTRAST.md` — overlay |
| gallery hover > 1.08 | `GALLERY_RULES.md` |
| animation > 1.2s | `ANIMATION_RULES.md` |
| body text < 16px | `TYPOGRAPHY.md` |
| missing focus ring | `ACCESSIBILITY_RULES.md` |
| gallery without lazy | `PERFORMANCE_RULES.md` |
| CTA "לחצו כאן" | `COPYWRITING_RULES.md` |
| container max-w-7xl | `SPACING_RULES.md` — stay max-w-5xl |
