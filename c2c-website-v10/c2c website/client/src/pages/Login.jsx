import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      const destination = searchParams.get('redirect');
      navigate(destination && destination.startsWith('/') ? destination : '/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="glass-card rounded-2xl p-7 sm:p-9">
        <p className="text-cyan-400 text-xs font-mono tracking-widest uppercase mb-3">Welcome back</p>
        <h1 className="text-3xl font-black text-white mb-2">Sign in to C2C</h1>
        <p className="text-slate-400 text-sm mb-8">Use your Code2Chill account details.</p>
        <form onSubmit={handleSubmit} className="space-y-5">
          <label className="block text-sm text-slate-300">
            Email address
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-dark-900 px-3">
              <Mail className="w-4 h-4 text-slate-500" />
              <input className="w-full bg-transparent py-3 text-white outline-none" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </span>
          </label>
          <label className="block text-sm text-slate-300">
            Password
            <span className="mt-2 flex items-center gap-3 rounded-xl border border-slate-700 bg-dark-900 px-3">
              <LockKeyhole className="w-4 h-4 text-slate-500" />
              <input className="w-full bg-transparent py-3 text-white outline-none" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
            </span>
          </label>
          {error && <p role="alert" className="text-sm text-rose-400">{error}</p>}
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-sm text-slate-400 mt-6 text-center">New to Code2Chill? <Link to="/join" className="text-cyan-400 hover:text-cyan-300">Join the club</Link></p>
      </div>
    </section>
  );
}
