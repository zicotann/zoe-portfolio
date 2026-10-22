"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { AdminView } from "./types";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {label ? <Label className="text-xs font-semibold">{label}</Label> : null}
      {children}
      {hint ? (
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextInput({
  label,
  hint,
  value,
  onChange,
  placeholder,
  mono,
  type = "text",
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mono?: boolean;
  type?: string;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint}>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={mono ? "font-mono text-xs" : undefined}
      />
    </Field>
  );
}

export function TextArea({
  label,
  hint,
  value,
  onChange,
  placeholder,
  rows = 4,
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint}>
      <Textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="min-h-0"
      />
    </Field>
  );
}

export function NumberInput({
  label,
  hint,
  value,
  onChange,
  step = "any",
}: {
  label?: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
}) {
  return (
    <Field label={label} hint={hint}>
      <Input
        type="number"
        step={step}
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => {
          const next = event.target.value === "" ? 0 : Number(event.target.value);
          onChange(Number.isFinite(next) ? next : 0);
        }}
      />
    </Field>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
      />
      <span className="space-y-0.5">
        <span className="block text-sm font-medium">{label}</span>
        {hint ? (
          <span className="block text-[11px] text-muted-foreground">{hint}</span>
        ) : null}
      </span>
    </label>
  );
}

export function SectionVisibility({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Toggle
      label="Show this section on the website"
      hint="Uncheck to hide the entire section. Changes apply when you publish."
      checked={checked}
      onChange={onChange}
    />
  );
}

export function Select({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <Field label={label} hint={hint}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex h-11 w-full appearance-none rounded-xl border border-input bg-background/60 px-4 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/30"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function ColorChoice({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; swatch: string }>;
}) {
  return (
    <Field label={label} hint={hint}>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
              value === option.value
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border bg-background/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            <span
              className={cn("h-3 w-3 rounded-full", option.swatch)}
              aria-hidden
            />
            {option.label}
          </button>
        ))}
      </div>
    </Field>
  );
}

export function ImageField({
  label,
  hint,
  value,
  onChange,
  aspect = "video",
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  aspect?: "video" | "square" | "portrait";
}) {
  const [broken, setBroken] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "portrait"
        ? "aspect-[3/4]"
        : "aspect-video";

  function showUploadNotice() {
    window.alert(
      "R2 uploads are not configured yet. Paste a public Cloudflare R2 URL in the field above for now.",
    );
  }

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-2">
        <Input
          value={value}
          onChange={(event) => {
            setBroken(false);
            onChange(event.target.value);
          }}
          placeholder="https://pub-….r2.dev/image.jpg"
          className="font-mono text-xs"
        />
        {value ? (
          <div
            className={cn(
              "relative w-full max-w-xs overflow-hidden rounded-xl border border-border bg-secondary",
              previewClass,
            )}
          >
            {broken ? (
              <div className="flex h-full items-center justify-center p-3 text-center text-[11px] text-muted-foreground">
                Could not load this image. Check the URL.
              </div>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={value}
                alt=""
                onError={() => setBroken(true)}
                className="h-full w-full object-cover"
              />
            )}
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              showUploadNotice();
            }}
            className="flex max-w-xs cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-secondary/40 px-4 py-6 text-center transition-colors hover:border-primary/40"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(event) => {
                if (event.target.files?.length) showUploadNotice();
                event.target.value = "";
              }}
            />
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm">
              <UploadCloud className="h-4 w-4" />
            </span>
            <p className="text-xs font-medium">Drop an image or video here</p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              R2 uploads are coming soon. For now, paste a public Cloudflare R2
              URL above.
            </p>
          </div>
        )}
      </div>
    </Field>
  );
}

interface PdfAsset {
  name: string;
  path: string;
  size?: number;
}

