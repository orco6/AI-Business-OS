# בסיס ידע לשיפור רכיבי אתר עסקי

## מטרה

בסיס ידע זה מיועד **לשיפור איכות הביצוע (Execution Quality)** של הרכיבים הקיימים ב-`apps/web/features/website/components/` — לא לבניית ארכיטקטורה חדשה, לא ליצירת אתרים מאפס, ולא לשינוי מבנה תיקיות.

## ארכיטקטורה קיימת — אסור לשנות

| שכבה | תפקיד |
|------|--------|
| Website Agent (Backend) | מייצר JSON תוכן לפי עסק |
| רכיבי React קבועים | מרנדרים את ה-JSON |
| Multi-tenant | כל העסקים משתמשים באותם רכיבים |

רכיבים קיימים:

- `hero-section.tsx`
- `about-section.tsx`
- `services-section.tsx`
- `gallery-section.tsx`
- `contact-section.tsx`
- `sticky-whatsapp.tsx`

## מתי להשתמש

**לפני** שיפור כל רכיב — קרא את הקובץ הרלוונטי כאן:

| רכיב | קבצים לקרוא |
|------|-------------|
| Hero | `HERO_RULES.md`, `TYPOGRAPHY.md`, `ANIMATION_RULES.md`, `COLOR_AND_CONTRAST.md`, `COPYWRITING_RULES.md` |
| Gallery | `GALLERY_RULES.md`, `PERFORMANCE_RULES.md`, `ACCESSIBILITY_RULES.md` |
| About | `TYPOGRAPHY.md`, `SPACING_RULES.md`, `ANIMATION_RULES.md` |
| Services | `TYPOGRAPHY.md`, `SPACING_RULES.md`, `COLOR_AND_CONTRAST.md` |
| Contact | `COPYWRITING_RULES.md`, `COLOR_AND_CONTRAST.md`, `ACCESSIBILITY_RULES.md` |
| Sticky WhatsApp | `ACCESSIBILITY_RULES.md`, `ANIMATION_RULES.md`, `COLOR_AND_CONTRAST.md` |

**אחרי** שיפור — הרץ `COMPONENT_IMPROVEMENT_CHECKLIST.md`.

## כללי שימוש

1. **שיפור בלבד** — אל תציע שינוי ארכיטקטורה, Agent, JSON schema, מבנה קבצים, או רכיבים חדשים.
2. **מספרים קונקרטיים** — יישם ערכים (px, ms, ratios) ישירות ב-Tailwind/CSS **בתוך** הקבצים ב-`components/`.
3. **RTL עברית** — ר' סעיף RTL למטה; `dir="rtl"` ו-`lang="he"` כבר מוגדרים ב-`website-renderer.tsx`.
4. **Theme דינמי** — `var(--color-primary)`, `var(--color-bg)`, `theme.primaryColor` — לא צבעים קשיחים (למעט WhatsApp `#25D366`, Contact `#111827`).
5. **אין העתקת קוד** — המקורות שימשו לחילוץ עקרונות ויזואליים/UX בלבד.
6. **אין תלויות חדשות** — שיפורים ב-CSS/motion/react בלבד; לא GSAP, לא modal libraries, לא component libraries.
7. **היקף שינוי** — רק קבצים ב-`components/` + `globals.css`. **לא** לשנות `website-renderer.tsx`, Agent, או API.

## מקורות אמת (מניעת סתירות)

| נושא | קובץ יחיד |
|------|-----------|
| גדלי טקסט | `TYPOGRAPHY.md` |
| ריווח / container | `SPACING_RULES.md` |
| duration / easing | `ANIMATION_RULES.md` |
| contrast / section colors | `COLOR_AND_CONTRAST.md` |
| Hero layout | `HERO_RULES.md` |
| Gallery / lightbox | `GALLERY_RULES.md` |
| CTA / microcopy | `COPYWRITING_RULES.md` |

קבצים אחרים **מפנים** למקורות האלה — לא מגדירים ערכים סותרים.

## RTL — כללים מחייבים

| אלמנט | spec |
|-------|------|
| כיוון דף | `dir="rtl"` + `lang="he"` (renderer — לא לשנות) |
| Hero / About / Contact body | `text-right` |
| Services / Gallery כותרות | `text-center` |
| Hero CTA row | `justify-end` |
| Hero accent line | `origin-right`, scaleX מימין |
| מיקום sticky WhatsApp | `fixed bottom-6 end-6` (logical) |
| lightbox close | `top-4 end-4` (logical — לא `right-4`) |
| lightbox prev/next | `-start-12` / `-end-12` (logical — לא left/right) |
| LTR בתוך RTL | מספרי טלפון, WhatsApp, URLs — OK inline |

**כלל:** בשיפורים חדשים — השתמש ב-`start`/`end`/`ms-*`/`me-*`, לא ב-`left`/`right`/`ml`/`mr`.

## מפת קבצים

| קובץ | תוכן |
|------|------|
| `HERO_RULES.md` | פריסה, טיפוגרפיה, motion, overlay, CTA |
| `GALLERY_RULES.md` | masonry, hover, lightbox, mobile scroll |
| `TYPOGRAPHY.md` | סולם טיפוגרפי מלא — מקור אמת לגדלי טקסט |
| `ANIMATION_RULES.md` | timing, easing, scroll-triggered — מקור אמת לאנימציות |
| `COLOR_AND_CONTRAST.md` | צבעים, overlay, ניגודיות בין סקשנים |
| `SPACING_RULES.md` | ריווח, whitespace, max-width — מקור אמת לריווח |
| `COPYWRITING_RULES.md` | CTA ומיקרו-קופי בעברית |
| `ACCESSIBILITY_RULES.md` | focus, alt, contrast, keyboard |
| `PERFORMANCE_RULES.md` | תמונות, lazy load, responsive |
| `COMPONENT_IMPROVEMENT_CHECKLIST.md` | רשימת בדיקה לפני/אחרי שיפור |

## סדר עדיפויות בשיפור

1. **קריאות** — overlay ≥ `bg-black/50`; body text contrast ≥ 4.5:1.
2. **היררכיה** — 3 רמות ב-Hero בלבד (H1 → sub → CTA).
3. **Motion** — reveal 300–600ms; Hero entrance ≤ 1000ms; hover 150–200ms.
4. **Mobile** — breakpoints 375px / 768px / 1440px; touch targets ≥ 44×44px.
5. **ביצועים** — Hero `priority` + `sizes="100vw"`; שאר תמונות `lazy`; LCP < 2.5s.

## מקורות השראה (עקרונות בלבד)

- Aceternity UI / Magic UI — micro-interactions, text reveal, parallax עדין
- shadcn/ui — focus rings, contrast tokens, rounded corners עקביים
- Awwwards SOTD — scroll storytelling, easing מותאם, restraint
- Land-book / Lapa Ninja — hero editorial, whitespace, CTA יחיד
- Mobbin — touch targets, mobile gallery patterns
