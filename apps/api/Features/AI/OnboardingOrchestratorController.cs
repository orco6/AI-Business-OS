using Microsoft.AspNetCore.Mvc;

namespace Api.Features.AI;

[ApiController]
[Route("api/onboarding")]
public class OnboardingOrchestratorController : ControllerBase
{
    private readonly OnboardingOrchestratorService _onboardingOrchestratorService;

    public OnboardingOrchestratorController(OnboardingOrchestratorService onboardingOrchestratorService)
    {
        _onboardingOrchestratorService = onboardingOrchestratorService;
    }

    [HttpPost("deep-question")]
    public async Task<IActionResult> GetDeepQuestion([FromBody] DeepQuestionRequest? request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.BusinessType))
        {
            return BadRequest();
        }

        var question = await _onboardingOrchestratorService.GetDeepQuestionAsync(request.BusinessType);

        return Ok(new { question });
    }
}

public sealed class DeepQuestionRequest
{
    public string? BusinessType { get; set; }
}
