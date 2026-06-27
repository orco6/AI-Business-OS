# PROJECT_BRAIN
> קובץ זה הוא מקור האמת היחיד של הפרויקט.
> חובה לעדכן אותו בסוף כל session לפני פתיחת שיחה חדשה.
> בשיחה חדשה - תמיד תתחיל מהקובץ הזה בלי לשאול שאלות. תמשיך מהנקודה האחרונה.

---

## חוקי עבודה קריטיים

1. אתה ה-CTO של הפרויקט. אני המיישם. אתה מחליט, אני מבצע.
2. תמיד תן הוראות צעד אחר צעד - פקודה מדויקת, קובץ מדויק, prompt מדויק.
3. אל תשאל שאלות מיותרות - אם צריך מידע, בקש קובץ ספציפי.
4. כל feature חייב לעבור: Build → Test → Commit → Push לפני שממשיכים.
5. כל סוף session - עדכן קובץ זה עם מה שהשתנה.
6. תמיד להשתמש בכלי ה-AI הכי מתאים לכל משימה.
7. הכל ברמה עולמית - best practices, UI/UX מושלם, scalable architecture.

---

## חזון המוצר

**AI Business OS** - עוזר AI לבעלי עסקים קטנים ובינוניים בישראל.

לא website builder. לא chatbot. לא dashboard.

**עובד AI** שעושה את העבודה במקום בעל העסק:
- בונה אתר מקצועי ברמה עולמית אוטומטית
- מביא לקוחות חדשים
- משפר את העסק לאורך זמן
- עובד ברקע בלי להעמיס

**החוויה:** בעל עסק נכנס, עונה על כמה שאלות, ותוך דקות יש לו אתר ברמה כאילו חברת עיצוב ב-$50,000 בנתה אותו.

**שוק יעד:** ישראל תחילה. עברית ו-RTL מהיום הראשון. בעתיד - עולמי.

**מודל עסקי:**
- חינם - אתר בסיסי
- ₪99/חודש - אתר מקצועי + Daily Brief + עדכונים
- ₪299/חודש - כל הפיצ'רים + אינסטגרם + וידאו

---

## Golden Rules של המוצר

1. The AI does the work. The user makes decisions.
2. Never ask if you can find - אל תשאל את המשתמש משהו שאפשר למצוא לבד.
3. Never expose technical terms - לא חושפים מושגים טכניים לבעלי עסקים.
4. One primary action per screen.
5. One question at a time באונבורדינג.
6. The user is never stuck.
7. Do not overwhelm.
8. Build the simplest thing that is production-ready.
9. No over-engineering.
10. Every feature must answer: האם זה חוסך זמן? האם זה מביא לקוחות? האם AI מוסיף ערך?

---

## מצב הפרויקט - מה הושלם

### Frontend - apps/web
- Next.js 16, React 19, TypeScript, Tailwind v4
- RTL עברית מלא
- `/onboarding` - אונבורדינג מלא 3 שלבים:
  - שלב 1: שם עסק → שולח ל-Backend → עובר לשלב 2
  - שלב 2: סוג עסק (6 קטגוריות עם Lucide icons)
  - שלב 3: Welcome screen עם הודעה אישית מ-Claude
- Build עובר, נבדק במובייל ודסקטופ

**קבצים חשובים:**
- `apps/web/app/onboarding/page.tsx` - לוגיקת האונבורדינג
- `apps/web/features/onboarding/components/onboarding-screen.tsx` - שלב 1
- `apps/web/features/onboarding/components/business-type-screen.tsx` - שלב 2
- `apps/web/features/onboarding/components/welcome-screen.tsx` - שלב 3
- `apps/web/components/ui/button.tsx`
- `apps/web/app/globals.css`

