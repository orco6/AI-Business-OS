using System.Net.Http.Json;
using System.Text.Json;

namespace Api.Features.AI;

public class AnthropicService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public AnthropicService(IConfiguration configuration)
    {
        _apiKey = configuration["Anthropic:ApiKey"]
            ?? throw new InvalidOperationException("Anthropic:ApiKey is not configured.");
        _httpClient = new HttpClient();
    }

    public async Task<string> CompleteAsync(string systemPrompt, string userMessage, int maxTokens = 1024)
    {
        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.anthropic.com/v1/messages");
        request.Headers.Add("x-api-key", _apiKey);
        request.Headers.Add("anthropic-version", "2023-06-01");

        var body = new
        {
            model = "claude-sonnet-4-6",
            max_tokens = maxTokens,
            messages = new[] { new { role = "user", content = userMessage } },
            system = systemPrompt,
        };

        request.Content = JsonContent.Create(body);

        var response = await _httpClient.SendAsync(request);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync();
            throw new HttpRequestException($"Anthropic API error {response.StatusCode}: {errorBody}");
        }

        using var doc = await JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
        return doc.RootElement.GetProperty("content")[0].GetProperty("text").GetString() ?? string.Empty;
    }
}
