import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import Dashboard from "./pages/Dashboard";
import RailwayMap from "./pages/RailwayMap";
import DelayPrediction from "./pages/DelayPrediction";
import CongestionPrediction from "./pages/CongestionPrediction";
import SimulationEngine from "./pages/SimulationEngine";
import AICopilot from "./pages/AICopilot";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-rail-bg grid-bg">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/map" element={<RailwayMap />} />
            <Route path="/delay" element={<DelayPrediction />} />
            <Route path="/congestion" element={<CongestionPrediction />} />
            <Route path="/simulation" element={<SimulationEngine />} />
            <Route path="/copilot" element={<AICopilot />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
