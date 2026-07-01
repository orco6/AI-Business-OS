using System.Text.Json;
using System.Text.RegularExpressions;
using Api.Features.AI;
using Api.Features.Onboarding;
using MongoDB.Driver;

namespace Api.Features.Website;

public class WebsiteService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    private readonly IMongoCollection<BusinessProfile> _collection;
    private readonly AnthropicService _anthropicService;

    public WebsiteService(IMongoDatabase database, AnthropicService anthropicService)
    {
        _collection = database.GetCollection<BusinessProfile>("business_profiles");
        _anthropicService = anthropicService;
    }

    public async Task<WebsiteData?> GetWebsiteAsync(string profileId)
    {
        var profile = await GetProfileAsync(profileId);
        return profile?.WebsiteData;
    }

    public async Task<WebsiteData> GenerateWebsiteAsync(string profileId)
    {
        var profile = await GetProfileAsync(profileId)
            ?? throw new InvalidOperationException($"Business profile {profileId} not found.");

        var (fontHeading, layoutStyle) = ResolveThemeFromBusinessType(profile.BusinessType);

        const string systemPrompt = """
            אתה Content Agent מומחה לכתיבה שיווקית לעסקים קטנים בישראל.

            כל תוכן שתכתוב חייב:
            להיות בעברית תקינה, ישירה, רגשית ומשכנעת
            להתאים בדיוק לסוג העסק ולקהל היעד שלו
            לא לכלול מילים גנריות כמו "מקצועי", "איכות" ללא הסבר
            להרגיש אישי וייחודי - לא תבניתי
            כותרות: קצרות, אמיצות, מרגשות (מקסימום 6 מילים)
            תת-כותרות: משפט אחד, רגשי, ממוקד בתועלת ללקוח

            חשוב מאוד: אל תמציא שירותים, מנות, מוצרים או מידע שהלקוח לא ציין.
            שירותים: בסס רק על keyFeatures ו-businessAnswer שהלקוח סיפק.
            אם אין מידע מספיק, כתוב שירותים כלליים מאוד ולא ספציפיים.

            החזר JSON בלבד. ללא text נוסף.
            """;

        var photoCategoryKeys = profile.PhotosByCategory.Keys.ToList();
        var type = profile.BusinessType.ToLowerInvariant();
        var isFoodBusiness = type.Contains("restaurant") || type.Contains("food") || type.Contains("cafe");
        var hasMenuSection = profile.WebsiteSections.Contains("menu");
        var hasSocialProof = profile.SocialProofScreenshots?.Count > 0;

        var extraPrompt = "";
        if (hasSocialProof)
        {
            extraPrompt += """

            אם יש SocialProofScreenshots, הוסף גם:
            "socialProofReviews": [
              {"text": "ביקורת קצרה בעברית", "author": "לקוח מרוצה", "stars": 5}
            ]
            3 ביקורות מומצאות אבל אמינות בסגנון ביקורות גוגל אמיתיות
            """;
        }

        var userMessage =
            $$"""
            צור תוכן אתר שיווקי לעסק הבא:

            שם העסק: {{profile.BusinessName}}
            סוג העסק: {{profile.BusinessType}}
            תיאור העסק: {{profile.BusinessAnswer}}
            קהל יעד: {{profile.TargetAudience}}
            ערך מרכזי: {{profile.MainValue}}
            טון מומלץ: {{profile.RecommendedTone}}
            מאפיינים מרכזיים: {{string.Join(", ", profile.KeyFeatures)}}
            שם הבעלים: {{profile.OwnerName}}
            עיר: {{profile.City}}
            קטגוריות שנבחרו: {{string.Join(", ", profile.SelectedCategories)}}
            קטגוריות תמונות זמינות: {{string.Join(", ", photoCategoryKeys)}}

            החזר JSON בלבד במבנה הבא:
            {
              "hero": {
                "headline": "כותרת קצרה מקסימום 6 מילים",
                "subheadline": "משפט אחד רגשי",
                "ctaText": "טקסט כפתור",
                "ctaAction": "whatsapp",
                "backgroundImageCategory": "שם קטגוריה מהרשימה"
              },
              "about": {
                "title": "כותרת סקשן",
                "story": "2-3 משפטים אישיים",
                "ownerName": "{{profile.OwnerName}}",
                "highlights": ["נקודה 1", "נקודה 2", "נקודה 3"]
              },
              "services": [
                {
                  "name": "שם שירות",
                  "description": "תיאור קצר",
                  "price": "",
                  "imageCategory": ""
                }
              ],
              "gallery": {
                "title": "כותרת גלריה"
              },
              "seo": {
                "metaTitle": "כותרת SEO",
                "metaDescription": "תיאור SEO",
                "keywords": ["מילת מפתח 1", "מילת מפתח 2"]
              }
            }

            ctaAction חייב להיות אחד מ: whatsapp, phone, scroll
            services: 3-6 פריטים — רק על בסיס מאפיינים מרכזיים ותיאור העסק, בלי להמציא מנות או שירותים ספציפיים
            backgroundImageCategory: בחר מקטגוריות התמונות הזמינות, או ריק אם אין
            {{extraPrompt}}
            """;

        var response = await _anthropicService.CompleteAsync(systemPrompt, userMessage, maxTokens: 4096);
        var aiContent = ParseAiResponse(response);

        var colors = profile.SuggestedColors;
        var primary = colors.Count > 0 ? colors[0] : "#2563eb";
        var secondary = colors.Count > 1 ? colors[1] : "#1e40af";
        var accent = colors.Count > 2 ? colors[2] : primary;

        var allPhotoUrls = profile.PhotosByCategory
            .SelectMany(kvp => kvp.Value)
            .Take(9)
            .ToList();

        var address = profile.Address;
        var city = profile.City;
        var fullAddress = string.Join(", ", new[] { address, city }.Where(s => !string.IsNullOrWhiteSpace(s)));
        var mapsQuery = Uri.EscapeDataString(fullAddress);
        var googleMapsUrl = !string.IsNullOrWhiteSpace(fullAddress)
            ? $"https://www.google.com/maps/search/?api=1&query={mapsQuery}"
            : string.Empty;

        var websiteData = new WebsiteData
        {
            Hero = aiContent.Hero,
            About = aiContent.About,
            Services = aiContent.Services,
            Gallery = new GallerySection
            {
                Title = aiContent.Gallery.Title,
                PhotoUrls = allPhotoUrls,
            },
            Contact = new ContactSection
            {
                Title = "צור קשר",
                Phone = profile.Phone,
                WhatsApp = profile.WhatsApp,
                Address = profile.Address,
                City = profile.City,
                Hours = profile.Hours,
                GoogleMapsUrl = googleMapsUrl,
            },
            Theme = new ThemeConfig
            {
                PrimaryColor = primary,
                SecondaryColor = secondary,
                AccentColor = accent,
                TextColor = "#1a1a1a",
                BgColor = "#ffffff",
                FontHeading = fontHeading,
                FontBody = "heebo",
                LayoutStyle = layoutStyle,
            },
            Seo = aiContent.Seo,
            BusinessName = profile.BusinessName,
            BusinessSlug = GenerateHebrewSlug(profile.BusinessName),
            GeneratedAt = DateTime.UtcNow,
            PhotosByCategory = profile.PhotosByCategory,
        };

        if (string.IsNullOrWhiteSpace(websiteData.About.OwnerName))
        {
            websiteData.About.OwnerName = profile.OwnerName;
        }

        var stats = new List<StatItem>();
        if (!string.IsNullOrWhiteSpace(profile.YearsInBusiness))
            stats.Add(new StatItem { Value = profile.YearsInBusiness + "+", Label = "שנות ניסיון" });
        if (!string.IsNullOrWhiteSpace(profile.ClientsServed))
            stats.Add(new StatItem { Value = profile.ClientsServed + "+", Label = "לקוחות מרוצים" });
        if (!string.IsNullOrWhiteSpace(profile.SpecialAchievement))
            stats.Add(new StatItem { Value = "★", Label = profile.SpecialAchievement });

        if (stats.Count > 0)
            websiteData.Numbers = new NumbersSection { Stats = stats };

        if (profile.SocialProofScreenshots?.Count > 0)
        {
            websiteData.SocialProof = new SocialProofSection
            {
                Title = "מה אומרים עלינו",
                ScreenshotUrls = profile.SocialProofScreenshots,
                Reviews = aiContent.SocialProofReviews,
            };
        }

        if (isFoodBusiness && hasMenuSection)
        {
            var menuSection = new MenuSection
            {
                Title = "התפריט שלנו",
                MenuUrl = profile.MenuUrl ?? "",
                HasReservations = profile.HasReservations,
                ReservationLink = profile.ReservationLink ?? "",
                ReservationPhone = profile.Phone,
                Categories = new List<MenuCategory>(),
            };
            websiteData.Menu = menuSection;
        }

        var navLinks = new List<NavLink>();
        if (profile.WebsiteSections.Contains("menu"))
            navLinks.Add(new NavLink { Label = "תפריט", Href = "#menu" });
        if (profile.WebsiteSections.Contains("about"))
            navLinks.Add(new NavLink { Label = "עלינו", Href = "#about" });
        if (profile.WebsiteSections.Contains("gallery"))
            navLinks.Add(new NavLink { Label = "גלריה", Href = "#gallery" });
        navLinks.Add(new NavLink { Label = "צור קשר", Href = "#contact" });

        websiteData.Navbar = new NavbarConfig
        {
            Links = navLinks,
            CtaText = profile.HasReservations ? "הזמן מקום" : "צור קשר",
            CtaHref = profile.HasReservations && !string.IsNullOrWhiteSpace(profile.ReservationLink)
                ? profile.ReservationLink
                : "#contact",
        };

        websiteData.InstagramUrl = profile.InstagramUrl ?? "";

        var filter = Builders<BusinessProfile>.Filter.Eq(p => p.Id, profileId);
        var update = Builders<BusinessProfile>.Update
            .Set(p => p.WebsiteData, websiteData)
            .Set(p => p.Status, "website_generated");
        await _collection.UpdateOneAsync(filter, update);

        return websiteData;
    }

    public async Task<bool> ClearWebsiteDataAsync(string profileId)
    {
        var filter = Builders<BusinessProfile>.Filter.Eq(p => p.Id, profileId);
        var update = Builders<BusinessProfile>.Update
            .Unset(p => p.WebsiteData)
            .Set(p => p.Status, "onboarding_complete");
        var result = await _collection.UpdateOneAsync(filter, update);
        return result.MatchedCount > 0;
    }

    private async Task<BusinessProfile?> GetProfileAsync(string profileId)
    {
        return await _collection
            .Find(p => p.Id == profileId)
            .FirstOrDefaultAsync();
    }

    private static (string FontHeading, string LayoutStyle) ResolveThemeFromBusinessType(string businessType)
    {
        var type = businessType.ToLowerInvariant();

        // מסעדות, בתי קפה, מאפיות, אוכל - Frank Ruhl Libre (serif יוקרתי)
        if (type.Contains("restaurant") || type.Contains("food") ||
            type.Contains("cafe") || type.Contains("bakery") || type.Contains("catering"))
            return ("frank-ruhl", "warm");

        // יופי, ספא, מספרה, קוסמטיקה - Frank Ruhl Libre (אלגנטי)
        if (type.Contains("beauty") || type.Contains("spa") ||
            type.Contains("salon") || type.Contains("hair") || type.Contains("nail"))
            return ("frank-ruhl", "luxury");

        // שירותים מקצועיים, עו"ד, רו"ח - Secular One (סמכותי)
        if (type.Contains("lawyer") || type.Contains("accountant") ||
            type.Contains("professional") || type.Contains("financial") || type.Contains("architect"))
            return ("secular", "professional");

        // חינוך, כושר, ילדים, יוגה - Rubik (ידידותי)
        if (type.Contains("education") || type.Contains("kids") ||
            type.Contains("fitness") || type.Contains("yoga") || type.Contains("music") || type.Contains("driving"))
            return ("rubik", "friendly");

        // קמעונאות, אופנה, חנויות - Secular One (bold)
        if (type.Contains("retail") || type.Contains("fashion") ||
            type.Contains("shop") || type.Contains("store") || type.Contains("jewelry"))
            return ("secular", "bold");

        // שירותים לבית, אינסטלטור, חשמלאי - Heebo (נקי, מקצועי)
        if (type.Contains("plumber") || type.Contains("electrician") ||
            type.Contains("contractor") || type.Contains("cleaning") || type.Contains("moving"))
            return ("heebo", "professional");

        // ברירת מחדל - Heebo
        return ("heebo", "warm");
    }

    private static string GenerateHebrewSlug(string businessName)
    {
        var slug = businessName.Trim();
        slug = Regex.Replace(slug, @"\s+", "-");
        slug = Regex.Replace(slug, @"-+", "-");
        return slug.Trim('-');
    }

    private static AiWebsiteContent ParseAiResponse(string response)
    {
        var json = ExtractJson(response);
        return JsonSerializer.Deserialize<AiWebsiteContent>(json, JsonOptions)
            ?? throw new InvalidOperationException("Failed to parse website content from AI response.");
    }

    private static string ExtractJson(string response)
    {
        var trimmed = response.Trim();
        if (trimmed.StartsWith("```"))
        {
            var start = trimmed.IndexOf('{');
            var end = trimmed.LastIndexOf('}');
            if (start >= 0 && end > start)
            {
                return trimmed[start..(end + 1)];
            }
        }

        return trimmed;
    }
}
