namespace Api.Features.Website;

public class WebsiteData
{
    public HeroSection Hero { get; set; } = new();
    public AboutSection About { get; set; } = new();
    public List<ServiceItem> Services { get; set; } = new();
    public GallerySection Gallery { get; set; } = new();
    public ContactSection Contact { get; set; } = new();
    public ThemeConfig Theme { get; set; } = new();
    public SeoConfig Seo { get; set; } = new();
    public string BusinessName { get; set; } = string.Empty;
    public string BusinessSlug { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; }
    public Dictionary<string, List<string>> PhotosByCategory { get; set; } = new();
}

public class HeroSection
{
    public string Headline { get; set; } = string.Empty;
    public string Subheadline { get; set; } = string.Empty;
    public string CtaText { get; set; } = string.Empty;
    public string CtaAction { get; set; } = string.Empty;
    public string BackgroundImageCategory { get; set; } = string.Empty;
}

public class AboutSection
{
    public string Title { get; set; } = string.Empty;
    public string Story { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public List<string> Highlights { get; set; } = new();
}

public class ServiceItem
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
    public string ImageCategory { get; set; } = string.Empty;
}

public class GallerySection
{
    public string Title { get; set; } = string.Empty;
    public List<string> PhotoUrls { get; set; } = new();
}

public class ContactSection
{
    public string Title { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string WhatsApp { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Hours { get; set; } = string.Empty;
    public string GoogleMapsUrl { get; set; } = string.Empty;
}

public class ThemeConfig
{
    public string PrimaryColor { get; set; } = string.Empty;
    public string SecondaryColor { get; set; } = string.Empty;
    public string AccentColor { get; set; } = string.Empty;
    public string TextColor { get; set; } = string.Empty;
    public string BgColor { get; set; } = string.Empty;
    public string FontHeading { get; set; } = string.Empty;
    public string FontBody { get; set; } = string.Empty;
    public string LayoutStyle { get; set; } = string.Empty;
}

public class SeoConfig
{
    public string MetaTitle { get; set; } = string.Empty;
    public string MetaDescription { get; set; } = string.Empty;
    public List<string> Keywords { get; set; } = new();
}

public class GenerateWebsiteRequest
{
    public string ProfileId { get; set; } = string.Empty;
}

public class AiWebsiteContent
{
    public HeroSection Hero { get; set; } = new();
    public AboutSection About { get; set; } = new();
    public List<ServiceItem> Services { get; set; } = new();
    public GallerySection Gallery { get; set; } = new();
    public SeoConfig Seo { get; set; } = new();
}
