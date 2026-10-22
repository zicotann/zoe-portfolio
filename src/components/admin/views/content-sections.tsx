"use client";

import { ArrayEditor, ColorChoice, GlobalFields, ImageField, NumberInput, SectionCard, SectionVisibility, Select, StringListEditor, TextArea, TextInput } from "@/components/admin/fields";
import type { AdminViewProps } from "@/components/admin/types";
import { Button } from "@/components/ui/button";
import { getReels } from "@/content/helpers";
import type {
  ClientLogo,
  ExperienceItem,
  ServiceItem,
  SummaryStat,
  Testimonial,
} from "@/content/schema";
import { newId } from "@/lib/id";

const experienceTypeOptions = [
  { value: "Full-time", label: "Full-time" },
  { value: "Contract", label: "Contract" },
  { value: "Freelance", label: "Freelance" },
  { value: "In-house", label: "In-house" },
  { value: "Agency", label: "Agency" },
];

const serviceIconOptions = [
  { value: "video", label: "Video" },
  { value: "strategy", label: "Strategy" },
  { value: "growth", label: "Growth" },
  { value: "creative", label: "Creative" },
];

const clientCategoryOptions = [
  { value: "Client", label: "Client" },
  { value: "Media", label: "Media" },
  { value: "Award", label: "Award" },
];

const availabilityColorOptions = [
  { value: "green", label: "Green", swatch: "bg-emerald-500" },
  { value: "yellow", label: "Yellow", swatch: "bg-amber-400" },
  { value: "red", label: "Red", swatch: "bg-red-500" },
];

export function HeroView({ content, onChange, onNavigate }: AdminViewProps) {
  const hero = content.sections.hero;
  const profile = content.profile;
  const patch = (value: Partial<typeof hero>) =>
    onChange({
      ...content,
      sections: { ...content.sections, hero: { ...hero, ...value } },
    });
  const patchProfile = (value: Partial<typeof profile>) =>
    onChange({ ...content, profile: { ...profile, ...value } });

  return (
    <div className="space-y-5">
      <SectionVisibility
        checked={hero.visible}
        onChange={(visible) => patch({ visible })}
      />
      <GlobalFields
        onNavigate={onNavigate}
        items={[
          { label: "Name", value: profile.name, view: "profile" },
          {
            label: "Location",
            value: `${profile.location} · ${profile.timezone}`,
            view: "profile",
          },
          {
            label: "Booking URL",
            value: profile.calendlyUrl,
            view: "profile",
          },
          {
            label: "Social links",
            value: content.socials.map((social) => social.label).join(", "),
            view: "socials",
          },
        ]}
      />

      <SectionCard
        title="Hero identity"
        description="The copy and portrait shown at the top of the site. Role is also used in the footer and page metadata."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Role"
            value={profile.role}
            onChange={(role) => patchProfile({ role })}
          />
          <TextInput
            label="Availability"
            hint="Leave empty to hide the availability badge from the hero."
            value={profile.availability}
            onChange={(availability) => patchProfile({ availability })}
          />
          <TextInput
            label="Headline — lead"
            hint="The plain part of the hero headline."
            value={profile.headlineLead}
            onChange={(headlineLead) => patchProfile({ headlineLead })}
          />
          <TextInput
            label="Headline — gradient accent"
            hint="Rendered after an “&” with the gradient treatment."
            value={profile.headlineAccent}
            onChange={(headlineAccent) => patchProfile({ headlineAccent })}
          />
        </div>
        <div className="mt-4">
          <TextArea
            label="Subheadline"
            value={profile.subheadline}
            onChange={(subheadline) => patchProfile({ subheadline })}
            rows={3}
          />
        </div>
        <div className="mt-4">
          <ColorChoice
            label="Availability color"
            hint="Sets the colour of the availability badge."
            value={profile.availabilityColor}
            onChange={(value) =>
              patchProfile({
                availabilityColor:
                  value as typeof profile.availabilityColor,
              })
            }
            options={availabilityColorOptions}
          />
        </div>
        <div className="mt-4">
          <ImageField
            label="Portrait image"
            value={profile.portraitImage}
            onChange={(portraitImage) => patchProfile({ portraitImage })}
            aspect="portrait"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Hero call-to-action"
        description="Buttons, labels, and the floating cards beside the portrait."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Primary CTA label"
            value={hero.primaryCtaLabel}
            onChange={(primaryCtaLabel) => patch({ primaryCtaLabel })}
          />
          <TextInput
            label="Primary CTA URL"
            value={hero.primaryCtaHref}
            onChange={(primaryCtaHref) => patch({ primaryCtaHref })}
          />
          <TextInput
            label="Secondary CTA label"
            value={hero.secondaryCtaLabel}
            onChange={(secondaryCtaLabel) => patch({ secondaryCtaLabel })}
          />
          <TextInput
            label="Secondary CTA URL"
            value={hero.secondaryCtaHref}
            onChange={(secondaryCtaHref) => patch({ secondaryCtaHref })}
          />
          <TextInput
            label="Follow label"
            value={hero.followLabel}
            onChange={(followLabel) => patch({ followLabel })}
          />
          <TextInput
            label="Portrait alt text"
            value={hero.portraitAlt}
            onChange={(portraitAlt) => patch({ portraitAlt })}
          />
          <TextInput
            label="Floating stat value"
            value={hero.floatingStatValue}
            onChange={(floatingStatValue) => patch({ floatingStatValue })}
          />
          <TextInput
            label="Floating stat label"
            value={hero.floatingStatLabel}
            onChange={(floatingStatLabel) => patch({ floatingStatLabel })}
          />
          <TextInput
            label="Floating badge"
            value={hero.floatingBadge}
            onChange={(floatingBadge) => patch({ floatingBadge })}
          />
        </div>
      </SectionCard>
    </div>
  );
}

