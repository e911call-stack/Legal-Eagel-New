'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Scale, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'magic'>('login');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    router.push('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-white border-r border-gray-200">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 -left-24 w-96 h-96 bg-gold-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-gold-400/8 rounded-full blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:32px_32px]" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <Scale className="w-5 h-5 text-ink-950" />
          </div>
          <span className="font-display text-2xl font-bold text-gray-900 tracking-wide">Legal Eagle</span>
        </div>

        {/* Main copy */}
        <div className="relative z-10">
          <h1 className="font-display text-5xl font-semibold text-gray-900 leading-tight mb-6">
            Legal accountability,
            <br />
            <span className="gradient-text-gold font-semibold italic">redefined.</span>
          </h1>
          <p className="text-gray-600 text-base leading-relaxed mb-10 max-w-md font-medium">
            AI-powered case transparency between lawyers and clients. Real-time tracking, negligence detection, and secure communication — all in one platform.
          </p>

          <div className="space-y-4">
            {[
              'AI Negligence Detection Engine — daily case health monitoring',
              'Real-time case timelines with automated inactivity alerts',
              'Secure document hub with client-controlled visibility',
              'Multilingual interface — English, Arabic, Spanish, Chinese & Hindi',
            ].map((f, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 w-4 h-4 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                </div>
                <p className="text-gray-600 text-sm font-medium">{f}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-ink-400 text-xs">
          © 2024 Legal Eagle Technologies · All rights reserved
        </p>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md animate-fade-in">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
              <Scale className="w-4 h-4 text-ink-950" />
            </div>
            <span className="font-display text-xl font-semibold text-ink-900">Legal Eagle</span>
          </div>

          <div className="mb-8">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500 text-sm font-medium">Sign in to your secure legal workspace</p>
          </div>

          {/* Mode toggle */}
          <div className="flex bg-black/[0.05] rounded-lg p-1 mb-6 border border-black/[0.07]">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 ${
                mode === 'login' ? 'bg-gold-500 text-ink-950 shadow-sm' : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setMode('magic')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-1.5 ${
                mode === 'magic' ? 'bg-gold-500 text-ink-950 shadow-sm' : 'text-ink-600 hover:text-ink-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Magic Link
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-ink-500 mb-1.5 font-medium uppercase tracking-wide">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@lawfirm.com"
                  className="input-field pl-9"
                  required
                />
              </div>
            </div>

            {mode === 'login' && (
              <div>
                <label className="block text-xs text-ink-500 mb-1.5 font-medium uppercase tracking-wide">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-9 pr-9"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="mt-1.5 text-right">
                  <a href="#" className="text-xs text-gold-600 hover:text-gold-500 transition-colors">
                    Forgot password?
                  </a>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin" />
                  {mode === 'magic' ? 'Sending link…' : 'Signing in…'}
                </>
              ) : (
                <>
                  {mode === 'magic' ? 'Send magic link' : 'Sign in'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-black/[0.07]" />
            <span className="text-ink-400 text-xs">or</span>
            <div className="flex-1 h-px bg-black/[0.07]" />
          </div>

          {/* Demo access */}
          <div className="bg-gold-50 border border-gold-200 rounded-xl p-4">
            <p className="text-gold-700 text-xs font-medium mb-2">Demo Access</p>
            <p className="text-ink-500 text-xs mb-3">Click any role below to explore the platform:</p>
            <div className="grid grid-cols-3 gap-2">
              {(['Lawyer', 'Client', 'Admin'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => router.push('/dashboard')}
                  className="py-1.5 rounded-lg bg-white border border-black/[0.08] text-xs text-ink-600 hover:text-gold-700 hover:border-gold-400/50 transition-all duration-200 shadow-sm"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <p className="text-ink-400 text-xs text-center mt-6">
            New firm?{' '}
            <Link href="/onboarding" className="text-gold-600 hover:text-gold-500 transition-colors">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