### Backend - apps/api
- ASP.NET Core 8, Controllers style, .NET 10
- `GET /health` → `{ status: "ok", service: "api" }`
- `POST /api/onboarding/start` → מקבל businessName + businessType, שומר ב-MongoDB, קורא ל-Claude, מחזיר profileId + welcomeMessage
- `POST /api/ai/test` → endpoint לבדיקת Claude (development only)
- CORS מוגדר ל-localhost:3000
- MongoDB Driver 3.9.0 מותקן

**קבצים חשובים:**
- `apps/api/Features/Onboarding/OnboardingController.cs`
- `apps/api/Features/Onboarding/OnboardingService.cs`
- `apps/api/Features/Onboarding/OnboardingModels.cs`
- `apps/api/Features/AI/AnthropicService.cs`
- `apps/api/Features/AI/OrchestratorService.cs`
- `apps/api/Features/AI/AiController.cs`
- `apps/api/Program.cs`

### Database - MongoDB Atlas
- Cluster: ai-business-os (M0 Free, Frankfurt)
- Database: ai-business-os
- Collection: business_profiles
- Document: `{ BusinessName, BusinessType, CreatedAt, Status: "onboarding" }`
- IP Access: 0.0.0.0/0 (development בלבד)
- User: api-user
- Connection string ב-appsettings.Development.json (לא ב-Git)

### AI Integration
- Anthropic Claude API מחובר ועובד
- Model: claude-sonnet-4-6
- AnthropicService - קריאות HTTP ישירות ל-API
- OrchestratorService - מנהל את הלוגיקה, כותב welcome message בעברית
- API key ב-appsettings.Development.json (לא ב-Git)

### Git & GitHub
- Repository: https://github.com/orco6/AI-Business-OS
- Branch: main
- appsettings.Development.json ב-.gitignore (מכיל secrets)

---

## ארכיטקטורה
Frontend (Next.js) - רק מציג, לא חכם, לא קורא ל-AI ישירות

↓

Backend API (ASP.NET Core) - מנהל בקשות, מאבטח

↓

AI Core - Orchestrator + Agents + Memory + Tasks

↓

LLM Layer - Claude Sonnet (ראשי), Claude Haiku (נפח), Gemini (תמונות)

↓

Database (MongoDB) - Business Profile + Tasks + Memory

**עיקרון קריטי:** Frontend לא יודע AI. לעולם לא קורא ישירות ל-LLM.

---

## מפת כלי AI לפרויקט

| תפקיד | כלי | סיבה |
|-------|-----|------|
| Orchestrator + תוכן | Claude Sonnet 4.6 | חזק בעברית, הוראות מורכבות |
| משימות נפח גבוה | Claude Haiku 4.5 | זול ומהיר |
| בניית קוד אתר | Claude Opus 4.8 | הכי חזק בקוד מורכב |
| תמונות וויזואל | Gemini 3.1 Pro | הכי חזק במולטימודל |
| AI Gateway | LiteLLM | מחבר כל הספקים |
| פיתוח יומיומי | Cursor | מימוש קוד |
| Refactor גדול | Claude Code | כשיש צורך אמיתי |
| UI Design | v0 | כשיש קרדיטים |

---

## Business Profile Structure

```json
{
  "id": "ObjectId",
  "businessName": "string",
  "businessType": "restaurant|retail|services|beauty|fitness|other",
  "status": "onboarding|active|paused",
  "createdAt": "DateTime",
  "contact": { "phone": "", "address": "", "email": "" },
  "brand": { "colors": [], "fonts": [], "logo": "" },
  "services": [],
  "media": { "images": [] },
  "website": { "url": "", "status": "" },
  "goals": {}
}
```

---

## Dynamic Onboarding Engine

### העיקרון המרכזי
AI חושב עם בעל העסק - לא שואל שאלות גנריות.
כל תשובה מנותחת ומשפיעה על כל השאלות הבאות (Context Chaining).
המטרה: להבין את העסק לעומק במינימום שאלות.
לא לחפור - כל שאלה חייבת לתרום ישירות לתוצר.

