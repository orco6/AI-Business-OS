using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Onboarding;

[ApiController]
[Route("api/business-profile")]
public class BusinessProfileController : ControllerBase
{
    private readonly OnboardingService _onboardingService;

    public BusinessProfileController(OnboardingService onboardingService)
    {
        _onboardingService = onboardingService;
    }

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? userId)
    {
        if (string.IsNullOrEmpty(userId))
        {
            return BadRequest();
        }

        var profile = await _onboardingService.GetByUserIdAsync(userId);

        if (profile is null)
        {
            return NotFound();
        }

        return Ok(profile);
    }
}
