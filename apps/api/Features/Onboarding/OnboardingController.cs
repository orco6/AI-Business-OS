using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Onboarding;

[ApiController]
[Route("api/onboarding")]
public class OnboardingController : ControllerBase
{
    [HttpPost("start")]
    public IActionResult Start([FromBody] StartOnboardingRequest? request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.BusinessName))
        {
            return BadRequest();
        }

        return Ok(new { status = "ok", businessName = request.BusinessName });
    }
}

public sealed class StartOnboardingRequest
{
    public string? BusinessName { get; set; }
}
