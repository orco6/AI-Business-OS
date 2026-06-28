using System.Text.Json;

namespace Api.Features.AI;

public class BusinessInsights
{
    public string TargetAudience { get; set; } = string.Empty;
    public string MainValue { get; set; } = string.Empty;
    public string RecommendedTone { get; set; } = string.Empty;
    public List<string> SuggestedColors { get; set; } = new();
    public List<string> KeyFeatures { get; set; } = new();
}

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
    public BusinessInsights? BusinessInsights { get; set; }
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

        var knowledgeBase = BusinessKnowledgeBase.GetKnowledgeForBusiness(businessType, businessAnswer);

        var userMessage =
            $"""
            {knowledgeBase}

            Now analyze this specific business and create a precise onboarding plan:
            Business Name: {businessName}
            Business Type: {businessType}
            Business Description: {businessAnswer}

            Rules:
            - For restaurants: don't suggest "categories" - suggest menu, delivery, seating, hours
            - For retail stores: suggest product categories relevant to what they sell
            - For service businesses: suggest specializations, service area, pricing model
            - For beauty/wellness: suggest treatment types, booking, pricing
            - Be SPECIFIC to this exact business, not generic

            Return ONLY this JSON structure:
            """ +
            """
            {
              "needsCategories": false,
              "categoriesLabel": "",
              "suggestedCategories": [],
              "needsMenu": false,
              "needsPricing": false,
              "needsServiceArea": false,
              "nextQuestion": "ONE most important follow-up question in Hebrew specific to THIS business, or null",
              "websiteSections": ["hero", "about", "contact"],
              "businessInsights": {
                "targetAudience": "who are the customers in Hebrew",
                "mainValue": "what makes this business special in Hebrew",
                "recommendedTone": "professional/warm/youthful/luxury",
                "suggestedColors": ["#color1", "#color2"],
                "keyFeatures": ["feature1 in Hebrew", "feature2 in Hebrew", "feature3 in Hebrew"]
              }
            }

            For restaurants: needsMenu=true, websiteSections include "menu", "hours", "delivery" if relevant
            For retail: needsCategories=true with SPECIFIC categories for THIS product type
            For services: needsServiceArea=true, websiteSections include "services", "area", "process"
            For beauty: needsCategories=true (treatment types), needsPricing=true

            Return ONLY valid JSON. No text before or after.
            """;

        var response = await _anthropicService.CompleteAsync(systemPrompt, userMessage);

        var plan = JsonSerializer.Deserialize<OnboardingPlan>(response, JsonOptions)
            ?? throw new InvalidOperationException("Failed to parse onboarding plan from AI response.");

        return plan;
    }
}
