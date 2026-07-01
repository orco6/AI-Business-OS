# צבע וניגודיות

> חל על: כל רכיבי website + `ThemeConfig`  
> הפניות: `ACCESSIBILITY_RULES.md` (WCAG ratios), `HERO_RULES.md` (overlay)

---

## עקרון מנחה

Primary color על ≤ 15% משטח המסך (CTAs, accent, badges, price). רקעים: `--color-bg` + tint 8% + Contact `#111827`.

---

## Theme Tokens (קיימים)

| Token | שימוש |
|-------|-------|
| `--color-primary` | CTA, accent line, price, highlight badges |
| `--color-secondary` | gradient fallback hero |
| `--color-bg` | רקע כללי, card backgrounds |
| `--color-accent` | accent line (fallback → primary) |
| `theme.primaryColor` | inline styles, shadows |

**אל תקשיח** צבעים חדשים — השתמש ב-theme + `color-mix()`.

---

## WCAG Contrast (חובה)

| אלמנט | ratio מינימום |
|-------|---------------|
| Body text | 4.5:1 |
| Large text (≥24px / bold ≥18.66px) | 3:1 |
| UI components (buttons, borders) | 3:1 |
| Focus indicator | 3:1 (focused vs unfocused pixels) |

---

## Hero — טקסט על תמונה

| שכבה | spec |
|------|------|
| Image overlay | `bg-black/50` (50%) — baseline |
| תמונה בהירה | `/55`–`/60` |
| תמונה כהה | `/40`–`/45` |
| Headline | `#FFFFFF` 100% + text-shadow |
| Subheadline | `white/85` (85% opacity) |
| CTA | `background: var(--color-primary)` + white text |

### בדיקה

- Headline לבן על overlay 50% → contrast ~12:1 ✅
- Subheadline 85% על overlay 50% → ~7:1 ✅

---

## Section Background Rhythm

דפוס רקעים: **light → tinted → light → dark**

| סקשן | רקע | טקסט |
|------|-----|------|
| Hero | תמונה/gradient | לבן |
| About | `--color-bg` (default) | foreground |
| Services | `color-mix(bg 92%, primary)` — tint עדין 8% | foreground |
| Gallery | `--color-bg` | foreground |
| Contact | `#111827` (gray-900) | לבן |

### contrast בין סקשנים

- מעבר light→tinted: הבדל lightness ≥ 5% (oklch L channel).
- Contact `#111827` = dark anchor — **לא לשנות** ללא סיבה מדידה.

---

## Cards (Services)

| property | value |
|----------|-------|
| background | `var(--color-bg)` |
| border | `border-black/5` |
| shadow | `shadow-sm` |
| price color | `var(--color-primary)` |

---

## Highlights badges (About)

```
background: color-mix(in srgb, var(--color-primary) 12%, transparent)
color: var(--color-primary)
```

- 12% primary tint — opacity equivalent ~12% in `color-mix`.

---

## WhatsApp

| property | value |
|----------|-------|
| Brand green | `#25D366` — יוצא מ-differentiator |
| Text on green | white — contrast ~3.5:1 (large text ✅) |

---

## Gradient Fallback Hero

- radial gradients ב-opacity `66`–`dd` hex.
- linear 135° primary → secondary.
- **אל תוסיף** patterns/textures — gradients בלבד.

---

## Hover / Focus states

| state | spec |
|-------|------|
| Ghost button hover | `bg-white/10`–`/20` |
| Primary CTA hover | scale + shadow increase (not color shift) |
| Focus ring | `ring-2 ring-offset-2` — ר' ACCESSIBILITY |

---

## ✅ Do

- overlay מספיק כהה על hero images.
- primary color רק ל-actions ו-accent.
- section tint עדין (≤10% primary mix).
- Contact section כ-dark anchor.

## ❌ Don't

- gradient text על body copy.
- primary color על paragraphs.
- opacity מתחת ל-75% על body text.
- יותר מ-3 background colors בדף (לא כולל hero image).
- neon/saturated: saturation (oklch C) > 0.25 על שטחים גדולים — אסור.