export function MetricsView({ content, onChange }: AdminViewProps) {
  const metrics = content.sections.metrics;
  const patch = (value: Partial<typeof metrics>) =>
    onChange({
      ...content,
      sections: {
        ...content.sections,
        metrics: { ...metrics, ...value },
      },
    });

  return (
    <div className="space-y-5">
      <SectionVisibility
        checked={metrics.visible}
        onChange={(visible) => patch({ visible })}
      />
      <SectionCard
        title="Metrics bar"
        description="The four summary statistics under the hero."
      >
        <ArrayEditor<SummaryStat>
          items={metrics.stats}
          onChange={(stats) => patch({ stats })}
          create={() => ({
            id: newId("stat"),
            label: "New metric",
            value: 0,
            suffix: "",
            description: "",
          })}
          itemLabel={(stat) => `${stat.label} (${stat.value}${stat.suffix})`}
          addLabel="Add metric"
        >
        {(stat, update) => (
          <div className="grid gap-4 sm:grid-cols-2">
            <TextInput
              label="Label"
              value={stat.label}
              onChange={(label) => update({ label })}
            />
            <NumberInput
              label="Value"
              value={stat.value}
              onChange={(value) => update({ value })}
            />
            <TextInput
              label="Prefix"
              value={stat.prefix ?? ""}
              onChange={(prefix) => update({ prefix })}
            />
            <TextInput
              label="Suffix"
              value={stat.suffix ?? ""}
              onChange={(suffix) => update({ suffix })}
            />
            <NumberInput
              label="Decimal places"
              value={stat.decimals ?? 0}
              onChange={(decimals) => update({ decimals })}
              step="1"
            />
            <div className="sm:col-span-2">
              <TextArea
                label="Description"
                value={stat.description}
                onChange={(description) => update({ description })}
                rows={2}
              />
            </div>
          </div>
        )}
        </ArrayEditor>
      </SectionCard>
    </div>
  );
}

export function ClientsView({ content, onChange }: AdminViewProps) {
  const clients = content.sections.clients;
  const patch = (value: Partial<typeof clients>) =>
    onChange({
      ...content,
      sections: {
        ...content.sections,
        clients: { ...clients, ...value },
      },
    });

  return (
    <div className="space-y-5">
      <SectionVisibility
        checked={clients.visible}
        onChange={(visible) => patch({ visible })}
      />
      <SectionCard
        title="Clients & features"
        description="Names in the two logo marquees. Category controls which row they appear in."
      >
        <TextInput
          label="Marquee intro text"
          value={clients.eyebrow}
          onChange={(eyebrow) => patch({ eyebrow })}
        />
        <div className="mt-6">
          <ArrayEditor<ClientLogo>
            items={clients.clients}
            onChange={(next) => patch({ clients: next })}
            create={() => ({
              id: newId("client"),
              name: "New client",
              category: "Client",
            })}
            itemLabel={(client) => client.name}
            addLabel="Add client or feature"
          >
            {(client, update) => (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="Name"
                  value={client.name}
                  onChange={(name) => update({ name })}
                />
                <Select
                  label="Category"
                  value={client.category}
                  onChange={(category) =>
                    update({ category: category as ClientLogo["category"] })
                  }
                  options={clientCategoryOptions}
                />
              </div>
            )}
          </ArrayEditor>
        </div>
      </SectionCard>
    </div>
  );
}

