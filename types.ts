
export interface Scenario {
  label: string;
  growths: number[];
  margins: number[];
  tgrD: number;
  exitD: number;
}

export interface ModelData {
  price: number;
  shares: number;
  mktCap: number;
  debt: number;
  cash: number;
  ev: number;
  rev25: number;
  fcf25: number;
  wacc: number;
  ke: number;
  kd: number;
  kdAt: number;
  tax: number;
  rf: number;
  beta: number;
  erp: number;
  we: number;
  wd: number;
  revs: number[];
  fcfs: number[];
  grs: number[];
  ms: number[];
  pvs: number[];
  sumPV: number;
  tvP: number;
  pvTVP: number;
  tvE: number;
  pvTVE: number;
  pvTVB: number;
  evDCF: number;
  eqVal: number;
  implied: number;
  upside: number;
  mosTarget: number;
  sens: number[][];
  wR: number[];
  tR: number[];
  allSc: Array<{
    key: string;
    label: string;
    price: number;
    revs: number[];
    fcfs: number[];
  }>;
}

export type TabId = 'overview' | 'projections' | 'optionality' | 'sensitivity' | 'thesis' | 'comps';
export type ScenarioId = 'bear' | 'base' | 'bull';
