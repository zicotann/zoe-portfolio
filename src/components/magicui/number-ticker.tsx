"use client";

import { useEffect, useRef } from "react";
import {
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from "framer-motion";

import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
  className,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (!isInView) return;

    const timer = setTimeout(() => {
      motionValue.set(direction === "down" ? 0 : value);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [motionValue, isInView, delay, value, direction]);

  useMotionValueEvent(springValue, "change", (latest) => {
    if (!ref.current) return;

    const formatted = Intl.NumberFormat("en-US", {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    }).format(Number(latest.toFixed(decimalPlaces)));

    ref.current.textContent = `${prefix}${formatted}${suffix}`;
  });

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums tracking-tight", className)}
    >
      {`${prefix}${(0).toFixed(decimalPlaces)}${suffix}`}
    </span>
  );
}
