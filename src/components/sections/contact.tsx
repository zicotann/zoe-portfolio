"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CalendarClock, Check, Send } from "lucide-react";

import { BrandIcon } from "@/components/brand-icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/magicui/reveal";
import type { SiteContent } from "@/content/schema";
import { previewFields } from "@/lib/preview-fields";

type FormValues = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

export function Contact({ content }: { content: SiteContent }) {
  const [sent, setSent] = useState(false);
  const contact = content.sections.contact;
  const copy = contact.form;
  const { profile, socials } = content;

  const formSchema = useMemo(
    () =>
      z.object({
        name: z.string().min(2, copy.errorName),
        email: z.string().email(copy.errorEmail),
        company: z.string().optional(),
        message: z.string().min(10, copy.errorMessage),
      }),
    [copy.errorName, copy.errorEmail, copy.errorMessage],
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", company: "", message: "" },
  });

  function onSubmit(values: FormValues) {
    const subject = encodeURIComponent(`New project enquiry from ${values.name}`);
    const body = encodeURIComponent(
      `${values.message}\n\n— ${values.name}${values.company ? `, ${values.company}` : ""}\n${values.email}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setSent(true);
    form.reset();
  }

  const directLinks = socials.filter(
    (social) => social.platform !== "youtube",
  );

  return (
    <section id="contact" className="py-16 sm:py-24">
      <div {...previewFields("sections.contact.visible")} className="container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 animate-blob rounded-full bg-brand-violet/20 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 animate-blob rounded-full bg-brand-coral/20 blur-3xl [animation-delay:4s]"
            />

            <div className="relative grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="space-y-6">
                <div className="space-y-3">
                  <p
                    {...previewFields("sections.contact.eyebrow")}
                    className="text-xs font-semibold uppercase tracking-[0.22em] text-primary"
                  >
                    {contact.eyebrow}
                  </p>
                  <h2 className="text-balance text-4xl leading-[1.02] tracking-tight sm:text-5xl">
                    <span
                      {...previewFields("sections.contact.headingLead")}
                    >
                      {contact.headingLead}
                    </span>{" "}
                    <span
                      {...previewFields("sections.contact.headingAccent")}
                      className="text-gradient animate-gradient-x"
                    >
                      {contact.headingAccent}
                    </span>
                  </h2>
                  <p
                    {...previewFields("sections.contact.description")}
                    className="text-pretty text-sm leading-relaxed text-muted-foreground"
                  >
                    {contact.description}
                  </p>
                </div>

                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a
                    {...previewFields("sections.contact.bookingLabel")}
                    href={profile.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CalendarClock className="h-4 w-4" />
                    {contact.bookingLabel}
                  </a>
                </Button>

                <div className="flex flex-wrap gap-2 pt-2">
                  {directLinks.map((social) => (
                    <a
                      key={social.id}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                    >
                      <BrandIcon
                        platform={social.platform}
                        className="h-4 w-4"
                      />
                      {social.handle}
                    </a>
                  ))}
                </div>

                <p
                  {...previewFields("sections.contact.basedInLabel")}
                  className="text-xs text-muted-foreground"
                >
                  {contact.basedInLabel} {profile.location} · {profile.timezone}
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem
                          {...previewFields(
                            "sections.contact.form.errorName",
                          )}
                        >
                          <FormLabel
                            {...previewFields(
                              "sections.contact.form.nameLabel",
                            )}
                          >
                            {copy.nameLabel}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...previewFields(
                                "sections.contact.form.namePlaceholder",
                              )}
                              placeholder={copy.namePlaceholder}
                              className="bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem
                          {...previewFields(
                            "sections.contact.form.errorEmail",
                          )}
                        >
                          <FormLabel
                            {...previewFields(
                              "sections.contact.form.emailLabel",
                            )}
                          >
                            {copy.emailLabel}
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...previewFields(
                                "sections.contact.form.emailPlaceholder",
                              )}
                              type="email"
                              placeholder={copy.emailPlaceholder}
                              className="bg-background"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel
                          {...previewFields(
                            "sections.contact.form.companyLabel",
                          )}
                        >
                          {copy.companyLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...previewFields(
                              "sections.contact.form.companyPlaceholder",
                            )}
                            placeholder={copy.companyPlaceholder}
                            className="bg-background"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem
                        {...previewFields(
                          "sections.contact.form.errorMessage",
                        )}
                      >
                        <FormLabel
                          {...previewFields(
                            "sections.contact.form.messageLabel",
                          )}
                        >
                          {copy.messageLabel}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            {...previewFields(
                              "sections.contact.form.messagePlaceholder",
                            )}
                            placeholder={copy.messagePlaceholder}
                            className="bg-background"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    {...previewFields(
                      "sections.contact.form.submitLabel",
                      "sections.contact.form.sentLabel",
                    )}
                    type="submit"
                    size="lg"
                    className="w-full"
                  >
                    {sent ? (
                      <>
                        <Check className="h-4 w-4" />
                        {copy.sentLabel}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {copy.submitLabel}
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
