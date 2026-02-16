
import React, { useState, useMemo, useEffect } from 'react';
import { TabId, ScenarioId, ModelData } from './types';
import { SCENARIOS, PEER_DATA } from './constants';
import { calculateModel, fmt, pct } from './utils/finance';
import { generateThesis } from './services/geminiService';
import Card from './components/Card';
import SliderRow from './components/SliderRow';

// Colors
const GREEN = "text-emerald-500";
const RED = "text-rose-500";
const GOLD = "text-amber-500";
const NAVY = "bg-[#0F172A]";
const ACCENT_COLOR = "indigo-600";

const App: React.FC = () => {
  const [scenario, setScenario] = useState<ScenarioId>('base');
  const [tab, setTab] = useState<TabId>('overview');
  const [tgr, setTgr] = useState(2.5);
  const [exitMult, setExitMult] = useState(12);
  const [waccAdj, setWaccAdj] = useState(0);

  // AI State
  const [thesis, setThesis] = useState<string>('');
  const [loadingThesis, setLoadingThesis] = useState(false);

  const data = useMemo(() => 
    calculateModel(scenario, tgr, exitMult, waccAdj), 
    [scenario, tgr, exitMult, waccAdj]
  );

  const years = ["FY26E", "FY27E", "FY28E", "FY29E", "FY30E"];

  const handleGenerateThesis = async () => {
    setLoadingThesis(true);
    const result = await generateThesis(data);
    setThesis(result);
    setLoadingThesis(false);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* HEADER SECTION */}
      <header className={`${NAVY} text-white pt-8 pb-10 px-6 lg:px-12`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded tracking-widest uppercase">
                  DCF-Engine v2.5
                </span>
                <span className="text-slate-400 text-xs font-medium">
                  Institutional Intelligence • Semiconductor Coverage
                </span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
                Skyworks Solutions <span className="text-slate-500 font-normal ml-2">NASDAQ: SWKS</span>
              </h1>
              <p className="text-slate-400 text-sm max-w-xl">
                Dynamic valuation model analyzing the RF leader's mobile concentration vs. broad market diversification and the strategic Qorvo merger impact.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:text-right">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Current Price</div>
                <div className="text-3xl font-black">${data.price.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Fair Value</div>
                <div className={`text-3xl font-black ${data.implied >= data.price ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ${data.implied.toFixed(0)}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Upside</div>
                <div className={`text-3xl font-black ${data.upside >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {data.upside >= 0 ? '+' : ''}{(data.upside * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-slate-800 pt-8">
            {(['bull', 'base', 'bear'] as ScenarioId[]).map((id) => (
              <button
                key={id}
                onClick={() => setScenario(id)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all border ${
                  scenario === id 
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105' 
                    : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {SCENARIOS[id].label}
              </button>
            ))}
            
            <button 
              onClick={handleGenerateThesis}
              disabled={loadingThesis}
              className="ml-auto flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 rounded-lg text-xs font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loadingThesis ? '🤖 Processing...' : '✨ Generate AI Thesis'}
            </button>
          </div>
        </div>
      </header>

      {/* TABS NAVIGATION */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 overflow-x-auto no-scrollbar">
          <div className="flex">
            {[
              { id: 'overview', icon: '📊', label: 'Valuation Bridge' },
              { id: 'projections', icon: '📈', label: 'Cash Flows' },
              { id: 'sensitivity', icon: '🎯', label: 'Sensitivity' },
              { id: 'optionality', icon: '🌿', label: 'Optionality' },
              { id: 'thesis', icon: '📋', label: 'Thesis & Risks' },
              { id: 'comps', icon: '⚖️', label: 'Comps' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as TabId)}
                className={`flex items-center gap-2 py-4 px-6 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                  tab === t.id 
                    ? 'border-indigo-600 text-indigo-600' 
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
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Card label="Mkt Cap" value={fmt(data.mktCap * 1e6)} />
              <Card label="EV" value={fmt(data.ev * 1e6)} />
              <Card label="Net Cash" value={fmt((data.cash - data.debt) * 1e6)} subColor="text-emerald-500" />
              <Card label="P/E NTM" value="10.5x" sub="Peer Avg: 22x" />
              <Card label="RS Rating" value="23" sub="Weak Momentum" subColor="text-rose-500" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Perpetuity Growth Assumption</h3>
                <SliderRow 
                  label="Terminal Growth Rate" 
                  value={tgr} 
                  setValue={setTgr} 
                  min={1} 
                  max={4} 
                  step={0.1} 
                  display={`${tgr.toFixed(1)}%`} 
                />
                <div className="bg-slate-50 p-4 rounded-xl mt-4 font-mono text-xs text-slate-600 leading-relaxed">
                  Terminal Value (TV) = FCF₅ × (1+g) / (WACC - g)<br/>
                  TV = {fmt(data.fcfs[4]*1e6)} × {(1+tgr/100).toFixed(3)} / ({pct(data.wacc)} - {tgr}%)<br/>
                  <span className="text-indigo-600 font-bold">PV(TV) = {fmt(data.pvTVP * 1e6)}</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Exit Multiple Assumption</h3>
                <SliderRow 
                  label="FCF Exit Multiple" 
                  value={exitMult} 
                  setValue={setExitMult} 
                  min={6} 
                  max={20} 
                  step={0.5} 
                  display={`${exitMult.toFixed(1)}x`} 
                />
                <div className="bg-slate-50 p-4 rounded-xl mt-4 font-mono text-xs text-slate-600 leading-relaxed">
                  Terminal Value (TV) = FCF₅ × Multiple<br/>
                  TV = {fmt(data.fcfs[4]*1e6)} × {exitMult}x<br/>
                  <span className="text-indigo-600 font-bold">PV(TV) = {fmt(data.pvTVE * 1e6)}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Equity Valuation Waterfall</h3>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { l: "Sum of PV of 5yr Cash Flows", v: fmt(data.sumPV * 1e6) },
                  { l: "PV of Terminal Value (Blended 50/50)", v: fmt(data.pvTVB * 1e6) },
                  { l: "Implied Enterprise Value", v: fmt(data.evDCF * 1e6), bold: true },
                  { l: "(+) Cash & Cash Equivalents", v: fmt(data.cash * 1e6) },
                  { l: "(−) Total Debt", v: `(${fmt(data.debt * 1e6)})` },
                  { l: "Implied Equity Value", v: fmt(data.eqVal * 1e6), bold: true },
                  { l: "÷ Diluted Shares Outstanding", v: `${data.shares}M` },
                  { l: "Implied Share Price", v: `$${data.implied.toFixed(2)}`, highlight: true }
                ].map((row, i) => (
                  <div key={i} className={`flex justify-between items-center px-6 py-4 ${row.highlight ? 'bg-indigo-50' : ''}`}>
                    <span className={`text-sm ${row.bold ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{row.l}</span>
                    <span className={`font-mono ${row.highlight ? 'text-xl font-black text-indigo-600' : row.bold ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
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
          <div className="space-y-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">5-Year Free Cash Flow Projections — {data.allSc.find(s => s.key === scenario)?.label}</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Metric</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">FY25A</th>
                      {years.map(y => (
                        <th key={y} className="px-6 py-4 text-[10px] font-bold text-indigo-500 uppercase tracking-wider text-right">{y}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { l: "Revenue ($M)", v: [fmt(data.rev25 * 1e6), ...data.revs.map(r => fmt(r * 1e6))], bold: true },
                      { l: "YoY Growth (%)", v: ["-2.2%", ...data.grs.map(g => pct(g))], color: true },
                      { l: "FCF Margin (%)", v: [pct(data.fcf25 / data.rev25), ...data.ms.map(m => pct(m))] },
                      { l: "Free Cash Flow ($M)", v: [fmt(data.fcf25 * 1e6), ...data.fcfs.map(f => fmt(f * 1e6))], bold: true, bg: "bg-indigo-50/50" },
                      { l: "Discount Factor", v: ["1.00", ...years.map((_, i) => (1 / Math.pow(1 + data.wacc, i + 1)).toFixed(3))] },
                      { l: "PV of FCF ($M)", v: ["—", ...data.pvs.map(p => fmt(p * 1e6))], bold: true }
                    ].map((row, i) => (
                      <tr key={i} className={`hover:bg-slate-50 transition-colors ${row.bg || ''}`}>
                        <td className={`px-6 py-4 text-sm ${row.bold ? 'font-bold text-slate-900' : 'text-slate-600'}`}>{row.l}</td>
                        {row.v.map((val, idx) => (
                          <td key={idx} className={`px-6 py-4 text-sm font-mono text-right ${
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
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">WACC Configuration</h3>
              <SliderRow 
                label="Risk Premium Adjust" 
                value={waccAdj} 
                setValue={setWaccAdj} 
                min={-3} 
                max={3} 
                step={0.5} 
                display={`${waccAdj >= 0 ? '+' : ''}${waccAdj}%`} 
              />
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Risk-Free (10Y UST)</span> <span className="font-mono font-bold">{pct(data.rf)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Equity Beta</span> <span className="font-mono font-bold">{data.beta.toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Equity Risk Premium</span> <span className="font-mono font-bold">{pct(data.erp)}</span></div>
                  <div className="flex justify-between text-sm font-bold border-t pt-2"><span className="text-indigo-600">Cost of Equity (Ke)</span> <span className="font-mono text-indigo-600">{pct(data.ke)}</span></div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Pre-tax Cost of Debt</span> <span className="font-mono font-bold">{pct(data.kd)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-slate-500">Tax Rate</span> <span className="font-mono font-bold">{pct(data.tax)}</span></div>
                  <div className="flex justify-between text-sm font-bold border-t pt-2"><span className="text-slate-900">After-tax Debt (Kd)</span> <span className="font-mono">{pct(data.kdAt)}</span></div>
                </div>
              </div>
              <div className="mt-8 p-4 bg-indigo-600 text-white rounded-xl text-center shadow-lg shadow-indigo-200">
                <div className="text-[10px] uppercase font-bold tracking-widest opacity-80 mb-1">Implied Weighted Average Cost of Capital</div>
                <div className="text-3xl font-black">{pct(data.wacc, 2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* SENSITIVITY TAB */}
        {tab === 'sensitivity' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Implied Share Price: WACC vs Terminal Growth</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center border-separate border-spacing-2">
                <thead>
                  <tr>
                    <th className="p-3 text-[10px] text-slate-400 font-bold bg-slate-50 rounded-lg">WACC \ TGR</th>
                    {data.tR.map(t => <th key={t} className="p-3 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg">{t.toFixed(1)}%</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.sens.map((row, ri) => (
                    <tr key={ri}>
                      <td className="p-3 text-xs font-bold text-slate-500 bg-slate-50 rounded-lg whitespace-nowrap">
                        {pct(data.wacc + data.wR[ri])}
                      </td>
                      {row.map((val, ci) => {
                        const isBase = data.wR[ri] === 0 && data.tR[ci] === 2.5;
                        const upside = (val / data.price) - 1;
                        const colorClass = upside > 0.2 ? 'bg-emerald-100 text-emerald-800' : 
                                          upside > 0 ? 'bg-indigo-50 text-indigo-800' : 
                                          upside > -0.15 ? 'bg-amber-50 text-amber-800' : 'bg-rose-50 text-rose-800';
                        
                        return (
                          <td 
                            key={ci} 
                            className={`p-4 rounded-lg font-mono text-sm font-bold transition-transform hover:scale-105 cursor-default shadow-sm ${colorClass} ${isBase ? 'ring-2 ring-indigo-500 scale-110 shadow-indigo-100' : ''}`}
                          >
                            ${val.toFixed(0)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-8 flex flex-wrap gap-6 justify-center">
              {[
                { c: "bg-emerald-100", l: "Strong Upside (>20%)" },
                { c: "bg-indigo-50", l: "Modest Upside" },
                { c: "bg-amber-50", l: "Overvalued" },
                { c: "bg-rose-50", l: "Significant Downside" }
              ].map(legend => (
                <div key={legend.l} className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <div className={`w-4 h-4 rounded ${legend.c}`}></div> {legend.l}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* THESIS TAB */}
        {tab === 'thesis' && (
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600"></div>
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Investment Summary</h3>
                   <span className="text-2xl">📋</span>
                 </div>
                 
                 {loadingThesis ? (
                   <div className="space-y-4 animate-pulse">
                     <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                     <div className="h-4 bg-slate-100 rounded w-full"></div>
                     <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                     <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                   </div>
                 ) : thesis ? (
                   <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed space-y-4">
                     {thesis.split('\n').map((line, i) => {
                       if (line.startsWith('#')) return <h4 key={i} className="text-slate-900 font-bold mt-4">{line.replace(/#/g, '')}</h4>;
                       return <p key={i}>{line}</p>;
                     })}
                   </div>
                 ) : (
                   <div className="text-center py-12">
                     <p className="text-slate-400 text-sm mb-4">No AI thesis generated yet.</p>
                     <button 
                       onClick={handleGenerateThesis}
                       className="bg-indigo-600 text-white px-6 py-2 rounded-lg text-xs font-bold shadow-lg shadow-indigo-200"
                     >
                       Analyze Model with Gemini
                     </button>
                   </div>
                 )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-emerald-500">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  🚀 Upside Catalysts
                </h3>
                <ul className="space-y-3">
                  {[
                    "Qorvo merger synergies estimated at $500M+ annually.",
                    "WiFi 7 adoption cycle accelerating broad market growth.",
                    "Automotive content expansion (EV connectivity suite).",
                    "Samsung/Android share gains offsetting Apple plateau.",
                    "Valuation compression at cycle low creates asymmetry."
                  ].map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-emerald-500 mt-1">●</span> {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm border-t-4 border-rose-500">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  📉 Risk Factors
                </h3>
                <ul className="space-y-3">
                  {[
                    "Apple (67% rev) moving modem/RF components in-house.",
                    "Smartphone shipment saturation globally (2-3% growth).",
                    "Regulatory hurdles for QRVO merger in foreign markets.",
                    "Price wars in commodity filters impacting gross margins.",
                    "Severe technical breakdown (RS Rating 23 indicates dumping)."
                  ].map((item, i) => (
                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                      <span className="text-rose-500 mt-1">●</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* COMPS TAB */}
        {tab === 'comps' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">RF & Analog Semiconductor Comparables</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Mkt Cap</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">EV/Rev</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">EV/EBITDA</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">P/E</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right text-indigo-600">FCF Yield</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {PEER_DATA.map((peer, i) => (
                      <tr key={i} className={`hover:bg-slate-50 transition-colors ${peer.hl ? 'bg-indigo-50/50' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="text-sm font-bold text-slate-900">{peer.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">{peer.ticker}</div>
                        </td>
                        <td className="px-6 py-4 text-sm font-mono text-right">{peer.mktCap}</td>
                        <td className="px-6 py-4 text-sm font-mono text-right">{peer.evRev}</td>
                        <td className="px-6 py-4 text-sm font-mono text-right">{peer.evEbitda}</td>
                        <td className="px-6 py-4 text-sm font-mono text-right">{peer.pe}</td>
                        <td className="px-6 py-4 text-sm font-mono text-right font-bold text-indigo-600">{peer.fcfYield}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
        )}

        {/* OPTIONALITY TAB */}
        {tab === 'optionality' && (
          <div className="space-y-8">
            <div className="bg-indigo-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-3xl -mr-20 -mt-20"></div>
               <div className="relative z-10">
                 <h2 className="text-3xl font-black mb-4">The Qorvo Merger Synergy</h2>
                 <p className="text-indigo-200 max-w-2xl text-lg mb-8">
                   Combining the two largest pure-play RF players creates a powerhouse with over $7B in combined Broad Markets revenue, significantly diluting the 'Apple Dependency' discount.
                 </p>
                 <div className="grid md:grid-cols-3 gap-8">
                   <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md">
                     <div className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-2">Cost Savings</div>
                     <div className="text-2xl font-bold">$500M+</div>
                     <p className="text-indigo-200 text-xs mt-2">Run-rate synergies through fab consolidation and G&A optimization.</p>
                   </div>
                   <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md">
                     <div className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-2">Market Share</div>
                     <div className="text-2xl font-bold">~65%</div>
                     <p className="text-indigo-200 text-xs mt-2">Combined market share in high-end acoustic filters and power amps.</p>
                   </div>
                   <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md">
                     <div className="text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-2">Combined FCF</div>
                     <div className="text-2xl font-bold">$2.8B+</div>
                     <p className="text-indigo-200 text-xs mt-2">Annualized free cash flow potential by FY28 post-integration.</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 mt-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Model Footnotes</div>
              <p className="text-[10px] text-slate-400 max-w-2xl leading-relaxed">
                Valuations as of Feb 2026. Standalone basis excludes potential merger arbitrage spreads. Equity risk premium (5.0%) and Beta (1.55) based on 3-year trailing semiconductor index data. Gemini analysis is generated in real-time based on active scenario parameters. Past performance is not indicative of future semiconductor cycle results.
              </p>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-[10px] font-bold text-slate-400">© 2026 DCF-Engine Pro</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
