import React, { useState, useEffect } from 'react';
import { CircuitState } from '../types';

interface CircuitSimProps {
  type: 'SERIES_PARALLEL' | 'CLOSED_CIRCUIT';
}

const CircuitSim: React.FC<CircuitSimProps> = ({ type }) => {
  const [state, setState] = useState<CircuitState>({
    r1: 10, r2: 10, r3: 10,
    isSeries: true,
    vb: 12, internalR: 2, externalR: 10
  });

  // Calculate values for Series/Parallel
  const rSeries = state.r1 + state.r2 + state.r3;
  const rParallel = 1 / ((1/state.r1) + (1/state.r2) + (1/state.r3));
  const rEq = state.isSeries ? rSeries : rParallel;
  const totalCurrentSP = state.vb / rEq; // Assuming 12V source for visualization

  // Calculate values for Closed Circuit
  const totalCurrentClosed = state.vb / (state.externalR + state.internalR);
  const vTerminal = state.vb - (totalCurrentClosed * state.internalR);

  return (
    <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse shadow-[0_0_10px_#eab308]"></span>
          {type === 'SERIES_PARALLEL' ? 'مختبر توصيل المقاومات' : 'مختبر قانون أوم المغلق'}
        </h3>
        <div className="text-[10px] text-yellow-500/50 font-mono border border-yellow-500/20 px-2 py-1 rounded bg-yellow-500/5">PREMIUM LAB</div>
      </div>

      {/* Simulation Visualization Area */}
      <div className="bg-slate-950 rounded-2xl h-80 relative overflow-hidden flex items-center justify-center mb-8 border border-slate-800 shadow-[inset_0_2px_20px_rgba(0,0,0,0.8)]">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(#fbbf24 1px, transparent 1px), linear-gradient(90deg, #fbbf24 1px, transparent 1px)', backgroundSize: '20px 20px'}}></div>

        {type === 'SERIES_PARALLEL' && (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 z-10">
            <div className="absolute top-4 right-4 bg-yellow-500/5 border border-yellow-500/20 p-2 rounded text-xs text-yellow-500/70 font-mono">
              Supply: 12.0V
            </div>
            
            {/* Schematic Visualization */}
            <div className="relative w-full max-w-3xl h-48 flex items-center justify-center">
              {state.isSeries ? (
                // Series Visualization
                <div className="flex items-center gap-1 w-full justify-center px-8">
                  <div className="h-[2px] bg-gradient-to-r from-transparent to-yellow-600 w-16 shadow-[0_0_5px_#ca8a04]"></div>
                  <ResistorBox val={state.r1} i={totalCurrentSP} v={totalCurrentSP * state.r1} label="R1" />
                  <WireSegment animated duration={2/totalCurrentSP} />
                  <ResistorBox val={state.r2} i={totalCurrentSP} v={totalCurrentSP * state.r2} label="R2" />
                  <WireSegment animated duration={2/totalCurrentSP} />
                  <ResistorBox val={state.r3} i={totalCurrentSP} v={totalCurrentSP * state.r3} label="R3" />
                  <div className="h-[2px] bg-gradient-to-l from-transparent to-yellow-600 w-16 shadow-[0_0_5px_#ca8a04]"></div>
                </div>
              ) : (
                // Parallel Visualization
                <div className="flex flex-col gap-4 w-full items-center relative py-2">
                   {/* Main Bus Bars */}
                   <div className="absolute left-16 top-2 bottom-2 w-1 bg-gradient-to-b from-yellow-600 via-yellow-400 to-yellow-600 shadow-[0_0_8px_#eab308] rounded-full"></div>
                   <div className="absolute right-16 top-2 bottom-2 w-1 bg-gradient-to-b from-yellow-600 via-yellow-400 to-yellow-600 shadow-[0_0_8px_#eab308] rounded-full"></div>
                   
                   {[state.r1, state.r2, state.r3].map((r, idx) => {
                     const iBranch = 12 / r;
                     return (
                       <div key={idx} className="flex items-center w-[80%] justify-between relative">
                         <div className="h-[2px] bg-yellow-600 flex-1 relative overflow-hidden shadow-[0_0_5px_#ca8a04]">
                            <div className="absolute inset-0 bg-yellow-200/50 w-full animate-flow" style={{animationDuration: `${Math.max(0.1, 1/iBranch)}s`}}></div>
                         </div>
                         <ResistorBox val={r} i={iBranch} v={12} label={`R${idx+1}`} />
                         <div className="h-[2px] bg-yellow-600 flex-1 shadow-[0_0_5px_#ca8a04]"></div>
                       </div>
                     )
                   })}
                </div>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-center w-full max-w-md">
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50 backdrop-blur">
                <p className="text-slate-500 text-[10px] mb-1 uppercase tracking-wider">Equivalent Resistance</p>
                <p className="text-xl font-bold text-white font-mono">{rEq.toFixed(1)} Ω</p>
              </div>
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700/50 backdrop-blur">
                <p className="text-slate-500 text-[10px] mb-1 uppercase tracking-wider">Total Current</p>
                <p className="text-xl font-bold text-yellow-400 font-mono">{totalCurrentSP.toFixed(2)} A</p>
              </div>
            </div>
          </div>
        )}

        {type === 'CLOSED_CIRCUIT' && (
          <div className="w-full h-full relative flex items-center justify-center z-10 scale-90 md:scale-100">
             {/* Battery Visual */}
             <div className="flex flex-col items-center gap-8">
                <div className="w-72 h-40 border border-slate-700/50 rounded-xl relative bg-slate-900 flex items-center justify-center p-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-visible group">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-yellow-500/5 rounded-xl group-hover:bg-yellow-500/10 transition-colors"></div>
                  
                  {/* Positive Terminal */}
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-12 bg-gradient-to-b from-slate-400 to-slate-600 rounded-r-sm shadow-lg border-l border-slate-800"></div>
                  {/* Negative Terminal */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-2 h-8 bg-gradient-to-b from-slate-400 to-slate-600 rounded-l-sm shadow-lg"></div>
                  
                  <div className="text-center z-10 flex flex-col items-center">
                    <div className="text-5xl font-black text-white font-mono tracking-tighter drop-shadow-lg">{state.vb}V</div>
                    <div className="text-[10px] text-yellow-500/70 mt-2 font-bold tracking-[0.2em]">BATTERY SOURCE</div>
                  </div>
                  
                  {/* Internal Resistor Representation */}
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-950 px-4 py-1.5 rounded-full border border-red-500/30 shadow-lg z-20">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                    <span className="text-[10px] text-slate-400 font-bold">r_internal</span>
                    <span className="text-xs text-red-400 font-bold font-mono ml-1">{state.internalR}Ω</span>
                  </div>
                </div>
                
                {/* External Circuit Loop */}
                <div className="w-96 h-32 border-x-2 border-b-2 border-yellow-500/40 rounded-b-[4rem] relative mt-[-24px] z-0 flex items-end justify-center pb-8 shadow-[0_10px_20px_rgba(234,179,8,0.05)]">
                   <div className="absolute inset-x-0 bottom-0 h-[2px] bg-yellow-500/20 blur-[2px]"></div>
                   <ResistorBox val={state.externalR} i={totalCurrentClosed} v={totalCurrentClosed * state.externalR} label="Load (R)" />
                </div>
                
                {/* Voltmeter Connected Across Battery */}
                <div className="absolute -top-8 right-[-40px] w-36 bg-slate-800/90 backdrop-blur border border-slate-600 p-3 rounded-lg shadow-2xl text-center transform rotate-6 z-30">
                   <div className="absolute -bottom-6 left-8 w-[2px] h-8 bg-slate-600"></div>
                   <div className="absolute -bottom-6 left-24 w-[2px] h-8 bg-slate-600"></div>
                   <div className="text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Voltmeter Reading</div>
                   <div className="text-2xl font-mono font-black text-green-400 bg-black/60 rounded px-2 py-1 shadow-inner border border-white/5">
                     {vTerminal.toFixed(2)} V
                   </div>
                   <div className="text-[9px] text-slate-500 mt-1 font-mono">V = VB - Ir</div>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Controls Area */}
      <div className="bg-slate-950/30 p-6 rounded-2xl border border-slate-800/50">
        <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Control Panel</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {type === 'SERIES_PARALLEL' ? (
          <>
            <div className="md:col-span-3 flex justify-center mb-4">
               <div className="bg-slate-950 p-1 rounded-xl flex border border-slate-800">
                 <button 
                   onClick={() => setState({...state, isSeries: true})}
                   className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${state.isSeries ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                 >
                   توالي (Series)
                 </button>
                 <button 
                   onClick={() => setState({...state, isSeries: false})}
                   className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${!state.isSeries ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
                 >
                   توازي (Parallel)
                 </button>
               </div>
            </div>
            
            {['r1', 'r2', 'r3'].map((key) => (
              <SliderControl 
                key={key} 
                label={`Resistance ${key.toUpperCase()}`} 
                value={(state as any)[key]} 
                onChange={(v) => setState({...state, [key]: v})}
                color="text-slate-300"
              />
            ))}
          </>
        ) : (
          <>
             <SliderControl 
               label="VB (Battery EMF)" 
               value={state.vb} 
               min={1} max={24} step={0.5} 
               onChange={(v) => setState({...state, vb: v})}
               color="text-yellow-400"
             />
             <SliderControl 
               label="r (Internal Resistance)" 
               value={state.internalR} 
               min={0} max={5} step={0.1}
               onChange={(v) => setState({...state, internalR: v})}
               color="text-red-400"
             />
             <SliderControl 
               label="R (External Load)" 
               value={state.externalR} 
               min={1} max={50} step={0.5}
               onChange={(v) => setState({...state, externalR: v})}
               color="text-blue-400"
             />
             
             <div className="col-span-full bg-yellow-500/5 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-3 mt-2">
               <div className="p-1 bg-yellow-500/20 rounded text-yellow-500 mt-0.5">💡</div>
               <p className="text-xs text-yellow-200/80 leading-relaxed">
                 <strong className="text-yellow-500 block mb-1">فكرة امتحان هامة:</strong>
                 لاحظ العلاقة العكسية: عند زيادة المقاومة الخارجية (R)، تقل شدة التيار (I)، وبالتالي يقل المقدار (Ir)، فتزداد قراءة الفولتميتر (V).
               </p>
             </div>
          </>
        )}
        </div>
      </div>
      <style>{`
        @keyframes flow {
           0% { transform: translateX(-100%); }
           100% { transform: translateX(100%); }
        }
        .animate-flow { animation: flow linear infinite; }
      `}</style>
    </div>
  );
};

const WireSegment = ({ animated, duration }: { animated?: boolean, duration?: number }) => (
  <div className="h-[2px] bg-yellow-600 w-12 relative overflow-hidden shadow-[0_0_5px_#ca8a04]">
    {animated && (
      <div 
        className="absolute inset-0 bg-yellow-200/50 w-full animate-flow" 
        style={{animationDuration: `${Math.max(0.1, duration || 1)}s`}}
      ></div>
    )}
  </div>
);

const ResistorBox = ({ val, i, v, label }: {val: number, i: number, v: number, label: string}) => (
  <div className="min-w-[80px] h-12 bg-slate-800 rounded flex flex-col items-center justify-center relative mx-1 transform transition-transform hover:scale-105 border border-slate-600 shadow-lg group">
    {/* Metallic Contacts */}
    <div className="absolute -left-1 w-1 h-4 bg-slate-400 rounded-l-sm"></div>
    <div className="absolute -right-1 w-1 h-4 bg-slate-400 rounded-r-sm"></div>
    
    {/* Color Bands (Cosmetic) */}
    <div className="flex gap-1.5 absolute top-0 bottom-0 items-center justify-center opacity-30 w-full">
       <div className="w-1 h-full bg-red-500"></div>
       <div className="w-1 h-full bg-blue-500"></div>
       <div className="w-1 h-full bg-yellow-500"></div>
    </div>
    
    <span className="relative z-10 text-[9px] font-bold text-slate-400 -mt-3">{label}</span>
    <span className="relative z-10 text-sm text-white font-mono font-bold">{val}Ω</span>
    
    {/* Hover Data Badge */}
    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur text-white text-[9px] px-2 py-1 rounded border border-white/10 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-xl">
       <span className="text-yellow-400">{v.toFixed(1)}V</span> • <span className="text-blue-400">{i.toFixed(2)}A</span>
    </div>
  </div>
);

const SliderControl = ({ label, value, onChange, min=1, max=50, step=1, color="text-white" }: any) => (
  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors group">
    <label className="flex justify-between text-slate-400 mb-2 text-[10px] uppercase tracking-wider font-bold">
      <span>{label}</span>
      <span className={`font-mono ${color} bg-white/5 px-1.5 rounded`}>{value}</span>
    </label>
    <input 
      type="range" min={min} max={max} step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 group-hover:accent-yellow-400"
    />
  </div>
);

export default CircuitSim;