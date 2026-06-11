import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Map, Clock, Users, Zap, Bot,
  ChevronLeft, ChevronRight, Train, Activity
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Overview", badge: null },
  { to: "/map", icon: Map, label: "Railway Map", badge: "LIVE" },
  { to: "/delay", icon: Clock, label: "Delay Prediction", badge: "4" },
  { to: "/congestion", icon: Users, label: "Congestion", badge: "2" },
  { to: "/simulation", icon: Zap, label: "Simulation", badge: null },
  { to: "/copilot", icon: Bot, label: "AI Copilot", badge: "AI" },
];

export default function Sidebar({ open, setOpen }) {
  return (
    <aside
      className={clsx(
        "flex flex-col h-full transition-all duration-300 ease-in-out",
        "border-r border-rail-border bg-rail-panel relative z-20",
        open ? "w-56" : "w-16"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-rail-border min-h-[64px]">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-rail-accent/20 border border-rail-accent/40 flex items-center justify-center">
          <Train size={16} className="text-rail-accent" />
        </div>
        {open && (
          <div className="overflow-hidden">
            <div className="text-sm font-bold text-white whitespace-nowrap font-mono">RailTwin AI</div>
            <div className="text-[10px] text-rail-muted whitespace-nowrap">Digital Twin Platform</div>
          </div>
        )}
      </div>

      {/* System Status */}
      {open && (
        <div className="mx-3 my-3 p-2 rounded-lg bg-rail-green/10 border border-rail-green/20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-rail-green status-online flex-shrink-0" />
            <span className="text-[10px] text-rail-green font-mono">SYSTEM ONLINE</span>
          </div>
          <div className="text-[9px] text-rail-muted mt-1 font-mono">Twin Sync: 98.4%</div>
        </div>
      )}
      {!open && (
        <div className="flex justify-center my-3">
          <span className="w-2 h-2 rounded-full bg-rail-green status-online" />
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, badge }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              clsx(
                "sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg border-l-2 cursor-pointer",
                isActive
                  ? "active bg-rail-accent/10 border-rail-accent text-rail-accent"
                  : "border-transparent text-rail-text hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={16} className={clsx("flex-shrink-0", isActive ? "text-rail-accent" : "text-rail-muted")} />
                {open && (
                  <span className="text-sm font-medium flex-1 whitespace-nowrap">{label}</span>
                )}
                {open && badge && (
                  <span className={clsx(
                    "text-[9px] font-mono px-1.5 py-0.5 rounded font-bold",
                    badge === "LIVE" ? "bg-rail-green/20 text-rail-green" :
                    badge === "AI" ? "bg-rail-purple/20 text-rail-purple" :
                    "bg-rail-red/20 text-rail-red"
                  )}>
                    {badge}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-rail-border p-3">
        {open && (
          <div className="mb-2 px-2">
            <div className="flex items-center justify-between text-[10px] text-rail-muted font-mono mb-1">
              <span>Network Health</span>
              <span className="text-rail-yellow">72%</span>
            </div>
            <div className="w-full h-1.5 bg-rail-border rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-rail-yellow to-rail-orange" style={{ width: "72%" }} />
            </div>
          </div>
        )}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-rail-border/50 text-rail-muted hover:text-rail-accent transition-colors"
        >
          {open ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          {open && <span className="text-xs">Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
