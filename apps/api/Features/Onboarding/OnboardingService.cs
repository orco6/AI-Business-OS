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

        string bookingMethod = "",

        string bookingLink = "",

        string serviceArea = "",

        string menuUrl = "",

        string menuDisplayMode = "",

        string menuTypes = "",

        string restaurantHighlights = "",

        string extraServices = "",

        bool hasReservations = false,

        string reservationLink = "",

        string cuisineType = "",

        List<string>? menuPhotos = null,

        List<ProfileMenuItem>? menuItems = null,

        string pricingList = "",

        string teamSize = "",

        bool emergency24_7 = false,

        string emergencyHours = "",

        bool isLicensed = false,

        string licenseNumber = "",

        string specialization = "",

        string subjects = "",

        string ageGroups = "",

        string sessionFormat = "",

        string studentAchievements = "",

        bool offersFreeTrial = false,

        string productCategories = "",

        bool hasOnlineStore = false,

        string onlineStoreUrl = "",

        string classTypes = "",

        string classSchedule = "",

        string mainServiceDescription = "",

        string instagramUrl = "",

        string facebookUrl = "",

        List<string>? socialProofScreenshots = null,

        string yearsInBusiness = "",

        string clientsServed = "",

        string specialAchievement = "",

        string heroPhotoUrl = "")

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

            BookingLink = bookingLink,

            ServiceArea = serviceArea,

            MenuUrl = menuUrl,

            MenuDisplayMode = menuDisplayMode,

            MenuTypes = menuTypes,

            RestaurantHighlights = restaurantHighlights,

            ExtraServices = extraServices,

            HasReservations = hasReservations,

            ReservationLink = reservationLink,

            CuisineType = cuisineType,

            MenuPhotos = menuPhotos ?? new(),

            MenuItems = menuItems ?? new(),

            PricingList = pricingList,

            TeamSize = teamSize,

            Emergency24_7 = emergency24_7,

            EmergencyHours = emergencyHours,

            IsLicensed = isLicensed,

            LicenseNumber = licenseNumber,

            Specialization = specialization,

            Subjects = subjects,

            AgeGroups = ageGroups,

            SessionFormat = sessionFormat,

            StudentAchievements = studentAchievements,

            OffersFreeTrial = offersFreeTrial,

            ProductCategories = productCategories,

            HasOnlineStore = hasOnlineStore,

            OnlineStoreUrl = onlineStoreUrl,

            ClassTypes = classTypes,

            ClassSchedule = classSchedule,

            MainServiceDescription = mainServiceDescription,

            InstagramUrl = instagramUrl,

            FacebookUrl = facebookUrl,

            SocialProofScreenshots = socialProofScreenshots ?? new(),

            YearsInBusiness = yearsInBusiness,

            ClientsServed = clientsServed,

            SpecialAchievement = specialAchievement,

            HeroPhotoUrl = heroPhotoUrl,

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



    public async Task UpdatePhotosAsync(
        string profileId,
        Dictionary<string, List<string>> photosByCategory,
        string heroPhotoUrl = "")
    {

        var filter = Builders<BusinessProfile>.Filter.Eq(p => p.Id, profileId);
        var update = Builders<BusinessProfile>.Update
            .Set(p => p.PhotosByCategory, photosByCategory);

        if (!string.IsNullOrWhiteSpace(heroPhotoUrl))
        {
            update = update.Set(p => p.HeroPhotoUrl, heroPhotoUrl);
        }

        await _collection.UpdateOneAsync(filter, update);

    }

}