### Progressive Disclosure - שלושה שלבים

**שלב 1 - שאלות חובה (בלי זה לא בונים אתר) - 5 דקות:**
1. שם העסק
2. קטגוריה כללית
3. שאלת העמקה אחת (AI מחליט לפי הקטגוריה)
4. מה אתה רוצה שהלקוח יעשה? (CTA ראשי)
5. טלפון / WhatsApp
6. תמונה אחת לפחות

**שלב 2 - שאלות מומלצות (משפרות את האתר) - בהמשך האונבורדינג:**
7. כתובת / אזור שירות / דיגיטלי בלבד
8. שעות פעילות
9. לוגו (העלאה)
10. צבע/תחושה רצויה (AI מציע 3 אפשרויות ויזואליות)
11. מה מבדל אותך? (משפט אחד) - אופציונלי תמיד
12. למי אתה פונה? (AI מציע לפי סוג עסק)
13. תמונות לפי קטגוריות (Smart Asset Collection)

**שלב 3 - שאלות לשיפור (בדשבורד, לא באונבורדינג):**
- מחירים / תעריפים
- ביקורות גוגל (שליפה אוטומטית)
- הסמכות / פרסים
- מבצעים
- לפני/אחרי
- סרטונים

### Context Chaining - כל תשובה משפיעה על הבאה

דוגמה: וילונות + קבלנים כלקוחות:
→ סגנון אתר: מקצועי/תאגידי
→ תמונות: פרויקטים גדולים
→ סעיפים: פרויקטים, ניסיון, לקוחות מובילים
→ CTA: הצעת מחיר (לא מחירון קבוע)
→ טון: רשמי ועסקי

דוגמה: וילונות + משפחות כלקוחות:
→ סגנון אתר: חם ונגיש
→ תמונות: בתים יפים, אווירה
→ סעיפים: שירות מדידה בבית, גלריה
→ CTA: קבע ביקור חינם
→ טון: אנושי וחמים

### שאלת העמקה לפי קטגוריה

חנות → "ספר לי על העסק - מה אתה מוכר ואיך?" (פתוח)
מסעדה → "איך אתה עובד?" (ישיבה / משלוחים / איסוף / שילוב)
שירות → "איך אתה נותן שירות?" (מגיע ללקוח / לקוח מגיע / דיגיטלי)
יופי → "איפה אתה עובד?" (סלון / ניידת / שניהם)
בריאות → "מה סוג הטיפול?" (קליניקה / ביתי / אונליין)

מהתשובה AI מסיק:
- פיזי / דיגיטלי / היברידי
- קטגוריות רלוונטיות
- לקוח יעד
- מה האתר צריך לכלול

### Smart Asset Collection
- AI מציע קטגוריות לפי סוג העסק
- משתמש מאשר / מוסיף / מוחק
- לכל קטגוריה → ממשק העלאה נפרד עם הסבר מה לצלם
- Drag & Drop, ללא הגבלת כמות
- Gemini 3.1 Pro מנתח תמונות → מבין סגנון, צבעים, איכות
- AI בוחר את הטובות ביותר אוטומטית

### מה נבנה לכל עסק

**אתר (Next.js + Tailwind, Lighthouse 95+):**
מותאם 100% לסוג העסק + לקוח היעד + מידע שנאסף.
סעיפים בסיסיים לכולם:
- Hero עם CTA ראשי
- אודות + מה מבדל
- שירותים/מוצרים/קטגוריות
- גלריה (אם יש תמונות)
- WhatsApp button (קבוע, נגיש)
- יצירת קשר + מפה
- Footer עם כל הפרטים

סעיפים מותאמים לפי סוג עסק:
- חנות: קטלוג לפי קטגוריות, מחירים אם רלוונטי
- מסעדה: תפריט, שעות, הזמנה
- שירות: אזורי שירות, זמן תגובה, תהליך העבודה
- יופי: גלריה לפני/אחרי, הזמנת תור, מחירון
- בריאות: תחומי התמחות, אמינות, הסמכות

