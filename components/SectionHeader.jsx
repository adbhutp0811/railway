import React from "react";
import clsx from "clsx";

export default function SectionHeader({ icon: Icon, title, subtitle, action, color = "accent" }) {
  const colorMap = {
    accent: "text-rail-accent",
    green: "text-rail-green",
    yellow: "text-rail-yellow",
    red: "text-rail-red",
    purple: "text-rail-purple",
  };
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={clsx("p-2 rounded-lg bg-rail-card border border-rail-border")}>
            <Icon size={18} className={colorMap[color] || colorMap.accent} />
          </div>
        )}
        <div>
          <h1 className="text-lg font-bold text-white">{title}</h1>
          {subtitle && <p className="text-xs text-rail-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
