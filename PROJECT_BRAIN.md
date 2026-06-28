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
8. אל תשכח דברים חשובים - לפני כל שלב חשוב, בדוק שלא מפספסים כלום.
9. תמיד לעדכן PROJECT_BRAIN בסוף כל session.

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
6. The user is never stuck - תמיד יש "דלג".
7. Do not overwhelm.
8. Build the simplest thing that is production-ready.
9. No over-engineering.
10. Every feature must answer: האם זה חוסך זמן? האם זה מביא לקוחות? האם AI מוסיף ערך?

---

## מצב הפרויקט - מה הושלם

### Frontend - apps/web
- Next.js 16, React 19, TypeScript, Tailwind v4
- RTL עברית מלא
- Google Auth (NextAuth.js) מלא
- `/login` - דף התחברות עם Google
- `/dashboard` - דשבורד מציג שם משתמש + נתוני עסק אמיתיים מ-MongoDB
- `/onboarding` - אונבורדינג מלא 7 שלבים:
  - שלב 1: שם עסק
  - שלב 2: סוג עסק (6 קטגוריות עם Lucide icons)
  - שלב 2.5: שאלת העמקה AI (DeepQuestionScreen)
  - שלב 3: קטגוריות (CategoriesScreen, רק אם plan.needsCategories)
  - שלב 3.5: העלאת תמונות (PhotosUploadScreen, תמיד - עם קטגוריות ברירת מחדל לפי סוג עסק)
  - שלב 3.7: פרטי קשר (ContactDetailsScreen - טלפון, WhatsApp, כתובת, שעות, שם בעל עסק + שדות ספציפיים לסוג עסק)
  - שלב 4: Welcome screen עם הודעה אישית מ-Claude

**קבצים חשובים:**
- `apps/web/app/onboarding/page.tsx` - לוגיקת האונבורדינג המלאה
- `apps/web/features/onboarding/components/onboarding-screen.tsx` - שלב 1
- `apps/web/features/onboarding/components/business-type-screen.tsx` - שלב 2
- `apps/web/features/onboarding/components/deep-question-screen.tsx` - שאלת העמקה
- `apps/web/features/onboarding/components/categories-screen.tsx` - קטגוריות
- `apps/web/features/onboarding/components/photos-upload-screen.tsx` - תמונות
- `apps/web/features/onboarding/components/contact-details-screen.tsx` - פרטי קשר
- `apps/web/features/onboarding/components/welcome-screen.tsx` - Welcome
- `apps/web/app/api/upload/route.ts` - Cloudinary upload API route
- `apps/web/app/api/auth/[...nextauth]/route.ts` - NextAuth
- `apps/web/app/login/page.tsx` - דף Login
- `apps/web/app/dashboard/page.tsx` - Dashboard
- `apps/web/app/providers.tsx` - SessionProvider

### Backend - apps/api
- ASP.NET Core 8, Controllers style, .NET 10
- `GET /health`
- `POST /api/onboarding/start` → שומר Business Profile מלא ב-MongoDB + קורא Claude
- `POST /api/onboarding/deep-question` → AI שואל שאלת העמקה לפי סוג עסק
- `POST /api/onboarding/plan` → AI מחזיר OnboardingPlan מלא עם BusinessInsights
- `POST /api/photos` → שומר URLs של תמונות ב-Business Profile
- `GET /api/business-profile?userId=` → מחזיר Business Profile לפי userId
- `POST /api/ai/test` → בדיקת Claude

**קבצים חשובים:**
- `apps/api/Features/Onboarding/OnboardingController.cs`
- `apps/api/Features/Onboarding/OnboardingService.cs`
- `apps/api/Features/Onboarding/OnboardingModels.cs`
- `apps/api/Features/Onboarding/BusinessProfileController.cs`
- `apps/api/Features/Onboarding/PhotosController.cs`
- `apps/api/Features/AI/AnthropicService.cs`
- `apps/api/Features/AI/OrchestratorService.cs`
- `apps/api/Features/AI/OnboardingOrchestratorService.cs`
- `apps/api/Features/AI/OnboardingPlannerService.cs`
- `apps/api/Features/AI/BusinessKnowledgeBase.cs` - מאגר ידע 50+ עסקים
- `apps/api/Features/AI/OnboardingOrchestratorController.cs`
- `apps/api/Features/AI/OnboardingPlannerController.cs`
- `apps/api/Program.cs`

