import type { Metadata } from "next";
import localFont from "next/font/local";
import { Bricolage_Grotesque } from "next/font/google";

import { siteContent } from "@/content/site";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

const seoTitle = siteContent.seo.titleTemplate
  .replace("{name}", siteContent.profile.name)
  .replace("{role}", siteContent.profile.role);

export const metadata: Metadata = {
  title: seoTitle,
  description: siteContent.seo.description,
  metadataBase: new URL(siteContent.seo.siteUrl),
  openGraph: {
    title: seoTitle,
    description: siteContent.seo.description,
    type: "website",
    locale: "en_US",
    ...(siteContent.seo.ogImage
      ? { images: [siteContent.seo.ogImage] }
      : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: siteContent.seo.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolageGrotesque.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
