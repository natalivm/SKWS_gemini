
import React from 'react';

interface SliderRowProps {
  label: string;
  value: number;
  setValue: (val: number) => void;
  min: number;
  max: number;
  step: number;
  display: string;
}

const SliderRow: React.FC<SliderRowProps> = ({ label, value, setValue, min, max, step, display }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1.5 items-center">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{display}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => setValue(Number(e.target.value))}
      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
  </div>
);

export default SliderRow;