export function ExperienceView({ content, onChange, onNavigate }: AdminViewProps) {
  const experience = content.sections.experience;
  const patch = (value: Partial<typeof experience>) =>
    onChange({
      ...content,
      sections: { ...content.sections, experience: { ...experience, ...value } },
    });

  return (
    <div className="space-y-5">
      <SectionVisibility
        checked={experience.visible}
        onChange={(visible) => patch({ visible })}
      />
      <GlobalFields
        onNavigate={onNavigate}
        items={[
          {
            label: "Resume",
            value: content.profile.resumeUrl,
            view: "profile",
          },
        ]}
      />
      <SectionCard title="Experience section">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Eyebrow"
            value={experience.eyebrow}
            onChange={(eyebrow) => patch({ eyebrow })}
          />
          <TextInput
            label="Résumé button label"
            value={experience.resumeLabel}
            onChange={(resumeLabel) => patch({ resumeLabel })}
          />
        </div>
        <div className="mt-4 space-y-4">
          <TextInput
            label="Heading"
            value={experience.heading}
            onChange={(heading) => patch({ heading })}
          />
          <TextArea
            label="Description"
            value={experience.description}
            onChange={(description) => patch({ description })}
            rows={3}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Services"
        description="The small cards beside the experience timeline."
      >
        <ArrayEditor<ServiceItem>
          items={experience.services}
          onChange={(services) => patch({ services })}
          create={() => ({
            id: newId("service"),
            title: "New service",
            description: "",
            icon: "creative",
          })}
          itemLabel={(service) => service.title}
          addLabel="Add service"
        >
          {(service, update) => (
            <div className="grid gap-4 sm:grid-cols-2">
              <TextInput
                label="Title"
                value={service.title}
                onChange={(title) => update({ title })}
              />
              <Select
                label="Icon"
                value={service.icon}
                onChange={(icon) =>
                  update({ icon: icon as ServiceItem["icon"] })
                }
                options={serviceIconOptions}
              />
              <div className="sm:col-span-2">
                <TextArea
                  label="Description"
                  value={service.description}
                  onChange={(description) => update({ description })}
                  rows={2}
                />
              </div>
            </div>
          )}
        </ArrayEditor>
      </SectionCard>

      <SectionCard
        title="Timeline"
        description="Roles shown in the résumé timeline."
      >
        <ArrayEditor<ExperienceItem>
          items={experience.experience}
          onChange={(items) => patch({ experience: items })}
          create={() => ({
            id: newId("experience"),
            role: "New role",
            company: "",
            period: "",
            location: "",
            type: "Full-time",
            description: "",
            highlights: [""],
          })}
          itemLabel={(job) => `${job.role} · ${job.company}`}
          addLabel="Add experience"
        >
          {(job, update) => (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="Role"
                  value={job.role}
                  onChange={(role) => update({ role })}
                />
                <TextInput
                  label="Company"
                  value={job.company}
                  onChange={(company) => update({ company })}
                />
                <TextInput
                  label="Period"
                  value={job.period}
                  onChange={(period) => update({ period })}
                />
                <TextInput
                  label="Location"
                  value={job.location}
                  onChange={(location) => update({ location })}
                />
                <Select
                  label="Type"
                  value={job.type}
                  onChange={(type) =>
                    update({ type: type as ExperienceItem["type"] })
                  }
                  options={experienceTypeOptions}
                />
              </div>
              <TextArea
                label="Description"
                value={job.description}
                onChange={(description) => update({ description })}
                rows={2}
              />
              <StringListEditor
                label="Highlights"
                items={job.highlights}
                onChange={(highlights) => update({ highlights })}
                addLabel="Add highlight"
              />
            </div>
          )}
        </ArrayEditor>
      </SectionCard>
    </div>
  );
}