function formatBytes(size?: number): string {
  if (!size) return "";
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export function PdfField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [files, setFiles] = useState<PdfAsset[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/resume", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return { files: [] as PdfAsset[] };
        return (await response.json()) as { files: PdfAsset[] };
      })
      .then((data) => {
        if (!cancelled) setFiles(data.files ?? []);
      })
      .catch(() => {
        if (!cancelled) setFiles([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingFiles(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function upload(file: File) {
    const isPdf =
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!isPdf) {
      setError("Choose a PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("PDFs must be 5 MB or smaller.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/resume", {
        method: "POST",
        body,
      });
      const data = (await response.json().catch(() => ({}))) as {
        asset?: PdfAsset;
        error?: string;
      };
      if (!response.ok || !data.asset) {
        setError(data.error ?? "Could not upload the PDF.");
        return;
      }
      onChange(data.asset.path);
      setFiles((current) => [
        data.asset as PdfAsset,
        ...current.filter((item) => item.path !== data.asset?.path),
      ]);
    } catch {
      setError("Could not upload the PDF.");
    } finally {
      setUploading(false);
    }
  }

  async function remove() {
    if (!value) return;
    if (
      !window.confirm(
        "Delete this resume? The PDF will be removed from the codebase.",
      )
    ) {
      return;
    }

    const previous = value;
    setDeleting(true);
    setError(null);
    onChange("");

    try {
      if (previous.startsWith("/resumes/")) {
        const response = await fetch("/api/admin/resume", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ path: previous }),
        });
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        if (!response.ok) {
          setError(
            data.error ??
              "The resume was removed from the content, but the PDF could not be deleted.",
          );
          return;
        }
        setFiles((current) =>
          current.filter((item) => item.path !== previous),
        );
      }
    } catch {
      setError(
        "The resume was removed from the content, but the PDF could not be deleted.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (file) void upload(file);
  }

  const fileName = value.split("/").pop() ?? value;
  const otherFiles = files.filter((file) => file.path !== value);

  return (
    <Field label={label} hint={hint}>
      <div className="space-y-3">
        {value ? (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background/60 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
              <FileText className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">{fileName}</p>
              <p className="truncate font-mono text-[11px] text-muted-foreground">
                {value}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Button asChild variant="outline" size="sm">
                <a href={value} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5" />
                  View
                </a>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading || deleting}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <UploadCloud className="h-3.5 w-3.5" />
                )}
                Replace
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={uploading || deleting}
                onClick={remove}
                className="text-muted-foreground hover:text-destructive"
              >
                {deleting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setDragging(false);
              handleFiles(event.dataTransfer.files);
            }}
            className={cn(
              "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-secondary/40 px-4 py-8 text-center transition-colors",
              dragging
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40",
            )}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm">
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UploadCloud className="h-4 w-4" />
              )}
            </span>
            <p className="text-xs font-medium">
              {uploading ? "Uploading…" : "Drop a PDF here, or click to upload"}
            </p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              PDFs are stored in the codebase under public/resumes.
            </p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />

        {error ? (
          <p className="text-[11px] leading-relaxed text-destructive">{error}</p>
        ) : null}

        <div className="space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Existing PDFs
          </p>
          {loadingFiles ? (
            <p className="text-[11px] text-muted-foreground">Loading PDFs…</p>
          ) : otherFiles.length ? (
            <div className="flex flex-wrap gap-1.5">
              {otherFiles.map((file) => (
                <button
                  key={file.path}
                  type="button"
                  onClick={() => onChange(file.path)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <FileText className="h-3 w-3" />
                  {file.name}
                  {file.size ? (
                    <span className="text-[10px] opacity-70">
                      {formatBytes(file.size)}
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground">
              No other PDFs found in the codebase.
            </p>
          )}
        </div>
      </div>
    </Field>
  );
}

export function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-5 space-y-1">
        <h2 className="font-display text-lg font-semibold tracking-tight">
          {title}
        </h2>
        {description ? (
          <p className="text-xs leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export function GlobalFields({
  items,
  onNavigate,
}: {
  items: Array<{ label: string; value: string; view?: AdminView }>;
  onNavigate: (view: AdminView) => void;
}) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Used globally
        </p>
        <p className="text-[11px] text-muted-foreground">
          Edit these in the Global section.
        </p>
      </div>
      <dl className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="space-y-0.5">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {item.label}
            </dt>
            <dd className="line-clamp-2 text-xs">
              {item.value || "—"}
              {item.view ? (
                <button
                  type="button"
                  onClick={() => onNavigate(item.view as AdminView)}
                  className="ml-2 text-[11px] font-semibold text-primary underline-offset-2 hover:underline"
                >
                  Edit
                </button>
              ) : null}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function StringListEditor({
  items,
  onChange,
  addLabel = "Add item",
  placeholder,
  label,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel?: string;
  placeholder?: string;
  label?: string;
}) {
  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(event) => {
                const next = [...items];
                next[index] = event.target.value;
                onChange(next);
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => onChange(items.filter((_, i) => i !== index))}
              aria-label="Remove item"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange([...items, ""])}
        >
          <Plus className="h-3.5 w-3.5" />
          {addLabel}
        </Button>
      </div>
    </Field>
  );
}

interface ArrayEditorProps<T> {
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  itemLabel: (item: T, index: number) => string;
  addLabel: string;
  children: (
    item: T,
    update: (patch: Partial<T>) => void,
    index: number,
  ) => React.ReactNode;
  defaultOpenFirst?: boolean;
  deleteBlocked?: (item: T, index: number) => string | null;
}

export function ArrayEditor<T>({
  items,
  onChange,
  create,
  itemLabel,
  addLabel,
  children,
  defaultOpenFirst = true,
  deleteBlocked,
}: ArrayEditorProps<T>) {
  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <details
          key={index}
          open={defaultOpenFirst && index === 0}
          className="group rounded-2xl border border-border bg-background/50"
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {itemLabel(item, index) || "Untitled"}
            </span>
            <span className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Move up"
                disabled={index === 0}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  move(index, -1);
                }}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30"
              >
                <ChevronUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Move down"
                disabled={index === items.length - 1}
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  move(index, 1);
                }}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground disabled:opacity-30"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Delete item"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  const blocked = deleteBlocked?.(item, index);
                  if (blocked) {
                    window.alert(blocked);
                    return;
                  }
                  if (
                    window.confirm(
                      `Remove “${itemLabel(item, index) || "this item"}”?`,
                    )
                  ) {
                    onChange(items.filter((_, i) => i !== index));
                  }
                }}
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </span>
          </summary>
          <div className="space-y-4 border-t border-border p-4">
            {children(
              item,
              (patch) => {
                const next = [...items];
                next[index] = { ...item, ...patch };
                onChange(next);
              },
              index,
            )}
          </div>
        </details>
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...items, create()])}
      >
        <Plus className="h-3.5 w-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}

export function ImageHint() {
  return (
    <p className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
      <ImagePlus className="h-3 w-3" />
      Paste a public URL. R2 uploads will be added later.
    </p>
  );
}
