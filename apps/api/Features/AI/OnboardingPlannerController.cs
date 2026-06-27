using Microsoft.AspNetCore.Mvc;

namespace Api.Features.AI;

[ApiController]
[Route("api/onboarding")]
public class OnboardingPlannerController : ControllerBase
{
    private readonly OnboardingPlannerService _onboardingPlannerService;

    public OnboardingPlannerController(OnboardingPlannerService onboardingPlannerService)
    {
        _onboardingPlannerService = onboardingPlannerService;
    }

    [HttpPost("plan")]
    public async Task<IActionResult> GetPlan([FromBody] OnboardingPlanRequest? request)
    {
        if (request is null
            || string.IsNullOrWhiteSpace(request.BusinessName)
            || string.IsNullOrWhiteSpace(request.BusinessType)
            || string.IsNullOrWhiteSpace(request.BusinessAnswer))
        {
            return BadRequest();
        }

        var plan = await _onboardingPlannerService.GetOnboardingPlanAsync(
            request.BusinessName,
            request.BusinessType,
            request.BusinessAnswer);

        return Ok(plan);
    }
}

public sealed class OnboardingPlanRequest
{
    public string? BusinessName { get; set; }
    public string? BusinessType { get; set; }
    public string? BusinessAnswer { get; set; }
}
