export type HeroSection = {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaAction: string;
  backgroundImageCategory: string;
  heroPhotoUrl?: string;
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

export type SocialProofSection = {
  title: string;
  screenshotUrls: string[];
  reviews: ReviewItem[];
};

export type ReviewItem = {
  text: string;
  author: string;
  stars: number;
};

export type NumbersSection = {
  title: string;
  stats: StatItem[];
};

export type StatItem = {
  value: string;
  label: string;
};

export type MenuSection = {
  title: string;
  displayMode?: "photos" | "manual" | "url" | "";
  menuUrl: string;
  menuPhotos: string[];
  categories: MenuCategory[];
  hasReservations: boolean;
  reservationLink: string;
  reservationPhone: string;
};

export type MenuCategory = {
  name: string;
  items: MenuItem[];
};

export type MenuItem = {
  name: string;
  description: string;
  price: string;
};

export type BeforeAfterPair = {
  beforeUrl: string;
  afterUrl: string;
  label?: string;
};

export type BeforeAfterSection = {
  title: string;
  pairs: BeforeAfterPair[];
};

export type NavLink = {
  label: string;
  href: string;
};

export type NavbarConfig = {
  links: NavLink[];
  ctaText: string;
  ctaHref: string;
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
  socialProof?: SocialProofSection;
  numbers?: NumbersSection;
  menu?: MenuSection;
  beforeAfter?: BeforeAfterSection;
  navbar?: NavbarConfig;
  instagramUrl?: string;
};

export const API_BASE = "http://localhost:5063";
