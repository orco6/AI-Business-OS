using MongoDB.Driver;

namespace Api.Features.Onboarding;

public class OnboardingService
{
    private readonly IMongoCollection<BusinessProfile> _collection;

    public OnboardingService(IMongoDatabase database)
    {
        _collection = database.GetCollection<BusinessProfile>("business_profiles");
    }

    public async Task<BusinessProfile> CreateBusinessProfileAsync(
        string businessName,
        string businessType,
        string userId,
        string businessAnswer = "",
        List<string>? selectedCategories = null,
        List<string>? websiteSections = null,
        string recommendedTone = "",
        List<string>? suggestedColors = null,
        string targetAudience = "",
        string mainValue = "",
        List<string>? keyFeatures = null,
        string phone = "",
        string whatsApp = "",
        string address = "",
        string ownerName = "",
        string city = "",
        string hours = "",
        string deliveryInfo = "",
        string emergencyService = "",
        string bookingMethod = "")
    {
        var profile = new BusinessProfile
        {
            UserId = userId,
            BusinessName = businessName,
            BusinessType = businessType,
            BusinessAnswer = businessAnswer,
            SelectedCategories = selectedCategories ?? new(),
            WebsiteSections = websiteSections ?? new(),
            RecommendedTone = recommendedTone,
            SuggestedColors = suggestedColors ?? new(),
            TargetAudience = targetAudience,
            MainValue = mainValue,
            KeyFeatures = keyFeatures ?? new(),
            Phone = phone,
            WhatsApp = whatsApp,
            Address = address,
            OwnerName = ownerName,
            City = city,
            Hours = hours,
            DeliveryInfo = deliveryInfo,
            EmergencyService = emergencyService,
            BookingMethod = bookingMethod,
        };

        await _collection.InsertOneAsync(profile);
        return profile;
    }

    public async Task<BusinessProfile?> GetByUserIdAsync(string userId)
    {
        return await _collection
            .Find(p => p.UserId == userId)
            .SortByDescending(p => p.CreatedAt)
            .FirstOrDefaultAsync();
    }

    public async Task UpdatePhotosAsync(string profileId, Dictionary<string, List<string>> photosByCategory)
    {
        var filter = Builders<BusinessProfile>.Filter.Eq(p => p.Id, profileId);
        var update = Builders<BusinessProfile>.Update.Set(p => p.PhotosByCategory, photosByCategory);
        await _collection.UpdateOneAsync(filter, update);
    }
}
