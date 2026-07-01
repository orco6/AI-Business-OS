# כללי קופירייטינג — CTA ומיקרו-קופי

> חל על: Hero CTA, Contact buttons, nav microcopy  
> שפה: **עברית** · RTL · קהל: בעלי עסקים קטנים/בינוניים בישראל  
> תוכן מגיע מ-Website Agent JSON — הרכיבים **מציגים**; Agent **כותב**

---

## עקרון מנחה

CTA: 2–4 מילים. Headline: 4–10 מילים. Subheadline: ≤120 תווים. **0** סימני קריאה.

---

## Hero Headline

| rule | spec |
|------|------|
| אורך | 4–8 מילים (מקס 10) |
| מבנה | [תועלת/הבטחה] + [למי/מה] |
| tone | ≤10 מילים; 0 סימני קריאה; ללא "הכי טוב" |

### דוגמאות ✅

- "יופי שמרגישים — מרכז הטיפוח של תל אביב"
- "עור בריא. תוצאות שרואים."
- "המטבח שתמיד חלמתם — מעוצב ומותקן"

### דוגמאות ❌

- "ברוכים הבאים לאתר שלנו!!!" (generic)
- "אנחנו העסק הכי טוב בישrael עם 20 שנה ניסיון ו..." (ארוך)
- "לחצו כאן לפרטים נוספים" (לא headline)

---

## Hero Subheadline

| rule | spec |
|------|------|
| אורך | 1–2 משפטים, מקס 120 תווים |
| תפקיד | context — מי, איפה, unique value |
| tone | ≤120 תווים; 1–2 משפטים; כולל מיקום או USP |

### דוגמאות ✅

- "טיפולי פנים מתקדמים בלב הרצליה. תיאום מהיר ב-WhatsApp."
- "15 שנות ניסיון. חומרים פרימיום. ייעוץ אישי חינם."

### ❌

- 3+ משפטים
- רשימת features ("✓ מקצועי ✓ אמין ✓ זול")

---

## CTA Labels (Hero)

### מבנה

```
[פועל] + [מה] — 2–4 מילים
```

### patterns מומלצים לפי action

| ctaAction | טקסטים מומלצים |
|-----------|----------------|
| `whatsapp` | "דברו איתנו ב-WhatsApp" · "קבעו תור ב-WhatsApp" · "שלחו הודעה" |
| `phone` | "התקשרו עכשיו" · "חייגו לתיאום" |
| `contact` | "צרו קשר" · "קבעו פגישה" · "בואו נדבר" |

### specs ויזואליים (לא תוכן)

- verb-first בעברית: "קבעו", "דברו", "התקשרו"
- **ללא** סימן קריאה (!)
- **ללא** "לחצו כאן"
- **ללא** ALL CAPS

---

## Nav Microcopy

| element | text |
|---------|------|
| Contact pill | "צור קשר" (קצר — nav context) |

---

## Section Titles

| section | default | rule |
|---------|---------|------|
| Gallery | "גלריה" | ספציפי עדיף: "העבודות שלנו", "לפני ואחרי" |
| Services | "השירותים שלנו" | OK — או category-specific |
| About | from JSON | ספציפי: "הסיפור שלנו", "מי אנחנו" |
| Contact | "צור קשר" | OK — או "בואו נפגש" |

---

## Contact Section

### WhatsApp button

- label: "WhatsApp" (מוכר internationally) **או** "שלחו הודעה"
- **לא**: "לחצו לשלוח WhatsApp"

### Phone button

- הצג מספר אמיתי: `{contact.phone}` — transparency builds trust
- **לא**: "התקשרו" בלי מספר

### Hours label

- "שעות פעילות: " + value — ✅ קיים

---

## Services Cards

| field | rule |
|-------|------|
| name | 2–5 מילים, שם שירות ברור |
| description | 1–2 משפטים, מקס 80 מילים |
| price | פורמט: "₪350" · "החל מ-₪200" · "ייעוץ חינם" |

---

## About Highlights (badges)

- 2–4 מילים each
- noun phrases: "15 שנות ניסיון", "מוצרים טבעיים", "תיאום מהיר"
- **לא** משפטים שלמים

---

## Tone Guide (מדיד)

| מדד | ✅ ערך מותר | ❌ אסור |
|-----|------------|---------|
| סימני קריאה | 0 | 1+ |
| מילים ב-CTA | 2–4 | 7+ |
| superlatives | 0 ("הכי", "מספר 1") | ללא הוכחה |
| urgency | 0 ("מהר", "אל תפספסו") | pushy language |
| emoji בטקסט | 0 | כל emoji |

---

## RTL Copy Notes

- מספרים: ספרות western (350, 15) — OK בעברית modern
- מחיר: ₪ לפני או אחרי — "₪350" or "350 ₪" — **consistent**
- WhatsApp / Phone — brand names ב-LTR within RTL OK

---

## ✅ Do

- verb-led CTAs
- 2–4 מילים per CTA
- subheadline עם location/service hint
- price transparency

## ❌ Don't

- "לחצו כאן" / "click here" equivalent
- multiple exclamation marks
- "הכי טוב", "מספר 1", "leading" — unsubstantiated claims
- CTA text ארוך מ-6 מילים
- emoji ב-CTAs (WhatsApp icon OK via component, not in text)
