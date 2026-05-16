import * as React from "react";

interface TenureSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

export function TenureSlider({ value, onChange, min, max, step }: TenureSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-slate-700">Tenure</label>
        <span className="text-sm font-bold text-slate-900">{value} days</span>
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
        <span>{min} days</span>
        <span>{max} days</span>
      </div>
    </div>
  );
}
