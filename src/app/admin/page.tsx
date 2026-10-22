import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { siteContent } from "@/content/site";

export default function AdminPage() {
  return <AdminDashboard initialContent={siteContent} />;
}
