using Microsoft.AspNetCore.Mvc;

namespace Api.Features.Website;

[ApiController]
[Route("api/website")]
public class WebsiteController : ControllerBase
{
    private readonly WebsiteService _websiteService;

    public WebsiteController(WebsiteService websiteService)
    {
        _websiteService = websiteService;
    }

    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromBody] GenerateWebsiteRequest? request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.ProfileId))
        {
            return BadRequest(new { error = "profileId is required" });
        }

        try
        {
            var websiteData = await _websiteService.GenerateWebsiteAsync(request.ProfileId);
            return Ok(websiteData);
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(new { error = ex.Message });
        }
    }

    [HttpDelete("{profileId}/data")]
    public async Task<IActionResult> ClearData(string profileId)
    {
        if (string.IsNullOrWhiteSpace(profileId))
        {
            return BadRequest(new { error = "profileId is required" });
        }

        var cleared = await _websiteService.ClearWebsiteDataAsync(profileId);
        if (!cleared)
        {
            return NotFound(new { error = "Profile not found" });
        }

        return Ok(new { message = "Website data cleared. Call POST /generate to regenerate." });
    }

    [HttpGet("{profileId}")]
    public async Task<IActionResult> Get(string profileId)
    {
        if (string.IsNullOrWhiteSpace(profileId))
        {
            return BadRequest();
        }

        var websiteData = await _websiteService.GetWebsiteAsync(profileId);

        if (websiteData is null)
        {
            return NotFound();
        }

        return Ok(websiteData);
    }
}
