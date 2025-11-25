import React, { useState, useEffect } from 'react';
import { ArrowRight, RefreshCw, Calculator, CheckCircle2, AlertTriangle } from 'lucide-react';

interface KirchhoffState {
  v1: number;
  v2: number;
  r1: number;
  r2: number;
  r3: number;
}

const KirchhoffSim: React.FC = () => {
  const [values, setValues] = useState<KirchhoffState>({
    v1: 12,
    v2: 6,
    r1: 4,
    r2: 2,
    r3: 6,
  });

  const [currents, setCurrents] = useState({ i1: 0, i2: 0, i3: 0 });

  // Solve linear equations for the 2-loop circuit
  // Loop 1 (Left): V1 - I1*R1 - I3*R3 = 0
  // Loop 2 (Right): V2 - I2*R2 - I3*R3 = 0
  // Node A: I1 + I2 = I3
  // System matrix:
  // | (R1+R3)   R3    | | I1 |   | V1 |
  // |   R3    (R2+R3) | | I2 | = | V2 |
  useEffect(() => {
    const { v1, v2, r1, r2, r3 } = values;
    const det = (r1 + r3) * (r2 + r3) - (r3 * r3);
    
    if (det === 0) return; // Prevent division by zero

    const i1 = (v1 * (r2 + r3) - v2 * r3) / det;
    const i2 = (v2 * (r1 + r3) - v1 * r3) / det;
    const i3 = i1 + i2;

    setCurrents({ i1, i2, i3 });
  }, [values]);

  const handleValueChange = (key: keyof KirchhoffState, val: number) => {
    setValues(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
            <div className="p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <Calculator size={20} />
            </div>
            مختبر كيرشوف (The 2-Loop Challenge)
          </h3>
          <p className="text-slate-400 text-xs mt-2 max-w-lg">
            قم بتغيير قيم البطاريات والمقاومات ولاحظ كيف تتغير اتجاهات وقيم التيارات (I1, I2, I3) تلقائياً بناءً على القوانين.
          </p>
        </div>
        
        <div className="flex gap-2">
           <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex flex-col items-center min-w-[80px]">
             <span className="text-[10px] text-slate-500 uppercase font-bold">I1 (Left)</span>
             <span className={`font-mono font-bold ${currents.i1 >= 0 ? 'text-blue-400' : 'text-red-400'}`}>
               {currents.i1.toFixed(2)} A
             </span>
           </div>
           <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex flex-col items-center min-w-[80px]">
             <span className="text-[10px] text-slate-500 uppercase font-bold">I2 (Right)</span>
             <span className={`font-mono font-bold ${currents.i2 >= 0 ? 'text-green-400' : 'text-red-400'}`}>
               {currents.i2.toFixed(2)} A
             </span>
           </div>
           <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 flex flex-col items-center min-w-[80px]">
             <span className="text-[10px] text-slate-500 uppercase font-bold">I3 (Mid)</span>
             <span className={`font-mono font-bold ${currents.i3 >= 0 ? 'text-yellow-400' : 'text-red-400'}`}>
               {currents.i3.toFixed(2)} A
             </span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Circuit Visualization */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl border border-slate-800 relative min-h-[400px] flex items-center justify-center overflow-hidden shadow-inner">
           <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>
           
           {/* Circuit Diagram SVG */}
           <svg viewBox="0 0 600 350" className="w-full h-full max-w-2xl drop-shadow-2xl">
              {/* Definitions for markers */}
              <defs>
                <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <path d="M0,0 L10,5 L0,10" fill="#60a5fa" />
                </marker>
                <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <path d="M0,0 L10,5 L0,10" fill="#4ade80" />
                </marker>
                <marker id="arrow-yellow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
                  <path d="M0,0 L10,5 L0,10" fill="#facc15" />
                </marker>
              </defs>

              {/* Wires */}
              {/* Outer Frame */}
              <path d="M100,250 L100,100 L500,100 L500,250 L100,250" fill="none" stroke="#334155" strokeWidth="4" />
              {/* Middle Branch */}
              <path d="M300,100 L300,250" fill="none" stroke="#334155" strokeWidth="4" />

              {/* Component: Battery V1 (Left) */}
              <g transform="translate(100, 175)">
                 <line x1="0" y1="-15" x2="0" y2="15" stroke="#334155" strokeWidth="4" /> {/* Masking wire */}
                 <rect x="-10" y="-15" width="20" height="30" fill="#020617" />
                 <line x1="-10" y1="5" x2="10" y2="5" stroke="#94a3b8" strokeWidth="2" /> {/* Negative */}
                 <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#fbbf24" strokeWidth="4" /> {/* Positive */}
                 <text x="-25" y="0" fill="#fbbf24" fontSize="14" fontWeight="bold" textAnchor="end">V1</text>
              </g>

              {/* Component: Battery V2 (Right) */}
              <g transform="translate(500, 175)">
                 <rect x="-10" y="-15" width="20" height="30" fill="#020617" />
                 <line x1="-10" y1="5" x2="10" y2="5" stroke="#94a3b8" strokeWidth="2" /> {/* Negative */}
                 <line x1="-15" y1="-5" x2="15" y2="-5" stroke="#fbbf24" strokeWidth="4" /> {/* Positive */}
                 <text x="25" y="0" fill="#fbbf24" fontSize="14" fontWeight="bold" textAnchor="start">V2</text>
              </g>

              {/* Component: Resistor R1 (Top Left) */}
              <g transform="translate(200, 100)">
                 <rect x="-25" y="-10" width="50" height="20" fill="#1e293b" stroke="#60a5fa" strokeWidth="2" />
                 <text x="0" y="5" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">R1</text>
              </g>

              {/* Component: Resistor R2 (Top Right) */}
              <g transform="translate(400, 100)">
                 <rect x="-25" y="-10" width="50" height="20" fill="#1e293b" stroke="#4ade80" strokeWidth="2" />
                 <text x="0" y="5" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">R2</text>
              </g>

              {/* Component: Resistor R3 (Middle) */}
              <g transform="translate(300, 175)">
                 <rect x="-10" y="-25" width="20" height="50" fill="#1e293b" stroke="#facc15" strokeWidth="2" />
                 <text x="0" y="5" fill="white" fontSize="12" fontWeight="bold" textAnchor="middle">R3</text>
              </g>

              {/* Node Dots */}
              <circle cx="300" cy="100" r="6" fill="#fbbf24" stroke="#fff" strokeWidth="2" />
              <text x="300" y="85" fill="#94a3b8" fontSize="12" textAnchor="middle">Node A</text>
              <circle cx="300" cy="250" r="6" fill="#334155" />

              {/* Dynamic Current Arrows */}
              
              {/* I1 Path (Blue) */}
              <path 
                d="M100,220 L100,100 L160,100" 
                fill="none" 
                stroke={currents.i1 > 0 ? "#60a5fa" : "#ef4444"} 
                strokeWidth="2" 
                strokeDasharray="5,5"
                className="animate-[dash_1s_linear_infinite]"
                style={{ animationDirection: currents.i1 > 0 ? 'normal' : 'reverse' }}
              />
              <text x="130" y="125" fill="#60a5fa" fontSize="14" fontWeight="bold">I1</text>

              {/* I2 Path (Green) */}
              <path 
                d="M500,220 L500,100 L440,100" 
                fill="none" 
                stroke={currents.i2 > 0 ? "#4ade80" : "#ef4444"} 
                strokeWidth="2" 
                strokeDasharray="5,5"
                className="animate-[dash_1s_linear_infinite]"
                style={{ animationDirection: currents.i2 > 0 ? 'normal' : 'reverse' }}
              />
              <text x="470" y="125" fill="#4ade80" fontSize="14" fontWeight="bold">I2</text>

              {/* I3 Path (Yellow) */}
              <path 
                d="M300,130 L300,145" 
                fill="none" 
                stroke={currents.i3 > 0 ? "#facc15" : "#ef4444"} 
                strokeWidth="3" 
                markerEnd={currents.i3 > 0 ? "url(#arrow-yellow)" : ""}
              />
              <text x="320" y="150" fill="#facc15" fontSize="14" fontWeight="bold">I3</text>

           </svg>
        </div>

        {/* Controls */}
        <div className="space-y-6 bg-slate-950/50 p-6 rounded-2xl border border-slate-800 overflow-y-auto custom-scrollbar max-h-[500px]">
           <div className="space-y-4">
             <h4 className="text-blue-400 font-bold text-sm uppercase tracking-wider border-b border-blue-500/20 pb-2">Left Loop (V1, R1)</h4>
             <ControlSlider label="V1 (Battery)" value={values.v1} max={24} onChange={(v) => handleValueChange('v1', v)} color="text-blue-400" />
             <ControlSlider label="R1 (Resistor)" value={values.r1} onChange={(v) => handleValueChange('r1', v)} color="text-slate-300" />
           </div>

           <div className="space-y-4">
             <h4 className="text-yellow-500 font-bold text-sm uppercase tracking-wider border-b border-yellow-500/20 pb-2">Middle Branch (R3)</h4>
             <ControlSlider label="R3 (Shared Resistor)" value={values.r3} onChange={(v) => handleValueChange('r3', v)} color="text-yellow-400" />
           </div>

           <div className="space-y-4">
             <h4 className="text-green-400 font-bold text-sm uppercase tracking-wider border-b border-green-500/20 pb-2">Right Loop (V2, R2)</h4>
             <ControlSlider label="V2 (Battery)" value={values.v2} max={24} onChange={(v) => handleValueChange('v2', v)} color="text-green-400" />
             <ControlSlider label="R2 (Resistor)" value={values.r2} onChange={(v) => handleValueChange('r2', v)} color="text-slate-300" />
           </div>

           {/* KCL Check Box */}
           <div className="mt-6 p-4 bg-slate-900 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-xs text-slate-400 font-bold">KCL CHECK (Node A)</span>
              </div>
              <div className="flex justify-between text-sm font-mono text-slate-300">
                 <span>I1 + I2</span>
                 <span>=</span>
                 <span>I3</span>
              </div>
              <div className="flex justify-between text-sm font-mono font-bold text-white mt-1 border-t border-slate-800 pt-1">
                 <span>{(currents.i1 + currents.i2).toFixed(2)}</span>
                 <span className="text-yellow-500">≈</span>
                 <span>{currents.i3.toFixed(2)}</span>
              </div>
           </div>
        </div>
      </div>
      
      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -10; }
        }
      `}</style>
    </div>
  );
};

const ControlSlider = ({ label, value, max=20, onChange, color }: any) => (
  <div className="group">
    <div className="flex justify-between mb-1 text-xs font-medium">
      <span className="text-slate-400">{label}</span>
      <span className={`font-mono ${color}`}>{value}</span>
    </div>
    <input 
      type="range" min="1" max={max} step="0.5"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-slate-500 group-hover:accent-yellow-500 transition-all"
    />
  </div>
);

export default KirchhoffSim;