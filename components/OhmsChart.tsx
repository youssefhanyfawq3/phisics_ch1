import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface OhmsChartProps {
  voltage: number;
  resistance: number;
}

const OhmsChart: React.FC<OhmsChartProps> = ({ voltage, resistance }) => {
  const data = [];
  const maxCurrent = 10;
  
  for (let i = 0; i <= maxCurrent; i+=1) {
    data.push({
      current: i,
      voltage: i * resistance,
    });
  }

  const currentI = resistance > 0 ? voltage / resistance : 0;

  return (
    <div className="w-full h-64 bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
      <h3 className="text-center text-sm mb-4 text-slate-400 font-bold">العلاقة الطردية: V = I × R</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="current" 
            label={{ value: 'التيار (I)', position: 'insideBottomRight', offset: -5, fill: '#94a3b8' }} 
            stroke="#475569"
            tick={{fill: '#94a3b8'}}
          />
          <YAxis 
            label={{ value: 'الجهد (V)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
            stroke="#475569"
            tick={{fill: '#94a3b8'}}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#fbbf24', color: '#f8fafc', borderRadius: '8px' }}
            itemStyle={{ color: '#fbbf24' }}
            formatter={(value: number) => [`${value} V`, 'الجهد']}
            labelFormatter={(label) => `التيار: ${label} A`}
            cursor={{stroke: '#fbbf24', strokeWidth: 1, strokeDasharray: '4 4'}}
          />
          <Line 
            type="monotone" 
            dataKey="voltage" 
            stroke="#fbbf24" 
            strokeWidth={3} 
            dot={false} 
            activeDot={{ r: 6, fill: '#fbbf24', stroke: '#fff', strokeWidth: 2 }} 
          />
          <ReferenceLine x={currentI} stroke="#fff" strokeOpacity={0.5} strokeDasharray="3 3" />
          <ReferenceLine y={voltage} stroke="#fff" strokeOpacity={0.5} strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
      <div className="text-center mt-[-10px] text-yellow-500 font-mono font-bold text-sm bg-yellow-500/10 inline-block px-3 py-1 rounded-full border border-yellow-500/20 mx-auto relative left-1/2 -translate-x-1/2">
        Point: ({currentI.toFixed(2)}A, {voltage}V)
      </div>
    </div>
  );
};

export default OhmsChart;