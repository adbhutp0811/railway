import React, { useState } from "react";
import { Clock, TrendingUp, CloudRain, AlertTriangle, ChevronDown, ChevronUp, Brain } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, ReferenceLine
} from "recharts";
import SectionHeader from "../components/SectionHeader";
import RiskBadge from "../components/RiskBadge";
import MetricCard from "../components/MetricCard";
import { delayPredictions, hourlyDelayData, trains, weatherData } from "../data/railwayData";

const factors = [
  { name: "Weather Conditions", weight: 32, color: "#00d4ff", icon: "🌧️" },
  { name: "Historical Patterns", weight: 28, color: "#00ff88", icon: "📊" },
  { name: "Passenger Load", weight: 18, color: "#ffcc00", icon: "👥" },
  { name: "Track Health", weight: 12, color: "#8b5cf6", icon: "🔧" },
  { name: "Signal Status", weight: 10, color: "#ff8800", icon: "🚦" },
];

const stationDelayHistory = [
  { day: "Mon", northgate: 3, southbridge: 5, airport: 4, central: 2 },
  { day: "Tue", northgate: 5, southbridge: 8, airport: 6, central: 3 },
  { day: "Wed", northgate: 4, southbridge: 6, airport: 5, central: 2 },
  { day: "Thu", northgate: 7, southbridge: 12, airport: 8, central: 4 },
  { day: "Fri", northgate: 9, southbridge: 14, airport: 11, central: 5 },
  { day: "Sat", northgate: 6, southbridge: 9, airport: 7, central: 3 },
  { day: "Today", northgate: 12, southbridge: 18, airport: 11, central: 3 },
];

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

