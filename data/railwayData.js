export const stations = [
  { id: "S1", name: "Central Hub", x: 50, y: 48, status: "normal", passengers: 2840, capacity: 3500, platform: 8, delay: 0 },
  { id: "S2", name: "Northgate", x: 22, y: 20, status: "congested", passengers: 1920, capacity: 2000, platform: 4, delay: 7 },
  { id: "S3", name: "Eastport Terminal", x: 80, y: 22, status: "warning", passengers: 1450, capacity: 1800, platform: 6, delay: 4 },
  { id: "S4", name: "Westfield Jct.", x: 18, y: 65, status: "normal", passengers: 880, capacity: 1500, platform: 3, delay: 0 },
  { id: "S5", name: "Southbridge", x: 55, y: 80, status: "critical", passengers: 2100, capacity: 2200, platform: 5, delay: 14 },
  { id: "S6", name: "Riverside Halt", x: 82, y: 68, status: "normal", passengers: 560, capacity: 1200, platform: 2, delay: 2 },
  { id: "S7", name: "Airport Express", x: 88, y: 42, status: "warning", passengers: 3100, capacity: 3500, platform: 6, delay: 9 },
  { id: "S8", name: "Metro Park", x: 36, y: 55, status: "normal", passengers: 1200, capacity: 2000, platform: 4, delay: 1 },
];

export const routes = [
  { id: "R1", from: "S1", to: "S2", name: "North Line", color: "#00d4ff", active: true },
  { id: "R2", from: "S1", to: "S3", name: "East Line", color: "#00ff88", active: true },
  { id: "R3", from: "S1", to: "S4", name: "West Line", color: "#8b5cf6", active: true },
  { id: "R4", from: "S1", to: "S5", name: "South Line", color: "#ff8800", active: true },
  { id: "R5", from: "S3", to: "S7", name: "Airport Spur", color: "#ffcc00", active: true },
  { id: "R6", from: "S5", to: "S6", name: "River Line", color: "#00d4ff", active: true },
  { id: "R7", from: "S2", to: "S8", name: "Loop West", color: "#ff4444", active: false },
  { id: "R8", from: "S8", to: "S4", name: "Loop South", color: "#8b5cf6", active: true },
];

export const trains = [
  { id: "T001", name: "Express 001", route: "R1", progress: 0.35, speed: 112, status: "on-time", delay: 0, cars: 8, passengers: 420 },
  { id: "T002", name: "Express 002", route: "R2", progress: 0.62, speed: 98, status: "delayed", delay: 7, cars: 6, passengers: 380 },
  { id: "T003", name: "Intercity 003", route: "R4", progress: 0.18, speed: 0, status: "stopped", delay: 14, cars: 10, passengers: 680 },
  { id: "T004", name: "Regional 004", route: "R3", progress: 0.75, speed: 88, status: "on-time", delay: 0, cars: 5, passengers: 210 },
  { id: "T005", name: "Airport 005", route: "R5", progress: 0.50, speed: 120, status: "delayed", delay: 9, cars: 4, passengers: 310 },
  { id: "T006", name: "Metro 006", route: "R8", progress: 0.40, speed: 72, status: "on-time", delay: 2, cars: 6, passengers: 195 },
];

export const delayPredictions = [
  { station: "Northgate", current: 7, predicted: 12, risk: "high", cause: "Heavy rainfall, signal fault" },
  { station: "Southbridge", current: 14, predicted: 18, risk: "critical", cause: "Track maintenance, congestion" },
  { station: "Airport Express", current: 9, predicted: 11, risk: "high", cause: "High passenger volume" },
  { station: "Eastport Terminal", current: 4, predicted: 6, risk: "medium", cause: "Weather conditions" },
  { station: "Riverside Halt", current: 2, predicted: 2, risk: "low", cause: "Minor schedule drift" },
  { station: "Metro Park", current: 1, predicted: 1, risk: "low", cause: "None detected" },
];

export const congestionData = [
  { station: "Central Hub", level: 81, trend: "stable", peak: "08:30", riskLevel: "medium" },
  { station: "Northgate", level: 96, trend: "rising", peak: "08:15", riskLevel: "critical" },
  { station: "Southbridge", level: 95, trend: "rising", peak: "08:45", riskLevel: "critical" },
  { station: "Airport Express", level: 89, trend: "rising", peak: "09:00", riskLevel: "high" },
  { station: "Eastport Terminal", level: 72, trend: "stable", peak: "08:00", riskLevel: "medium" },
  { station: "Westfield Jct.", level: 45, trend: "falling", peak: "07:30", riskLevel: "low" },
  { station: "Riverside Halt", level: 38, trend: "stable", peak: "07:00", riskLevel: "low" },
  { station: "Metro Park", level: 60, trend: "rising", peak: "08:30", riskLevel: "medium" },
];

export const weatherData = {
  condition: "Heavy Rain",
  icon: "🌧️",
  temp: 14,
  wind: 32,
  visibility: 4.2,
  humidity: 88,
  alert: "Rainfall advisory — possible signal interference on North & South lines",
};

export const systemMetrics = {
  onTimeRate: 67,
  avgDelay: 6.4,
  activeTrains: 6,
  alertsActive: 4,
  passengersToday: 48200,
  networkHealth: 72,
};

