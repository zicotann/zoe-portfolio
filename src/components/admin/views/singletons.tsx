"use client";

import { ArrayEditor, Field, ImageField, SectionCard, Select, TextArea, TextInput, Toggle } from "@/components/admin/fields";
import type { AdminViewProps } from "@/components/admin/types";
import type { NavLink, SocialLink } from "@/content/schema";
import { newId } from "@/lib/id";

const navIconOptions = [
  { value: "work", label: "Work" },
  { value: "metrics", label: "Metrics" },
  { value: "experience", label: "Experience" },
  { value: "reels", label: "Reels" },
  { value: "testimonials", label: "Testimonials" },
  { value: "contact", label: "Contact" },
  { value: "mail", label: "Mail" },
  { value: "link", label: "Link" },
];

const socialPlatformOptions = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "email", label: "Email" },
];

export function ProfileView({ content, onChange }: AdminViewProps) {
  const profile = content.profile;
  const patch = (value: Partial<typeof profile>) =>
    onChange({ ...content, profile: { ...profile, ...value } });

  return (
    <div className="space-y-5">
      <SectionCard
        title="Profile & identity"
        description="These fields are used across the hero, header, footer, metadata, and contact section."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <TextInput
            label="Full name"
            value={profile.name}
            onChange={(name) => patch({ name })}
          />
          <TextInput
            label="First name"
            value={profile.firstName}
            onChange={(firstName) => patch({ firstName })}
          />
          <TextInput
            label="Role"
            value={profile.role}
            onChange={(role) => patch({ role })}
          />
          <TextInput
            label="Availability label"
            value={profile.availabilityLabel}
            onChange={(availabilityLabel) => patch({ availabilityLabel })}
          />
          <TextInput
            label="Headline — lead"
            hint="The plain part of the hero headline."
            value={profile.headlineLead}
            onChange={(headlineLead) => patch({ headlineLead })}
          />
          <TextInput
            label="Headline — gradient accent"
            hint="Rendered after an “&” with the gradient treatment."
            value={profile.headlineAccent}
            onChange={(headlineAccent) => patch({ headlineAccent })}
          />
        </div>
        <div className="mt-4">
          <TextArea
            label="Subheadline"
            value={profile.subheadline}
            onChange={(subheadline) => patch({ subheadline })}
            rows={3}
          />
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <Toggle
            label="Available for projects"
            checked={profile.available}
            onChange={(available) => patch({ available })}
          />
          <TextInput
            label="Location"
            value={profile.location}
            onChange={(location) => patch({ location })}
          />
          <TextInput
            label="Timezone"
            value={profile.timezone}
            onChange={(timezone) => patch({ timezone })}
          />
          <TextInput
            label="Email"
            value={profile.email}
            onChange={(email) => patch({ email })}
          />
          <TextInput
            label="Booking URL"
            value={profile.calendlyUrl}
            onChange={(calendlyUrl) => patch({ calendlyUrl })}
          />
          <TextInput
            label="Résumé URL"
            value={profile.resumeUrl}
            onChange={(resumeUrl) => patch({ resumeUrl })}
            mono
          />
        </div>
        <div className="mt-4">
          <ImageField
            label="Portrait image"
            value={profile.portraitImage}
            onChange={(portraitImage) => patch({ portraitImage })}
            aspect="portrait"
          />
        </div>
      </SectionCard>
    </div>
  );
}

