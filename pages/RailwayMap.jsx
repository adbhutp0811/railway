import React, { useState, useEffect, useRef } from "react";
import { Map, Train, Info, Layers, ZoomIn, ZoomOut, RefreshCw } from "lucide-react";
import RiskBadge from "../components/RiskBadge";
import SectionHeader from "../components/SectionHeader";
import { stations, routes, trains } from "../data/railwayData";

function getStationById(id) {
  return stations.find((s) => s.id === id);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function RailwayMap() {
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [trainPositions, setTrainPositions] = useState(
    trains.map((t) => ({ ...t }))
  );
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const animRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setTrainPositions((prev) =>
        prev.map((t) => {
          const speed = t.status === "stopped" ? 0 : 0.002;
          const newProgress = (t.progress + speed) % 1;
          return { ...t, progress: newProgress };
        })
      );
    }, 100);
    return () => clearInterval(interval);
  }, []);

  function getTrainPosition(train) {
    const route = routes.find((r) => r.id === train.route);
    if (!route) return { x: 50, y: 50 };
    const from = getStationById(route.from);
    const to = getStationById(route.to);
    if (!from || !to) return { x: 50, y: 50 };
    return {
      x: lerp(from.x, to.x, train.progress),
      y: lerp(from.y, to.y, train.progress),
    };
  }

  const statusDotColor = {
    normal: "#00ff88",
    warning: "#ffcc00",
    congested: "#ff8800",
    critical: "#ff4444",
  };

  return (
    <div className="space-y-4 max-w-screen-2xl mx-auto">
      <SectionHeader
        icon={Map}
        title="Digital Railway Map"
        subtitle="Live train positions · Station status · Route visualization"
        color="accent"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLabels(!showLabels)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono border border-rail-border hover:border-rail-accent/40 text-rail-muted hover:text-rail-accent transition-colors"
            >
              <Layers size={12} className="inline mr-1" />
              Labels {showLabels ? "ON" : "OFF"}
            </button>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rail-green/10 border border-rail-green/30">
              <span className="w-2 h-2 rounded-full bg-rail-green status-online" />
              <span className="text-xs text-rail-green font-mono">LIVE</span>
            </div>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Map Canvas */}
        <div className="xl:col-span-3 panel-border rounded-xl overflow-hidden relative" style={{ height: 520 }}>
          {/* Scan line effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
            <div className="scan-line" />
          </div>

          {/* Controls */}
          <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
            <button onClick={() => setZoom(Math.min(zoom + 0.2, 2))} className="p-2 rounded-lg bg-rail-card border border-rail-border hover:border-rail-accent/40 text-rail-muted hover:text-rail-accent transition-colors">
              <ZoomIn size={14} />
            </button>
            <button onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))} className="p-2 rounded-lg bg-rail-card border border-rail-border hover:border-rail-accent/40 text-rail-muted hover:text-rail-accent transition-colors">
              <ZoomOut size={14} />
            </button>
          </div>

          {/* Zoom indicator */}
          <div className="absolute bottom-3 left-3 z-20 text-[10px] font-mono text-rail-muted bg-rail-card/80 px-2 py-1 rounded">
            ZOOM: {Math.round(zoom * 100)}% · {trains.length} TRAINS · {stations.length} STATIONS
          </div>

          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.3s ease" }}
          >
            {/* Background grid */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,212,255,0.04)" strokeWidth="0.2" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />

            {/* Routes */}
            {routes.map((route) => {
              const from = getStationById(route.from);
              const to = getStationById(route.to);
              if (!from || !to) return null;
              return (
                <g key={route.id}>
                  {/* Shadow */}
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={route.color}
                    strokeWidth="1.2"
                    opacity="0.15"
                  />
                  {/* Main track */}
                  <line
                    x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                    stroke={route.color}
                    strokeWidth={route.active ? "0.6" : "0.3"}
                    opacity={route.active ? 0.8 : 0.3}
                    strokeDasharray={route.active ? "none" : "2 2"}
                    className={route.active ? "map-track" : ""}
                  />
                  {/* Route label */}
                  {showLabels && (
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 1.5}
                      fontSize="1.8"
                      fill={route.color}
                      opacity="0.6"
                      textAnchor="middle"
                    >
                      {route.name}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Stations */}
            {stations.map((station) => {
              const color = statusDotColor[station.status] || "#00ff88";
              const isSelected = selectedStation?.id === station.id;
              return (
                <g
                  key={station.id}
                  onClick={() => {
                    setSelectedStation(isSelected ? null : station);
                    setSelectedTrain(null);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {/* Glow ring */}
                  {(station.status === "critical" || station.status === "congested") && (
                    <circle
                      cx={station.x} cy={station.y} r="3.5"
                      fill="none"
                      stroke={color}
                      strokeWidth="0.3"
                      opacity="0.4"
                      className="pulse-ring"
                    />
                  )}
                  {/* Station circle */}
                  <circle
                    cx={station.x} cy={station.y} r={isSelected ? 2.8 : 2.2}
                    fill={color}
                    opacity={isSelected ? 1 : 0.85}
                    stroke={isSelected ? "#fff" : color}
                    strokeWidth={isSelected ? "0.4" : "0.2"}
                  />
                  {/* Inner dot */}
                  <circle cx={station.x} cy={station.y} r="0.8" fill="#050d1a" opacity="0.8" />
                  {/* Label */}
                  {showLabels && (
                    <text
                      x={station.x}
                      y={station.y + 4}
                      fontSize="2"
                      fill="#c8d8f0"
                      opacity="0.9"
                      textAnchor="middle"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {station.name}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Trains */}
            {trainPositions.map((train) => {
              const pos = getTrainPosition(train);
              const isSelected = selectedTrain?.id === train.id;
              const color = train.status === "on-time" ? "#00ff88" : train.status === "delayed" ? "#ffcc00" : "#ff4444";
              return (
                <g
                  key={train.id}
                  onClick={() => {
                    setSelectedTrain(isSelected ? null : train);
                    setSelectedStation(null);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {isSelected && (
                    <circle cx={pos.x} cy={pos.y} r="3" fill="none" stroke={color} strokeWidth="0.4" opacity="0.5" className="pulse-ring" />
                  )}
                  <rect
                    x={pos.x - 2} y={pos.y - 1.2}
                    width="4" height="2.4"
                    rx="0.5"
                    fill={color}
                    opacity={isSelected ? 1 : 0.9}
                    stroke="#050d1a"
                    strokeWidth="0.2"
                  />
                  <text
                    x={pos.x} y={pos.y + 0.5}
                    fontSize="1.4"
                    fill="#050d1a"
                    textAnchor="middle"
                    style={{ fontFamily: "monospace", fontWeight: "bold" }}
                  >
                    T
                  </text>
                  {showLabels && (
                    <text
                      x={pos.x} y={pos.y - 2.5}
                      fontSize="1.8"
                      fill={color}
                      textAnchor="middle"
                      opacity="0.9"
                    >
                      {train.id}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Legend */}
          <div className="panel-border rounded-xl p-4">
            <h3 className="text-xs font-semibold text-white mb-3">Legend</h3>
            <div className="space-y-2 text-xs">
              <div className="font-semibold text-rail-muted font-mono text-[10px] mb-1">STATIONS</div>
              {[
                { color: "#00ff88", label: "Normal" },
                { color: "#ffcc00", label: "Warning" },
                { color: "#ff8800", label: "Congested" },
                { color: "#ff4444", label: "Critical" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-rail-text">{label}</span>
                </div>
              ))}
              <div className="font-semibold text-rail-muted font-mono text-[10px] mt-3 mb-1">TRAINS</div>
              {[
                { color: "#00ff88", label: "On Time" },
                { color: "#ffcc00", label: "Delayed" },
                { color: "#ff4444", label: "Stopped" },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-4 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-rail-text">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Info */}
          {selectedStation && (
            <div className="panel-border rounded-xl p-4 border-rail-accent/30">
              <div className="flex items-center gap-2 mb-3">
                <Info size={14} className="text-rail-accent" />
                <span className="text-xs font-semibold text-white">Station Info</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold text-rail-accent">{selectedStation.name}</div>
                <RiskBadge level={selectedStation.status} size="md" />
                <div className="space-y-1 text-[11px] font-mono mt-2">
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Passengers</span>
                    <span className="text-rail-text">{selectedStation.passengers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Capacity</span>
                    <span className="text-rail-text">{selectedStation.capacity.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Load</span>
                    <span className={selectedStation.passengers / selectedStation.capacity > 0.9 ? "text-rail-red" : "text-rail-green"}>
                      {Math.round((selectedStation.passengers / selectedStation.capacity) * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Platforms</span>
                    <span className="text-rail-text">{selectedStation.platform}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Delay</span>
                    <span className={selectedStation.delay > 0 ? "text-rail-red" : "text-rail-green"}>
                      {selectedStation.delay > 0 ? `+${selectedStation.delay} min` : "None"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {selectedTrain && (
            <div className="panel-border rounded-xl p-4 border-rail-accent/30">
              <div className="flex items-center gap-2 mb-3">
                <Train size={14} className="text-rail-accent" />
                <span className="text-xs font-semibold text-white">Train Info</span>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-bold text-rail-accent">{selectedTrain.name}</div>
                <RiskBadge level={selectedTrain.status === "on-time" ? "normal" : selectedTrain.status === "delayed" ? "warning" : "critical"} size="md" />
                <div className="space-y-1 text-[11px] font-mono mt-2">
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Speed</span>
                    <span className="text-rail-text">{selectedTrain.speed} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Passengers</span>
                    <span className="text-rail-text">{selectedTrain.passengers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Cars</span>
                    <span className="text-rail-text">{selectedTrain.cars}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Delay</span>
                    <span className={selectedTrain.delay > 0 ? "text-rail-red" : "text-rail-green"}>
                      {selectedTrain.delay > 0 ? `+${selectedTrain.delay} min` : "None"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-rail-muted">Progress</span>
                    <span className="text-rail-text">{Math.round(selectedTrain.progress * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!selectedStation && !selectedTrain && (
            <div className="panel-border rounded-xl p-4 text-center">
              <Info size={24} className="text-rail-muted mx-auto mb-2" />
              <p className="text-xs text-rail-muted">Click a station or train on the map to view details</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="panel-border rounded-xl p-4">
            <h3 className="text-xs font-semibold text-white mb-3 font-mono">NETWORK STATS</h3>
            <div className="space-y-2 text-[11px] font-mono">
              {[
                { label: "Total Routes", value: `${routes.length}`, color: "text-rail-accent" },
                { label: "Active Trains", value: `${trains.filter(t => t.status !== "stopped").length}/${trains.length}`, color: "text-rail-green" },
                { label: "Delayed Trains", value: `${trains.filter(t => t.delay > 0).length}`, color: "text-rail-yellow" },
                { label: "Critical Stations", value: `${stations.filter(s => s.status === "critical").length}`, color: "text-rail-red" },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-rail-muted">{label}</span>
                  <span className={color}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
