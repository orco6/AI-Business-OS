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
        List<string>? keyFeatures = null)
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
}
