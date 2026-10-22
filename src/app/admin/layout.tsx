import type { Metadata } from "next";

import { requireAdminPage } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Content Studio",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  requireAdminPage();
  return <>{children}</>;
}
