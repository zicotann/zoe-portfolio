import { BrandIcon } from "@/components/brand-icons";
import type { SiteContent } from "@/content/schema";
import { previewFields } from "@/lib/preview-fields";

export function Footer({ content }: { content: SiteContent }) {
  const { profile, socials, sections } = content;

  return (
    <footer id="footer" className="border-t border-border/60 py-10">
      <div className="container flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="text-center sm:text-left">
          <p className="font-display text-lg font-semibold tracking-tight">
            {profile.name}
            <span className="text-brand-coral">.</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">{profile.role}</p>
        </div>

        <div className="flex items-center gap-2">
          {socials.map((social) => (
            <a
              {...previewFields(
                `socials.${social.id}.platform`,
                `socials.${social.id}.label`,
                `socials.${social.id}.handle`,
                `socials.${social.id}.href`,
              )}
              key={social.id}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-primary/50 hover:bg-secondary hover:text-foreground"
            >
              <BrandIcon platform={social.platform} />
            </a>
          ))}
        </div>

        <p
          {...previewFields("sections.footer.rightsLabel")}
          className="text-xs text-muted-foreground"
        >
          © {new Date().getFullYear()} {profile.name}.{" "}
          {sections.footer.rightsLabel}
        </p>
      </div>
    </footer>
  );
}
