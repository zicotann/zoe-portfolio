import type {
  Campaign,
  CampaignCategory,
  SiteContent,
  VideoSample,
} from "./schema";

export function getCategoryName(
  categories: CampaignCategory[],
  categoryId: string,
): string {
  return (
    categories.find((category) => category.id === categoryId)?.name ??
    "Uncategorized"
  );
}

export function getCampaignBySlug(
  campaigns: Campaign[],
  slug: string,
): Campaign | undefined {
  return campaigns.find((campaign) => campaign.slug === slug);
}

export function getFeaturedCampaigns(campaigns: Campaign[]): Campaign[] {
  return campaigns.filter((campaign) => campaign.featured);
}

export function getReels(
  campaigns: Campaign[],
  limit: number,
): Array<VideoSample & { client: string }> {
  return campaigns
    .flatMap((campaign) =>
      (campaign.videoSamples ?? []).map((video) => ({
        ...video,
        client: campaign.clientName,
      })),
    )
    .filter((video) => video.aspectRatio === "9:16")
    .slice(0, limit);
}

export function getUsedCategoryIds(content: SiteContent): Set<string> {
  return new Set(
    content.sections.campaigns.campaigns.map((campaign) => campaign.categoryId),
  );
}
