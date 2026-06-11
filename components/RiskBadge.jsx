import React from "react";
import clsx from "clsx";

const config = {
  critical: { bg: "bg-rail-red/20", border: "border-rail-red/50", text: "text-rail-red", dot: "bg-rail-red", label: "CRITICAL" },
  high: { bg: "bg-rail-orange/20", border: "border-rail-orange/50", text: "text-rail-orange", dot: "bg-rail-orange", label: "HIGH" },
  medium: { bg: "bg-rail-yellow/20", border: "border-rail-yellow/50", text: "text-rail-yellow", dot: "bg-rail-yellow", label: "MEDIUM" },
  low: { bg: "bg-rail-green/20", border: "border-rail-green/50", text: "text-rail-green", dot: "bg-rail-green", label: "LOW" },
  normal: { bg: "bg-rail-green/20", border: "border-rail-green/50", text: "text-rail-green", dot: "bg-rail-green", label: "NORMAL" },
  warning: { bg: "bg-rail-yellow/20", border: "border-rail-yellow/50", text: "text-rail-yellow", dot: "bg-rail-yellow", label: "WARNING" },
  congested: { bg: "bg-rail-orange/20", border: "border-rail-orange/50", text: "text-rail-orange", dot: "bg-rail-orange", label: "CONGESTED" },
};

export default function RiskBadge({ level, size = "sm" }) {
  const c = config[level] || config.low;
  return (
    <span className={clsx(
      "inline-flex items-center gap-1 rounded font-mono font-bold border",
      c.bg, c.border, c.text,
      size === "sm" ? "text-[9px] px-1.5 py-0.5" : "text-xs px-2 py-1"
    )}>
      <span className={clsx("rounded-full flex-shrink-0", c.dot, size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2")} />
      {c.label}
    </span>
  );
}
