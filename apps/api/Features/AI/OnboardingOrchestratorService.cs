namespace Api.Features.AI;

public class OnboardingOrchestratorService
{
    private readonly AnthropicService _anthropicService;

    public OnboardingOrchestratorService(AnthropicService anthropicService)
    {
        _anthropicService = anthropicService;
    }

    public async Task<string> GetDeepQuestionAsync(string businessType)
    {
        const string systemPrompt = """
            You are a warm, professional Israeli business consultant.
            You speak fluent, natural Hebrew like a native Israeli.
            Your job is to ask ONE simple, clear question to understand what the business sells.
            The question must be extremely simple - even a non-technical person understands immediately.
            Maximum 6 words.
            Never ask about customers in the first question.
            Just ask what they sell or what they do.
            Return only the question, nothing else.
            """;

        var userMessage = $"""
            Business type: {businessType}
            
            Ask the simplest possible question in Hebrew to find out exactly what this business sells or does.
            Examples:
            - "מה אתה מוכר בחנות?"
            - "במה העסק שלך עוסק?"
            - "איזה שירותים אתה נותן?"
            """;

        return await _anthropicService.CompleteAsync(systemPrompt, userMessage);
    }
}
