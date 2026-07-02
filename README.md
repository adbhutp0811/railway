# KSP Datathon 2026 — Winning Roadmap
**Challenge 2: AI-Driven Crime Analytics & Visualization Platform**
**Today: July 2, 2026 | Registration close: July 19 | Submission deadline: July 26**

---

## 1. Strategic Positioning

**Why PS2 over PS1:** Lower interface risk (dashboards fail gracefully, live multilingual chat doesn't), direct reuse of your existing skillset (Infinite Parallax's geospatial fusion, RailTwin's dashboard/map architecture), and judges (police officials) read visual intelligence faster than they can evaluate chatbot accuracy live.

**Your USP:** Most teams will submit charts-only dashboards. You differentiate on:
- A real node-based **criminal network graph** (hardest feature, most teams skip it)
- **Predictive risk scoring** via QuickML, not just historical heatmaps
- Synthetic data with genuine embedded structure (repeat offenders, MO clustering, seasonal patterns) — not random fill

**The failure mode to avoid (learned from RailTwin's audit):** hardcoded/mocked data and scripted responses read as thin to evaluators. Every feature must hit a real Catalyst backend call by demo day.

---

## 2. Feature Priority (MoSCoW)

| Priority | Feature | Brief requirement it satisfies |
|---|---|---|
| **Must** | Hotspot map, district→station drill-down | Interactive dashboards & geospatial maps, District-level drill-down |
| **Must** | Red-zone trend alerts (spike vs. historical baseline) | Emerging Trend Alerts |
| **Must** | Criminal network/link-analysis graph | Network & link analysis, Association detection |
| **Must** | Repeat offender + MO tracking (tagged in data model) | Repeat Offender Tracking |
| **Must** | Predictive risk scoring (QuickML) | Predictive Risk Scoring, AI/ML-Driven Intelligence |
| **Should** | Socio-economic correlation overlay | Socio-Economic Correlation |
| **Should** | Anomaly flags folded into network graph | Anomaly Detection |
| **Could** | NL query bar over dashboard | Borrows PS1 territory, demo differentiator |
| **Won't (this cycle)** | Full RBAC/audit logs, voice, financial transaction link analysis | Out of scope for PS2; mention as roadmap in deck |

---

## 3. Week-by-Week Plan

### Phase 0 — Today, Jul 2
- [ ] Register team on hackathon dashboard
- [ ] Claim Catalyst free credits
- [ ] Assign roles: Catalyst/backend, frontend/viz, data+ML, deck/video
- [ ] Install Catalyst CLI, create project, init Slate + serverless functions

### Phase 1 — Jul 2–8: Foundation
- [ ] Design DB schema: FIR#, crime type, district/station, status, accused, victim, MO, coordinates, timestamp, district socio-economic fields (population, urbanization index, income band)
- [ ] Build synthetic data generator with real embedded structure — repeat offenders across districts, MO clustering, seasonal/diurnal spikes, plausible socio-economic correlation
- [ ] Light role-based views (analyst vs. supervisor) — cheap, signals production-thinking
- [ ] Review Catalyst workshop recordings if available

### Phase 2 — Jul 9–15: Core Build
- [ ] Hotspot map: MapLibre, drill-down, spatiotemporal layering
- [ ] Red-zone trend alerts (rolling baseline comparison)
- [ ] Network/link-analysis graph with MO tagging, repeat-offender highlighting
- [ ] Wire all of the above to live Catalyst calls — no permanent stubs

### Phase 3 — Jul 16–21: Intelligence Layer
- [ ] QuickML predictive risk scoring, overlaid on map
- [ ] Anomaly flags on network graph (outlier nodes)
- [ ] Socio-economic correlation overlay (simple scatter/side-panel is fine)
- [ ] NL query bar (cut first if behind schedule)

### Phase 4 — Jul 22–24: Package for Submission
Fill the official template in this order:
1. Team details, problem statement
2. Solution brief (3–4 sentences)
3. **Opportunities slide** — name the USP explicitly: network graph + predictive layer vs. "dashboards-only" competitors
4. Feature list mapped to brief's capability language
5. Process/use-case flow diagram
6. Wireframes (low-cost polish)
7. Architecture diagram: Slate → Functions → Catalyst DB → QuickML → Map/Graph/Dashboard
8. Tech stack list
9. Catalyst services checklist (DB, Functions, Slate, QuickML, Auth) — explicitly scored
10. Estimated cost (optional)
11. Best screenshots: hotspot map, network graph, prediction overlay
12. Benchmarking: query response time, model accuracy, load handling
13. Links: GitHub, demo video, deployed link
14. Future development: RBAC, voice, financial link analysis — shows awareness of full scope

### Phase 5 — Jul 25–26: Final Submission
- [ ] Record 3-minute demo video: problem → live walkthrough (map → graph → prediction → query) → impact close
- [ ] Write Prototype Brief (≤1024 chars, specific not generic)
- [ ] GitHub repo public, with real README (setup + execution instructions)
- [ ] Deploy exclusively on Catalyst
- [ ] Test every link in incognito browser before submitting
- [ ] Submit early — multiple submissions allowed before deadline; refine after

---

## 4. Non-Negotiables
- Deployment **must** be on Catalyst — no exceptions, or disqualified
- Submission **must** use the official template — other formats not evaluated
- All links must be publicly accessible and tested before final submit

