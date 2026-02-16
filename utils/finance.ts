
import { ScenarioId, ModelData, Scenario } from '../types';
import { SCENARIOS } from '../constants';

export const fmt = (n: number, d = 1) => {
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(d)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(d)}M`;
  return `$${n.toFixed(2)}`;
};

export const pct = (n: number, d = 1) => `${(n * 100).toFixed(d)}%`;

export const calculateModel = (
  scenarioId: ScenarioId,
  tgr: number,
  exitMult: number,
  waccAdj: number
): ModelData => {
  const sc = SCENARIOS[scenarioId];
  const price = 62.10, shares = 150.4, debt = 1000, cash = 1600;
  const mktCap = price * shares;
  const ev = mktCap - cash + debt;
  const rev25 = 4090, fcf25 = 1110;

  const rf = 0.0434, beta = 1.55, erp = 0.05;
  const ke = rf + beta * erp + waccAdj * 0.01;
  const kd = 0.045, tax = 0.10;
  const kdAt = kd * (1 - tax);
  const we = mktCap / (mktCap + debt), wd = debt / (mktCap + debt);
  const wacc = ke * we + kdAt * wd;

  let pRev = rev25;
  const revs: number[] = [], fcfs: number[] = [], grs = sc.growths, ms = sc.margins;
  for (let i = 0; i < 5; i++) {
    const r = pRev * (1 + grs[i]); 
    revs.push(r); 
    fcfs.push(r * ms[i]); 
    pRev = r;
  }
  const pvs = fcfs.map((f, i) => f / Math.pow(1 + wacc, i + 1));
  const sumPV = pvs.reduce((a, b) => a + b, 0);

  const tgrV = tgr / 100;
  const tvP = (fcfs[4] * (1 + tgrV)) / (wacc - tgrV);
  const pvTVP = tvP / Math.pow(1 + wacc, 5);
  const tvE = fcfs[4] * exitMult;
  const pvTVE = tvE / Math.pow(1 + wacc, 5);
  const pvTVB = (pvTVP + pvTVE) / 2;

  const evDCF = sumPV + pvTVB;
  const eqVal = evDCF + cash - debt;
  const implied = eqVal / shares;
  const upside = (implied - price) / price;
  const mosTarget = implied * 0.75;

  // Sensitivity matrix calculation
  const wR = [-0.02, -0.01, 0, 0.01, 0.02];
  const tR = [1.5, 2.0, 2.5, 3.0, 3.5];
  const sens = wR.map(dw => tR.map(tg => {
    const w = wacc + dw, t = tg / 100;
    const tv = (fcfs[4] * (1 + t)) / (w - t) / Math.pow(1 + w, 5);
    const pv = fcfs.map((f, i) => f / Math.pow(1 + w, i + 1)).reduce((a, b) => a + b, 0);
    return (pv + tv + cash - debt) / shares;
  }));

  // Comparison across all scenarios
  const allSc = (["bear", "base", "bull"] as ScenarioId[]).map(k => {
    const s = SCENARIOS[k]; 
    let pr = rev25;
    const sr: number[] = [], sf: number[] = [];
    for (let i = 0; i < 5; i++) { 
      const r = pr * (1 + s.growths[i]); 
      sr.push(r); 
      sf.push(r * s.margins[i]); 
      pr = r; 
    }
    const sp = sf.map((f, i) => f / Math.pow(1 + wacc, i + 1)).reduce((a, b) => a + b, 0);
    const st1 = (sf[4] * (1 + s.tgrD / 100)) / (wacc - s.tgrD / 100) / Math.pow(1 + wacc, 5);
    const st2 = (sf[4] * s.exitD) / Math.pow(1 + wacc, 5);
    const sev = sp + (st1 + st2) / 2;
    return { key: k, label: s.label, price: (sev + cash - debt) / shares, revs: sr, fcfs: sf };
  });

  return {
    price, shares, mktCap, debt, cash, ev, rev25, fcf25, wacc, ke, kd, kdAt, tax, rf, beta, erp, we, wd,
    revs, fcfs, grs, ms, pvs, sumPV, tvP, pvTVP, tvE, pvTVE, pvTVB, evDCF, eqVal, implied, upside, mosTarget,
    sens, wR, tR, allSc
  };
};
