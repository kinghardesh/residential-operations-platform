import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { monthlyComplaintTrend } from '@/data/mockData';

export function ComplaintTrendChart({ data = monthlyComplaintTrend }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="cmpFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0070c5" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#0070c5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" allowDecimals={false} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
            formatter={(v) => [`${v}`, 'Complaints']}
          />
          <Area type="monotone" dataKey="count" stroke="#0070c5" fill="url(#cmpFill)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
