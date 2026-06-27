namespace Api.Features.AI;

public class OrchestratorService
{
    private readonly AnthropicService _anthropicService;

    public OrchestratorService(AnthropicService anthropicService)
    {
        _anthropicService = anthropicService;
    }

    public async Task<string> ProcessOnboardingAsync(string businessName, string businessType)
    {
        const string systemPrompt = """
            You are an AI business assistant helping Israeli small business owners.
            You speak Hebrew. Be warm, professional, and concise.
            """;

        var userMessage = $"""
            A new business just completed onboarding:
            Business Name: {businessName}
            Business Type: {businessType}

            Generate a warm welcome message in Hebrew (2-3 sentences) that:
            1. Welcomes them by business name
            2. Mentions what we'll help them with based on their business type
            3. Says we're starting to build their digital presence
            """;

        return await _anthropicService.CompleteAsync(systemPrompt, userMessage);
    }
}
