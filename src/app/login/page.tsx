import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";

export const metadata: Metadata = {
  title: "Content Studio — Sign in",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-28 -top-32 h-[26rem] w-[26rem] rounded-full bg-brand-violet/20 blur-3xl" />
        <div className="absolute -right-16 top-16 h-80 w-80 rounded-full bg-brand-coral/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-amber/20 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
      </div>

      <div className="relative w-full max-w-sm rounded-[2rem] border border-border bg-card/90 p-8 shadow-xl backdrop-blur-xl">
        <div className="mb-8 space-y-2 text-center">
          <p className="font-display text-2xl font-semibold tracking-tight">
            Content Studio<span className="text-brand-coral">.</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Sign in to edit and publish the site.
          </p>
        </div>

        <LoginForm />

        <Link
          href="/"
          className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to site
        </Link>
      </div>
    </main>
  );
}
