import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../services/api';

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/auth/login', form);
      setUser(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1211] flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex w-1/2 bg-[#0D1211] border-r border-white/10 flex-col justify-between p-12">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#B7FF5A] rounded-full flex items-center justify-center">
            <span className="font-mono font-bold text-[#0D1211] text-sm">O</span>
          </div>
          <span className="font-mono font-bold text-white text-lg tracking-wider">ORUVIA</span>
        </Link>

        <div>
          <h1 className="font-serif text-5xl text-white mb-4 leading-tight">
            Knowledge,<br /><em className="text-[#B7FF5A]">alive.</em>
          </h1>
          <p className="text-[#747A75] text-lg">
            Your gateway to a unified scientific knowledge system — expeditions, datasets, research, and living observations.
          </p>

          <div className="mt-12 space-y-4">
            {[
              { icon: '🗃️', text: 'Access curated scientific datasets' },
              { icon: '🗺️', text: 'Explore the interactive knowledge atlas' },
              { icon: '🤖', text: 'Ask questions powered by AI & RAG' },
              { icon: '📝', text: 'Contribute and publish through Studio' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <span className="text-[#747A75]">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#747A75] text-sm font-mono">
          © {new Date().getFullYear()} ORUVIA Scientific Platform
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="lg:hidden flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-[#B7FF5A] rounded-full flex items-center justify-center">
                <span className="font-mono font-bold text-[#0D1211] text-xs">O</span>
              </div>
              <span className="font-mono font-bold text-white">ORUVIA</span>
            </Link>
            <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
            <p className="text-[#747A75]">Access the ORUVIA knowledge platform</p>
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-[#747A75] mb-1.5" htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                placeholder="you@institution.org"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#747A75] focus:outline-none focus:border-[#B7FF5A] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-[#747A75] mb-1.5" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#747A75] focus:outline-none focus:border-[#B7FF5A] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B7FF5A] text-[#0D1211] font-bold py-3 rounded-lg hover:bg-[#c8ff7a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-[#747A75] text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="text-[#B7FF5A] hover:underline">Create one</Link>
            </p>
          </div>

          {/* Demo credentials */}
          <div className="mt-8 p-4 bg-white/5 border border-white/10 rounded-xl">
            <p className="text-xs font-mono text-[#747A75] uppercase tracking-wider mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-[#747A75]">
              <div><span className="text-white">Admin:</span> admin@oruvia.demo / oruvia2026</div>
              <div><span className="text-white">Editor:</span> editor@oruvia.demo / oruvia2026</div>
              <div><span className="text-white">Reviewer:</span> reviewer@oruvia.demo / oruvia2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
