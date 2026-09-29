import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Array Boundary Errors', count: 7 },
  { name: 'Null Pointer Errors', count: 4 },
  { name: 'Type Mismatch', count: 3 },
  { name: 'HashMap Errors', count: 2 },
];

export const MistakeChart: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-full flex flex-col">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Recurring Mistakes</h2>
      <div className="flex-grow w-full" style={{ minHeight: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis type="number" hide={false} axisLine={false} tickLine={false} />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false} 
              width={150}
              tick={{ fill: '#4B5563', fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: '#F3F4F6' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #E5E7EB' }}
            />
            <Bar dataKey="count" fill="#2563EB" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