### Business Profile - מה נשמר ב-MongoDB
BusinessName, BusinessType, BusinessAnswer

UserId, Status, CreatedAt

SelectedCategories, WebsiteSections

RecommendedTone, SuggestedColors, TargetAudience, MainValue, KeyFeatures

Phone, WhatsApp, Address, City, Hours, OwnerName

DeliveryInfo (מסעדה), EmergencyService (שירות), BookingMethod (יופי)

PhotosByCategory - URLs מ-Cloudinary לפי קטגוריה

### Database - MongoDB Atlas
- Cluster: ai-business-os (M0 Free, Frankfurt)
- Database: ai-business-os
- Collection: business_profiles
- User: api-user
- Connection string ב-appsettings.Development.json (לא ב-Git)

### AI Integration
- Anthropic Claude API מחובר ועובד
- Model: claude-sonnet-4-6
- $9.95 קרדיט נשאר
- API key ב-appsettings.Development.json (לא ב-Git)

### Cloudinary (אחסון תמונות)
- Cloud Name: dmi0exthg
- API Key: 278852755972328
- תמונות מועלות לתיקייה: `ai-business-os/{profileId}/{category}`
- ENV vars ב-apps/web/.env.local (לא ב-Git)

### Google OAuth
- Project: My Project 63507 (noted-sandbox-471109-k4)
- Client ID: 1055286334803-e5o66gnke332l3t8s6mcb8s1q6dr7g02.apps.googleusercontent.com
- Redirect URI: http://localhost:3000/api/auth/callback/google
- Test user: orcohen733@gmail.com
- Credentials ב-apps/web/.env.local (לא ב-Git)

### Git & GitHub
- Repository: https://github.com/orco6/AI-Business-OS
- Branch: main
- appsettings.Development.json ב-.gitignore
- .env.local ב-.gitignore

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

## Dynamic Onboarding Engine

### Flow מלא

שם עסק
סוג עסק (6 קטגוריות)

2.5. שאלת העמקה AI - שאלה אחת חכמה לפי סוג עסק
קטגוריות - AI מציע, משתמש מאשר/מוסיף/מוחק (רק אם needsCategories)

3.5. תמונות - לפי קטגוריות, עם ברירת מחדל לפי סוג עסק

3.7. פרטי קשר - טלפון, כתובת, שעות + שדות ספציפיים לסוג עסק
Welcome + Claude message


### Business Knowledge Base
מכסה 50+ סוגי עסקים בישראל:
- מזון (מסעדה, בית קפה, מאפייה, קייטרינג)
- קמעונאות (בגדים, רהיטים, וילונות, אלקטרוניקה, תכשיטים, חיות, פרחים)
- שירותים לבית (אינסטלטור, חשמלאי, קבלן, ניקיון, גינון, מנעולן, הדברה, הובלות)
- יופי (מספרה, ספר, ציפורניים, ספא, קוסמטיקה)
- שירותים מקצועיים (עורך דין, רואה חשבון, אדריכל, מעצב פנים, מתווך)
- רפואה (פיזיותרפיסט, פסיכולוג, דיאטנית, רופא שיניים, וטרינר)
- חינוך (מורה פרטי, מוזיקה, נהיגה, גן ילדים, יוגה/פילאטיס)
- יצירה ואירועים (צלם, וידאו, מארגן אירועים, מעצב גרפי)
- רכב (מוסך, פחחות)
- דיגיטל (מפתח אתרים, שיווק, תיקון מחשבים)

