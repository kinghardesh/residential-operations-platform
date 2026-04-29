import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { adminResourceUsage } from '@/data/mockData';

export function ResourceUsageChart({ data = adminResourceUsage }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} />
          <Legend />
          <Line type="monotone" dataKey="water" name="Water (kl)" stroke="#0ea5e9" strokeWidth={2} dot={false} />
          <Line
            type="monotone"
            dataKey="electricity"
            name="Electricity (kWh)"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
