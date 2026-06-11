import React, { useState, useEffect } from "react";
import { Zap, Play, Square, RotateCcw, AlertTriangle, TrendingUp, Activity, ChevronRight } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import SectionHeader from "../components/SectionHeader";
import RiskBadge from "../components/RiskBadge";
import MetricCard from "../components/MetricCard";
import { simulationScenarios } from "../data/railwayData";

const impactData = [
  { subject: "Delay Impact", A: 78, B: 45, fullMark: 100 },
  { subject: "Congestion", A: 85, B: 30, fullMark: 100 },
  { subject: "Safety Risk", A: 62, B: 20, fullMark: 100 },
  { subject: "Revenue Loss", A: 70, B: 35, fullMark: 100 },
  { subject: "Passenger Exp.", A: 80, B: 40, fullMark: 100 },
  { subject: "Recovery Time", A: 75, B: 50, fullMark: 100 },
];

const cascadeData = [
  { station: "Central Hub", before: 0, after: 8, mitigated: 3 },
  { station: "Northgate", before: 7, after: 19, mitigated: 12 },
  { station: "Southbridge", before: 14, after: 28, mitigated: 18 },
  { station: "Airport", before: 9, after: 17, mitigated: 11 },
  { station: "Eastport", before: 4, after: 12, mitigated: 7 },
];

