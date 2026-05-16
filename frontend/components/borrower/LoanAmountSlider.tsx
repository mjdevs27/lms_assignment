import * as React from "react";
import { formatCurrency } from "@/lib/formatters";

interface LoanAmountSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export function LoanAmountSlider({ value, onChange, min, max, step }: LoanAmountSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700">Loan Amount</label>
        <span className="text-sm font-bold text-slate-900">{formatCurrency(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
      />
      <div className="flex justify-between text-xs text-slate-400">
        <span>{formatCurrency(min)}</span>
        <span>{formatCurrency(max)}</span>
      </div>
    </div>
  );
}
