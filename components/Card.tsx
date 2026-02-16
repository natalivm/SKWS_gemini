
import React from 'react';

interface CardProps {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: string;
}

const Card: React.FC<CardProps> = ({ label, value, sub, subColor }) => (
  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex-1 min-w-[120px] transition-all hover:shadow-md">
    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">
      {label}
    </div>
    <div className="text-xl font-extrabold text-slate-900">
      {value}
    </div>
    {sub && (
      <div className={`text-[11px] mt-1 font-semibold ${subColor || 'text-slate-400'}`}>
        {sub}
      </div>
    )}
  </div>
);

export default Card;
