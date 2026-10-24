"use client";

import {
  ArrayEditor,
  ImageField,
  NumberInput,
  SectionCard,
  SectionVisibility,
  Select,
  StringListEditor,
  TextArea,
  TextInput,
  Toggle,
} from "@/components/admin/fields";
import type { AdminViewProps } from "@/components/admin/types";
import type {
  Campaign,
  CampaignCategory,
  CampaignsContent,
  ImageAspectRatio,
  ImageSample,
  ImageSource,
  Metric,
  VideoSample,
  VideoSource,
} from "@/content/schema";
import { newId, slugify } from "@/lib/id";
import {
  getInstagramEmbedUrl,
  getLinkedInEmbedUrl,
} from "@/lib/video-embed";

const aspectRatioOptions = [
  { value: "9:16", label: "9:16 — vertical" },
  { value: "16:9", label: "16:9 — landscape" },
  { value: "1:1", label: "1:1 — square" },
];

const imageAspectRatioOptions = [
  { value: "1:1", label: "1:1 — square (default)" },
  { value: "4:5", label: "4:5 — portrait" },
  { value: "16:9", label: "16:9 — landscape" },
  { value: "9:16", label: "9:16 — vertical" },
];

const videoSourceOptions = [
  { value: "instagram", label: "Instagram post" },
  { value: "linkedin", label: "LinkedIn post" },
  { value: "url", label: "Hosted video URL" },
];

const imageSourceOptions = [
  { value: "url", label: "Hosted image URL" },
  { value: "instagram", label: "Instagram post" },
  { value: "linkedin", label: "LinkedIn post" },
];

