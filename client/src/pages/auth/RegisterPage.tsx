import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuthStore } from '../../stores/authStore';
import { api } from '../../services/api';

export default function RegisterPage() {
  const [, navigate] = useLocation();
  const { setUser } = useAuthStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', institution: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post('/auth/register', form);
      setUser(data.user, data.token);
      navigate('/');
    } catch (err: any) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1211] flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#B7FF5A] rounded-full flex items-center justify-center">
              <span className="font-mono font-bold text-[#0D1211]">O</span>
            </div>
            <span className="font-mono font-bold text-white text-lg">ORUVIA</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-1">Create an account</h1>
          <p className="text-[#747A75]">Join the scientific knowledge community</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-[#747A75] mb-1.5" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required
              placeholder="Dr. Jane Smith"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#747A75] focus:outline-none focus:border-[#B7FF5A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-[#747A75] mb-1.5" htmlFor="reg-email">Email address</label>
            <input
              id="reg-email"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              placeholder="you@institution.org"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#747A75] focus:outline-none focus:border-[#B7FF5A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-[#747A75] mb-1.5" htmlFor="institution">Institution (optional)</label>
            <input
              id="institution"
              type="text"
              value={form.institution}
              onChange={e => setForm(f => ({ ...f, institution: e.target.value }))}
              placeholder="National Institute of Polar Research"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#747A75] focus:outline-none focus:border-[#B7FF5A] transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-[#747A75] mb-1.5" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              minLength={6}
              placeholder="Min. 6 characters"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#747A75] focus:outline-none focus:border-[#B7FF5A] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B7FF5A] text-[#0D1211] font-bold py-3 rounded-lg hover:bg-[#c8ff7a] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-[#747A75] text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-[#B7FF5A] hover:underline">Sign in</Link>
        </p>

        <p className="text-center text-[10px] text-[#747A75] mt-8 font-mono">
          By registering, you agree to contribute to and respect the scientific integrity of the ORUVIA platform.
        </p>
      </div>
    </div>
  );
}
