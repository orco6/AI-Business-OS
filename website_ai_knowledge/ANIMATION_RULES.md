# כללי אנימציה

> **מקור אמת** ל-timing, easing, scroll patterns  
> ספרייה: `motion/react` (Framer Motion) + CSS keyframes  
> חל על: כל רכיבי `features/website/components/`

---

## עקרון מנחה

Animate רק `opacity` + `transform`. Hero entrance ≤ 1000ms; section reveal 300–600ms; hover 150–200ms.

---

## Properties מותרות לאנימציה

| ✅ Animate | ❌ Avoid |
|-----------|---------|
| `opacity` | `width`, `height` |
| `transform` (translate, scale, rotate) | `top`, `left`, `margin` |
| `filter` (blur sparingly) | `box-shadow` animate |
| CSS `background-position` (Ken Burns) | layout-triggering props |

---

## Duration Scale

| קטגוריה | ms | שימוש |
|---------|-----|-------|
| Micro | 150–200 | hover scale, color transition |
| Fast | 300–400 | card reveal, gallery stagger item |
| Standard | 500–600 | section content fade-in |
| Slow | 800–1000 | hero entrance, accent line |
| Ambient | 15000–25000 | Ken Burns background |

---

## Easing

| שם | cubic-bezier / value | שימוש |
|----|---------------------|-------|
| Premium out | `[0.25, 0.46, 0.45, 0.94]` | Hero entrance (נוכחי בקוד) |
| Snappy | `ease-out` / `[0, 0, 0.2, 1]` | card reveals, CTAs |
| Smooth | `[0.4, 0, 0.2, 1]` | general transitions |
| Expo out | equivalent `[0.16, 1, 0.3, 1]` | scroll-in elements (Awwwards pattern) |
| Linear | `linear` / `none` | scrub/parallax only |

### כלל

- **כניסה**: decelerate (ease-out) — אלמנט "נוחת".
- **יציאה**: accelerate (ease-in) — אלמנט "נעלם".
- **Hover**: 150–200ms ease-out.

---

## Hero Animations

| אלמנט | type | duration | delay | easing |
|-------|------|----------|-------|--------|
| Content wrapper | fade + translateY(32→0) | 1000ms | 0 | premium out |
| Accent line | scaleX(0→1) | 800ms | 300ms | default |
| Ken Burns | CSS scale 1→1.08 | 20s | — | ease-in-out alternate |
| CTA hover | scale 1→1.05 | 200ms | — | ease-out |

---

## Scroll-Triggered (whileInView)

### Standard reveal

```
initial:   { opacity: 0, y: 16–20 }
animate:   { opacity: 1, y: 0 }
viewport:  { once: true, margin: "-40px" to "-80px" }
duration:  500–600ms
easing:    ease-out
```

### Stagger (lists, grids)

```
delay: index * 0.08s (cards)
delay: index * 0.04–0.05s (gallery items)
max total stagger: ~400ms
```

### About section (split layout)

| side | initial | delay |
|------|---------|-------|
| Text (RTL right) | x: 20 | 0 |
| Image (RTL left) | x: -20 | 150ms |
| viewport margin | `-80px` | — |

---

## Hover Interactions

| אלמנט | effect | duration |
|-------|--------|----------|
| CTA primary | scale 1.05 | 200ms |
| CTA active | scale 0.95 | 100ms |
| Gallery image | scale 1.04 | 500ms |
| Nav ghost button | bg opacity 0→20% | 200ms |
| Sticky WhatsApp | scale 1→1.10 | 200ms (`transition-transform`) |
| Service card | none | — |

---

## Patterns מהשראה (Aceternity / Magic UI / Awwwards)

| Pattern | יישום בפרויקט | עדיפות |
|---------|---------------|--------|
| Text reveal (clip/mask) | Hero accent line (scaleX) | ✅ קיים |
| Parallax background | Ken Burns CSS | ✅ קיים |
| Stagger grid reveal | gallery, services | ✅ קיים |
| Magnetic button | — | ❌ לא מתאים |
| Scroll-linked timeline | — | ❌ לא מתאים |
| ספריות scroll נוספות | Lenis כבר ב-`website-renderer.tsx` | ❌ אל תוסיף GSAP/Locomotive |

---

## prefers-reduced-motion

חובה לכבות:

- Ken Burns (`.ken-burns { animation: none }`) — ✅ ב-`globals.css`
- whileInView animations → `initial={false}` או CSS `@media (prefers-reduced-motion: reduce)`
- whatsapp pulse — ✅ כבר מכובה

---

## ✅ Do

- `viewport: { once: true }` — אנימציה פעם אחת.
- animate רק `opacity` + `transform`.
- stagger קצר (≤80ms between items).
- hero entrance ≤1s.

## ❌ Don't

- duration מעל 1.2s ל-reveal רגיל.
- bounce/elastic על business CTAs.
- animate על scroll continuously (parallax על הכל).
- reverse animation on scroll up.
- יותר מ-2 animated elements simultaneously ב-Hero.
- autoplay carousel animations.
