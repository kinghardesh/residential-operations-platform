import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { monthlyPaymentCollection } from '@/data/mockData';

function formatInr(n) {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}k`;
  return `₹${n}`;
}

export function PaymentCollectionChart({ data = monthlyPaymentCollection }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={formatInr} />
          <Tooltip
            contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
            formatter={(v) => [formatInr(v), 'Collected']}
          />
          <Bar dataKey="amount" fill="#0c8ee7" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
