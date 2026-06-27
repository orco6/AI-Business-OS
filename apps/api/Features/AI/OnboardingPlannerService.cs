using System.Text.Json;

namespace Api.Features.AI;

public class OnboardingPlan
{
    public bool NeedsCategories { get; set; }
    public string CategoriesLabel { get; set; } = string.Empty;
    public List<string> SuggestedCategories { get; set; } = new();
    public bool NeedsMenu { get; set; }
    public bool NeedsPricing { get; set; }
    public bool NeedsServiceArea { get; set; }
    public string? NextQuestion { get; set; }
    public List<string> WebsiteSections { get; set; } = new();
}

public class OnboardingPlannerService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    private readonly AnthropicService _anthropicService;

    public OnboardingPlannerService(AnthropicService anthropicService)
    {
        _anthropicService = anthropicService;
    }

    public async Task<OnboardingPlan> GetOnboardingPlanAsync(
        string businessName,
        string businessType,
        string businessAnswer)
    {
        const string systemPrompt = """
            You are an expert business consultant for Israeli small businesses.
            You analyze a business and decide exactly what information is needed to build a perfect website.
            You respond in JSON only. No markdown, no explanation.
            """;

        var userMessage =
            $"""
            Business Name: {businessName}
            Business Type: {businessType}
            Business Description: {businessAnswer}

            Analyze this business and return a JSON object with the following structure:
            """ +
            """
            {
              "needsCategories": true/false,
              "categoriesLabel": "קטגוריות המוצרים" / "תחומי התמחות" / "סוגי טיפולים" etc,
              "suggestedCategories": ["category1", "category2", ...],
              "needsMenu": true/false,
              "needsPricing": true/false,
              "needsServiceArea": true/false,
              "nextQuestion": "the next most important question to ask in Hebrew, or null if no more questions needed",
              "websiteSections": ["hero", "about", "services", "gallery", "contact", "menu", "pricing", "area"]
            }

            Return ONLY valid JSON. No text before or after.
            """;

        var response = await _anthropicService.CompleteAsync(systemPrompt, userMessage);

        var plan = JsonSerializer.Deserialize<OnboardingPlan>(response, JsonOptions)
            ?? throw new InvalidOperationException("Failed to parse onboarding plan from AI response.");

        return plan;
    }
}
