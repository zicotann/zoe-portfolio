"use client";

import { BrandIcon } from "@/components/brand-icons";
import {
  ArrayEditor,
  Field,
  ImageField,
  PdfField,
  SectionCard,
  Select,
  TextArea,
  TextInput,
} from "@/components/admin/fields";
import type { AdminViewProps } from "@/components/admin/types";
import type { NavLink, SocialLink, SocialPlatform } from "@/content/schema";
import { newId } from "@/lib/id";
import { cn } from "@/lib/utils";

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

const socialIconOptions: Array<{ value: SocialPlatform; label: string }> = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X" },
  { value: "facebook", label: "Facebook" },
  { value: "threads", label: "Threads" },
  { value: "pinterest", label: "Pinterest" },
  { value: "snapchat", label: "Snapchat" },
  { value: "twitch", label: "Twitch" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "telegram", label: "Telegram" },
  { value: "discord", label: "Discord" },
  { value: "spotify", label: "Spotify" },
  { value: "soundcloud", label: "SoundCloud" },
  { value: "reddit", label: "Reddit" },
  { value: "tumblr", label: "Tumblr" },
  { value: "vimeo", label: "Vimeo" },
  { value: "behance", label: "Behance" },
  { value: "dribbble", label: "Dribbble" },
  { value: "github", label: "GitHub" },
  { value: "medium", label: "Medium" },
  { value: "substack", label: "Substack" },
  { value: "bluesky", label: "Bluesky" },
  { value: "mastodon", label: "Mastodon" },
  { value: "linktree", label: "Linktree" },
  { value: "signal", label: "Signal" },
  { value: "viber", label: "Viber" },
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "link", label: "Link" },
];

function SocialIconPicker({
  value,
  onChange,
}: {
  value: SocialPlatform;
  onChange: (value: SocialPlatform) => void;
}) {
  return (
    <Field
      label="Icon"
      hint="Pick the icon shown with this link in the hero, contact section, and footer."
    >
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
        {socialIconOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            title={option.label}
            className={cn(
              "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-2.5 text-[10px] font-medium transition-colors",
              value === option.value
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            <BrandIcon platform={option.value} className="h-5 w-5" />
            <span className="w-full truncate text-center">{option.label}</span>
          </button>
        ))}
      </div>
    </Field>
  );
}

export function ProfileView({ content, onChange }: AdminViewProps) {
  const profile = content.profile;
  const patch = (value: Partial<typeof profile>) =>
    onChange({ ...content, profile: { ...profile, ...value } });

  return (
    <div className="space-y-5">
      <SectionCard
        title="Profile & identity"
        description="Global details used across the header, footer, metadata, contact section, and résumé download. Hero copy and the portrait are edited in the Hero section."
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
            label="Location"
            value={profile.location}
            onChange={(location) => patch({ location })}
          />
          <TextInput
            label="Timezone"
            value={profile.timezone}
            onChange={(timezone) => patch({ timezone })}
          />
        </div>
        <div className="mt-6">
          <PdfField
            label="Resume"
            hint="Upload a PDF or pick one that already exists in the codebase. Leave empty to hide the résumé download."
            value={profile.resumeUrl}
            onChange={(resumeUrl) => patch({ resumeUrl })}
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
      title="Header"
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
            <div className="sm:col-span-2">
              <SocialIconPicker
                value={social.platform}
                onChange={(platform) => update({ platform })}
              />
            </div>
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
            <div className="sm:col-span-2">
              <TextInput
                label="URL"
                value={social.href}
                onChange={(href) => update({ href })}
                mono
              />
            </div>
          </div>
        )}
      </ArrayEditor>
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
