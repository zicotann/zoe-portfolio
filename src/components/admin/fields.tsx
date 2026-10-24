"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  FileText,
  GripVertical,
  ImagePlus,
  Images,
  Loader2,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { previewFields, type PreviewField } from "@/lib/preview-fields";
import { cn } from "@/lib/utils";
import { PreviewLocateButton } from "./preview-locate";
import type { AdminView } from "./types";

export function Field({
  label,
  hint,
  children,
  className,
  previewField,
  previewLabel,
}: {
  label?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  previewField?: PreviewField;
  previewLabel?: string;
}) {
  return (
    <div className={cn("group/field space-y-1.5", className)}>
      {label ? (
        <div className="flex min-h-5 items-center gap-2">
          <Label className="text-xs font-semibold">{label}</Label>
          {previewField ? (
            <PreviewLocateButton
              field={previewField}
              label={previewLabel ?? label}
            />
          ) : null}
        </div>
      ) : null}
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
  previewField,
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  mono?: boolean;
  type?: string;
  previewField?: PreviewField;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} previewField={previewField}>
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
  previewField,
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  previewField?: PreviewField;
}) {
  const id = useId();
  return (
    <Field label={label} hint={hint} previewField={previewField}>
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
  previewField,
}: {
  label?: string;
  hint?: string;
  value: number;
  onChange: (value: number) => void;
  step?: string;
  previewField?: PreviewField;
}) {
  return (
    <Field label={label} hint={hint} previewField={previewField}>
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
  previewField,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  hint?: string;
  previewField?: PreviewField;
}) {
  return (
    <div className="group/field relative">
      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-3",
          previewField && "pr-9",
        )}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-input accent-[hsl(var(--primary))]"
        />
        <span className="space-y-0.5">
          <span className="block text-sm font-medium">{label}</span>
          {hint ? (
            <span className="block text-[11px] text-muted-foreground">
              {hint}
            </span>
          ) : null}
        </span>
      </label>
      {previewField ? (
        <div className="absolute right-2 top-2">
          <PreviewLocateButton field={previewField} label={label} />
        </div>
      ) : null}
    </div>
  );
}

