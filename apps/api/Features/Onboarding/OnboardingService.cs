using MongoDB.Driver;

namespace Api.Features.Onboarding;

public class OnboardingService
{
    private readonly IMongoCollection<BusinessProfile> _collection;

    public OnboardingService(IMongoDatabase database)
    {
        _collection = database.GetCollection<BusinessProfile>("business_profiles");
    }

    public async Task<BusinessProfile> CreateBusinessProfileAsync(string businessName, string businessType, string userId)
    {
        var profile = new BusinessProfile
        {
            UserId = userId,
            BusinessName = businessName,
            BusinessType = businessType,
        };

        await _collection.InsertOneAsync(profile);
        return profile;
    }
}
