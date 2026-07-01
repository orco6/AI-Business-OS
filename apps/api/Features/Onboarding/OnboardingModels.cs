using Api.Features.Website;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Api.Features.Onboarding;

public class ProfileMenuItem
{
    public string Category { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
}

public class BusinessProfile
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    public string UserId { get; set; } = string.Empty;
    public string BusinessName { get; set; } = string.Empty;
    public string BusinessType { get; set; } = string.Empty;
    public string BusinessAnswer { get; set; } = string.Empty;
    public List<string> SelectedCategories { get; set; } = new();
    public string Status { get; set; } = "onboarding";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // From OnboardingPlan
    public List<string> WebsiteSections { get; set; } = new();
    public string RecommendedTone { get; set; } = string.Empty;
    public List<string> SuggestedColors { get; set; } = new();
    public string TargetAudience { get; set; } = string.Empty;
    public string MainValue { get; set; } = string.Empty;
    public List<string> KeyFeatures { get; set; } = new();

    // Contact info
    public string Phone { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Hours { get; set; } = string.Empty;
    public string DeliveryInfo { get; set; } = string.Empty;
    public string EmergencyService { get; set; } = string.Empty;
    public string BookingMethod { get; set; } = string.Empty;
    public string ServiceArea { get; set; } = string.Empty;

    // Restaurant
    public string MenuUrl { get; set; } = string.Empty;
    public string MenuDisplayMode { get; set; } = string.Empty;
    public string MenuTypes { get; set; } = string.Empty;
    public string RestaurantHighlights { get; set; } = string.Empty;
    public string ExtraServices { get; set; } = string.Empty;
    public bool HasReservations { get; set; }
    public string ReservationLink { get; set; } = string.Empty;
    public string CuisineType { get; set; } = string.Empty;
    public List<string> MenuPhotos { get; set; } = new();
    public List<ProfileMenuItem> MenuItems { get; set; } = new();

    // Beauty / Barber
    public string PricingList { get; set; } = string.Empty;
    public string TeamSize { get; set; } = string.Empty;

    // Services
    public bool Emergency24_7 { get; set; }
    public string EmergencyHours { get; set; } = string.Empty;
    public bool IsLicensed { get; set; }
    public string LicenseNumber { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string BookingLink { get; set; } = string.Empty;

    // Education
    public string Subjects { get; set; } = string.Empty;
    public string AgeGroups { get; set; } = string.Empty;
    public string SessionFormat { get; set; } = string.Empty;
    public string StudentAchievements { get; set; } = string.Empty;
    public bool OffersFreeTrial { get; set; }

    // Retail
    public string ProductCategories { get; set; } = string.Empty;
    public bool HasOnlineStore { get; set; }
    public string OnlineStoreUrl { get; set; } = string.Empty;

    // Fitness
    public string ClassTypes { get; set; } = string.Empty;
    public string ClassSchedule { get; set; } = string.Empty;

    // General
    public string MainServiceDescription { get; set; } = string.Empty;
    public string InstagramUrl { get; set; } = string.Empty;
    public string FacebookUrl { get; set; } = string.Empty;

    // Social proof
    public List<string> SocialProofScreenshots { get; set; } = new();
    public string YearsInBusiness { get; set; } = string.Empty;
    public string ClientsServed { get; set; } = string.Empty;
    public string SpecialAchievement { get; set; } = string.Empty;

    public Dictionary<string, List<string>> PhotosByCategory { get; set; } = new();
    public string HeroPhotoUrl { get; set; } = string.Empty;
    public WebsiteData? WebsiteData { get; set; }
}