export default function DelayPrediction() {
  const [expanded, setExpanded] = useState(null);
  const [selectedModel, setSelectedModel] = useState("xgboost");

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      <SectionHeader
        icon={Clock}
        title="Delay Prediction Engine"
        subtitle="AI-powered delay forecasting · XGBoost + LSTM models · Updated every 5 minutes"
        color="yellow"
        action={
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-rail-muted font-mono">MODEL:</span>
            {["xgboost", "lstm", "rf"].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedModel(m)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold border transition-colors ${
                  selectedModel === m
                    ? "bg-rail-accent/20 border-rail-accent text-rail-accent"
                    : "border-rail-border text-rail-muted hover:text-rail-accent"
                }`}
              >
                {m.toUpperCase()}
              </button>
            ))}
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Brain} label="Model Accuracy" value="94.2%" sub="XGBoost · 30-day avg" color="green" />
        <MetricCard icon={Clock} label="Avg Predicted Delay" value="8.4m" sub="Next 2 hours" color="yellow" trend={14} />
        <MetricCard icon={AlertTriangle} label="High Risk Stations" value="3" sub="Threshold: 10 min" color="red" />
        <MetricCard icon={TrendingUp} label="Prediction Horizon" value="2h" sub="Rolling forecast" color="accent" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Hourly Delay */}
        <div className="panel-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Actual vs Predicted Delay</h2>
              <p className="text-[10px] text-rail-muted font-mono">Today · All corridors combined</p>
            </div>
            <span className="text-[10px] bg-rail-green/10 text-rail-green border border-rail-green/30 px-2 py-0.5 rounded font-mono">
              MAE: 0.8 min
            </span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hourlyDelayData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
              <XAxis dataKey="time" tick={{ fill: "#4a6080", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4a6080", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#4a6080" }} />
              <ReferenceLine y={10} stroke="#ff4444" strokeDasharray="4 2" strokeWidth={1} label={{ value: "Alert", fill: "#ff4444", fontSize: 9 }} />
              <Line type="monotone" dataKey="delay" name="Actual" stroke="#ff8800" strokeWidth={2} dot={{ r: 3, fill: "#ff8800" }} />
              <Line type="monotone" dataKey="predicted" name="AI Predicted" stroke="#00d4ff" strokeWidth={2} strokeDasharray="4 2" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Station History */}
        <div className="panel-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Station Delay History (7 days)</h2>
              <p className="text-[10px] text-rail-muted font-mono">Minutes late per key station</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stationDelayHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
              <XAxis dataKey="day" tick={{ fill: "#4a6080", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#4a6080", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 10, color: "#4a6080" }} />
              <Bar dataKey="northgate" name="Northgate" fill="#ff4444" radius={[2, 2, 0, 0]} />
              <Bar dataKey="southbridge" name="Southbridge" fill="#ff8800" radius={[2, 2, 0, 0]} />
              <Bar dataKey="airport" name="Airport" fill="#ffcc00" radius={[2, 2, 0, 0]} />
              <Bar dataKey="central" name="Central Hub" fill="#00d4ff" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Predictions Table */}
        <div className="xl:col-span-2 panel-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-4">Station Delay Predictions — Next 2 Hours</h2>
          <div className="space-y-3">
            {delayPredictions.map((d, i) => (
              <div key={i} className="rounded-xl bg-rail-card border border-rail-border overflow-hidden">
                <button
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-rail-border/20 transition-colors"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-white">{d.station}</span>
                      <RiskBadge level={d.risk} />
                    </div>
                    <div className="text-[10px] text-rail-muted font-mono">{d.cause}</div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-center">
                      <div className="text-[10px] text-rail-muted font-mono">CURRENT</div>
                      <div className="text-sm font-mono text-rail-yellow">{d.current} min</div>
                    </div>
                    <div className="text-rail-muted">→</div>
                    <div className="text-center">
                      <div className="text-[10px] text-rail-muted font-mono">PREDICTED</div>
                      <div className={`text-sm font-mono font-bold ${d.predicted > d.current ? "text-rail-red" : "text-rail-green"}`}>
                        {d.predicted} min
                      </div>
                    </div>
                    {expanded === i ? <ChevronUp size={14} className="text-rail-muted" /> : <ChevronDown size={14} className="text-rail-muted" />}
                  </div>
                </button>
                {expanded === i && (
                  <div className="border-t border-rail-border p-4 bg-rail-bg/50">
                    <div className="grid grid-cols-3 gap-4 text-xs font-mono">
                      <div>
                        <div className="text-rail-muted mb-1">DELAY INCREASE</div>
                        <div className="text-rail-red font-bold">+{d.predicted - d.current} min</div>
                      </div>
                      <div>
                        <div className="text-rail-muted mb-1">CONFIDENCE</div>
                        <div className="text-rail-green font-bold">
                          {d.risk === "low" ? "96%" : d.risk === "medium" ? "91%" : d.risk === "high" ? "87%" : "82%"}
                        </div>
                      </div>
                      <div>
                        <div className="text-rail-muted mb-1">PRIMARY CAUSE</div>
                        <div className="text-rail-text">{d.cause.split(",")[0]}</div>
                      </div>
                    </div>
                    <div className="mt-3 p-2 rounded bg-rail-accent/5 border border-rail-accent/20 text-[10px] text-rail-accent font-mono">
                      💡 RECOMMENDATION: {
                        d.risk === "critical" ? "Immediate intervention required. Consider service diversion." :
                        d.risk === "high" ? "Notify passengers. Pre-position staff at affected platforms." :
                        d.risk === "medium" ? "Monitor closely. Issue advisory if delay exceeds 10 min." :
                        "No action required. Continue monitoring."
                      }
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feature Importance */}
        <div className="space-y-4">
          <div className="panel-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-white mb-4">Model Feature Importance</h2>
            <p className="text-[10px] text-rail-muted font-mono mb-4">Factors driving delay predictions</p>
            <div className="space-y-3">
              {factors.map((f) => (
                <div key={f.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{f.icon}</span>
                      <span className="text-xs text-rail-text">{f.name}</span>
                    </div>
                    <span className="text-xs font-mono font-bold" style={{ color: f.color }}>{f.weight}%</span>
                  </div>
                  <div className="w-full h-2 bg-rail-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full risk-bar"
                      style={{ width: `${f.weight}%`, backgroundColor: f.color, opacity: 0.8 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weather Impact */}
          <div className="panel-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CloudRain size={14} className="text-rail-yellow" />
              <h2 className="text-sm font-semibold text-white">Weather Impact</h2>
            </div>
            <div className="p-3 rounded-lg bg-rail-yellow/10 border border-rail-yellow/30 mb-3">
              <div className="text-xs text-rail-yellow font-mono font-bold">{weatherData.condition}</div>
              <div className="text-[10px] text-rail-muted mt-1">{weatherData.alert}</div>
            </div>
            <div className="space-y-2 text-[11px] font-mono">
              {[
                { label: "Temperature", value: `${weatherData.temp}°C` },
                { label: "Wind Speed", value: `${weatherData.wind} km/h` },
                { label: "Visibility", value: `${weatherData.visibility} km` },
                { label: "Humidity", value: `${weatherData.humidity}%` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-rail-muted">{label}</span>
                  <span className="text-rail-text">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
