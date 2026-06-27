using Microsoft.AspNetCore.Mvc;

namespace Api.Features.AI;

[ApiController]
[Route("api/ai")]
public class AiController : ControllerBase
{
    private readonly AnthropicService _anthropicService;

    public AiController(AnthropicService anthropicService)
    {
        _anthropicService = anthropicService;
    }

    [HttpPost("test")]
    public async Task<IActionResult> Test()
    {
        var result = await _anthropicService.CompleteAsync(
            "You are a helpful assistant",
            "Say hello in Hebrew in one sentence");

        return Ok(new { result });
    }
}
