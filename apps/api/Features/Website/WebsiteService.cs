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
        var dna = ResolveBusinessDna(profile);

        const string systemPrompt = """
            אתה Website Content Agent המתמחה ביצירת תוכן שיווקי לאתרי עסקים קטנים בישראל.

            כללים מחייבים:
            אל תמציא מידע שהלקוח לא סיפק. אם לא ידעת — אל תכתוב.
            שירותים/מנות: בסס רק על מה שהלקוח ציין ב-keyFeatures וב-businessAnswer.
            כותרות: קצרות, אמיצות, רגשיות. מקסימום 8 מילים.
            ה-headline הראשי = שם העסק (לא תגית שיווקית) — אל תכתוב headline, רק subheadline.
            תגית משנה (subheadline): משפט רגשי אחד שמתאר את הייחוד של העסק.
            תוכן about: אישי, מהלב, מבוסס על businessAnswer ו-ownerName.
            אל תשתמש במילים גנריות: "מקצועי", "איכות", "מוביל" — ללא הסבר קונקרטי.
            כתוב בעברית תקינה, ישירה, לא מתנשאת.
            JSON בלבד, ללא text נוסף.
            """;

        var photoCategoryKeys = profile.PhotosByCategory.Keys.ToList();
        var type = profile.BusinessType.ToLowerInvariant();
        var isFoodBusiness = type == "restaurant" || type.Contains("food") || type.Contains("cafe");
        var hasMenuSection = profile.WebsiteSections.Contains("menu");
        var hasSocialProof = profile.SocialProofScreenshots?.Count > 0;
        var aiProfileContext = BuildAiProfileContext(profile);

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
            {{aiProfileContext}}

            DNA לסוג העסק: {{dna.AiHint}}

            החזר JSON בלבד במבנה הבא:
            {
              "hero": {
                "subheadline": "משפט רגשי אחד — מקסימום 8 מילים",
                "ctaText": "{{dna.HeroCtaText}}",
                "ctaAction": "{{dna.HeroCtaAction}}",
                "backgroundImageCategory": "שם קטגוריה מהרשימה"
              },
              "about": {
                "title": "כותרת סקשן",
                "story": "2-3 משפטים אישיים מהלב",
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
            services: 3-6 פריטים — רק על בסיס המידע שסיפק הלקוח, בלי להמציא מנות או שירותים
            backgroundImageCategory: בחר מקטגוריות התמונות הזמינות, או ריק אם אין
            {{extraPrompt}}
            """;

        var response = await _anthropicService.CompleteAsync(systemPrompt, userMessage, maxTokens: 4096);
        var aiContent = ParseAiResponse(response);

        var colors = profile.SuggestedColors;
        var primary = colors.Count > 0 ? colors[0] : "#2563eb";
        var secondary = colors.Count > 1 ? colors[1] : "#1e40af";
        var accent = colors.Count > 2 ? colors[2] : primary;

        var allPhotoUrls = BuildGalleryPhotos(profile);

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

        ApplyBusinessDna(profile, websiteData, aiContent, dna, isFoodBusiness, hasMenuSection);

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

    private static List<MenuCategory> BuildMenuCategories(List<ProfileMenuItem>? menuItems)
    {
        if (menuItems == null || menuItems.Count == 0)
            return new List<MenuCategory>();

        var categories = new List<MenuCategory>();

        foreach (var item in menuItems)
        {
            var categoryName = string.IsNullOrWhiteSpace(item.Category) ? "תפריט" : item.Category.Trim();
            if (string.IsNullOrWhiteSpace(item.Name))
                continue;

            var existing = categories.FirstOrDefault(c => c.Name == categoryName);
            if (existing == null)
            {
                existing = new MenuCategory { Name = categoryName };
                categories.Add(existing);
            }

            existing.Items.Add(new MenuItem
            {
                Name = item.Name,
                Description = item.Description ?? "",
                Price = item.Price ?? "",
            });
        }

        return categories;
    }

    private static string ResolveMenuDisplayMode(
        string? menuDisplayMode,
        bool hasMenuPhotos,
        bool hasMenuItems,
        bool hasMenuUrl)
    {
        if (!string.IsNullOrWhiteSpace(menuDisplayMode))
        {
            if (menuDisplayMode == "העלה תמונות" && hasMenuPhotos) return "photos";
            if (menuDisplayMode == "הזן מנות ידנית" && hasMenuItems) return "manual";
            if (menuDisplayMode == "יש לי קישור" && hasMenuUrl) return "url";
        }

        if (hasMenuPhotos) return "photos";
        if (hasMenuItems) return "manual";
        if (hasMenuUrl) return "url";
        return "";
    }

    private sealed class BusinessDna
    {
        public string HeroCtaText { get; init; } = "צור קשר";
        public string HeroCtaAction { get; init; } = "whatsapp";
        public string NavbarCtaText { get; init; } = "צור קשר";
        public string AiHint { get; init; } = "";
    }

    private static BusinessDna ResolveBusinessDna(BusinessProfile profile)
    {
        var type = profile.BusinessType.ToLowerInvariant();

        if (type == "restaurant")
        {
            return new BusinessDna
            {
                HeroCtaText = profile.HasReservations ? "הזמן מקום" : "צור קשר",
                HeroCtaAction = profile.HasReservations ? "whatsapp" : "scroll",
                NavbarCtaText = profile.HasReservations ? "הזמן מקום" : "צור קשר",
                AiHint = "מסעדה/בית קפה: דגש על אווירה, מטבח, חוויה. CTA עיקרי: הזמנת מקום. אל תמציא מנות.",
            };
        }

        if (type == "beauty")
        {
            return new BusinessDna
            {
                HeroCtaText = "קבע תור עכשיו",
                HeroCtaAction = "whatsapp",
                NavbarCtaText = "קבע תור עכשיו",
                AiHint = "יופי/סלון: אלגנטי, אישי, portfolio. CTA: קביעת תור. השתמש במחירון אם סופק.",
            };
        }

        if (type == "services")
        {
            var ctaText = !string.IsNullOrWhiteSpace(profile.Phone) ? "התקשר עכשיו" : "קבל הצעת מחיר";
            return new BusinessDna
            {
                HeroCtaText = ctaText,
                HeroCtaAction = !string.IsNullOrWhiteSpace(profile.Phone) ? "phone" : "scroll",
                NavbarCtaText = ctaText,
                AiHint = "שירותים: אמון, זמינות, אזור שירות. הדגש רישיון/ניסיון אם סופק. CTA: שיחה או הצעת מחיר.",
            };
        }

        if (type == "fitness")
        {
            var ctaText = profile.OffersFreeTrial ? "שיעור ניסיון בחינם" : "קבע שיעור ראשון";
            return new BusinessDna
            {
                HeroCtaText = ctaText,
                HeroCtaAction = "whatsapp",
                NavbarCtaText = ctaText,
                AiHint = "כושר/הוראה: חם, מעודד, תוצאות. CTA: שיעור ניסיון. השתמש בהישגי תלמידים אם סופקו.",
            };
        }

        if (type == "retail")
        {
            return new BusinessDna
            {
                HeroCtaText = "בקרו בחנות",
                HeroCtaAction = "scroll",
                NavbarCtaText = "צרו קשר",
                AiHint = "קמעונאות: מוצרים, חוויית חנות. CTA: ביקור בחנות.",
            };
        }

        return new BusinessDna
        {
            HeroCtaText = "לייעוץ ראשוני",
            HeroCtaAction = "scroll",
            NavbarCtaText = "לייעוץ ראשוני",
            AiHint = "שירות מקצועי: סמכות, אמון, ניסיון. CTA: ייעוץ ראשוני.",
        };
    }

    private static string BuildAiProfileContext(BusinessProfile profile)
    {
        var lines = new List<string>();
        var type = profile.BusinessType.ToLowerInvariant();

        if (!string.IsNullOrWhiteSpace(profile.CuisineType))
            lines.Add($"סוג מטבח: {profile.CuisineType}");
        if (!string.IsNullOrWhiteSpace(profile.RestaurantHighlights))
            lines.Add($"דגשים: {profile.RestaurantHighlights}");
        if (!string.IsNullOrWhiteSpace(profile.ExtraServices))
            lines.Add($"שירותים נוספים: {profile.ExtraServices}");
        if (!string.IsNullOrWhiteSpace(profile.PricingList))
            lines.Add($"מחירון: {profile.PricingList}");
        if (!string.IsNullOrWhiteSpace(profile.ServiceArea))
            lines.Add($"אזור שירות: {profile.ServiceArea}");
        if (!string.IsNullOrWhiteSpace(profile.Specialization))
            lines.Add($"התמחות: {profile.Specialization}");
        if (profile.Emergency24_7)
            lines.Add($"שירות חירום: {(string.IsNullOrWhiteSpace(profile.EmergencyHours) ? "זמין" : profile.EmergencyHours)}");
        if (profile.IsLicensed && !string.IsNullOrWhiteSpace(profile.LicenseNumber))
            lines.Add($"רישיון/הסמכה: {profile.LicenseNumber}");
        if (!string.IsNullOrWhiteSpace(profile.ClassTypes))
            lines.Add($"סוגי שיעורים: {profile.ClassTypes}");
        if (!string.IsNullOrWhiteSpace(profile.StudentAchievements))
            lines.Add($"הישגים: {profile.StudentAchievements}");
        if (!string.IsNullOrWhiteSpace(profile.ProductCategories))
            lines.Add($"מוצרים: {profile.ProductCategories}");
        if (!string.IsNullOrWhiteSpace(profile.TeamSize))
            lines.Add($"גודל צוות: {profile.TeamSize}");

        if (lines.Count == 0) return "";
        return "\n            מידע נוסף מהלקוח:\n            " + string.Join("\n            ", lines);
    }

    private static void ApplyBusinessDna(
        BusinessProfile profile,
        WebsiteData websiteData,
        AiWebsiteContent aiContent,
        BusinessDna dna,
        bool isFoodBusiness,
        bool hasMenuSection)
    {
        websiteData.Hero.Headline = profile.BusinessName;
        websiteData.Hero.Subheadline = TrimToWordLimit(aiContent.Hero.Subheadline, 8);
        websiteData.Hero.CtaText = dna.HeroCtaText;
        websiteData.Hero.CtaAction = dna.HeroCtaAction;
        websiteData.Hero.HeroPhotoUrl = ResolveHeroPhotoUrl(profile);

        if (string.IsNullOrWhiteSpace(websiteData.About.OwnerName))
            websiteData.About.OwnerName = profile.OwnerName;

        MergeAboutHighlights(profile, websiteData.About);

        websiteData.Services = BuildServicesFromProfile(profile, aiContent.Services);

        var stats = new List<StatItem>();
        if (!string.IsNullOrWhiteSpace(profile.YearsInBusiness))
            stats.Add(new StatItem { Value = profile.YearsInBusiness + "+", Label = "שנות ניסיון" });
        if (!string.IsNullOrWhiteSpace(profile.ClientsServed))
            stats.Add(new StatItem { Value = profile.ClientsServed + "+", Label = "לקוחות מרוצים" });
        if (!string.IsNullOrWhiteSpace(profile.SpecialAchievement))
            stats.Add(new StatItem { Value = "★", Label = profile.SpecialAchievement });

        if (stats.Count > 0)
            websiteData.Numbers = new NumbersSection { Title = "במספרים", Stats = stats };

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
            var hasMenuPhotos = profile.MenuPhotos?.Count > 0;
            var hasMenuItems = profile.MenuItems?.Count > 0;
            var hasMenuUrl = !string.IsNullOrWhiteSpace(profile.MenuUrl);

            if (hasMenuPhotos || hasMenuItems || hasMenuUrl)
            {
                websiteData.Menu = new MenuSection
                {
                    Title = "התפריט שלנו",
                    DisplayMode = ResolveMenuDisplayMode(
                        profile.MenuDisplayMode,
                        hasMenuPhotos,
                        hasMenuItems,
                        hasMenuUrl),
                    MenuUrl = profile.MenuUrl ?? "",
                    MenuPhotos = profile.MenuPhotos ?? new(),
                    HasReservations = profile.HasReservations,
                    ReservationLink = profile.ReservationLink ?? "",
                    ReservationPhone = profile.Phone,
                    Categories = BuildMenuCategories(profile.MenuItems),
                };
            }
        }

        websiteData.BeforeAfter = BuildBeforeAfterSection(profile);
        websiteData.InstagramUrl = profile.InstagramUrl ?? "";

        var (ctaText, ctaHref) = ResolvePrimaryCta(profile, websiteData, dna);
        websiteData.Navbar = new NavbarConfig
        {
            Links = BuildNavbarLinks(websiteData),
            CtaText = ctaText,
            CtaHref = ctaHref,
        };
    }

    private static List<string> BuildGalleryPhotos(BusinessProfile profile)
    {
        return profile.PhotosByCategory
            .Where(kvp => !IsExcludedFromGallery(kvp.Key))
            .SelectMany(kvp => kvp.Value)
            .Take(9)
            .ToList();
    }

    private static bool IsExcludedFromGallery(string category)
    {
        if (category.StartsWith("לפני - ", StringComparison.Ordinal)) return true;
        if (category.StartsWith("אחרי - ", StringComparison.Ordinal)) return true;
        if (category == "תפריט") return true;
        return false;
    }

    private static BeforeAfterSection? BuildBeforeAfterSection(BusinessProfile profile)
    {
        const string beforePrefix = "לפני - ";
        const string afterPrefix = "אחרי - ";
        var pairs = new List<BeforeAfterPair>();

        foreach (var (key, beforeUrls) in profile.PhotosByCategory)
        {
            if (!key.StartsWith(beforePrefix, StringComparison.Ordinal)) continue;
            var category = key[beforePrefix.Length..];
            if (!profile.PhotosByCategory.TryGetValue($"{afterPrefix}{category}", out var afterUrls)) continue;
            if (beforeUrls.Count == 0 || afterUrls.Count == 0) continue;

            pairs.Add(new BeforeAfterPair
            {
                BeforeUrl = beforeUrls[0],
                AfterUrl = afterUrls[0],
                Label = category,
            });
        }

        if (pairs.Count == 0) return null;

        return new BeforeAfterSection
        {
            Title = "לפני ואחרי",
            Pairs = pairs.Take(4).ToList(),
        };
    }

    private static List<NavLink> BuildNavbarLinks(WebsiteData data)
    {
        var links = new List<NavLink>();

        if (data.Menu != null)
            links.Add(new NavLink { Label = "תפריט", Href = "#menu" });

        links.Add(new NavLink { Label = "עלינו", Href = "#about" });

        if (data.BeforeAfter?.Pairs.Count > 0)
            links.Add(new NavLink { Label = "לפני ואחרי", Href = "#before-after" });

        if (data.Gallery.PhotoUrls.Count > 0)
            links.Add(new NavLink { Label = "גלריה", Href = "#gallery" });

        links.Add(new NavLink { Label = "צור קשר", Href = "#contact" });
        return links;
    }

    private static (string CtaText, string CtaHref) ResolvePrimaryCta(
        BusinessProfile profile,
        WebsiteData data,
        BusinessDna dna)
    {
        var type = profile.BusinessType.ToLowerInvariant();

        if (type == "restaurant" && profile.HasReservations)
        {
            if (!string.IsNullOrWhiteSpace(profile.ReservationLink))
                return (dna.NavbarCtaText, profile.ReservationLink);

            var waHref = BuildWhatsAppHref(profile.WhatsApp, "היי, אשמח להזמין מקום");
            if (waHref != "#contact")
                return (dna.NavbarCtaText, waHref);
        }

        if (type == "beauty" || (type == "fitness" && profile.OffersFreeTrial))
        {
            var message = type == "beauty"
                ? "היי, אשמח לקבוע תור"
                : "היי, אשמח לשיעור ניסיון";
            var waHref = BuildWhatsAppHref(profile.WhatsApp, message);
            if (waHref != "#contact")
                return (dna.NavbarCtaText, waHref);
        }

        if (type == "services" && !string.IsNullOrWhiteSpace(profile.Phone))
            return (dna.NavbarCtaText, $"tel:{profile.Phone.Replace(" ", "")}");

        if (type == "retail")
            return ("צרו קשר", "#contact");

        return (dna.NavbarCtaText, "#contact");
    }

    private static string BuildWhatsAppHref(string whatsApp, string message)
    {
        if (string.IsNullOrWhiteSpace(whatsApp)) return "#contact";
        var digits = new string(whatsApp.Where(char.IsDigit).ToArray());
        if (digits.Length == 0) return "#contact";
        return $"https://wa.me/{digits}?text={Uri.EscapeDataString(message)}";
    }

    private static List<ServiceItem> BuildServicesFromProfile(
        BusinessProfile profile,
        List<ServiceItem> aiServices)
    {
        var type = profile.BusinessType.ToLowerInvariant();

        if (type == "beauty" && !string.IsNullOrWhiteSpace(profile.PricingList))
            return ParsePricingList(profile.PricingList);

        if (type == "fitness" && !string.IsNullOrWhiteSpace(profile.ClassTypes))
            return ParseCommaSeparatedServices(profile.ClassTypes, profile.PricingList);

        if (type == "services")
        {
            var items = new List<ServiceItem>();
            if (!string.IsNullOrWhiteSpace(profile.Specialization))
            {
                items.Add(new ServiceItem
                {
                    Name = profile.Specialization,
                    Description = string.IsNullOrWhiteSpace(profile.ServiceArea)
                        ? ""
                        : $"אזור שירות: {profile.ServiceArea}",
                });
            }

            items.AddRange(profile.KeyFeatures
                .Where(f => !string.IsNullOrWhiteSpace(f))
                .Take(5)
                .Select(f => new ServiceItem { Name = f, Description = "" }));

            if (items.Count > 0) return items;
        }

        if (type == "retail" && !string.IsNullOrWhiteSpace(profile.ProductCategories))
            return ParseCommaSeparatedServices(profile.ProductCategories);

        if (type == "restaurant")
        {
            var fromFeatures = profile.KeyFeatures
                .Where(f => !string.IsNullOrWhiteSpace(f))
                .Take(4)
                .Select(f => new ServiceItem { Name = f, Description = "" })
                .ToList();
            if (fromFeatures.Count > 0) return fromFeatures;
            return new List<ServiceItem>();
        }

        return aiServices.Count > 0 ? aiServices : ParseKeyFeaturesAsServices(profile.KeyFeatures);
    }

    private static List<ServiceItem> ParsePricingList(string pricingList)
    {
        var items = new List<ServiceItem>();
        foreach (var segment in pricingList.Split([',', '\n', ';'], StringSplitOptions.RemoveEmptyEntries))
        {
            var text = segment.Trim();
            if (string.IsNullOrWhiteSpace(text)) continue;

            var price = ExtractPrice(text);
            var name = string.IsNullOrWhiteSpace(price)
                ? text
                : text.Replace(price, "").Trim(' ', '-', '–', ':');

            items.Add(new ServiceItem
            {
                Name = string.IsNullOrWhiteSpace(name) ? text : name,
                Description = "",
                Price = price,
            });
        }

        return items;
    }

    private static List<ServiceItem> ParseCommaSeparatedServices(
        string value,
        string? pricingHint = null)
    {
        return value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries)
            .Where(v => !string.IsNullOrWhiteSpace(v))
            .Select(v => new ServiceItem
            {
                Name = v,
                Description = "",
                Price = pricingHint ?? "",
            })
            .ToList();
    }

    private static List<ServiceItem> ParseKeyFeaturesAsServices(List<string> keyFeatures)
    {
        return keyFeatures
            .Where(f => !string.IsNullOrWhiteSpace(f))
            .Take(6)
            .Select(f => new ServiceItem { Name = f, Description = "" })
            .ToList();
    }

    private static string ExtractPrice(string text)
    {
        var match = Regex.Match(text, @"(\d[\d,]*\s*₪|₪\s*\d[\d,]*)");
        return match.Success ? match.Value.Trim() : "";
    }

    private static void MergeAboutHighlights(BusinessProfile profile, AboutSection about)
    {
        var fromProfile = new List<string>();

        if (!string.IsNullOrWhiteSpace(profile.RestaurantHighlights))
            fromProfile.AddRange(SplitCsv(profile.RestaurantHighlights));
        if (profile.IsLicensed && !string.IsNullOrWhiteSpace(profile.LicenseNumber))
            fromProfile.Add($"מורשה: {profile.LicenseNumber}");
        if (!string.IsNullOrWhiteSpace(profile.ServiceArea))
            fromProfile.Add($"אזור שירות: {profile.ServiceArea}");
        if (!string.IsNullOrWhiteSpace(profile.TeamSize))
            fromProfile.Add($"צוות: {profile.TeamSize}");

        if (fromProfile.Count == 0) return;

        var merged = fromProfile
            .Concat(about.Highlights)
            .Where(h => !string.IsNullOrWhiteSpace(h))
            .Distinct()
            .Take(5)
            .ToList();

        about.Highlights = merged;
    }

    private static IEnumerable<string> SplitCsv(string value)
    {
        return value.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
    }

    private static string ResolveHeroPhotoUrl(BusinessProfile profile)
    {
        if (!string.IsNullOrWhiteSpace(profile.HeroPhotoUrl))
            return profile.HeroPhotoUrl;

        return profile.PhotosByCategory
            .Where(kvp => !IsExcludedFromGallery(kvp.Key))
            .SelectMany(kvp => kvp.Value)
            .FirstOrDefault(url => !string.IsNullOrWhiteSpace(url)) ?? "";
    }

    private static string TrimToWordLimit(string text, int maxWords)
    {
        if (string.IsNullOrWhiteSpace(text)) return text;
        var words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        return string.Join(' ', words.Take(maxWords));
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

        // שירותים לבית, אינסטלטור, חשמלאי, שירותים כלליים - Heebo (נקי, מקצועי)
        if (type == "services" || type.Contains("plumber") || type.Contains("electrician") ||
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
