using Api.Features.AI;
using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Onboarding;

[ApiController]
[Route("api/onboarding")]
public class OnboardingController : ControllerBase
{
    private readonly OnboardingService _onboardingService;
    private readonly OrchestratorService _orchestratorService;

    public OnboardingController(
        OnboardingService onboardingService,
        OrchestratorService orchestratorService)
    {
        _onboardingService = onboardingService;
        _orchestratorService = orchestratorService;
    }

    [HttpPost("start")]
    public async Task<IActionResult> Start([FromBody] StartOnboardingRequest? request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.BusinessName))
        {
            return BadRequest();
        }

        var businessType = request.BusinessType ?? "unknown";

        var profile = await _onboardingService.CreateBusinessProfileAsync(
            request.BusinessName,
            businessType,
            request.UserId ?? "anonymous",
            businessAnswer: request.BusinessAnswer ?? "",
            selectedCategories: request.SelectedCategories,
            websiteSections: request.WebsiteSections,
            recommendedTone: request.RecommendedTone ?? "",
            suggestedColors: request.SuggestedColors,
            targetAudience: request.TargetAudience ?? "",
            mainValue: request.MainValue ?? "",
            keyFeatures: request.KeyFeatures,
            phone: request.Phone ?? "",
            whatsApp: request.WhatsApp ?? "",
            address: request.Address ?? "",
            ownerName: request.OwnerName ?? "",
            city: request.City ?? "",
            hours: request.Hours ?? "",
            deliveryInfo: request.DeliveryInfo ?? "",
            emergencyService: request.EmergencyService ?? "",
            bookingMethod: request.BookingMethod ?? "",
            bookingLink: request.BookingLink ?? "",
            serviceArea: request.ServiceArea ?? "",
            menuUrl: request.MenuUrl ?? "",
            menuDisplayMode: request.MenuDisplayMode ?? "",
            menuTypes: request.MenuTypes ?? "",
            restaurantHighlights: request.RestaurantHighlights ?? "",
            extraServices: request.ExtraServices ?? "",
            hasReservations: request.HasReservations ?? false,
            reservationLink: request.ReservationLink ?? "",
            cuisineType: request.CuisineType ?? "",
            menuPhotos: request.MenuPhotos,
            menuItems: request.MenuItems,
            pricingList: request.PricingList ?? "",
            teamSize: request.TeamSize ?? "",
            emergency24_7: request.Emergency24_7 ?? false,
            emergencyHours: request.EmergencyHours ?? "",
            isLicensed: request.IsLicensed ?? false,
            licenseNumber: request.LicenseNumber ?? "",
            specialization: request.Specialization ?? "",
            subjects: request.Subjects ?? "",
            ageGroups: request.AgeGroups ?? "",
            sessionFormat: request.SessionFormat ?? "",
            studentAchievements: request.StudentAchievements ?? "",
            offersFreeTrial: request.OffersFreeTrial ?? false,
            productCategories: request.ProductCategories ?? "",
            hasOnlineStore: request.HasOnlineStore ?? false,
            onlineStoreUrl: request.OnlineStoreUrl ?? "",
            classTypes: request.ClassTypes ?? "",
            classSchedule: request.ClassSchedule ?? "",
            mainServiceDescription: request.MainServiceDescription ?? "",
            instagramUrl: request.InstagramUrl ?? "",
            facebookUrl: request.FacebookUrl ?? "",
            socialProofScreenshots: request.SocialProofScreenshots,
            yearsInBusiness: request.YearsInBusiness ?? "",
            clientsServed: request.ClientsServed ?? "",
            specialAchievement: request.SpecialAchievement ?? "",
            heroPhotoUrl: request.HeroPhotoUrl ?? "");

        var welcomeMessage = await _orchestratorService.ProcessOnboardingAsync(
            request.BusinessName,
            businessType);

        return Ok(new { status = "ok", profileId = profile.Id, welcomeMessage });
    }
}

public sealed class StartOnboardingRequest
{
    public string? UserId { get; set; }
    public string? BusinessName { get; set; }
    public string? BusinessType { get; set; }
    public string? BusinessAnswer { get; set; }
    public List<string>? SelectedCategories { get; set; }
    public List<string>? WebsiteSections { get; set; }
    public string? RecommendedTone { get; set; }
    public List<string>? SuggestedColors { get; set; }
    public string? TargetAudience { get; set; }
    public string? MainValue { get; set; }
    public List<string>? KeyFeatures { get; set; }
    public string? Phone { get; set; }
    public string? WhatsApp { get; set; }
    public string? Address { get; set; }
    public string? OwnerName { get; set; }
    public string? City { get; set; }
    public string? Hours { get; set; }
    public string? DeliveryInfo { get; set; }
    public string? EmergencyService { get; set; }
    public string? BookingMethod { get; set; }
    public string? BookingLink { get; set; }
    public string? ServiceArea { get; set; }
    public string? MenuUrl { get; set; }
    public string? MenuDisplayMode { get; set; }
    public string? MenuTypes { get; set; }
    public string? RestaurantHighlights { get; set; }
    public string? ExtraServices { get; set; }
    public bool? HasReservations { get; set; }
    public string? ReservationLink { get; set; }
    public string? CuisineType { get; set; }
    public List<string>? MenuPhotos { get; set; }
    public List<ProfileMenuItem>? MenuItems { get; set; }
    public string? PricingList { get; set; }
    public string? TeamSize { get; set; }
    public bool? Emergency24_7 { get; set; }
    public string? EmergencyHours { get; set; }
    public bool? IsLicensed { get; set; }
    public string? LicenseNumber { get; set; }
    public string? Specialization { get; set; }
    public string? Subjects { get; set; }
    public string? AgeGroups { get; set; }
    public string? SessionFormat { get; set; }
    public string? StudentAchievements { get; set; }
    public bool? OffersFreeTrial { get; set; }
    public string? ProductCategories { get; set; }
    public bool? HasOnlineStore { get; set; }
    public string? OnlineStoreUrl { get; set; }
    public string? ClassTypes { get; set; }
    public string? ClassSchedule { get; set; }
    public string? MainServiceDescription { get; set; }
    public string? InstagramUrl { get; set; }
    public string? FacebookUrl { get; set; }
    public List<string>? SocialProofScreenshots { get; set; }
    public string? YearsInBusiness { get; set; }
    public string? ClientsServed { get; set; }
    public string? SpecialAchievement { get; set; }
    public string? HeroPhotoUrl { get; set; }
}
