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
            request.UserId ?? "anonymous");

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
}
