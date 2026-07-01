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
    public SocialProofSection? SocialProof { get; set; }
    public NumbersSection? Numbers { get; set; }
    public MenuSection? Menu { get; set; }
    public BeforeAfterSection? BeforeAfter { get; set; }
    public NavbarConfig Navbar { get; set; } = new();
    public string InstagramUrl { get; set; } = string.Empty;
}

public class HeroSection
{
    public string Headline { get; set; } = string.Empty;
    public string Subheadline { get; set; } = string.Empty;
    public string CtaText { get; set; } = string.Empty;
    public string CtaAction { get; set; } = string.Empty;
    public string BackgroundImageCategory { get; set; } = string.Empty;
    public string HeroPhotoUrl { get; set; } = string.Empty;
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

public class SocialProofSection
{
    public string Title { get; set; } = "מה אומרים עלינו";
    public List<string> ScreenshotUrls { get; set; } = new();
    public List<ReviewItem> Reviews { get; set; } = new();
}

public class ReviewItem
{
    public string Text { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public int Stars { get; set; } = 5;
}

public class NumbersSection
{
    public string Title { get; set; } = "במספרים";
    public List<StatItem> Stats { get; set; } = new();
}

public class StatItem
{
    public string Value { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
}

public class MenuSection
{
    public string Title { get; set; } = "התפריט שלנו";
    public string DisplayMode { get; set; } = string.Empty;
    public string MenuUrl { get; set; } = string.Empty;
    public List<string> MenuPhotos { get; set; } = new();
    public List<MenuCategory> Categories { get; set; } = new();
    public bool HasReservations { get; set; }
    public string ReservationLink { get; set; } = string.Empty;
    public string ReservationPhone { get; set; } = string.Empty;
}

public class MenuCategory
{
    public string Name { get; set; } = string.Empty;
    public List<MenuItem> Items { get; set; } = new();
}

public class MenuItem
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
}

public class BeforeAfterSection
{
    public string Title { get; set; } = "לפני ואחרי";
    public List<BeforeAfterPair> Pairs { get; set; } = new();
}

public class BeforeAfterPair
{
    public string BeforeUrl { get; set; } = string.Empty;
    public string AfterUrl { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
}

public class NavbarConfig
{
    public List<NavLink> Links { get; set; } = new();
    public string CtaText { get; set; } = "צור קשר";
    public string CtaHref { get; set; } = "#contact";
}

public class NavLink
{
    public string Label { get; set; } = string.Empty;
    public string Href { get; set; } = string.Empty;
}

public class AiWebsiteContent
{
    public HeroSection Hero { get; set; } = new();
    public AboutSection About { get; set; } = new();
    public List<ServiceItem> Services { get; set; } = new();
    public GallerySection Gallery { get; set; } = new();
    public SeoConfig Seo { get; set; } = new();
    public List<ReviewItem> SocialProofReviews { get; set; } = new();
}
