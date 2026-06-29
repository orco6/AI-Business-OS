import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { API_BASE, type WebsiteData } from "@/features/website/types";
import { WebsiteRenderer } from "./website-renderer";

type PreviewPageProps = {
  params: Promise<{ profileId: string }>;
};

async function fetchWebsite(profileId: string): Promise<WebsiteData | null> {
  const response = await fetch(`${API_BASE}/api/website/${profileId}`, {
    cache: "no-store",
  });

  if (response.ok) {
    return response.json();
  }

  return null;
}

async function generateWebsite(profileId: string): Promise<WebsiteData | null> {
  const response = await fetch(`${API_BASE}/api/website/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profileId }),
    cache: "no-store",
  });

  if (response.ok) {
    return response.json();
  }

  return null;
}

export async function generateMetadata({
  params,
}: PreviewPageProps): Promise<Metadata> {
  const { profileId } = await params;
  const websiteData = (await fetchWebsite(profileId)) ?? (await generateWebsite(profileId));

  if (!websiteData) {
    return { title: "אתר עסק" };
  }

  return {
    title: websiteData.seo.metaTitle || websiteData.hero.headline,
    description: websiteData.seo.metaDescription,
    keywords: websiteData.seo.keywords,
  };
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { profileId } = await params;

  let websiteData = await fetchWebsite(profileId);

  if (!websiteData) {
    websiteData = await generateWebsite(profileId);
  }

  if (!websiteData) {
    notFound();
  }

  return <WebsiteRenderer websiteData={websiteData} />;
}
