import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Building2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { FormInput } from '@/components/ui/FormInput';
import { clsx } from '@/lib/cn';
import Logo from '/Logo.png';

const roles = [
  { id: 'resident', label: 'Resident login', desc: 'Tenants & occupants' },
  { id: 'owner', label: 'Owner login', desc: 'Flat owners' },
  { id: 'admin', label: 'Admin login', desc: 'Society administration' },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [role, setRole] = useState('resident');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(role, { username, email: username, password, remember });
    } catch (err) {
      const msg = err?.response?.data?.error;
      setError(
        msg === 'invalid_credentials'
          ? 'Invalid email or password.'
          : 'Unable to sign in. Check backend is running.'
      );
      return;
    }
    const target =
      from && from !== '/login'
        ? from
        : role === 'resident'
          ? '/resident/dashboard'
          : role === 'owner'
            ? '/owner/dashboard'
            : '/admin/dashboard';
    navigate(target, { replace: true });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50 flex flex-col">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-6">
          <Link to="/" className="flex items-center gap-3">
            <img src={Logo} alt="ROP Logo" className="h-12 w-auto" />
            <span className="font-semibold text-slate-900">ROP</span>
          </Link>
          <Link to="/" className="text-sm font-medium text-brand-600 hover:text-brand-700">
            Back to home
          </Link>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
            <p className="mt-2 text-sm text-slate-600">Residential Operations Platform — secure access</p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card-lg sm:p-8">
            <div className="grid gap-2 sm:grid-cols-3">
              {roles.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={clsx(
                    'rounded-xl border px-3 py-3 text-left text-sm transition-colors',
                    role === r.id
                      ? 'border-brand-500 bg-brand-50 text-brand-900 ring-1 ring-brand-500'
                      : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  <span className="font-semibold">{r.label}</span>
                  <span className="mt-1 block text-xs text-slate-500">{r.desc}</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <FormInput
                label="Username or email"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="you@example.com"
              />
              <div className="relative">
                <FormInput
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[34px] text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  Remember me
                </label>
                <button type="button" className="text-sm font-medium text-brand-600 hover:text-brand-700">
                  Forgot password?
                </button>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" className="w-full py-2.5">
                Continue
              </Button>
              <p className="text-center text-xs text-slate-500">
                Admin: admin@rorop.com / admin123 · Resident & Owner: use seeded email
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