export function ReelsView({ content, onChange, onNavigate }: AdminViewProps) {
  const reels = content.sections.reels;
  const patch = (value: Partial<typeof reels>) =>
    onChange({
      ...content,
      sections: { ...content.sections, reels: { ...reels, ...value } },
    });
  const preview = getReels(content.sections.campaigns.campaigns, reels.limit);

  return (
    <div className="space-y-5">
      <SectionVisibility
        checked={reels.visible}
        onChange={(visible) => patch({ visible })}
      />
      <SectionCard
        title="Reels section"
        description="Section copy and how many campaign videos to show."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Eyebrow"
            value={reels.eyebrow}
            onChange={(eyebrow) => patch({ eyebrow })}
          />
          <NumberInput
            label="Maximum reels"
            value={reels.limit}
            onChange={(limit) => patch({ limit: Math.max(1, Math.round(limit)) })}
            step="1"
          />
          <TextInput
            label="Heading — lead"
            value={reels.headingLead}
            onChange={(headingLead) => patch({ headingLead })}
          />
          <TextInput
            label="Heading — gradient accent"
            value={reels.headingAccent}
            onChange={(headingAccent) => patch({ headingAccent })}
          />
        </div>
        <div className="mt-4">
          <TextArea
            label="Description"
            value={reels.description}
            onChange={(description) => patch({ description })}
            rows={3}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Videos appearing here"
        description="Reels are pulled from 9:16 campaign video samples. Edit them in Campaigns."
      >
        <div className="mb-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onNavigate("campaigns")}
          >
            Edit campaign videos
          </Button>
        </div>
        <div className="space-y-2">
          {preview.length ? (
            preview.map((reel) => (
              <div
                key={reel.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium">{reel.title}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {reel.client}
                  </p>
                </div>
                <span className="shrink-0 text-[10px] uppercase tracking-wide text-muted-foreground">
                  9:16
                </span>
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground">
              No 9:16 campaign videos yet.
            </p>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

export function TestimonialsView({ content, onChange }: AdminViewProps) {
  const testimonials = content.sections.testimonials;
  const patch = (value: Partial<typeof testimonials>) =>
    onChange({
      ...content,
      sections: {
        ...content.sections,
        testimonials: { ...testimonials, ...value },
      },
    });

  return (
    <div className="space-y-5">
      <SectionVisibility
        checked={testimonials.visible}
        onChange={(visible) => patch({ visible })}
      />
      <SectionCard title="Testimonials section">
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Eyebrow"
            value={testimonials.eyebrow}
            onChange={(eyebrow) => patch({ eyebrow })}
          />
          <TextInput
            label="Heading"
            value={testimonials.heading}
            onChange={(heading) => patch({ heading })}
          />
        </div>
      </SectionCard>

      <SectionCard title="Testimonials">
        <ArrayEditor<Testimonial>
          items={testimonials.testimonials}
          onChange={(items) => patch({ testimonials: items })}
          create={() => ({
            id: newId("testimonial"),
            quote: "",
            name: "New testimonial",
            title: "",
            company: "",
            initials: "NT",
          })}
          itemLabel={(testimonial) => testimonial.name}
          addLabel="Add testimonial"
        >
          {(testimonial, update) => (
            <div className="space-y-4">
              <TextArea
                label="Quote"
                value={testimonial.quote}
                onChange={(quote) => update({ quote })}
                rows={3}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="Name"
                  value={testimonial.name}
                  onChange={(name) => update({ name })}
                />
                <TextInput
                  label="Initials"
                  value={testimonial.initials}
                  onChange={(initials) => update({ initials })}
                />
                <TextInput
                  label="Job title"
                  value={testimonial.title}
                  onChange={(title) => update({ title })}
                />
                <TextInput
                  label="Company"
                  value={testimonial.company}
                  onChange={(company) => update({ company })}
                />
              </div>
            </div>
          )}
        </ArrayEditor>
      </SectionCard>
    </div>
  );
}

export function ContactView({ content, onChange, onNavigate }: AdminViewProps) {
  const contact = content.sections.contact;
  const patchContact = (value: Partial<typeof contact>) =>
    onChange({
      ...content,
      sections: { ...content.sections, contact: { ...contact, ...value } },
    });
  const patchForm = (value: Partial<typeof contact.form>) =>
    onChange({
      ...content,
      sections: {
        ...content.sections,
        contact: { ...contact, form: { ...contact.form, ...value } },
      },
    });

  return (
    <div className="space-y-5">
      <SectionVisibility
        checked={contact.visible}
        onChange={(visible) => patchContact({ visible })}
      />
      <GlobalFields
        onNavigate={onNavigate}
        items={[
          {
            label: "Email",
            value: content.profile.email,
            view: "profile",
          },
          {
            label: "Booking URL",
            value: content.profile.calendlyUrl,
            view: "profile",
          },
          {
            label: "Location",
            value: `${content.profile.location} · ${content.profile.timezone}`,
            view: "profile",
          },
          {
            label: "Social links",
            value: content.socials.map((social) => social.handle).join(", "),
            view: "socials",
          },
          {
            label: "Resume",
            value: content.profile.resumeUrl,
            view: "profile",
          },
        ]}
      />

      <SectionCard
        title="Contact section"
        description="The heading and intro shown in the contact section. Email, booking URL, and location come from Profile & Identity."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Eyebrow"
            value={contact.eyebrow}
            onChange={(eyebrow) => patchContact({ eyebrow })}
          />
          <TextInput
            label="Booking button label"
            value={contact.bookingLabel}
            onChange={(bookingLabel) => patchContact({ bookingLabel })}
          />
          <TextInput
            label="Heading — lead"
            value={contact.headingLead}
            onChange={(headingLead) => patchContact({ headingLead })}
          />
          <TextInput
            label="Heading — gradient accent"
            value={contact.headingAccent}
            onChange={(headingAccent) => patchContact({ headingAccent })}
          />
          <TextInput
            label="Location prefix"
            hint="Rendered as “{prefix} {location} · {timezone}”."
            value={contact.basedInLabel}
            onChange={(basedInLabel) => patchContact({ basedInLabel })}
          />
        </div>
        <div className="mt-4">
          <TextArea
            label="Description"
            value={contact.description}
            onChange={(description) => patchContact({ description })}
            rows={2}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Contact form copy"
        description="Visible labels, placeholders, button states, and validation messages."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Name label"
            value={contact.form.nameLabel}
            onChange={(nameLabel) => patchForm({ nameLabel })}
          />
          <TextInput
            label="Name placeholder"
            value={contact.form.namePlaceholder}
            onChange={(namePlaceholder) => patchForm({ namePlaceholder })}
          />
          <TextInput
            label="Email label"
            value={contact.form.emailLabel}
            onChange={(emailLabel) => patchForm({ emailLabel })}
          />
          <TextInput
            label="Email placeholder"
            value={contact.form.emailPlaceholder}
            onChange={(emailPlaceholder) => patchForm({ emailPlaceholder })}
          />
          <TextInput
            label="Company label"
            value={contact.form.companyLabel}
            onChange={(companyLabel) => patchForm({ companyLabel })}
          />
          <TextInput
            label="Company placeholder"
            value={contact.form.companyPlaceholder}
            onChange={(companyPlaceholder) => patchForm({ companyPlaceholder })}
          />
          <TextInput
            label="Message label"
            value={contact.form.messageLabel}
            onChange={(messageLabel) => patchForm({ messageLabel })}
          />
          <TextInput
            label="Message placeholder"
            value={contact.form.messagePlaceholder}
            onChange={(messagePlaceholder) =>
              patchForm({ messagePlaceholder })
            }
          />
          <TextInput
            label="Submit label"
            value={contact.form.submitLabel}
            onChange={(submitLabel) => patchForm({ submitLabel })}
          />
          <TextInput
            label="Sent label"
            value={contact.form.sentLabel}
            onChange={(sentLabel) => patchForm({ sentLabel })}
          />
          <TextInput
            label="Name error"
            value={contact.form.errorName}
            onChange={(errorName) => patchForm({ errorName })}
          />
          <TextInput
            label="Email error"
            value={contact.form.errorEmail}
            onChange={(errorEmail) => patchForm({ errorEmail })}
          />
          <TextInput
            label="Message error"
            value={contact.form.errorMessage}
            onChange={(errorMessage) => patchForm({ errorMessage })}
          />
        </div>
      </SectionCard>
    </div>
  );
}

export function FooterView({ content, onChange, onNavigate }: AdminViewProps) {
  const footer = content.sections.footer;
  return (
    <div className="space-y-5">
      <GlobalFields
        onNavigate={onNavigate}
        items={[
          { label: "Name", value: content.profile.name, view: "profile" },
          { label: "Role", value: content.profile.role, view: "hero" },
          {
            label: "Social links",
            value: content.socials.map((social) => social.label).join(", "),
            view: "socials",
          },
        ]}
      />
      <SectionCard title="Footer">
        <TextInput
          label="Rights label"
          hint="Rendered after “© {year} {name}.”"
          value={footer.rightsLabel}
          onChange={(rightsLabel) =>
            onChange({
              ...content,
              sections: {
                ...content.sections,
                footer: { ...footer, rightsLabel },
              },
            })
          }
        />
      </SectionCard>
    </div>
  );
}
