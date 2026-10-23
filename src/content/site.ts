import rawContent from "../../content/site.json";

import { siteContentSchema, type SiteContent } from "./schema";

export const siteContent: SiteContent = siteContentSchema.parse(rawContent);
