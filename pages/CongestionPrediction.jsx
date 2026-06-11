import React, { useState } from "react";
import { Users, TrendingUp, TrendingDown, Minus, AlertTriangle, Clock } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadialBarChart, RadialBar
} from "recharts";
import SectionHeader from "../components/SectionHeader";
import RiskBadge from "../components/RiskBadge";
import MetricCard from "../components/MetricCard";
import { congestionData, passengerFlowData } from "../data/railwayData";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-rail-card border border-rail-border rounded-lg p-3 text-xs font-mono">
        <div className="text-rail-muted mb-1">{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>{p.name}: {p.value.toLocaleString()} pax</div>
        ))}
      </div>
    );
  }
  return null;
};

const trendIcon = (trend) => {
  if (trend === "rising") return <TrendingUp size={12} className="text-rail-red" />;
  if (trend === "falling") return <TrendingDown size={12} className="text-rail-green" />;
  return <Minus size={12} className="text-rail-muted" />;
};

function CongestionMeter({ level, riskLevel }) {
  const color =
    riskLevel === "critical" ? "#ff4444" :
    riskLevel === "high" ? "#ff8800" :
    riskLevel === "medium" ? "#ffcc00" : "#00ff88";

  const dashArray = 2 * Math.PI * 28;
  const dashOffset = dashArray * (1 - level / 100);

  return (
    <div className="relative w-20 h-20 flex-shrink-0">
      <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
        <circle cx="32" cy="32" r="28" fill="none" stroke="#1a3a5c" strokeWidth="5" />
        <circle
          cx="32" cy="32" r="28"
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold font-mono" style={{ color }}>{level}%</span>
      </div>
    </div>
  );
}

