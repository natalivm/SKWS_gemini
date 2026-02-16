
import React, { useState, useMemo } from 'react';
import { TabId, ScenarioId } from './types';
import { SCENARIOS, PEER_DATA } from './constants';
import { calculateModel, fmt, pct } from './utils/finance';
import Card from './components/Card';
import SliderRow from './components/SliderRow';

// Colors
const NAVY = "bg-[#0F172A]";

const App: React.FC = () => {
  const [scenario, setScenario] = useState<ScenarioId>('base');
  const [tab, setTab] = useState<TabId>('overview');
  const [tgr, setTgr] = useState(2.5);
  const [exitMult, setExitMult] = useState(12);
  const [waccAdj, setWaccAdj] = useState(0);

  const data = useMemo(() => 
    calculateModel(scenario, tgr, exitMult, waccAdj), 
    [scenario, tgr, exitMult, waccAdj]
  );

  const years = ["FY26E", "FY27E", "FY28E", "FY29E", "FY30E"];

  return (
    <div className="min-h-screen pb-12 text-slate-900 bg-slate-50">
      {/* EXPANDED SPACIOUS HEADER */}
      <header className={`${NAVY} text-white pt-16 pb-24 px-8 lg:px-16`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-3 py-1 rounded tracking-widest uppercase">
                  DCF-Engine v2.5
                </span>
                <span className="text-slate-400 text-xs font-medium tracking-wide">
                  Institutional Intelligence • Semiconductor Coverage • FY2026 Analysis
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-black tracking-tight leading-tight">
                Skyworks Solutions
              </h1>
              <p className="text-slate-400 text-base max-w-3xl leading-relaxed">
                Dynamic institutional-grade valuation model analyzing standard mobile concentration risks versus broad market diversification optionality and the strategic long-term impact of the Qorvo consolidation.
              </p>
            </div>

            {/* SPACIOUS KPIs REPOSITIONED UNDER TEXT */}
            <div className="pt-10 border-t border-slate-800">
              <div className="flex flex-wrap items-center gap-16 mb-12">
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Current Price</div>
                  <div className="text-4xl font-black tracking-tighter">${data.price.toFixed(2)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Implied Fair Value</div>
                  <div className={`text-4xl font-black tracking-tighter ${data.implied >= data.price ? 'text-emerald-400' : 'text-rose-400'}`}>
                    ${data.implied.toFixed(0)}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Total Upside</div>
                  <div className={`text-4xl font-black tracking-tighter ${data.upside >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {data.upside >= 0 ? '+' : ''}{(data.upside * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              {/* LARGER SCENARIO BUTTONS UNDER PRICES */}
              <div className="flex flex-wrap items-center gap-4">
                {(['bull', 'base', 'bear'] as ScenarioId[]).map((id) => (
                  <button
                    key={id}
                    onClick={() => setScenario(id)}
                    className={`px-10 py-5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all border-2 ${
                      scenario === id 
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-500/40 scale-105' 
                        : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                    }`}
                  >
                    {SCENARIOS[id].label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* TABS NAVIGATION */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 overflow-x-auto no-scrollbar">
          <div className="flex">
            {[
              { id: 'overview', icon: '📊', label: 'Valuation Bridge' },
              { id: 'projections', icon: '📈', label: 'Cash Flows' },
              { id: 'sensitivity', icon: '🎯', label: 'Sensitivity Matrix' },
              { id: 'optionality', icon: '🌿', label: 'Optionality' },
              { id: 'thesis', icon: '📋', label: 'Investment Thesis' },
              { id: 'comps', icon: '⚖️', label: 'Peer Multiples' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as TabId)}
                className={`flex items-center gap-3 py-5 px-6 border-b-2 text-sm font-bold transition-all whitespace-nowrap ${
                  tab === t.id 
                    ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <span className="text-lg">{t.icon}</span> {t.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* CONTENT AREA */}
      <main className="max-w-7xl mx-auto px-8 pt-10 space-y-10">
        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card label="Market Cap" value={fmt(data.mktCap * 1e6)} />
              <Card label="Enterprise Value" value={fmt(data.ev * 1e6)} />
              <Card label="Net Cash Pos." value={fmt((data.cash - data.debt) * 1e6)} subColor="text-emerald-500" />
              <Card label="P/E Ratio NTM" value="10.5x" sub="Peer Avg: 22x" />
              <Card label="RS Technicals" value="23" subColor="text-rose-500" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-6">Long-Term Growth Projection</h3>
                <SliderRow 
                  label="Terminal Growth Rate" 
                  value={tgr} 
                  setValue={setTgr} 
                  min={1} 
                  max={4} 
                  step={0.1} 
                  display={`${tgr.toFixed(1)}%`} 
                />
                <div className="bg-slate-50 p-4 rounded-xl mt-4 font-mono text-xs text-slate-500 border border-slate-100 leading-relaxed">
                  <span className="opacity-60">Implied TV Projection:</span><br/>
                  <span className="text-indigo-600 font-bold">PV(TV) = {fmt(data.pvTVP * 1e6)}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-6">Exit Multiple Analysis</h3>
                <SliderRow 
                  label="Free Cash Flow Multiple" 
                  value={exitMult} 
                  setValue={setExitMult} 
                  min={6} 
                  max={20} 
                  step={0.5} 
                  display={`${exitMult.toFixed(1)}x`} 
                />
                <div className="bg-slate-50 p-4 rounded-xl mt-4 font-mono text-xs text-slate-500 border border-slate-100 leading-relaxed">
                  <span className="opacity-60">Implied Exit Value:</span><br/>
                  <span className="text-indigo-600 font-bold">PV(TV) = {fmt(data.pvTVE * 1e6)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="divide-y divide-slate-100">
                {[
                  { l: "PV of 5-Year Cash Flows", v: fmt(data.sumPV * 1e6) },
                  { l: "PV of Terminal Value (Blended Projection)", v: fmt(data.pvTVB * 1e6) },
                  { l: "Implied Enterprise Value (Standalone)", v: fmt(data.evDCF * 1e6), bold: true },
                  { l: "Net Cash & Debt Adjustments", v: fmt((data.cash - data.debt) * 1e6) },
                  { l: "Implied Equity Value", v: fmt(data.eqVal * 1e6), bold: true },
                  { l: "Implied Share Price (Fair Value)", v: `$${data.implied.toFixed(2)}`, highlight: true }
                ].map((row, i) => (
                  <div key={i} className={`flex justify-between items-center px-8 py-5 ${row.highlight ? 'bg-indigo-50/50' : ''}`}>
                    <span className={`text-sm tracking-tight ${row.bold ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{row.l}</span>
                    <span className={`font-mono ${row.highlight ? 'text-2xl font-black text-indigo-600' : row.bold ? 'text-lg font-bold text-slate-900' : 'text-sm text-slate-700'}`}>
                      {row.v}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PROJECTIONS TAB */}
        {tab === 'projections' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Projection Metric</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">FY25A</th>
                      {years.map(y => (
                        <th key={y} className="px-6 py-4 text-[10px] font-bold text-indigo-500 uppercase tracking-widest text-right">{y}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { l: "Revenue ($M)", v: [fmt(data.rev25 * 1e6), ...data.revs.map(r => fmt(r * 1e6))], bold: true },
                      { l: "YoY Growth Rate", v: ["-2.2%", ...data.grs.map(g => pct(g))], color: true },
                      { l: "FCF Margin", v: [pct(data.fcf25 / data.rev25), ...data.ms.map(m => pct(m))] },
                      { l: "Free Cash Flow", v: [fmt(data.fcf25 * 1e6), ...data.fcfs.map(f => fmt(f * 1e6))], bold: true, bg: "bg-indigo-50/20" },
                      { l: "PV of Free Cash Flow", v: ["—", ...data.pvs.map(p => fmt(p * 1e6))], bold: true }
                    ].map((row, i) => (
                      <tr key={i} className={`${row.bg || 'hover:bg-slate-50/50 transition-colors'}`}>
                        <td className={`px-6 py-4 text-xs ${row.bold ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{row.l}</td>
                        {row.v.map((val, idx) => (
                          <td key={idx} className={`px-6 py-4 text-xs font-mono text-right ${
                            row.color ? (val.startsWith('-') ? 'text-rose-600' : 'text-emerald-600') : 
                            row.bold ? 'font-bold text-slate-900' : 'text-slate-600'
                          }`}>
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-6">WACC Component Sensitivity</h3>
              <div className="grid md:grid-cols-2 gap-10">
                <SliderRow label="Risk Premium Adjustment" value={waccAdj} setValue={setWaccAdj} min={-3} max={3} step={0.5} display={`${waccAdj}%`} />
                <div className="bg-indigo-600 text-white rounded-xl p-4 flex flex-col justify-center items-center shadow-lg shadow-indigo-500/20">
                  <span className="text-[10px] uppercase font-bold tracking-widest opacity-70 mb-1">Implied Discount Rate (WACC)</span>
                  <span className="text-3xl font-black">{pct(data.wacc, 2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SENSITIVITY TAB */}
        {tab === 'sensitivity' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-10 text-center">Sensitivity Matrix: Valuation Sensitivity to Discounting and Growth</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-separate border-spacing-2">
                <thead>
                  <tr>
                    <th className="p-4 text-[10px] text-slate-400 font-bold bg-slate-50 rounded-xl">WACC \ TGR</th>
                    {data.tR.map(t => <th key={t} className="p-4 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-xl">{t.toFixed(1)}%</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.sens.map((row, ri) => (
                    <tr key={ri}>
                      <td className="p-4 text-xs font-bold text-slate-500 bg-slate-50 rounded-xl">
                        {pct(data.wacc + data.wR[ri])}
                      </td>
                      {row.map((val, ci) => {
                        const isBase = data.wR[ri] === 0 && data.tR[ci] === 2.5;
                        const upside = (val / data.price) - 1;
                        const colorClass = upside > 0.2 ? 'bg-emerald-100 text-emerald-800' : 
                                          upside > 0 ? 'bg-indigo-50 text-indigo-800' : 
                                          upside > -0.15 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800';
                        
                        return (
                          <td key={ci} className={`p-4 rounded-xl font-mono text-xs font-bold shadow-sm transition-transform hover:scale-105 ${colorClass} ${isBase ? 'ring-2 ring-indigo-500 scale-110 z-10' : ''}`}>
                            ${val.toFixed(0)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-12 flex flex-wrap gap-8 justify-center">
              {[
                { c: "bg-emerald-100", l: "Significant Alpha Potential (>20%)" },
                { c: "bg-indigo-50", l: "Positive Risk/Reward" },
                { c: "bg-amber-50", l: "Market Value Alignment" },
                { c: "bg-rose-50", l: "Avoid / Overvalued Area" }
              ].map(legend => (
                <div key={legend.l} className="flex items-center gap-3 text-xs font-semibold text-slate-500">
                  <div className={`w-5 h-5 rounded-md shadow-sm ${legend.c}`}></div> {legend.l}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THESIS TAB */}
        {tab === 'thesis' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm border-t-8 border-emerald-500">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">🚀 Key Upside Drivers</h3>
              <ul className="space-y-4">
                {[
                  "Synergy potential from Qorvo consolidation estimated at $500M+ annually.",
                  "WiFi 7 adoption cycle accelerating standard-setting growth in broad markets.",
                  "Automotive content expansion via EV connectivity and powertrain optimization.",
                  "Strategic share gains within the Android ecosystem to offset Apple plateauing."
                ].map((item, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-3 leading-relaxed">
                    <span className="bg-emerald-100 text-emerald-600 rounded-full p-1 mt-0.5"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm border-t-8 border-rose-500">
              <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-3">📉 Structural Risk Factors</h3>
              <ul className="space-y-4">
                {[
                  "Apple (67% revenue) continues vertical integration of modem and RF components.",
                  "Global smartphone shipment saturation limiting total addressable market expansion.",
                  "Anti-trust and regulatory hurdles for the QRVO merger in key foreign jurisdictions.",
                  "Technical price breakdown (RS 23) suggesting sustained institutional distribution."
                ].map((item, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-start gap-3 leading-relaxed">
                    <span className="bg-rose-100 text-rose-600 rounded-full p-1 mt-0.5"><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* COMPS TAB */}
        {tab === 'comps' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Industry Component</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Mkt Cap</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">EV/Rev</th>
                      <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right text-indigo-600">FCF Yield</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PEER_DATA.map((peer, i) => (
                      <tr key={i} className={`${peer.hl ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50 transition-colors'}`}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-900">{peer.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono tracking-wider">{peer.ticker}</div>
                        </td>
                        <td className="px-6 py-4 text-xs font-mono text-right text-slate-700">{peer.mktCap}</td>
                        <td className="px-6 py-4 text-xs font-mono text-right text-slate-700">{peer.evRev}</td>
                        <td className="px-6 py-4 text-xs font-mono text-right font-black text-indigo-600">{peer.fcfYield}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}

        {/* OPTIONALITY TAB */}
        {tab === 'optionality' && (
          <div className="bg-indigo-900 text-white p-12 rounded-3xl shadow-2xl relative overflow-hidden border border-white/5">
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] -mr-48 -mt-48"></div>
             <div className="relative z-10">
               <h2 className="text-3xl font-black mb-4 tracking-tight">The Strategic Consolidation Optionality</h2>
               <p className="text-indigo-200 text-sm mb-12 max-w-2xl leading-relaxed">
                 The proposed merger with Qorvo represents a definitive shift in the RF landscape, combining the two largest pure-play specialists to achieve unparalleled scale in the semiconductor supply chain.
               </p>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-xl border border-white/10 text-center">
                   <div className="text-indigo-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Cost Synergy</div>
                   <div className="text-4xl font-black">$500M+</div>
                   <p className="text-indigo-400 text-[10px] mt-2 font-medium">Run-rate Annualized</p>
                 </div>
                 <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-xl border border-white/10 text-center">
                   <div className="text-indigo-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Filter Mkt Share</div>
                   <div className="text-4xl font-black">~65%</div>
                   <p className="text-indigo-400 text-[10px] mt-2 font-medium">BAW / SAW Combined</p>
                 </div>
                 <div className="bg-white/5 p-8 rounded-2xl backdrop-blur-xl border border-white/10 text-center">
                   <div className="text-indigo-300 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">Pro-Forma FCF</div>
                   <div className="text-4xl font-black">$2.8B</div>
                   <p className="text-indigo-400 text-[10px] mt-2 font-medium">Integrated Target</p>
                 </div>
               </div>
             </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-8 mt-12 pb-12">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Skyworks Global Analytics</span>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight">© 2026 DCF-Engine Pro. Quantitative investment model based on public company filings and sector research.</p>
            </div>
            <div className="flex gap-4">
               <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-3 py-1 border border-slate-100 rounded-full">Standalone Mode</span>
               <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-3 py-1 border border-slate-100 rounded-full">Live Feed Active</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
