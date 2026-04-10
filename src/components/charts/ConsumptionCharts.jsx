import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { consumptions } from '@/data/mockData';

export function ConsumptionCharts({ flatId }) {
  const water = consumptions
    .filter((c) => c.flat_id === flatId && c.type === 'Water')
    .map((c) => ({ month: c.month.slice(5), units: c.units }));
  const elec = consumptions
    .filter((c) => c.flat_id === flatId && c.type === 'Electricity')
    .map((c) => ({ month: c.month.slice(5), kwh: c.units }));

  const merged = water.map((w, i) => ({
    month: w.month,
    water: w.units,
    electricity: elec[i]?.kwh ?? 0,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <h4 className="mb-3 text-sm font-semibold text-slate-800">Water (units)</h4>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={water}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="units" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card">
        <h4 className="mb-3 text-sm font-semibold text-slate-800">Electricity (kWh)</h4>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={elec}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="kwh" stroke="#f59e0b" strokeWidth={2} dot />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-card lg:col-span-2">
        <h4 className="mb-3 text-sm font-semibold text-slate-800">Monthly consumption overview</h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={merged}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="water" name="Water" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              <Bar dataKey="electricity" name="Electricity" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