export function CampaignsView({ content, onChange }: AdminViewProps) {
  const campaignsContent = content.sections.campaigns;
  const categories = content.categories;

  const patch = (value: Partial<CampaignsContent>) =>
    onChange({
      ...content,
      sections: {
        ...content.sections,
        campaigns: { ...campaignsContent, ...value },
      },
    });

  const patchCaseStudy = (value: Partial<CampaignsContent["caseStudy"]>) =>
    patch({ caseStudy: { ...campaignsContent.caseStudy, ...value } });

  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const createCampaign = (): Campaign => {
    const stamp = Date.now().toString(36);
    return {
      id: newId("camp"),
      slug: `new-campaign-${stamp}`,
      clientName: "New campaign",
      clientLogo: "NC",
      categoryId: categories[0]?.id ?? "",
      role: "",
      period: "",
      summary: "",
      heroImage: "",
      coverImage: "",
      featured: false,
      keyMetrics: [],
      deliverables: [],
      videoSamples: [],
      imageSamples: [],
      fullStrategyBreakdown: {
        theChallenge: "",
        theStrategy: "",
        theResults: "",
      },
    };
  };

  return (
    <div className="space-y-5">
      <SectionVisibility
        checked={campaignsContent.visible}
        onChange={(visible) => patch({ visible })}
        previewField="sections.campaigns.visible"
      />
      <SectionCard
        title="Campaign grid copy"
        description="Section headings, filter labels, and card labels."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Eyebrow"
            value={campaignsContent.eyebrow}
            onChange={(eyebrow) => patch({ eyebrow })}
            previewField="sections.campaigns.eyebrow"
          />
          <TextInput
            label="All filter label"
            value={campaignsContent.allLabel}
            onChange={(allLabel) => patch({ allLabel })}
            previewField="sections.campaigns.allLabel"
          />
          <TextInput
            label="Heading — lead"
            value={campaignsContent.headingLead}
            onChange={(headingLead) => patch({ headingLead })}
            previewField="sections.campaigns.headingLead"
          />
          <TextInput
            label="Heading — gradient accent"
            value={campaignsContent.headingAccent}
            onChange={(headingAccent) => patch({ headingAccent })}
            previewField="sections.campaigns.headingAccent"
          />
          <TextInput
            label="Featured badge label"
            value={campaignsContent.featuredLabel}
            onChange={(featuredLabel) => patch({ featuredLabel })}
            previewField="sections.campaigns.featuredLabel"
          />
          <TextInput
            label="Card link label"
            value={campaignsContent.viewLabel}
            onChange={(viewLabel) => patch({ viewLabel })}
            previewField="sections.campaigns.viewLabel"
          />
        </div>
        <div className="mt-4">
          <TextArea
            label="Description"
            value={campaignsContent.description}
            onChange={(description) => patch({ description })}
            rows={2}
            previewField="sections.campaigns.description"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Case study labels"
        description="Shared by the campaign sheet and standalone case-study pages."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Page title suffix"
            hint="Used in the browser title: “{client name} — {suffix}”."
            value={campaignsContent.caseStudy.pageTitleSuffix}
            onChange={(pageTitleSuffix) =>
              patchCaseStudy({ pageTitleSuffix })
            }
          />
          <TextInput
            label="Key achievements"
            value={campaignsContent.caseStudy.keyAchievementsLabel}
            onChange={(keyAchievementsLabel) =>
              patchCaseStudy({ keyAchievementsLabel })
            }
          />
          <TextInput
            label="Strategy section"
            value={campaignsContent.caseStudy.strategyLabel}
            onChange={(strategyLabel) => patchCaseStudy({ strategyLabel })}
          />
          <TextInput
            label="Challenge heading"
            value={campaignsContent.caseStudy.challengeHeading}
            onChange={(challengeHeading) =>
              patchCaseStudy({ challengeHeading })
            }
          />
          <TextInput
            label="Strategy heading"
            value={campaignsContent.caseStudy.strategyHeading}
            onChange={(strategyHeading) =>
              patchCaseStudy({ strategyHeading })
            }
          />
          <TextInput
            label="Results heading"
            value={campaignsContent.caseStudy.resultsHeading}
            onChange={(resultsHeading) => patchCaseStudy({ resultsHeading })}
          />
          <TextInput
            label="Video showcase heading"
            value={campaignsContent.caseStudy.videoShowcaseHeading}
            onChange={(videoShowcaseHeading) =>
              patchCaseStudy({ videoShowcaseHeading })
            }
          />
          <TextInput
            label="Content showcase heading"
            value={campaignsContent.caseStudy.contentSamplesHeading}
            onChange={(contentSamplesHeading) =>
              patchCaseStudy({ contentSamplesHeading })
            }
          />
          <TextInput
            label="Deliverables label"
            value={campaignsContent.caseStudy.deliverablesLabel}
            onChange={(deliverablesLabel) =>
              patchCaseStudy({ deliverablesLabel })
            }
          />
          <TextInput
            label="Close button label"
            value={campaignsContent.caseStudy.closeLabel}
            onChange={(closeLabel) => patchCaseStudy({ closeLabel })}
          />
          <TextInput
            label="Back link label"
            value={campaignsContent.caseStudy.backLabel}
            onChange={(backLabel) => patchCaseStudy({ backLabel })}
          />
          <TextInput
            label="Bottom CTA heading"
            value={campaignsContent.caseStudy.ctaHeading}
            onChange={(ctaHeading) => patchCaseStudy({ ctaHeading })}
          />
          <TextInput
            label="Bottom CTA label"
            value={campaignsContent.caseStudy.ctaLabel}
            onChange={(ctaLabel) => patchCaseStudy({ ctaLabel })}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Campaigns"
        description="Add, edit, reorder, or remove campaigns. Every campaign becomes a case-study page."
      >
        <ArrayEditor<Campaign>
          items={campaignsContent.campaigns}
          onChange={(campaigns) => patch({ campaigns })}
          create={createCampaign}
          itemLabel={(campaign) => campaign.clientName}
          addLabel="Add campaign"
          defaultOpenFirst={false}
          glowWhenOpen
        >
          {(campaign, update) => (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="Client name"
                  value={campaign.clientName}
                  onChange={(clientName) => {
                    const patchValue: Partial<Campaign> = { clientName };
                    if (
                      campaign.slug.startsWith("new-campaign-") &&
                      clientName.trim()
                    ) {
                      patchValue.slug = slugify(clientName);
                    }
                    update(patchValue);
                  }}
                  previewField={`sections.campaigns.campaigns.${campaign.id}.clientName`}
                />
                <TextInput
                  label="Slug"
                  hint="Changing this changes the case-study URL."
                  value={campaign.slug}
                  onChange={(slug) => update({ slug: slugify(slug) })}
                  mono
                />
                <TextInput
                  label="Client logo initials"
                  value={campaign.clientLogo}
                  onChange={(clientLogo) => update({ clientLogo })}
                />
                <Select
                  label="Category"
                  value={campaign.categoryId}
                  onChange={(categoryId) => update({ categoryId })}
                  options={categoryOptions}
                  previewField={`sections.campaigns.campaigns.${campaign.id}.categoryId`}
                />
                <TextInput
                  label="Role"
                  value={campaign.role}
                  onChange={(role) => update({ role })}
                />
                <TextInput
                  label="Period"
                  value={campaign.period}
                  onChange={(period) => update({ period })}
                />
              </div>

              <Toggle
                label="Featured campaign"
                hint="Featured campaigns show the Featured badge."
                checked={campaign.featured}
                onChange={(featured) => update({ featured })}
                previewField={`sections.campaigns.campaigns.${campaign.id}.featured`}
              />

              <TextArea
                label="Summary"
                value={campaign.summary}
                onChange={(summary) => update({ summary })}
                rows={3}
                previewField={`sections.campaigns.campaigns.${campaign.id}.summary`}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <ImageField
                  label="Cover image (grid card)"
                  value={campaign.coverImage}
                  onChange={(coverImage) => update({ coverImage })}
                  previewField={`sections.campaigns.campaigns.${campaign.id}.coverImage`}
                />
                <ImageField
                  label="Hero image (case study)"
                  value={campaign.heroImage}
                  onChange={(heroImage) => update({ heroImage })}
                />
              </div>

              <div className="space-y-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Strategy breakdown
                </p>
                <TextArea
                  label="The challenge"
                  value={campaign.fullStrategyBreakdown.theChallenge}
                  onChange={(theChallenge) =>
                    update({
                      fullStrategyBreakdown: {
                        ...campaign.fullStrategyBreakdown,
                        theChallenge,
                      },
                    })
                  }
                  rows={3}
                />
                <TextArea
                  label="The strategy"
                  value={campaign.fullStrategyBreakdown.theStrategy}
                  onChange={(theStrategy) =>
                    update({
                      fullStrategyBreakdown: {
                        ...campaign.fullStrategyBreakdown,
                        theStrategy,
                      },
                    })
                  }
                  rows={3}
                />
                <TextArea
                  label="The results"
                  value={campaign.fullStrategyBreakdown.theResults}
                  onChange={(theResults) =>
                    update({
                      fullStrategyBreakdown: {
                        ...campaign.fullStrategyBreakdown,
                        theResults,
                      },
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Key metrics
                </p>
                <ArrayEditor<Metric>
                  items={campaign.keyMetrics}
                  onChange={(keyMetrics) => update({ keyMetrics })}
                  create={() => ({
                    id: newId("metric"),
                    label: "New metric",
                    value: 0,
                    suffix: "",
                  })}
                  itemLabel={(metric) => metric.label}
                  addLabel="Add metric"
                  defaultOpenFirst={false}
                >
                  {(metric, updateMetric) => (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <TextInput
                        label="Label"
                        value={metric.label}
                        onChange={(label) => updateMetric({ label })}
                        previewField={`sections.campaigns.campaigns.${campaign.id}.keyMetrics.${metric.id}.label`}
                      />
                      <NumberInput
                        label="Value"
                        value={metric.value}
                        onChange={(value) => updateMetric({ value })}
                        previewField={`sections.campaigns.campaigns.${campaign.id}.keyMetrics.${metric.id}.value`}
                      />
                      <TextInput
                        label="Prefix"
                        value={metric.prefix ?? ""}
                        onChange={(prefix) => updateMetric({ prefix })}
                        previewField={`sections.campaigns.campaigns.${campaign.id}.keyMetrics.${metric.id}.prefix`}
                      />
                      <TextInput
                        label="Suffix"
                        value={metric.suffix}
                        onChange={(suffix) => updateMetric({ suffix })}
                        previewField={`sections.campaigns.campaigns.${campaign.id}.keyMetrics.${metric.id}.suffix`}
                      />
                      <NumberInput
                        label="Decimal places"
                        value={metric.decimals ?? 0}
                        onChange={(decimals) => updateMetric({ decimals })}
                        step="1"
                        previewField={`sections.campaigns.campaigns.${campaign.id}.keyMetrics.${metric.id}.decimals`}
                      />
                    </div>
                  )}
                </ArrayEditor>
              </div>

              <StringListEditor
                label="Deliverables"
                items={campaign.deliverables}
                onChange={(deliverables) => update({ deliverables })}
                addLabel="Add deliverable"
              />

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Video samples
                </p>
                <ArrayEditor<VideoSample>
                  items={campaign.videoSamples ?? []}
                  onChange={(videoSamples) => update({ videoSamples })}
                  create={() => ({
                    id: newId("video"),
                    title: "New video",
                    aspectRatio: "9:16",
                    source: "instagram",
                  })}
                  itemLabel={(video) => video.title}
                  addLabel="Add video sample"
                  defaultOpenFirst={false}
                >
                  {(video, updateVideo) => (
                    <div className="space-y-4">
                      <TextInput
                        label="Title"
                        value={video.title}
                        onChange={(title) => updateVideo({ title })}
                      />
                      <Select
                        label="Aspect ratio"
                        value={video.aspectRatio}
                        onChange={(aspectRatio) =>
                          updateVideo({
                            aspectRatio:
                              aspectRatio as VideoSample["aspectRatio"],
                          })
                        }
                        options={aspectRatioOptions}
                      />
                      {/* TODO: Add playback for hosted video URLs. */}
                      <Select
                        label="Video source"
                        hint="Instagram and LinkedIn posts supply their own thumbnail and open in an embedded player. Hosted videos use their first frame; playback is coming later."
                        value={video.source ?? "url"}
                        onChange={(source) =>
                          updateVideo({ source: source as VideoSource })
                        }
                        options={videoSourceOptions}
                      />
                      {video.source === "instagram" ||
                      video.source === "linkedin" ? (
                        <TextInput
                          label={
                            video.source === "instagram"
                              ? "Instagram post URL"
                              : "LinkedIn post URL"
                          }
                          hint="Paste the public post or reel URL. It opens in an embedded player on the site."
                          value={video.postUrl ?? ""}
                          onChange={(postUrl) => updateVideo({ postUrl })}
                          mono
                        />
                      ) : (
                        <TextInput
                          label="Video URL"
                          hint="Direct link to a hosted video file. Playback will be integrated later."
                          value={video.videoUrl ?? ""}
                          onChange={(videoUrl) => updateVideo({ videoUrl })}
                          mono
                        />
                      )}
                    </div>
                  )}
                </ArrayEditor>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Content showcase images
                </p>
                <ArrayEditor<ImageSample>
                  items={campaign.imageSamples ?? []}
                  onChange={(imageSamples) => update({ imageSamples })}
                  create={() => ({
                    id: newId("image"),
                    caption: "New image",
                    source: "url",
                    aspectRatio: "1:1",
                  })}
                  itemLabel={(image) => image.caption}
                  addLabel="Add image sample"
                  defaultOpenFirst={false}
                >
                  {(image, updateImage) => {
                    const source = (image.source ?? "url") as ImageSource;

                    return (
                      <div className="space-y-4">
                        <TextInput
                          label="Caption"
                          value={image.caption}
                          onChange={(caption) => updateImage({ caption })}
                        />
                        <Select
                          label="Image source"
                          hint="Hosted images use the selected aspect ratio. Instagram and LinkedIn posts render as official embeds."
                          value={source}
                          onChange={(value) =>
                            updateImage({ source: value as ImageSource })
                          }
                          options={imageSourceOptions}
                        />
                        {source === "url" ? (
                          <div className="space-y-4">
                            <Select
                              label="Aspect ratio"
                              hint="Applies to hosted images only."
                              value={image.aspectRatio ?? "1:1"}
                              onChange={(value) =>
                                updateImage({
                                  aspectRatio: value as ImageAspectRatio,
                                })
                              }
                              options={imageAspectRatioOptions}
                            />
                            <ImageField
                              label="Image"
                              hint="Paste a hosted image URL, upload an image, or choose an existing image from Cloudflare R2."
                              value={image.imageUrl ?? ""}
                              onChange={(imageUrl) =>
                                updateImage({ imageUrl })
                              }
                              aspect={image.aspectRatio ?? "1:1"}
                            />
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <TextInput
                              label={
                                source === "instagram"
                                  ? "Instagram post URL"
                                  : "LinkedIn post URL"
                              }
                              hint={
                                source === "instagram"
                                  ? "Paste the public post or reel URL. It renders as an official Instagram embed; multi-image posts get carousel arrows."
                                  : "Paste the public post URL. It renders as an official LinkedIn embed."
                              }
                              value={image.postUrl ?? ""}
                              onChange={(postUrl) =>
                                updateImage({ postUrl })
                              }
                              mono
                            />
                            <SocialImagePreview
                              key={`${source}:${image.postUrl ?? ""}`}
                              source={source}
                              postUrl={image.postUrl ?? ""}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }}
                </ArrayEditor>
              </div>
            </div>
          )}
        </ArrayEditor>
      </SectionCard>
    </div>
  );
}

function SocialImagePreview({
  source,
  postUrl,
}: {
  source: ImageSource;
  postUrl: string;
}) {
  if (source === "url") return null;

  const platform = source === "instagram" ? "Instagram" : "LinkedIn";
  const trimmed = postUrl.trim();

  if (!trimmed) {
    return (
      <p className="rounded-xl border border-border bg-secondary/40 p-3 text-[11px] leading-relaxed text-muted-foreground">
        Paste a public {platform} post URL to see a live embed preview.
      </p>
    );
  }

  const embedUrl =
    source === "instagram"
      ? getInstagramEmbedUrl(trimmed)
      : getLinkedInEmbedUrl(trimmed);

  if (!embedUrl) {
    return (
      <p className="rounded-xl border border-border bg-secondary/40 p-3 text-[11px] leading-relaxed text-destructive">
        This does not look like a valid {platform} post URL. Use the public post
        URL copied from {platform}.
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="w-full max-w-sm overflow-hidden rounded-xl border border-border bg-secondary">
        <iframe
          src={embedUrl}
          title={`${platform} post preview`}
          loading="lazy"
          allow="encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          scrolling="no"
          className="h-[480px] w-full border-0"
        />
      </div>
      <p className="text-[11px] leading-relaxed text-muted-foreground">
        Official {platform} embed preview. The live site renders this embed in
        the content showcase.
      </p>
    </div>
  );
}

export function CategoriesView({ content, onChange }: AdminViewProps) {
  const usedCategories = new Set(
    content.sections.campaigns.campaigns.map(
      (campaign) => campaign.categoryId,
    ),
  );

  return (
    <div className="space-y-5">
      <SectionCard
        title="Campaign Categories"
        description="Campaigns choose a category from a dropdown. Category names also appear on filter chips and case-study badges."
      >
        <ArrayEditor<CampaignCategory>
          items={content.categories}
          onChange={(categories) => onChange({ ...content, categories })}
          create={() => ({ id: newId("cat"), name: "New category" })}
          itemLabel={(category) => category.name}
          addLabel="Add category"
          deleteBlocked={(category) => {
            if (!usedCategories.has(category.id)) return null;
            const count = content.sections.campaigns.campaigns.filter(
              (campaign) => campaign.categoryId === category.id,
            ).length;
            return `“${category.name}” is used by ${count} campaign${
              count === 1 ? "" : "s"
            }. Reassign those campaigns before deleting this category.`;
          }}
        >
          {(category, update) => (
            <div className="space-y-3">
              <TextInput
                label="Category name"
                value={category.name}
                onChange={(name) => update({ name })}
                previewField={`categories.${category.id}.name`}
              />
              <p className="text-[11px] text-muted-foreground">
                ID: <code>{category.id}</code>
              </p>
            </div>
          )}
        </ArrayEditor>
      </SectionCard>
    </div>
  );
}