export function SectionVisibility({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  previewField?: PreviewField;
}) {
  return (
    <Toggle
      label="Show this section on the website"
      hint="Uncheck to hide the entire section."
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
  previewField,
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  previewField?: PreviewField;
}) {
  return (
    <Field label={label} hint={hint} previewField={previewField}>
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
  previewField,
}: {
  label?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; swatch: string }>;
  previewField?: PreviewField;
}) {
  return (
    <Field label={label} hint={hint} previewField={previewField}>
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

const imageAspectClasses = {
  video: "aspect-video",
  square: "aspect-square",
  portrait: "aspect-[3/4]",
  "1:1": "aspect-square",
  "4:5": "aspect-[4/5]",
  "16:9": "aspect-video",
  "9:16": "aspect-[9/16]",
} as const;

export type ImageFieldAspect = keyof typeof imageAspectClasses;

interface R2ImageAsset {
  name: string;
  key: string;
  url: string;
  size?: number;
  lastModified?: string;
}

export function ImageField({
  label,
  hint,
  value,
  onChange,
  aspect = "video",
  previewField,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  aspect?: ImageFieldAspect;
  previewField?: PreviewField;
}) {
  const [broken, setBroken] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [assets, setAssets] = useState<R2ImageAsset[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [assetsError, setAssetsError] = useState<string | null>(null);
  const [r2Configured, setR2Configured] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Images must be 10 MB or smaller.");
      return;
    }

    setUploading(true);
    setError(null);
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/images", {
        method: "POST",
        body,
      });
      const data = (await response.json().catch(() => ({}))) as {
        asset?: R2ImageAsset;
        error?: string;
      };
      if (!response.ok || !data.asset) {
        setError(data.error ?? "Could not upload the image.");
        return;
      }
      onChange(data.asset.url);
      setBroken(false);
      setAssets((current) => [
        data.asset as R2ImageAsset,
        ...current.filter((asset) => asset.url !== data.asset?.url),
      ]);
    } catch {
      setError("Could not upload the image.");
    } finally {
      setUploading(false);
    }
  }

  async function openPicker() {
    setPickerOpen(true);
    setLoadingAssets(true);
    setAssetsError(null);
    try {
      const response = await fetch("/api/admin/images", { cache: "no-store" });
      const data = (await response.json().catch(() => ({}))) as {
        files?: R2ImageAsset[];
        configured?: boolean;
        error?: string;
      };
      if (!response.ok) {
        setAssetsError(
          data.error ?? "Could not load images from Cloudflare R2.",
        );
        return;
      }
      setR2Configured(data.configured !== false);
      setAssets(data.files ?? []);
    } catch {
      setAssetsError("Could not load images from Cloudflare R2.");
    } finally {
      setLoadingAssets(false);
    }
  }

  async function remove() {
    if (!value) return;
    if (
      !window.confirm(
        "Remove this image? If it is stored in Cloudflare R2, the file will also be deleted.",
      )
    ) {
      return;
    }

    const previous = value;
    setDeleting(true);
    setError(null);
    onChange("");

    try {
      const response = await fetch("/api/admin/images", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: previous }),
      });
      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(
          data.error ??
            "The image was removed from the content, but the file could not be deleted from R2.",
        );
      }
    } catch {
      setError(
        "The image was removed from the content, but the file could not be deleted from R2.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (file) void uploadFile(file);
  }

  const busy = uploading || deleting;

  return (
    <Field label={label} hint={hint} previewField={previewField}>
      <div className="space-y-2">
        <Input
          value={value}
          onChange={(event) => {
            setBroken(false);
            setError(null);
            onChange(event.target.value);
          }}
          placeholder="https://pub-….r2.dev/image.jpg"
          className="font-mono text-xs"
        />

        {value ? (
          <>
            <div
              className={cn(
                "relative w-full max-w-xs overflow-hidden rounded-xl border border-border bg-secondary",
                imageAspectClasses[aspect],
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
            <div className="flex flex-wrap items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
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
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={openPicker}
              >
                <Images className="h-3.5 w-3.5" />
                Choose from R2
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={busy}
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
          </>
        ) : (
          <>
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
              onDragLeave={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as Node | null,
                  )
                ) {
                  setDragging(false);
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                handleFiles(event.dataTransfer.files);
              }}
              className={cn(
                "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-secondary/40 px-4 py-6 text-center transition-colors",
                dragging
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40",
              )}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
              </span>
              <p className="text-xs font-medium">
                {uploading
                  ? "Uploading…"
                  : "Drop an image here, or click to upload"}
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Uploads are stored in Cloudflare R2. You can also choose an
                existing R2 image.
              </p>
            </div>
            <div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={openPicker}
              >
                <Images className="h-3.5 w-3.5" />
                Choose from R2
              </Button>
            </div>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/avif,image/gif,image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = "";
          }}
        />

        {error ? (
          <p className="text-[11px] leading-relaxed text-destructive">{error}</p>
        ) : null}

        <Dialog open={pickerOpen} onOpenChange={setPickerOpen}>
          <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Choose an image from Cloudflare R2</DialogTitle>
              <DialogDescription>
                Pick an image to use here, or upload a new one from the field.
              </DialogDescription>
            </DialogHeader>

            {loadingAssets ? (
              <p className="flex items-center gap-2 py-6 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Loading images…
              </p>
            ) : !r2Configured ? (
              <p className="rounded-xl border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
                Cloudflare R2 is not configured yet. Add{" "}
                <code>R2_ACCOUNT_ID</code>, <code>R2_ACCESS_KEY_ID</code>,{" "}
                <code>R2_SECRET_ACCESS_KEY</code>, <code>R2_BUCKET</code>, and{" "}
                <code>R2_PUBLIC_URL</code> to enable uploads and the R2 picker.
              </p>
            ) : assetsError ? (
              <p className="rounded-xl border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-destructive">
                {assetsError}
              </p>
            ) : assets.length ? (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {assets.map((asset) => (
                  <button
                    key={asset.key}
                    type="button"
                    onClick={() => {
                      onChange(asset.url);
                      setBroken(false);
                      setPickerOpen(false);
                    }}
                    className="group overflow-hidden rounded-xl border border-border bg-secondary/40 text-left transition-colors hover:border-primary/50"
                  >
                    <span className="relative block aspect-square overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset.url}
                        alt={asset.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </span>
                    <span className="block truncate px-2 py-1.5 text-[11px] text-muted-foreground">
                      {asset.name}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-border bg-secondary/40 p-4 text-xs leading-relaxed text-muted-foreground">
                No images found in R2 yet. Upload one from the image field and it
                will appear here.
              </p>
            )}
          </DialogContent>
        </Dialog>
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
      <div className="mb-6">
        <p className="text-lg font-display font-semibold">
          {title}
        </p>

        {description ? (
          <p className="text-xs text-muted-foreground">
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

function moveItem<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= items.length || to >= items.length) {
    return items;
  }
  const next = [...items];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function DragHandle({
  index,
  onDragStart,
  onDragEnd,
}: {
  index: number;
  onDragStart: () => void;
  onDragEnd: () => void;
}) {
  return (
    <span
      role="button"
      tabIndex={-1}
      draggable
      aria-label="Drag to reorder"
      title="Drag to reorder"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
      onDragStart={(event) => {
        event.stopPropagation();
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", String(index));
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      className="cursor-grab touch-none rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:cursor-grabbing"
    >
      <GripVertical className="h-4 w-4" />
    </span>
  );
}

function ReorderButton({
  direction,
  disabled,
  onClick,
}: {
  direction: -1 | 1;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === -1 ? ChevronUp : ChevronDown;
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground disabled:opacity-30"
      disabled={disabled}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      aria-label={direction === -1 ? "Move up" : "Move down"}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );
}

export function StringListEditor({
  items,
  onChange,
  addLabel = "Add item",
  placeholder,
  label,
  previewFieldForIndex,
}: {
  items: string[];
  onChange: (items: string[]) => void;
  addLabel?: string;
  placeholder?: string;
  label?: string;
  previewFieldForIndex?: (index: number) => string;
}) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const resetDrag = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  return (
    <Field label={label}>
      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            {...(previewFieldForIndex
              ? previewFields(previewFieldForIndex(index))
              : {})}
            onDragOver={(event) => {
              if (dragIndex === null) return;
              event.preventDefault();
              setDragOverIndex(index);
            }}
            onDragLeave={(event) => {
              if (
                !event.currentTarget.contains(event.relatedTarget as Node | null)
              ) {
                setDragOverIndex(null);
              }
            }}
            onDrop={(event) => {
              event.preventDefault();
              const raw = event.dataTransfer.getData("text/plain");
              const from = Number(raw);
              if (raw !== "" && Number.isInteger(from)) {
                onChange(moveItem(items, from, index));
              }
              resetDrag();
            }}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-transparent p-1 transition-colors",
              dragOverIndex === index &&
                dragIndex !== index &&
                "border-primary/50 bg-primary/5",
            )}
          >
            <DragHandle
              index={index}
              onDragStart={() => setDragIndex(index)}
              onDragEnd={resetDrag}
            />
            <Input
              value={item}
              placeholder={placeholder}
              onChange={(event) => {
                const next = [...items];
                next[index] = event.target.value;
                onChange(next);
              }}
            />
            <span className="flex items-center gap-1">
              <ReorderButton
                direction={-1}
                disabled={index === 0}
                onClick={() => onChange(moveItem(items, index, index - 1))}
              />
              <ReorderButton
                direction={1}
                disabled={index === items.length - 1}
                onClick={() => onChange(moveItem(items, index, index + 1))}
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
            </span>
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
  glowWhenOpen?: boolean;
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
  glowWhenOpen = false,
}: ArrayEditorProps<T>) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const resetDrag = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const move = (index: number, direction: -1 | 1) => {
    onChange(moveItem(items, index, index + direction));
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <details
          key={index}
          open={defaultOpenFirst && index === 0}
          onDragOver={(event) => {
            if (dragIndex === null) return;
            event.preventDefault();
            setDragOverIndex(index);
          }}
          onDragLeave={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            ) {
              setDragOverIndex(null);
            }
          }}
          onDrop={(event) => {
            event.preventDefault();
            const raw = event.dataTransfer.getData("text/plain");
            const from = Number(raw);
            if (raw !== "" && Number.isInteger(from)) {
              onChange(moveItem(items, from, index));
            }
            resetDrag();
          }}
          className={cn(
            "group rounded-2xl border border-border bg-background transition-colors",
            glowWhenOpen && "glow-when-open",
            dragOverIndex === index &&
              dragIndex !== index &&
              "border-primary/60 bg-primary/5 ring-2 ring-primary/15",
          )}
        >
          <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 [&::-webkit-details-marker]:hidden">
            <DragHandle
              index={index}
              onDragStart={() => setDragIndex(index)}
              onDragEnd={resetDrag}
            />
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px] font-semibold text-secondary-foreground">
              {index + 1}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {itemLabel(item, index) || "Untitled"}
            </span>
            <span className="flex items-center gap-1">
              <ReorderButton
                direction={-1}
                disabled={index === 0}
                onClick={() => move(index, -1)}
              />
              <ReorderButton
                direction={1}
                disabled={index === items.length - 1}
                onClick={() => move(index, 1)}
              />
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
      Paste a public URL, upload an image, or choose one from Cloudflare R2.
    </p>
  );
}
