"use client";

import { useState } from "react";
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
import { profile } from "@/data/profile";

const formSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email address."),
  company: z.string().optional(),
  message: z.string().min(10, "Tell me a little more (10+ characters)."),
});

type FormValues = z.infer<typeof formSchema>;

export function Contact() {
  const [sent, setSent] = useState(false);

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

  const directLinks = profile.socials.filter(
    (social) => social.platform !== "youtube",
  );

  return (
    <section id="contact" className="py-16 sm:py-24">
      <div className="container">
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
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    Contact
                  </p>
                  <h2 className="text-balance text-4xl leading-[1.02] tracking-tight sm:text-5xl">
                    Let&rsquo;s build your{" "}
                    <span className="text-gradient animate-gradient-x">
                      next campaign.
                    </span>
                  </h2>
                  <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                    Tell me about your brand and goals — or skip the form and
                    book a call directly.
                  </p>
                </div>

                <Button asChild size="lg" className="w-full sm:w-auto">
                  <a
                    href={profile.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CalendarClock className="h-4 w-4" />
                    Schedule a call
                  </a>
                </Button>

                <div className="flex flex-wrap gap-2 pt-2">
                  {directLinks.map((social) => (
                    <a
                      key={social.platform}
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

                <p className="text-xs text-muted-foreground">
                  Based in {profile.location} · {profile.timezone}
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
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Jane Cooper"
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
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="jane@brand.com"
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
                        <FormLabel>Company (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Brand or agency"
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
                      <FormItem>
                        <FormLabel>Project details</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Goals, timeline, platforms..."
                            className="bg-background"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size="lg" className="w-full">
                    {sent ? (
                      <>
                        <Check className="h-4 w-4" />
                        Message ready — check your mail app
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send message
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
