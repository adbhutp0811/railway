import React from "react";
import clsx from "clsx";

export default function MetricCard({ icon: Icon, label, value, sub, color = "accent", trend, className }) {
  const colorMap = {
    accent: { bg: "bg-rail-accent/10", border: "border-rail-accent/30", icon: "text-rail-accent", value: "text-rail-accent" },
    green: { bg: "bg-rail-green/10", border: "border-rail-green/30", icon: "text-rail-green", value: "text-rail-green" },
    red: { bg: "bg-rail-red/10", border: "border-rail-red/30", icon: "text-rail-red", value: "text-rail-red" },
    yellow: { bg: "bg-rail-yellow/10", border: "border-rail-yellow/30", icon: "text-rail-yellow", value: "text-rail-yellow" },
    orange: { bg: "bg-rail-orange/10", border: "border-rail-orange/30", icon: "text-rail-orange", value: "text-rail-orange" },
    purple: { bg: "bg-rail-purple/10", border: "border-rail-purple/30", icon: "text-rail-purple", value: "text-rail-purple" },
  };
  const c = colorMap[color] || colorMap.accent;

  return (
    <div className={clsx("panel-border rounded-xl p-4 card-hover", c.border.replace("border-", "border "), className)}>
      <div className="flex items-start justify-between mb-3">
        <div className={clsx("p-2 rounded-lg", c.bg)}>
          <Icon size={18} className={c.icon} />
        </div>
        {trend !== undefined && (
          <span className={clsx("text-xs font-mono px-2 py-0.5 rounded", trend >= 0 ? "text-rail-red bg-rail-red/10" : "text-rail-green bg-rail-green/10")}>
            {trend >= 0 ? "▲" : "▼"} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className={clsx("text-2xl font-bold font-mono mb-1", c.value)}>{value}</div>
      <div className="text-xs font-medium text-rail-text">{label}</div>
      {sub && <div className="text-[10px] text-rail-muted mt-0.5 font-mono">{sub}</div>}
    </div>
  );
}