### OnboardingPlan מה-AI מחזיר
```json
{
  "needsCategories": true/false,
  "categoriesLabel": "שם הקטגוריות",
  "suggestedCategories": ["..."],
  "needsMenu": false,
  "needsPricing": false,
  "needsServiceArea": false,
  "nextQuestion": "שאלה נוספת בעברית או null",
  "websiteSections": ["hero", "about", "services", "..."],
  "businessInsights": {
    "targetAudience": "...",
    "mainValue": "...",
    "recommendedTone": "warm/professional/luxury",
    "suggestedColors": ["#color1", "#color2"],
    "keyFeatures": ["...", "...", "..."]
  }
}
```

---

## Website Delivery & Domain Strategy

### שלושה שלבי פרסום
1. Preview מיידי (חינם) - `ai-business-os.com/preview/[profileId]`
2. Subdomain שלנו (חינם) - `[שם-עסק].ai-business-os.com`
3. דומיין אישי (בתשלום ~₪50/שנה)

### האתר שנבנה
- Next.js + Tailwind, Lighthouse 95+
- RTL עברית מושלם
- Mobile-first
- SEO מלא (meta, schema, sitemap)
- WhatsApp button בולט
- מותאם 100% לסוג עסק

---

## Sprint נוכחי - Sprint 8

**מה הושלם ב-Sprint 7+8:**
- ✅ אונבורדינג מלא 7 שלבים עובד end-to-end
- ✅ תמונות מועלות ל-Cloudinary ונשמרות ב-MongoDB
- ✅ פרטי קשר נשמרים לפי סוג עסק
- ✅ Flow נכון: תמונות (preview) → פרטי קשר → שמירה → upload תמונות → Welcome
- ✅ ברירת מחדל לקטגוריות תמונות לפי סוג עסק
- ✅ Business Profile מלא ב-MongoDB עם כל השדות

**הצעד הבא - Sprint 9 - Website Agent:**
- Research Agent - חיפוש השראה מאתרים מובילים בתחום
- Content Agent - כתיבת תוכן לאתר לפי Business Profile
- Website Agent - בניית קוד Next.js מלא לאתר הלקוח
- Loading screen - "בונה את האתר שלך..."
- Preview - הצגת האתר למשתמש

---

## Backlog

| פיצ'ר | עדיפות |
|-------|--------|
| Website Agent - בניית אתר | גבוהה מאוד - הלב של המוצר |
| Progress Bar באונבורדינג | גבוהה |
| Google Business Import אוטומטי | גבוהה - WOW moment |
| Dashboard מלא עם נתוני עסק | גבוהה |
| Daily Brief / Today Dashboard | בינונית |
| ניתוח מתחרים | בינונית |
| Instagram Automation | בינונית |
| UI/UX Redesign מלא | חשוב - לפני launch |
| Video/Reel Generator | נמוכה |
| Billing / Subscriptions | לפני launch |

---

## עלויות משוערות לפי לקוח

| פעולה | עלות |
|-------|------|
| אונבורדינג מלא (Claude) | ~$0.10 |
| בניית אתר (Claude Opus) | ~$0.50-1.00 |
| Cloudinary תמונות | חינם עד 25GB |
| MongoDB | חינם עד 512MB |
| Vercel hosting | חינם |
| סה"כ לכל לקוח | ~$0.60-1.10 |

---

## Workflow עבודה

1. Product decision → Architecture review
2. מחקר אם צריך (web search)
3. v0 אם UI חדש
4. Cursor implementation
5. Build + Lint
6. Manual test
7. Commit + Push
8. עדכון PROJECT_BRAIN

**להרצה מקומית:**
- Frontend: `cd apps/web && npm run dev` → localhost:3000
- Backend: `cd apps/api && dotnet run` → localhost:5063
- שני טרמינלים נפרדים תמיד

---

## מה לא לבנות עכשיו

לא: Docker, Tests, Clean Architecture, MediatR, CQRS, OpenTelemetry, i18n, Dark Mode, Full Design System, PostgreSQL, Billing.