export const hourlyDelayData = [
  { time: "06:00", delay: 1.2, predicted: 1.5 },
  { time: "07:00", delay: 2.8, predicted: 3.0 },
  { time: "08:00", delay: 5.4, predicted: 5.0 },
  { time: "09:00", delay: 8.1, predicted: 7.8 },
  { time: "10:00", delay: 6.4, predicted: 7.2 },
  { time: "11:00", delay: 4.2, predicted: 4.8 },
  { time: "12:00", delay: 3.1, predicted: 3.5 },
  { time: "13:00", delay: 2.9, predicted: 3.0 },
  { time: "14:00", delay: 3.6, predicted: 3.2 },
  { time: "15:00", delay: 4.8, predicted: 5.0 },
  { time: "16:00", delay: 7.2, predicted: 7.5 },
  { time: "17:00", delay: 9.8, predicted: 10.2 },
];

export const passengerFlowData = [
  { time: "06:00", northgate: 320, central: 580, southbridge: 210, airport: 890 },
  { time: "07:00", northgate: 980, central: 1420, southbridge: 760, airport: 1240 },
  { time: "08:00", northgate: 1820, central: 2640, southbridge: 1920, airport: 2890 },
  { time: "09:00", northgate: 1620, central: 2280, southbridge: 2100, airport: 3100 },
  { time: "10:00", northgate: 840, central: 1680, southbridge: 1240, airport: 2200 },
  { time: "11:00", northgate: 560, central: 1240, southbridge: 880, airport: 1800 },
  { time: "12:00", northgate: 720, central: 1480, southbridge: 960, airport: 1640 },
];

export const simulationScenarios = [
  {
    id: "SC1",
    name: "Heavy Rainfall Event",
    type: "weather",
    icon: "🌧️",
    description: "Simulates the impact of heavy rainfall on signal systems and track conditions across the North and South corridors.",
    affectedStations: ["Northgate", "Central Hub", "Southbridge"],
    delayIncrease: "+8 min avg",
    congestionIncrease: "+23%",
    riskScore: 78,
    status: "active",
  },
  {
    id: "SC2",
    name: "Platform Conflict — Central Hub",
    type: "conflict",
    icon: "⚠️",
    description: "Two trains scheduled for Platform 3 simultaneously. Cascade delay propagation across 4 downstream stations.",
    affectedStations: ["Central Hub", "Northgate", "Eastport Terminal"],
    delayIncrease: "+12 min avg",
    congestionIncrease: "+18%",
    riskScore: 85,
    status: "simulated",
  },
  {
    id: "SC3",
    name: "Track Maintenance — South Line",
    type: "maintenance",
    icon: "🔧",
    description: "Planned maintenance window on South Line between Central Hub and Southbridge. Single-track operation required.",
    affectedStations: ["Southbridge", "Central Hub", "Metro Park"],
    delayIncrease: "+15 min avg",
    congestionIncrease: "+31%",
    riskScore: 91,
    status: "planned",
  },
  {
    id: "SC4",
    name: "Equipment Failure — Signal Box 7",
    type: "equipment",
    icon: "🔴",
    description: "Signal box failure near Eastport Terminal. Manual operation required, reducing throughput by 40%.",
    affectedStations: ["Eastport Terminal", "Airport Express"],
    delayIncrease: "+20 min avg",
    congestionIncrease: "+45%",
    riskScore: 94,
    status: "simulated",
  },
];

export const copilotResponses = {
  "vulnerable route": {
    answer: "The **South Line (R4)** is currently the most vulnerable route. Train T003 (Intercity 003) is stopped with a 14-minute delay near Southbridge. Combined with planned track maintenance and rising congestion (95% capacity), this corridor has a **Risk Score of 91/100**. Recommend activating contingency buses and redistributing passengers via Metro Park.",
    tags: ["South Line", "Risk: 91", "Action Required"],
  },
  "congestion risk": {
    answer: "**Northgate Station** has the highest congestion risk right now at **96% capacity** with a rising trend. Peak load is expected at 08:15. The station is approaching critical overflow. Recommend deploying 2 additional staff to platforms 2 and 3, activating crowd flow barriers, and issuing passenger advisory via app.",
    tags: ["Northgate", "96% Capacity", "Immediate Action"],
  },
  "operator actions": {
    answer: "Recommended immediate actions:\n1. **Reroute T003** via West Line to bypass Southbridge blockage\n2. **Deploy crowd control** at Northgate — 96% capacity breach imminent\n3. **Alert signal team** for Airport Express delay (9 min, rising)\n4. **Issue weather advisory** — heavy rainfall affecting North & South corridors\n5. **Pre-position maintenance crew** at Signal Box 7 (preventive)",
    tags: ["5 Actions", "High Priority", "Operational"],
  },
  "weather impact": {
    answer: "Current heavy rainfall (32 km/h wind, 4.2km visibility) is causing signal interference on the **North Line** and **South Line**. Predicted impact: +8 min average delay across affected corridors. Track adhesion reduced by ~18% — speed restrictions recommended below 100 km/h. Stations most affected: Northgate (+5 min), Southbridge (+4 min).",
    tags: ["Weather Alert", "North & South Lines", "Speed Restriction"],
  },
  "default": {
    answer: "I'm analyzing the current railway network state. All 6 active trains are being monitored across 5 routes. Current network health is **72%** with 4 active alerts. The primary concerns are Northgate congestion (96%) and the Southbridge delay cascade. Would you like me to run a specific simulation or provide recommendations for a particular station?",
    tags: ["Network Health: 72%", "4 Alerts", "6 Active Trains"],
  },
};