export function NavigationView({ content, onChange }: AdminViewProps) {
  const navigation = content.navigation;

  return (
    <SectionCard
      title="Navigation"
      description="Controls the desktop nav, mobile dock, and booking call-to-action."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Booking CTA label"
          value={navigation.ctaLabel}
          onChange={(ctaLabel) =>
            onChange({ ...content, navigation: { ...navigation, ctaLabel } })
          }
        />
        <TextInput
          label="Booking CTA URL"
          value={navigation.ctaHref}
          onChange={(ctaHref) =>
            onChange({ ...content, navigation: { ...navigation, ctaHref } })
          }
        />
      </div>

      <div className="mt-6">
        <Field label="Navigation links">
          <ArrayEditor<NavLink>
            items={navigation.links}
            onChange={(links) =>
              onChange({ ...content, navigation: { ...navigation, links } })
            }
            create={() => ({
              id: newId("nav"),
              label: "New link",
              href: "#top",
              icon: "link",
            })}
            itemLabel={(link) => link.label}
            addLabel="Add navigation link"
          >
            {(link, update) => (
              <div className="grid gap-4 sm:grid-cols-2">
                <TextInput
                  label="Label"
                  value={link.label}
                  onChange={(label) => update({ label })}
                />
                <TextInput
                  label="Href"
                  value={link.href}
                  onChange={(href) => update({ href })}
                  mono
                />
                <Select
                  label="Dock icon"
                  value={link.icon}
                  onChange={(icon) =>
                    update({ icon: icon as typeof link.icon })
                  }
                  options={navIconOptions}
                />
              </div>
            )}
          </ArrayEditor>
        </Field>
      </div>
    </SectionCard>
  );
}

export function SocialsView({ content, onChange }: AdminViewProps) {
  return (
    <SectionCard
      title="Social links"
      description="Reused in the hero, contact section, and footer."
    >
      <ArrayEditor<SocialLink>
        items={content.socials}
        onChange={(socials) => onChange({ ...content, socials })}
        create={() => ({
          id: newId("social"),
          platform: "instagram",
          label: "Instagram",
          handle: "@handle",
          href: "https://",
        })}
        itemLabel={(social) => `${social.label} — ${social.handle}`}
        addLabel="Add social link"
      >
        {(social, update) => (
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Platform"
              value={social.platform}
              onChange={(platform) =>
                update({ platform: platform as typeof social.platform })
              }
              options={socialPlatformOptions}
            />
            <TextInput
              label="Label"
              value={social.label}
              onChange={(label) => update({ label })}
            />
            <TextInput
              label="Handle"
              value={social.handle}
              onChange={(handle) => update({ handle })}
            />
            <TextInput
              label="URL"
              value={social.href}
              onChange={(href) => update({ href })}
              mono
            />
          </div>
        )}
      </ArrayEditor>
    </SectionCard>
  );
}

export function ContactDetailsView({ content, onChange }: AdminViewProps) {
  const profile = content.profile;
  const patch = (value: Partial<typeof profile>) =>
    onChange({ ...content, profile: { ...profile, ...value } });

  return (
    <SectionCard
      title="Contact & booking"
      description="Global contact details used by the contact section, booking buttons, and résumé download."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Email address"
          value={profile.email}
          onChange={(email) => patch({ email })}
        />
        <TextInput
          label="Booking URL"
          value={profile.calendlyUrl}
          onChange={(calendlyUrl) => patch({ calendlyUrl })}
        />
        <TextInput
          label="Location"
          value={profile.location}
          onChange={(location) => patch({ location })}
        />
        <TextInput
          label="Timezone"
          value={profile.timezone}
          onChange={(timezone) => patch({ timezone })}
        />
        <TextInput
          label="Résumé URL"
          value={profile.resumeUrl}
          onChange={(resumeUrl) => patch({ resumeUrl })}
          mono
        />
      </div>
    </SectionCard>
  );
}

export function SeoView({ content, onChange }: AdminViewProps) {
  const seo = content.seo;
  const patch = (value: Partial<typeof seo>) =>
    onChange({ ...content, seo: { ...seo, ...value } });

  return (
    <SectionCard
      title="SEO & metadata"
      description="Used for the browser title, social previews, and canonical site URL."
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextInput
          label="Site URL"
          value={seo.siteUrl}
          onChange={(siteUrl) => patch({ siteUrl })}
          mono
        />
        <TextInput
          label="Title template"
          hint="Available placeholders: {name}, {role}"
          value={seo.titleTemplate}
          onChange={(titleTemplate) => patch({ titleTemplate })}
        />
      </div>
      <div className="mt-4">
        <TextArea
          label="Meta description"
          value={seo.description}
          onChange={(description) => patch({ description })}
          rows={3}
        />
      </div>
      <div className="mt-4">
        <ImageField
          label="Open Graph image (optional)"
          value={seo.ogImage ?? ""}
          onChange={(ogImage) => patch({ ogImage })}
        />
      </div>
    </SectionCard>
  );
}
