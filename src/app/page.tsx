import { SiteShell } from "@/components/site-shell";
import { siteContent } from "@/content/site";

export default function Home() {
  return <SiteShell content={siteContent} />;
}
