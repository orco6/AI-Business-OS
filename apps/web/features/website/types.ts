export type HeroSection = {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaAction: string;
  backgroundImageCategory: string;
};

export type AboutSection = {
  title: string;
  story: string;
  ownerName: string;
  highlights: string[];
};

export type ServiceItem = {
  name: string;
  description: string;
  price: string;
  imageCategory: string;
};

export type GallerySection = {
  title: string;
  photoUrls: string[];
};

export type ContactSection = {
  title: string;
  phone: string;
  whatsApp: string;
  address: string;
  city: string;
  hours: string;
  googleMapsUrl: string;
};

export type ThemeConfig = {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  textColor: string;
  bgColor: string;
  fontHeading: string;
  fontBody: string;
  layoutStyle: string;
};

export type SeoConfig = {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
};

export type WebsiteData = {
  hero: HeroSection;
  about: AboutSection;
  services: ServiceItem[];
  gallery: GallerySection;
  contact: ContactSection;
  theme: ThemeConfig;
  seo: SeoConfig;
  businessName: string;
  businessSlug: string;
  generatedAt: string;
  photosByCategory: Record<string, string[]>;
};

export const API_BASE = "http://localhost:5063";