**תהליך בניית האתר:**
Business Profile מלא → Claude Opus 4.8 מתכנן → Website Agent מייצר קוד Next.js מלא → Deploy אוטומטי ל-Vercel → דומיין מותאם

**SEO מלא:**
- Meta title + description מותאמים לכל דף
- Schema markup לפי סוג עסק (LocalBusiness, Restaurant, וכו')
- Sitemap.xml אוטומטי
- Open Graph לשיתוף ברשתות חברתיות
- Core Web Vitals ירוק

**Instagram:**
- תבניות פוסטים מותאמות (Canva API או Figma)
- Caption בעברית עם hashtags
- Stories templates
- Reels תסריט

**Google Business:**
- אופטימיזציה מלאה של הפרופיל
- תמונות מותאמות
- תיאור עסק ממוטב

**Daily Brief (שבועי):**
- ביקורים באתר
- פניות שנכנסו
- המלצה אחת לשיפור
- מה המתחרים עושים

### חוקי UX קריטיים
- שום שאלה לא חובה - תמיד יש כפתור "דלג, אמשיך אחר כך"
- "בנה עכשיו, שפר אחר כך" - אתר בסיסי תוך 5 דקות גם בלי כלום
- שאלה אחת בכל פעם - תמיד
- AI מציע, משתמש מאשר/מוסיף/מוחק - אף פעם לא blank slate
- להסביר בשפה עסקית למה כל שאלה חשובה
- Progress bar ברור
- אפשר לדלג ולהשלים בדשבורד
- כל מסך - פעולה אחת ראשית
- Mobile-first - רוב בעלי העסקים על הטלפון
- זמן אונבורדינג מינימלי: 5 דקות לאתר בסיסי

**מימוש נוכחי (Sprint 5):** שלבים 1-2 בלבד (שם עסק + קטגוריה). שאר השאלות — backlog.

---

## Sprint נוכחי - Sprint 6

**מה הושלם ב-Sprint 5:**
- ✅ UserId מחובר ל-Business Profile
- ✅ GET /api/business-profile endpoint
- ✅ Dashboard מציג שם עסק + סוג עסק אמיתיים

**Sprint 6 - Website Agent:**
- Content Agent - כותב תוכן לאתר לפי סוג עסק
- Website Agent - מייצר קוד HTML/CSS מלא
- Preview - מציג את האתר למשתמש
- Deploy - שולח ל-Vercel

---

## Backlog

| פיצ'ר | עדיפות |
|-------|--------|
| Google Business Import אוטומטי | גבוהה מאוד - WOW moment |
| Smart Asset Collection | גבוהה |
| Daily Brief / Today Dashboard | גבוהה |
| Website Generation Agent | גבוהה |
| Auth | גבוהה |
| ניתוח מתחרים | בינונית |
| Instagram Automation | בינונית |
| Video/Reel Generator | נמוכה |
| Billing / Subscriptions | לפני launch |

---

## Workflow עבודה

1. Product decision → Architecture review
2. v0 אם UI חדש
3. Cursor implementation
4. Build + Lint
5. Manual test
6. Commit + Push
7. עדכון PROJECT_BRAIN

**Cursor rules:**
- Prompt אחד = מטרה אחת
- תמיד לבדוק קבצים קריטיים לאחר מימוש
- לא סומכים על סיכום בלי לראות קוד

**להרצה מקומית:**
- Frontend: `cd apps/web && npm run dev` → localhost:3000
- Backend: `cd apps/api && dotnet run` → localhost:5063
- שני טרמינלים נפרדים תמיד

---

## מה לא לבנות עכשיו

לא: Docker, Tests, Clean Architecture, MediatR, CQRS, OpenTelemetry, i18n, Dark Mode, Full Design System, PostgreSQL.
