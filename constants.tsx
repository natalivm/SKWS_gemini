
import { Scenario, ScenarioId } from './types';

export const SCENARIOS: Record<ScenarioId, Scenario> = {
  bear: {
    label: "Bear Case",
    growths: [-0.08, -0.03, 0.01, 0.02, 0.03],
    margins: [0.22, 0.23, 0.24, 0.25, 0.26],
    tgrD: 2.0,
    exitD: 8
  },
  base: {
    label: "Base Case",
    growths: [-0.04, 0.02, 0.05, 0.06, 0.06],
    margins: [0.26, 0.27, 0.28, 0.29, 0.30],
    tgrD: 2.5,
    exitD: 12
  },
  bull: {
    label: "Bull Case",
    growths: [0.00, 0.06, 0.09, 0.10, 0.10],
    margins: [0.27, 0.29, 0.31, 0.32, 0.33],
    tgrD: 3.0,
    exitD: 15
  },
};

export const PEER_DATA = [
  { name: "Skyworks Solutions", ticker: "SWKS", mktCap: "$9.3B", evRev: "2.1x", evEbitda: "8.5x", pe: "10.5x", fcfYield: "11.9%", gross: "46.6%", revGr: "-2%", hl: true },
  { name: "Qorvo", ticker: "QRVO", mktCap: "$8.0B", evRev: "2.5x", evEbitda: "11.2x", pe: "18.0x", fcfYield: "6.8%", gross: "44.4%", revGr: "-3%", hl: false },
  { name: "Broadcom", ticker: "AVGO", mktCap: "$1.1T", evRev: "18.5x", evEbitda: "28.0x", pe: "38.0x", fcfYield: "3.2%", gross: "76.0%", revGr: "+44%", hl: false },
  { name: "Analog Devices", ticker: "ADI", mktCap: "$105B", evRev: "11.8x", evEbitda: "24.5x", pe: "32.0x", fcfYield: "3.5%", gross: "57.0%", revGr: "+5%", hl: false },
  { name: "Texas Instruments", ticker: "TXN", mktCap: "$175B", evRev: "10.5x", evEbitda: "22.0x", pe: "33.0x", fcfYield: "3.0%", gross: "58.0%", revGr: "+3%", hl: false },
  { name: "NXP Semi", ticker: "NXPI", mktCap: "$55B", evRev: "4.2x", evEbitda: "12.5x", pe: "17.0x", fcfYield: "5.5%", gross: "57.5%", revGr: "+1%", hl: false },
  { name: "Microchip Tech", ticker: "MCHP", mktCap: "$35B", evRev: "6.0x", evEbitda: "15.0x", pe: "25.0x", fcfYield: "4.2%", gross: "60.0%", revGr: "-8%", hl: false },
];
