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

## שאלות האונבורדינג (מתוכנן - 7 מקסימום)

1. ✅ שם העסק
2. ✅ סוג העסק
3. ⏳ מה אתה רוצה שלקוחות יעשו? (להתקשר / לקבוע תור / לקנות)
4. ⏳ יש לך לוגו? (העלאה)
5. ⏳ יש לך תמונות? (Smart Asset Collection לפי קטגוריות)
6. ⏳ כתובת וטלפון
7. ⏳ יש אתר קיים / Google Business? (ייבוא אוטומטי - WOW moment)

**Smart Asset Collection:** המערכת מבינה לפי סוג העסק אילו תמונות צריך ושואלת בהתאם. לדוגמה חנות וילונות → שואלת אילו קטגוריות יש → ממשק העלאה נפרד לכל קטגוריה.

---

## האתר שנבנה ללקוח

**רמה:** כאילו חברת עיצוב ב-$50,000 בנתה אותו. Lighthouse 95+.

**תהליך:**
Business Profile מלא

→ Claude Opus 4.8 מתכנן את האתר

→ Website Agent מייצר קוד Next.js מלא

→ Deploy אוטומטי ל-Vercel

→ דומיין מותאם

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
