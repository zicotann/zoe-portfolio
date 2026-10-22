import { Marquee } from "@/components/magicui/marquee";
import type { ClientLogo, SiteContent } from "@/content/schema";
import { cn } from "@/lib/utils";

const tileColors = [
  "bg-brand-violet/10 text-brand-violet",
  "bg-brand-coral/10 text-brand-coral",
  "bg-brand-amber/20 text-brand-amber",
];

function LogoItem({ client, index }: { client: ClientLogo; index: number }) {
  return (
    <div className="flex items-center gap-3 whitespace-nowrap">
      <span
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl text-xs font-bold transition-transform duration-300 hover:scale-110",
          tileColors[index % tileColors.length],
        )}
      >
        {client.name.slice(0, 2).toUpperCase()}
      </span>
      <span className="text-base font-semibold tracking-tight text-foreground/80">
        {client.name}
      </span>
    </div>
  );
}

export function LogoCloud({ content }: { content: SiteContent }) {
  const { eyebrow, clients: allClients } = content.sections.clients;
  const clients = allClients.filter((c) => c.category === "Client");
  const mentions = allClients.filter((c) => c.category !== "Client");

  return (
    <section id="clients" className="border-y border-border bg-card/60 py-14">
      <div className="container">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </p>
      </div>

      <div className="space-y-6">
        <Marquee pauseOnHover className="mask-fade-x [--duration:38s]">
          {clients.map((client, index) => (
            <LogoItem key={client.id} client={client} index={index} />
          ))}
        </Marquee>

        <Marquee reverse pauseOnHover className="mask-fade-x [--duration:44s]">
          {mentions.map((client, index) => (
            <LogoItem key={client.id} client={client} index={index + 2} />
          ))}
        </Marquee>
      </div>
    </section>
  );
}
