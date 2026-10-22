"use client";

import {
  ArrayEditor,
  ImageField,
  NumberInput,
  SectionCard,
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
  ImageSample,
  Metric,
  VideoSample,
} from "@/content/schema";
import { newId, slugify } from "@/lib/id";

const aspectRatioOptions = [
  { value: "9:16", label: "9:16 — vertical" },
  { value: "16:9", label: "16:9 — landscape" },
  { value: "1:1", label: "1:1 — square" },
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
      <SectionCard
        title="Campaign grid copy"
        description="Section headings, filter labels, and card labels."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Eyebrow"
            value={campaignsContent.eyebrow}
            onChange={(eyebrow) => patch({ eyebrow })}
          />
          <TextInput
            label="All filter label"
            value={campaignsContent.allLabel}
            onChange={(allLabel) => patch({ allLabel })}
          />
          <TextInput
            label="Heading — lead"
            value={campaignsContent.headingLead}
            onChange={(headingLead) => patch({ headingLead })}
          />
          <TextInput
            label="Heading — gradient accent"
            value={campaignsContent.headingAccent}
            onChange={(headingAccent) => patch({ headingAccent })}
          />
          <TextInput
            label="Featured badge label"
            value={campaignsContent.featuredLabel}
            onChange={(featuredLabel) => patch({ featuredLabel })}
          />
          <TextInput
            label="Card link label"
            value={campaignsContent.viewLabel}
            onChange={(viewLabel) => patch({ viewLabel })}
          />
        </div>
        <div className="mt-4">
          <TextArea
            label="Description"
            value={campaignsContent.description}
            onChange={(description) => patch({ description })}
            rows={2}
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
            label="Content samples heading"
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
              />

              <TextArea
                label="Summary"
                value={campaign.summary}
                onChange={(summary) => update({ summary })}
                rows={3}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <ImageField
                  label="Cover image (grid card)"
                  value={campaign.coverImage}
                  onChange={(coverImage) => update({ coverImage })}
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
                      />
                      <NumberInput
                        label="Value"
                        value={metric.value}
                        onChange={(value) => updateMetric({ value })}
                      />
                      <TextInput
                        label="Prefix"
                        value={metric.prefix ?? ""}
                        onChange={(prefix) => updateMetric({ prefix })}
                      />
                      <TextInput
                        label="Suffix"
                        value={metric.suffix}
                        onChange={(suffix) => updateMetric({ suffix })}
                      />
                      <NumberInput
                        label="Decimal places"
                        value={metric.decimals ?? 0}
                        onChange={(decimals) => updateMetric({ decimals })}
                        step="1"
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
                    thumbnail: "",
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
                      <ImageField
                        label="Thumbnail"
                        value={video.thumbnail}
                        onChange={(thumbnail) => updateVideo({ thumbnail })}
                        aspect="portrait"
                      />
                      <div className="grid gap-4 sm:grid-cols-2">
                        <TextInput
                          label="Video URL (optional)"
                          value={video.videoUrl ?? ""}
                          onChange={(videoUrl) => updateVideo({ videoUrl })}
                          mono
                        />
                        <TextInput
                          label="Embed URL (optional)"
                          value={video.embedUrl ?? ""}
                          onChange={(embedUrl) => updateVideo({ embedUrl })}
                          mono
                        />
                      </div>
                    </div>
                  )}
                </ArrayEditor>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Image samples
                </p>
                <ArrayEditor<ImageSample>
                  items={campaign.imageSamples ?? []}
                  onChange={(imageSamples) => update({ imageSamples })}
                  create={() => ({
                    id: newId("image"),
                    caption: "New image",
                    imageUrl: "",
                  })}
                  itemLabel={(image) => image.caption}
                  addLabel="Add image sample"
                  defaultOpenFirst={false}
                >
                  {(image, updateImage) => (
                    <div className="space-y-4">
                      <TextInput
                        label="Caption"
                        value={image.caption}
                        onChange={(caption) => updateImage({ caption })}
                      />
                      <ImageField
                        label="Image"
                        value={image.imageUrl}
                        onChange={(imageUrl) => updateImage({ imageUrl })}
                        aspect="square"
                      />
                    </div>
                  )}
                </ArrayEditor>
              </div>
            </div>
          )}
        </ArrayEditor>
      </SectionCard>
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
        title="Campaign categories"
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
