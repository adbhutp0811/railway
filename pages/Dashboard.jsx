import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Train, Clock, Users, AlertTriangle, Activity, Zap,
  TrendingUp, CloudRain, CheckCircle, XCircle, ArrowRight, Bot
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import MetricCard from "../components/MetricCard";
import RiskBadge from "../components/RiskBadge";
import SectionHeader from "../components/SectionHeader";
import {
  systemMetrics, trains, stations, delayPredictions,
  hourlyDelayData, weatherData, simulationScenarios
} from "../data/railwayData";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-rail-card border border-rail-border rounded-lg p-3 text-xs font-mono">
        <div className="text-rail-muted mb-1">{label}</div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color }}>{p.name}: {p.value} min</div>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 1), 5000);
    return () => clearInterval(t);
  }, []);

  const statusColor = { "on-time": "rail-green", delayed: "rail-yellow", stopped: "rail-red" };

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      {/* Header */}
      <SectionHeader
        icon={Activity}
        title="Operations Overview"
        subtitle="Real-time railway network status · Last sync: just now"
        color="accent"
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rail-green/10 border border-rail-green/30">
            <span className="w-2 h-2 rounded-full bg-rail-green status-online" />
            <span className="text-xs text-rail-green font-mono">LIVE MONITORING</span>
          </div>
        }
      />

      {/* Weather Alert Banner */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-rail-yellow/10 border border-rail-yellow/30">
        <CloudRain size={16} className="text-rail-yellow flex-shrink-0" />
        <span className="text-xs text-rail-yellow font-mono flex-1">{weatherData.alert}</span>
        <span className="text-[10px] text-rail-muted font-mono">WEATHER ADVISORY</span>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard icon={Train} label="Active Trains" value={systemMetrics.activeTrains} sub="6 routes monitored" color="accent" />
        <MetricCard icon={CheckCircle} label="On-Time Rate" value={`${systemMetrics.onTimeRate}%`} sub="Target: 90%" color="yellow" trend={-8} />
        <MetricCard icon={Clock} label="Avg Delay" value={`${systemMetrics.avgDelay}m`} sub="Across all trains" color="orange" trend={12} />
        <MetricCard icon={AlertTriangle} label="Active Alerts" value={systemMetrics.alertsActive} sub="2 critical, 2 high" color="red" />
        <MetricCard icon={Users} label="Passengers Today" value={`${(systemMetrics.passengersToday / 1000).toFixed(1)}K`} sub="Across all stations" color="purple" />
        <MetricCard icon={Activity} label="Network Health" value={`${systemMetrics.networkHealth}%`} sub="Degraded · Monitor" color="yellow" trend={-5} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Delay Chart */}
        <div className="xl:col-span-2 panel-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Delay Trend — Today</h2>
              <p className="text-[10px] text-rail-muted font-mono mt-0.5">Actual vs AI-Predicted delays (minutes)</p>
            </div>
            <Link to="/delay" className="text-xs text-rail-accent hover:underline flex items-center gap-1">
              Full Analysis <ArrowRight size={12} />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={hourlyDelayData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="delayGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff8800" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff8800" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
              <XAxis dataKey="time" tick={{ fill: "#4a6080", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4a6080", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#4a6080" }} />
              <Area type="monotone" dataKey="delay" name="Actual" stroke="#ff8800" strokeWidth={2} fill="url(#delayGrad)" dot={false} />
              <Area type="monotone" dataKey="predicted" name="Predicted" stroke="#00d4ff" strokeWidth={2} strokeDasharray="4 2" fill="url(#predGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Train Status */}
        <div className="panel-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Train Status</h2>
            <Link to="/map" className="text-xs text-rail-accent hover:underline flex items-center gap-1">
              Map <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {trains.map((train) => (
              <div key={train.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-rail-card border border-rail-border">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  train.status === "on-time" ? "bg-rail-green" :
                  train.status === "delayed" ? "bg-rail-yellow" : "bg-rail-red"
                } ${train.status === "stopped" ? "pulse-ring" : ""}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{train.name}</div>
                  <div className="text-[10px] text-rail-muted font-mono">
                    {train.speed > 0 ? `${train.speed} km/h` : "STOPPED"} · {train.passengers} pax
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {train.delay > 0 ? (
                    <span className="text-xs font-mono text-rail-red">+{train.delay}m</span>
                  ) : (
                    <span className="text-xs font-mono text-rail-green">ON TIME</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Station Risk */}
        <div className="panel-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Station Risk Levels</h2>
            <Link to="/congestion" className="text-xs text-rail-accent hover:underline flex items-center gap-1">
              Details <ArrowRight size={12} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {stations.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-rail-text truncate">{s.name}</span>
                    <span className="text-[10px] font-mono text-rail-muted ml-2 flex-shrink-0">
                      {Math.round((s.passengers / s.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-rail-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        s.status === "critical" ? "bg-rail-red" :
                        s.status === "congested" ? "bg-rail-orange" :
                        s.status === "warning" ? "bg-rail-yellow" : "bg-rail-green"
                      }`}
                      style={{ width: `${Math.round((s.passengers / s.capacity) * 100)}%` }}
                    />
                  </div>
                </div>
                <RiskBadge level={s.status} />
              </div>
            ))}
          </div>
        </div>

        {/* Delay Predictions */}
        <div className="panel-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Delay Predictions</h2>
            <span className="text-[10px] text-rail-accent font-mono bg-rail-accent/10 px-2 py-0.5 rounded">AI MODEL</span>
          </div>
          <div className="space-y-3">
            {delayPredictions.slice(0, 5).map((d, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-rail-card border border-rail-border">
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-white truncate">{d.station}</div>
                  <div className="text-[10px] text-rail-muted font-mono truncate">{d.cause}</div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-xs font-mono">
                    <span className="text-rail-muted">{d.current}m</span>
                    <span className="text-rail-muted mx-1">→</span>
                    <span className={d.predicted > d.current ? "text-rail-red" : "text-rail-green"}>
                      {d.predicted}m
                    </span>
                  </div>
                  <RiskBadge level={d.risk} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Simulations + AI Copilot CTA */}
        <div className="space-y-4">
          <div className="panel-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-white">Active Simulations</h2>
              <Link to="/simulation" className="text-xs text-rail-accent hover:underline flex items-center gap-1">
                All <ArrowRight size={12} />
              </Link>
            </div>
            <div className="space-y-2">
              {simulationScenarios.slice(0, 2).map((s) => (
                <div key={s.id} className="p-3 rounded-lg bg-rail-card border border-rail-border">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{s.icon}</span>
                    <span className="text-xs font-semibold text-white flex-1 truncate">{s.name}</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      s.status === "active" ? "bg-rail-red/20 text-rail-red" :
                      s.status === "planned" ? "bg-rail-yellow/20 text-rail-yellow" :
                      "bg-rail-accent/20 text-rail-accent"
                    }`}>
                      {s.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[10px] text-rail-muted font-mono">
                    Risk Score: <span className={s.riskScore > 85 ? "text-rail-red" : "text-rail-yellow"}>{s.riskScore}/100</span>
                    · Delay: {s.delayIncrease}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Copilot CTA */}
          <Link to="/copilot" className="block panel-border rounded-xl p-5 hover:border-rail-purple/50 transition-colors group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-rail-purple/20 border border-rail-purple/30">
                <Bot size={18} className="text-rail-purple" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">AI Operations Copilot</div>
                <div className="text-[10px] text-rail-muted">Ask anything about your network</div>
              </div>
            </div>
            <div className="p-3 rounded-lg bg-rail-bg border border-rail-border text-xs text-rail-muted font-mono italic">
              "Which route is most vulnerable today?"
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs text-rail-purple group-hover:gap-2 transition-all">
              Open Copilot <ArrowRight size={12} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}