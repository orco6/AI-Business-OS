using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Onboarding;

[ApiController]
[Route("api/onboarding")]
public class OnboardingController : ControllerBase
{
    private readonly OnboardingService _onboardingService;

    public OnboardingController(OnboardingService onboardingService)
    {
        _onboardingService = onboardingService;
    }

    [HttpPost("start")]
    public async Task<IActionResult> Start([FromBody] StartOnboardingRequest? request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.BusinessName))
        {
            return BadRequest();
        }

        var profile = await _onboardingService.CreateBusinessProfileAsync(
            request.BusinessName,
            request.BusinessType ?? "unknown");

        return Ok(new { status = "ok", profileId = profile.Id });
    }
}

public sealed class StartOnboardingRequest
{
    public string? BusinessName { get; set; }
    public string? BusinessType { get; set; }
}
