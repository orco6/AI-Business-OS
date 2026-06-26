# PROJECT_BRAIN

> מקור האמת היחיד של AI-Business-OS.
> מתעדכן בכל סוף session.

---

## חזון המוצר

**AI Business OS** הוא עוזר AI לבעלי עסקים קטנים ובינוניים בישראל.

לא website builder. לא chatbot. לא dashboard.

**עובד AI** שעושה את העבודה בשביל בעל העסק:
- בונה נוכחות דיגיטלית מקצועית
- מביא לקוחות
- משפר את העסק לאורך זמן
- עובד ברקע בלי להעמיס

**החוויה שאנחנו בונים:**
בעל עסק נכנס, עונה על כמה שאלות פשוטות, ותוך דקות יש לו אתר מקצועי ברמה עולמית - כאילו חברת עיצוב יקרה בנתה אותו.

**המשפט המנחה:**
אנחנו לא נותנים לבעלי עסקים עוד מערכת לנהל. אנחנו מורידים מהם עבודה.

---

## Golden Rules

1. The AI does the work. The user makes decisions.
2. Never ask if you can find.
3. Never expose technical terms to business owners.
4. One primary action per screen.
5. One question at a time.
6. The user is never stuck.
7. Do not overwhelm.
8. Build the simplest thing that is production-ready.
9. No over-engineering.
10. Every feature must answer: האם זה חוסך זמן? האם זה מביא לקוחות? האם AI מוסיף פה ערך?

---

## מצב הפרויקט

### מה הושלם

**Frontend - apps/web**
- Next.js 16, React 19, TypeScript, Tailwind v4
- RTL עברית מלא
- Onboarding שלב 1 - שם עסק (`/onboarding`)
- Onboarding שלב 2 - סוג עסק (בחירה מכרטיסיות)
- מעבר בין שלבים עם state management
- Build עובר, Lint עובר, נבדק במובייל

**Backend - apps/api**
- ASP.NET Core 8, Controllers style
- `GET /health` → `{ status: "ok", service: "api" }`
- `POST /api/onboarding/start` → מקבל businessName + businessType
- CORS מוגדר ל-localhost:3000
- MongoDB Driver 3.9.0 מותקן
- MongoDB Atlas מחובר (cluster: ai-business-os, Frankfurt)
- Business Profile נשמר ב-MongoDB בהצלחה
- Build עובר

**Database - MongoDB Atlas**
- Cluster: ai-business-os (M0 Free, Frankfurt)
- Collection: business_profiles
- Document: BusinessName, BusinessType, CreatedAt, Status
- IP Access: 0.0.0.0/0 (development)
- User: api-user

**Git**
- Repository: https://github.com/orco6/AI-Business-OS
- Branch: main
- Commits אחרונים:
  - feat: save business profile to MongoDB
  - feat: connect onboarding frontend to backend
  - feat: add onboarding step 2 - business type selection
  - feat: add onboarding start endpoint
  - chore: add backend folder structure

---

## ארכיטקטורה
Frontend (Next.js) - רק מציג, לא חכם

↓

Backend API (ASP.NET Core) - מנהל בקשות

↓

AI Core - Orchestrator + Agents + Memory + Tasks

↓

LLM Layer (LiteLLM) - ניהול כל ספקי ה-AI

↓

Database (MongoDB) - Business Profile + Tasks + Memory

**עיקרון קריטי:** Frontend לא יודע AI. לעולם לא קורא ישירות ל-LLM.

---

## מפת כלי ה-AI

| תפקיד | כלי | סיבה |
|-------|-----|------|
| Orchestrator + תוכן עסקי | Claude Opus 4.8 | הכי חזק בהבנה עסקית וכתיבה |
| משימות נפח גבוה | Claude Haiku 4.5 | זול ומהיר לפעולות פשוטות |
| יצירת קוד אתר | Claude Sonnet 4.6 / GPT-5.4 | חזקים בפרונטאנד, נבדוק בפועל |
| תמונות וניתוח ויזואל | Gemini 3.1 Pro | הכי חזק במולטימודל |
| AI Gateway | LiteLLM | מחבר כל הספקים דרך API אחד |
| פיתוח יומיומי | Cursor | מימוש קוד בתוך הפרויקט |
| Refactor גדול | Claude Code | כשיש צורך אמיתי |
| UI Design | v0 | כשיש קרדיטים |

