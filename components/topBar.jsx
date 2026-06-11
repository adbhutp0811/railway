import React, { useState, useEffect } from "react";
import { Menu, Bell, RefreshCw, Wifi, AlertTriangle, Cloud } from "lucide-react";
import { weatherData } from "../data/railwayData";

export default function TopBar({ onMenuToggle }) {
  const [time, setTime] = useState(new Date());
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1500);
  };

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b border-rail-border bg-rail-panel min-h-[64px] z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg hover:bg-rail-border/50 text-rail-muted hover:text-rail-accent transition-colors"
        >
          <Menu size={18} />
        </button>
        <div>
          <div className="text-sm font-semibold text-white">RailTwin AI Dashboard</div>
          <div className="text-[10px] text-rail-muted font-mono">
            {time.toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Weather */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rail-card border border-rail-border">
          <span className="text-sm">{weatherData.icon}</span>
          <div>
            <div className="text-[10px] text-rail-muted font-mono">{weatherData.condition}</div>
            <div className="text-xs text-rail-text">{weatherData.temp}°C · {weatherData.wind} km/h</div>
          </div>
        </div>

        {/* Alert */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rail-red/10 border border-rail-red/30">
          <AlertTriangle size={12} className="text-rail-red" />
          <span className="text-[10px] text-rail-red font-mono">4 ACTIVE ALERTS</span>
        </div>

        {/* Clock */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rail-card border border-rail-border">
          <Wifi size={12} className="text-rail-green" />
          <span className="text-sm font-mono text-rail-accent">
            {time.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </span>
        </div>

        {/* Sync */}
        <button
          onClick={handleSync}
          className="p-2 rounded-lg hover:bg-rail-border/50 text-rail-muted hover:text-rail-accent transition-colors"
        >
          <RefreshCw size={16} className={syncing ? "animate-spin text-rail-accent" : ""} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-rail-border/50 text-rail-muted hover:text-rail-accent transition-colors">
          <Bell size={16} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-rail-red rounded-full" />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-rail-accent/20 border border-rail-accent/40 flex items-center justify-center text-xs font-bold text-rail-accent">
          OP
        </div>
      </div>
    </header>
  );
}
