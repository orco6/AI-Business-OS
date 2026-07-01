using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Onboarding;

[ApiController]
[Route("api/photos")]
public class PhotosController : ControllerBase
{
    private readonly OnboardingService _onboardingService;

    public PhotosController(OnboardingService onboardingService)
    {
        _onboardingService = onboardingService;
    }

    [HttpPost]
    public async Task<IActionResult> UpdatePhotos([FromBody] UpdatePhotosRequest? request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.ProfileId))
        {
            return BadRequest();
        }

        await _onboardingService.UpdatePhotosAsync(
            request.ProfileId,
            request.PhotosByCategory ?? new(),
            request.HeroPhotoUrl ?? "");

        return Ok(new { status = "ok" });
    }
}

public sealed class UpdatePhotosRequest
{
    public string? ProfileId { get; set; }
    public Dictionary<string, List<string>>? PhotosByCategory { get; set; }
    public string? HeroPhotoUrl { get; set; }
}