const CascadeTooltip = ({ active, payload, label }) => {
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

const steps = [
  { step: 1, label: "Normal Operations", desc: "All trains running on schedule. Network health: 95%.", status: "done", icon: "✅" },
  { step: 2, label: "Event Introduced", desc: "Heavy rainfall near Northgate. Signal interference detected.", status: "done", icon: "🌧️" },
  { step: 3, label: "Delay Detection", desc: "AI model detects possible delays on North & South lines.", status: "done", icon: "🔍" },
  { step: 4, label: "Congestion Identified", desc: "Passenger load rising at Northgate (96%) and Southbridge (95%).", status: "active", icon: "👥" },
  { step: 5, label: "Network Impact", desc: "Cascade delay propagation calculated across 5 downstream stations.", status: "pending", icon: "📊" },
  { step: 6, label: "AI Recommendations", desc: "Copilot generating intervention actions for operators.", status: "pending", icon: "🤖" },
  { step: 7, label: "Intervention Applied", desc: "Reduced risk after operator actions. Network health recovering.", status: "pending", icon: "✨" },
];

export default function SimulationEngine() {
  const [activeScenario, setActiveScenario] = useState(null);
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(3);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 100) {
            setRunning(false);
            setCurrentStep(7);
            return 100;
          }
          setCurrentStep(Math.floor((p / 100) * 7) + 1);
          return p + 2;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [running]);

  const handleRun = (scenario) => {
    setActiveScenario(scenario);
    setRunning(true);
    setProgress(0);
    setCurrentStep(1);
  };

  const handleStop = () => {
    setRunning(false);
  };

  const handleReset = () => {
    setRunning(false);
    setProgress(0);
    setCurrentStep(3);
    setActiveScenario(null);
  };

  return (
    <div className="space-y-6 max-w-screen-2xl mx-auto">
      <SectionHeader
        icon={Zap}
        title="Simulation Engine"
        subtitle="Model disruptions · Analyze cascade impact · Test interventions"
        color="yellow"
        action={
          <div className="flex items-center gap-2">
            {running ? (
              <button onClick={handleStop} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rail-red/20 border border-rail-red/40 text-rail-red text-sm font-mono hover:bg-rail-red/30 transition-colors">
                <Square size={14} /> Stop Simulation
              </button>
            ) : (
              <button onClick={handleReset} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-rail-border hover:bg-rail-card border border-rail-border text-rail-muted text-sm font-mono transition-colors">
                <RotateCcw size={14} /> Reset
              </button>
            )}
          </div>
        }
      />

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard icon={Activity} label="Simulations Run" value="47" sub="This session" color="accent" />
        <MetricCard icon={AlertTriangle} label="Highest Risk Score" value="94/100" sub="Equipment Failure" color="red" />
        <MetricCard icon={TrendingUp} label="Avg Cascade Delay" value="+12.4m" sub="Across scenarios" color="orange" />
        <MetricCard icon={Zap} label="Scenarios Available" value="4" sub="Ready to simulate" color="purple" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Scenario Cards */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Simulation Scenarios</h2>
          {simulationScenarios.map((scenario) => (
            <div
              key={scenario.id}
              className={`panel-border rounded-xl p-4 card-hover ${
                activeScenario?.id === scenario.id ? "border-rail-accent/50 bg-rail-accent/5" : ""
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{scenario.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">{scenario.name}</span>
                  </div>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                    scenario.status === "active" ? "bg-rail-red/20 text-rail-red" :
                    scenario.status === "planned" ? "bg-rail-yellow/20 text-rail-yellow" :
                    "bg-rail-accent/20 text-rail-accent"
                  }`}>
                    {scenario.status.toUpperCase()}
                  </span>
                </div>
              </div>
              <p className="text-[10px] text-rail-muted mb-3 leading-relaxed">{scenario.description}</p>
              <div className="grid grid-cols-2 gap-2 mb-3 text-[10px] font-mono">
                <div>
                  <span className="text-rail-muted">Risk Score</span>
                  <div className={`font-bold ${scenario.riskScore > 85 ? "text-rail-red" : "text-rail-yellow"}`}>
                    {scenario.riskScore}/100
                  </div>
                </div>
                <div>
                  <span className="text-rail-muted">Delay Impact</span>
                  <div className="text-rail-orange font-bold">{scenario.delayIncrease}</div>
                </div>
              </div>
              <div className="w-full h-1.5 bg-rail-border rounded-full mb-3 overflow-hidden">
                <div
                  className={`h-full rounded-full ${scenario.riskScore > 85 ? "bg-rail-red" : "bg-rail-yellow"}`}
                  style={{ width: `${scenario.riskScore}%` }}
                />
              </div>
              <button
                onClick={() => handleRun(scenario)}
                disabled={running}
                className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-mono font-bold transition-colors ${
                  running && activeScenario?.id === scenario.id
                    ? "bg-rail-accent/20 border border-rail-accent text-rail-accent"
                    : "bg-rail-card border border-rail-border hover:border-rail-accent/40 text-rail-muted hover:text-rail-accent"
                }`}
              >
                {running && activeScenario?.id === scenario.id ? (
                  <><Activity size={12} className="animate-pulse" /> RUNNING...</>
                ) : (
                  <><Play size={12} /> RUN SIMULATION</>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Simulation Visualization */}
        <div className="xl:col-span-2 space-y-4">
          {/* Progress */}
          {activeScenario && (
            <div className="panel-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{activeScenario.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{activeScenario.name}</div>
                    <div className="text-[10px] text-rail-muted font-mono">
                      {running ? "Simulation running..." : progress === 100 ? "Simulation complete" : "Paused"}
                    </div>
                  </div>
                </div>
                <span className="text-sm font-mono text-rail-accent">{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-2 bg-rail-border rounded-full overflow-hidden mb-4">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rail-accent to-rail-purple transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Steps */}
              <div className="space-y-2">
                {steps.map((s) => {
                  const isDone = s.step < currentStep;
                  const isActive = s.step === currentStep;
                  return (
                    <div key={s.step} className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${
                      isActive ? "bg-rail-accent/10 border border-rail-accent/30" :
                      isDone ? "opacity-60" : "opacity-30"
                    }`}>
                      <span className="text-base flex-shrink-0">{s.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`text-xs font-semibold ${isActive ? "text-rail-accent" : "text-rail-text"}`}>
                          Step {s.step}: {s.label}
                        </div>
                        <div className="text-[10px] text-rail-muted font-mono">{s.desc}</div>
                      </div>
                      {isActive && running && (
                        <div className="w-2 h-2 rounded-full bg-rail-accent animate-pulse flex-shrink-0 mt-1" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Radar */}
            <div className="panel-border rounded-xl p-5">
              <h3 className="text-xs font-semibold text-white mb-1">Impact Analysis</h3>
              <p className="text-[10px] text-rail-muted font-mono mb-3">Without vs With Intervention</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={impactData}>
                  <PolarGrid stroke="#1a3a5c" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "#4a6080", fontSize: 9 }} />
                  <Radar name="No Action" dataKey="A" stroke="#ff4444" fill="#ff4444" fillOpacity={0.2} />
                  <Radar name="With AI" dataKey="B" stroke="#00ff88" fill="#00ff88" fillOpacity={0.2} />
                  <Legend wrapperStyle={{ fontSize: 9, color: "#4a6080" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Cascade */}
            <div className="panel-border rounded-xl p-5">
              <h3 className="text-xs font-semibold text-white mb-1">Cascade Delay Impact</h3>
              <p className="text-[10px] text-rail-muted font-mono mb-3">Before / After / Mitigated (min)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={cascadeData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a3a5c" />
                  <XAxis dataKey="station" tick={{ fill: "#4a6080", fontSize: 8 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#4a6080", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CascadeTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 9, color: "#4a6080" }} />
                  <Bar dataKey="before" name="Before" fill="#00ff88" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="after" name="After Event" fill="#ff4444" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="mitigated" name="Mitigated" fill="#00d4ff" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Summary */}
          {!activeScenario && (
            <div className="panel-border rounded-xl p-6 text-center">
              <Zap size={32} className="text-rail-muted mx-auto mb-3" />
              <p className="text-sm text-rail-muted">Select a scenario from the left panel and click <strong className="text-rail-accent">Run Simulation</strong> to begin analysis</p>
            </div>
          )}

          {activeScenario && progress === 100 && (
            <div className="panel-border rounded-xl p-5 border-rail-green/30 bg-rail-green/5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">✅</span>
                <h3 className="text-sm font-semibold text-rail-green">Simulation Complete</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-rail-card border border-rail-border text-center">
                  <div className="text-rail-muted mb-1">RISK SCORE</div>
                  <div className="text-xl font-bold text-rail-red">{activeScenario.riskScore}</div>
                </div>
                <div className="p-3 rounded-lg bg-rail-card border border-rail-border text-center">
                  <div className="text-rail-muted mb-1">DELAY IMPACT</div>
                  <div className="text-xl font-bold text-rail-orange">{activeScenario.delayIncrease}</div>
                </div>
                <div className="p-3 rounded-lg bg-rail-card border border-rail-border text-center">
                  <div className="text-rail-muted mb-1">CONGESTION</div>
                  <div className="text-xl font-bold text-rail-yellow">{activeScenario.congestionIncrease}</div>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-rail-accent/5 border border-rail-accent/20 text-[10px] text-rail-accent font-mono">
                💡 AI COPILOT RECOMMENDATION: Immediate intervention on {activeScenario.affectedStations.join(", ")}. 
                Estimated recovery time with action: 25 minutes. Without action: 90+ minutes.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
