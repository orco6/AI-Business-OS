using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Api.Features.Onboarding;

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
    public Dictionary<string, List<string>> PhotosByCategory { get; set; } = new();
}
