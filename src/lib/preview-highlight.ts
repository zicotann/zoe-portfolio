import type { PreviewHighlightTarget } from "@/lib/preview-fields";

export type ActiveHighlight = PreviewHighlightTarget;

const HIGHLIGHT_ATTRIBUTE = "data-preview-highlighted";

let activeTarget: ActiveHighlight | null = null;
let activeNodes: HTMLElement[] = [];
let activeNode: HTMLElement | null = null;
let pill: HTMLDivElement | null = null;
let frame = 0;

function escapeAttributeValue(value: string) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/["\\]/g, "\\$&");
}

function clearVisuals() {
  activeNodes.forEach((node) => node.removeAttribute(HIGHLIGHT_ATTRIBUTE));
  activeNodes = [];
  activeNode = null;
  document.documentElement.removeAttribute("data-preview-highlighting");
  if (pill) {
    pill.remove();
    pill = null;
  }
  if (frame) {
    window.cancelAnimationFrame(frame);
    frame = 0;
  }
}

function isRendered(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function isInViewport(node: HTMLElement) {
  const rect = node.getBoundingClientRect();
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.right > 0 &&
    rect.top < window.innerHeight &&
    rect.left < window.innerWidth
  );
}

function positionPill(node: HTMLElement) {
  if (!pill) return;
  const rect = node.getBoundingClientRect();
  const pillRect = pill.getBoundingClientRect();
  const gap = 10;
  const margin = 8;

  let top: number;
  if (rect.height > window.innerHeight * 0.6) {
    top = Math.min(
      Math.max(margin, rect.top + gap),
      window.innerHeight - pillRect.height - margin,
    );
  } else {
    top = rect.top - pillRect.height - gap;
    if (top < margin) top = rect.bottom + gap;
    if (top + pillRect.height > window.innerHeight - margin) {
      top = Math.max(margin, window.innerHeight - pillRect.height - margin);
    }
  }

  let left = rect.left;
  if (left + pillRect.width > window.innerWidth - margin) {
    left = window.innerWidth - pillRect.width - margin;
  }
  if (left < margin) left = margin;

  pill.style.top = `${top + window.scrollY}px`;
  pill.style.left = `${left + window.scrollX}px`;
}

function tick() {
  if (!activeNode || !activeNode.isConnected) {
    frame = 0;
    return;
  }
  positionPill(activeNode);
  frame = window.requestAnimationFrame(tick);
}

function scrollToTarget(node: HTMLElement) {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const behavior: ScrollBehavior = reduced ? "auto" : "smooth";

  if (node.closest("header")) {
    window.scrollTo({ top: 0, behavior });
    return;
  }

  const rect = node.getBoundingClientRect();
  const block = rect.height > window.innerHeight * 0.8 ? "start" : "center";
  node.scrollIntoView({ block, inline: "nearest", behavior });
}

export function applyPreviewHighlight(
  target: PreviewHighlightTarget,
  options: { scroll?: boolean } = {},
): boolean {
  activeTarget = target;
  clearVisuals();

  const fieldSelector = `[data-preview-field~="${escapeAttributeValue(
    target.field,
  )}"]`;
  let nodes = Array.from(
    document.querySelectorAll<HTMLElement>(fieldSelector),
  );

  if (!nodes.length) {
    for (const anchor of target.fallbackAnchors ?? []) {
      const anchorSelector = `[data-preview-anchor~="${escapeAttributeValue(
        anchor,
      )}"]`;
      nodes = Array.from(
        document.querySelectorAll<HTMLElement>(anchorSelector),
      );
      if (nodes.length) break;
    }
  }

  if (!nodes.length) {
    return false;
  }

  activeNodes = nodes;
  nodes.forEach((node) =>
    node.setAttribute(HIGHLIGHT_ATTRIBUTE, "true"),
  );
  document.documentElement.setAttribute("data-preview-highlighting", "true");

  const primary =
    nodes.find(isInViewport) ?? nodes.find(isRendered) ?? nodes[0];
  activeNode = primary;

  pill = document.createElement("div");
  pill.className = "preview-locate-pill";
  pill.setAttribute("aria-hidden", "true");
  pill.textContent = target.label;
  document.body.appendChild(pill);
  positionPill(primary);

  if (options.scroll !== false) {
    scrollToTarget(primary);
  }

  frame = window.requestAnimationFrame(tick);
  return true;
}

export function clearPreviewHighlight() {
  activeTarget = null;
  clearVisuals();
}

export function getActivePreviewHighlight() {
  return activeTarget;
}
