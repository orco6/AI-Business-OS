# כללי Hero Section

> חל על: `hero-section.tsx`  
> מקורות השראה: Land-book, Lapa Ninja, Aceternity UI, Awwwards editorial heroes  
> הפניות: `TYPOGRAPHY.md` (גדלי טקסט), `ANIMATION_RULES.md` (motion), `SPACING_RULES.md` (ריווח)

---

## מטרת Hero

לענות בשלוש שניות על: **מה זה?** (headline) · **למה זה חשוב?** (subheadline) · **מה עושים?** (CTA אחד).

---

## פריסה (Layout)

### מידות סקשן

| פרמטר | Desktop | Mobile |
|-------|---------|--------|
| גובה | `100vh`, `min-h-[600px]` | `100vh`, `min-h-[600px]` (נוכחי בקוד) |
| max-width תוכן | `max-w-5xl` (1024px) | אותו דבר |
| padding אופקי | `px-8` (32px) | `px-8` (32px) — נוכחי בקוד |
| יישור תוכן | `text-right`, `justify-end` (RTL) | אותו דבר |

### מיקום תוכן — Bottom-Align

- תוכן Hero בתחתית המסך (לא מרכז אנכי).
- `pt-32 pb-24` — 128px מ-nav, 96px מקצה תחתון.
- Nav: `absolute top-0`, `px-8 py-6` (32px / 24px), `z-20`.

### Visual Weight Triangle

שלוש נקודות עניין:

1. **רקע** — תמונה/גרדient (עוגן ויזואלי)
2. **Headline** — נקודת מבט ראשונה
3. **CTA** — יעד תנועת העין האחרון

---

## רקע (Background)

### תמונת רקע

| פרמטר | ערך |
|-------|-----|
| Overlay כהה | `bg-black/50` (50%) — baseline; מינימום 40%, מקסימום 60% |
| object-fit | `object-cover` |
| Ken Burns | scale 1 → 1.08, 20s, `ease-in-out`, `alternate` |
| sizes | `100vw` |
| loading | `priority` (LCP) |

### גradient fallback (ללא תמונה)

- 3 radial gradients + linear 135° — כבר מיושם; שמור על opacity בין `66` ל-`dd` hex.

### קו accent

- גובה: `h-1` (4px)
- רוחב: `w-16` עד `w-24` (64–96px)
- `origin-right` (RTL), `rounded-full`
- צבע: `var(--color-accent)` או `var(--color-primary)`

---

## טיפוגרפיה Hero

> פרטים מלאים ב-`TYPOGRAPHY.md` — סעיף Hero

| אלמנט | Desktop | Mobile | weight | line-height |
|-------|---------|--------|--------|-------------|
| H1 headline | 60–96px (`text-6xl`→`text-8xl`) — נוכחי | 60px base (`text-6xl`) | 700 | 1.1 |
| Subheadline | 20–24px (`text-xl`→`text-2xl`) | 18–20px (`text-lg`→`text-xl`) | 400 | 1.5–1.6 |
| Nav business name | 24px (`text-2xl`) | 20px (`text-xl`) | 700 | 1.2 |
| CTA label | 18–20px (`text-lg`→`text-xl`) | 16–18px | 600–700 | 1.2 |

### כללי טקסט

- **Headline**: מקסימום 8–10 מילים; `letter-spacing: -0.02em` על כותרות גדולות.
- **Subheadline**: 1–2 משפטים; `max-w-xl`; opacity `85%` (`text-white/85`).
- **text-shadow** על טקסט לבן מעל תמונה: `0 4px 30px rgba(0,0,0,0.4)`.

---

## CTA

| פרמטר | ערך |
|-------|-----|
| צורה | `rounded-full` |
| padding | `px-10 py-5` (desktop), `px-8 py-4` (mobile) |
| shadow | `0 8px 32px` + primary color ב-40% opacity |
| hover | `scale-105`, shadow חזק יותר |
| active | `scale-95` |
| מספר CTAs | **1 בלבד** בגוף Hero; nav יכול "צור קשר" נוסף |

---

## Motion

> פרטים ב-`ANIMATION_RULES.md`

| אלמנט | initial | animate | duration | delay | easing |
|-------|---------|---------|----------|-------|--------|
| תוכן Hero | opacity 0, y: 32 | opacity 1, y: 0 | 1000ms | 0 | `[0.25, 0.46, 0.45, 0.94]` |
| קו accent | scaleX: 0 | scaleX: 1 | 800ms | 300ms | default |
| Ken Burns | — | CSS keyframes | 20s | — | ease-in-out |

---

## Nav ב-Hero

- לוגו/שם עסק: לבן + text-shadow.
- כפתור "צור קשר": `border border-white/40`, `backdrop-blur-sm`, `rounded-full px-5 py-2.5`.
- hover: `bg-white/20`.

---

## ✅ Do

- CTA אחד + overlay ≥ `bg-black/50`.
- Ken Burns: scale 1→1.08, 20s (לא מעל 1.10).
- תוכן bottom-aligned: `pt-32 pb-24`.
- `prefers-reduced-motion`: כבה Ken Burns (ב-`globals.css`).

## ❌ Don't

- יותר מ-CTA אחד בגוף Hero.
- subheadline ארוך מ-2 משפטים / 120 תווים.
- headline מעל 10 מילים.
- overlay מתחת ל-40% (`bg-black/40`) על תמונות בהירות.
- entrance מעל 1000ms.
- carousel/slider — תמונה אחת קבועה.
- שינוי JSON, props, או קבצים חדשים — רק CSS/layout/motion בתוך `hero-section.tsx`.