export default function CongestionPrediction() {
  const [selectedStation, setSelectedStation] = useState(null);
  const critical = congestionData.filter(s => s.riskLevel === "critical" || s.riskLevel === "high");

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      <SectionHeader
        icon={Users}
        title="Congestion Prediction"
        subtitle="AI crowd forecasting · Passenger flow patterns · Risk assessment"
        color="purple"
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rail-red/10 border border-rail-red/30">
            <AlertTriangle size={12} className="text-rail-red" />
            <span className="text-xs text-rail-red font-mono">2 STATIONS CRITICAL</span>
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Users} label="Critical Stations" value="2" sub="Above 90% capacity" color="red" />
        <MetricCard icon={TrendingUp} label="Rising Congestion" value="3" sub="Trend: increasing" color="orange" />
        <MetricCard icon={Clock} label="Next Peak" value="08:45" sub="Southbridge forecast" color="yellow" />
        <MetricCard icon={AlertTriangle} label="Overflow Risk" value="High" sub="Northgate imminent" color="red" />
      </div>

      {/* Critical Alert */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {critical.map((s) => (
          <div key={s.station} className={`p-4 rounded-xl border ${
            s.riskLevel === "critical" ? "bg-rail-red/10 border-rail-red/40" : "bg-rail-orange/10 border-rail-orange/40"
          }`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${s.riskLevel === "critical" ? "bg-rail-red/20" : "bg-rail-orange/20"}`}>
                <AlertTriangle size={16} className={s.riskLevel === "critical" ? "text-rail-red" : "text-rail-orange"} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white">{s.station}</div>
                <div className="text-[10px] font-mono text-rail-muted">
                  {s.level}% capacity · Peak at {s.peak} · Trend: {s.trend}
                </div>
              </div>
              <RiskBadge level={s.riskLevel} size="md" />
            </div>
            <div className="mt-3 text-[10px] font-mono text-rail-muted">
              💡 Deploy crowd management staff · Activate overflow protocols · Issue passenger advisory
            </div>
          </div>
        ))}
      </div>

      {/* Passenger Flow Chart */}
      <div className="panel-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-white">Passenger Flow — Today</h2>
            <p className="text-[10px] text-rail-muted font-mono">Hourly passenger count by station</p>
          </div>
          <span className="text-[10px] text-rail-accent font-mono bg-rail-accent/10 px-2 py-0.5 rounded border border-rail-accent/20">
            AI FORECAST
          </span>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={passengerFlowData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              {[
                { id: "ng", color: "#ff4444" },
                { id: "ch", color: "#00d4ff" },
                { id: "sb", color: "#ff8800" },
                { id: "ap", color: "#8b5cf6" },
              ].map(({ id, color }) => (
                <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
            <XAxis dataKey="time" tick={{ fill: "#4a6080", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#4a6080", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 10, color: "#4a6080" }} />
            <Area type="monotone" dataKey="northgate" name="Northgate" stroke="#ff4444" strokeWidth={2} fill="url(#ng)" />
            <Area type="monotone" dataKey="central" name="Central Hub" stroke="#00d4ff" strokeWidth={2} fill="url(#ch)" />
            <Area type="monotone" dataKey="southbridge" name="Southbridge" stroke="#ff8800" strokeWidth={2} fill="url(#sb)" />
            <Area type="monotone" dataKey="airport" name="Airport Express" stroke="#8b5cf6" strokeWidth={2} fill="url(#ap)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Station Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {congestionData.map((s) => (
          <button
            key={s.station}
            onClick={() => setSelectedStation(selectedStation?.station === s.station ? null : s)}
            className={`panel-border rounded-xl p-4 text-left card-hover transition-all ${
              selectedStation?.station === s.station ? "border-rail-accent/50" : ""
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-white">{s.station}</div>
                <div className="flex items-center gap-1 mt-1">
                  {trendIcon(s.trend)}
                  <span className="text-[10px] text-rail-muted font-mono capitalize">{s.trend}</span>
                </div>
              </div>
              <RiskBadge level={s.riskLevel} />
            </div>
            <CongestionMeter level={s.level} riskLevel={s.riskLevel} />
            <div className="mt-3 space-y-1 text-[10px] font-mono">
              <div className="flex justify-between">
                <span className="text-rail-muted">Peak Time</span>
                <span className="text-rail-text">{s.peak}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rail-muted">Load</span>
                <span className={
                  s.level > 90 ? "text-rail-red" :
                  s.level > 75 ? "text-rail-orange" :
                  s.level > 60 ? "text-rail-yellow" : "text-rail-green"
                }>{s.level}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Selected Station Detail */}
      {selectedStation && (
        <div className="panel-border rounded-xl p-5 border-rail-accent/30">
          <div className="flex items-center gap-3 mb-4">
            <Users size={16} className="text-rail-accent" />
            <h2 className="text-sm font-semibold text-white">Detailed Analysis — {selectedStation.station}</h2>
            <RiskBadge level={selectedStation.riskLevel} size="md" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 rounded-lg bg-rail-card border border-rail-border">
              <div className="text-rail-muted mb-1">CURRENT LOAD</div>
              <div className={`text-xl font-bold ${selectedStation.level > 90 ? "text-rail-red" : "text-rail-yellow"}`}>
                {selectedStation.level}%
              </div>
            </div>
            <div className="p-3 rounded-lg bg-rail-card border border-rail-border">
              <div className="text-rail-muted mb-1">TREND</div>
              <div className="flex items-center gap-1 text-xl font-bold">
                {trendIcon(selectedStation.trend)}
                <span className="text-rail-text capitalize">{selectedStation.trend}</span>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-rail-card border border-rail-border">
              <div className="text-rail-muted mb-1">PEAK TIME</div>
              <div className="text-xl font-bold text-rail-yellow">{selectedStation.peak}</div>
            </div>
            <div className="p-3 rounded-lg bg-rail-card border border-rail-border">
              <div className="text-rail-muted mb-1">RISK LEVEL</div>
              <div className="mt-1"><RiskBadge level={selectedStation.riskLevel} size="md" /></div>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-rail-accent/5 border border-rail-accent/20 text-xs text-rail-accent font-mono">
            💡 AI RECOMMENDATION: {
              selectedStation.riskLevel === "critical"
                ? `Immediate action required at ${selectedStation.station}. Activate overflow protocols, deploy 3 additional staff to platforms, issue real-time passenger advisory via app and displays.`
                : selectedStation.riskLevel === "high"
                ? `Monitor ${selectedStation.station} closely. Pre-position crowd management staff. Consider platform capacity messaging.`
                : `${selectedStation.station} is within acceptable parameters. Continue standard monitoring.`
            }
          </div>
        </div>
      )}
    </div>
  );
}