---

## Multi-Agent Architecture

| Agent | תפקיד |
|-------|--------|
| Research Agent | מחפש מידע על העסק בגוגל, שואב Google Business |
| Content Agent | כותב תוכן מותאם לסוג העסק |
| Design Agent | בוחר צבעים, פונטים, layout |
| Website Agent | מייצר קוד Next.js מלא לאתר |
| SEO Agent | meta tags, Schema, sitemap |
| Media Agent | מנתח תמונות, מארגן לקטגוריות |
| QA Agent | בודק איכות האתר |

**כללים:**
- כל Agent קורא מ-Business Profile
- כל Agent מחזיר הצעת שינוי - לא מעדכן DB ישירות
- Agents לא מדברים ביניהם - רק דרך Orchestrator

---

## Business Profile Structure

```json
{
  "id": "ObjectId",
  "businessName": "string",
  "businessType": "restaurant|retail|services|beauty|fitness|other",
  "status": "onboarding|active|paused",
  "createdAt": "DateTime",
  
  // יתווסף בהמשך:
  "contact": { "phone", "address", "email" },
  "brand": { "colors", "fonts", "logo" },
  "services": [],
  "media": { "images": [] },
  "website": { "url", "status" },
  "goals": {}
}
```

---

## שאלות האונבורדינג (מתוכנן)

7 שאלות מקסימום:
1. ✅ שם העסק
2. ✅ סוג העסק
3. מה אתה רוצה שלקוחות יעשו? (להתקשר / לקבוע תור / לקנות)
4. יש לך לוגו? (העלאה)
5. יש לך תמונות? (העלאה חכמה לפי קטגוריות)
6. כתובת וטלפון
7. יש אתר קיים / Google Business? (לייבוא אוטומטי)

**Smart Asset Collection:**
המערכת מבינה לפי סוג העסק אילו תמונות צריך ושואלת בהתאם.
לדוגמה חנות וילונות → שואלת אילו קטגוריות יש → ממשק העלאה נפרד לכל קטגוריה.

---

## האתר שנבנה ללקוח

**הרמה:** כאילו חברת עיצוב ב-$50,000 בנתה אותו.

**תהליך:**
Business Profile מלא

→ Claude Opus 4.8 מתכנן את האתר

→ Website Agent מייצר קוד Next.js מלא

→ Deploy אוטומטי ל-Vercel

→ דומיין מותאם

**תקנים:**
- Lighthouse 95+
- Mobile first
- RTL עברית מושלם
- Core Web Vitals ירוק
- SEO מלא + Schema markup

---

## Backlog מרכזי

| פיצ'ר | עדיפות |
|-------|--------|
| Google Business Import אוטומטי | גבוהה מאוד - WOW moment |
| Smart Asset Collection | גבוהה |
| Daily Brief / Today Dashboard | גבוהה |
| Auth (התחברות) | גבוהה |
| Website Generation Agent | גבוהה |
| ניתוח מתחרים | בינונית |
| Instagram Automation | בינונית |
| Video/Reel Generator | נמוכה |
| Billing / Subscriptions | לפני launch |

---

## Sprint נוכחי

**Sprint 3 - AI Integration**

מה הושלם:
- ✅ Backend Foundation
- ✅ MongoDB מחובר
- ✅ Onboarding שלבים 1+2 עובדים end-to-end
- ✅ Business Profile נשמר ב-DB

הצעד הבא:
- פתיחת Anthropic API key
- חיבור Claude ל-Backend
- בניית Orchestrator ראשון
- Agent ראשון שעושה משהו אמיתי

---

## כללי עבודה

**Workflow:**
1. Product decision
2. v0 אם UI
3. Cursor implementation
4. Build + Lint
5. Manual test
6. Commit + Push

**Cursor:**
- Prompt אחד = מטרה אחת
- תמיד לבדוק קבצים קריטיים בעצמך
- לא סומכים על סיכום בלי לראות קוד

**v0:**
- מעצב בלבד, לא מפתח
- מעתיקים רק: page.tsx, component ראשי, globals.css

**Claude Code:**
- רק כשיש צורך אמיתי: refactor גדול, שינוי שחוצה הרבה קבצים
