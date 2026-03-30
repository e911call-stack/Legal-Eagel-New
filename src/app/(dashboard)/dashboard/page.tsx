'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp, AlertTriangle, MessageSquare, CheckSquare,
  Briefcase, ChevronRight, Clock, ArrowUpRight, Sparkles,
  Shield, Activity, Zap
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { mockStats, mockCases, mockAlerts, mockTasks } from '@/lib/mock-data';
import { cn, riskDot, statusColor, formatStatus, timeAgo, riskColor, t } from '@/lib/utils';
import { useLanguage } from '@/lib/language-context';

const activityData = [
  { day: 'Mon', cases: 3, alerts: 1 },
  { day: 'Tue', cases: 5, alerts: 2 },
  { day: 'Wed', cases: 2, alerts: 0 },
  { day: 'Thu', cases: 7, alerts: 3 },
  { day: 'Fri', cases: 4, alerts: 1 },
  { day: 'Sat', cases: 1, alerts: 0 },
  { day: 'Sun', cases: 6, alerts: 2 },
];

export default function DashboardPage() {
  const { lang } = useLanguage();
  const [checkingHealth, setCheckingHealth] = useState(false);
  const [healthResult, setHealthResult] = useState<string | null>(null);

  const STATS = [
    { key: 'activeCases',        value: 18,  icon: Briefcase,     color: 'text-blue-700',   bg: 'bg-blue-50',   border: 'border-blue-200' },
    { key: 'highRiskCasesLabel', value: 3,   icon: AlertTriangle, color: 'text-red-700',    bg: 'bg-red-50',    border: 'border-red-200'  },
    { key: 'unreadMessagesLabel',value: 7,   icon: MessageSquare, color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200' },
    { key: 'pendingTasks',       value: 12,  icon: CheckSquare,   color: 'text-amber-700',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  ];

  async function runHealthCheck() {
    setCheckingHealth(true);
    await new Promise(r => setTimeout(r, 2000));
    setHealthResult('AI analysis complete. 3 high-risk cases flagged. 1 missed deadline detected. 2 unanswered client messages require immediate attention.');
    setCheckingHealth(false);
  }

  const activeCases = mockCases.slice(0, 5);
  const recentAlerts = mockAlerts.filter(a => !a.resolved).slice(0, 3);

  return (
    <div className="p-5 lg:p-7 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
            {t('goodMorning', lang)}, Sarah
          </h1>
          <p className="text-gray-600 text-sm mt-1 font-medium">
            {t('today', lang)}: <span className="text-red-600 font-medium">3 {t('highRiskCases', lang)}</span> &amp;{' '}
            <span className="text-violet-600 font-medium">7 {t('unreadMessages', lang)}</span>
          </p>
        </div>
        <button onClick={runHealthCheck} disabled={checkingHealth}
          className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-300 flex-shrink-0',
            checkingHealth
              ? 'bg-gold-500/10 border-gold-500/30 text-gold-600 cursor-not-allowed'
              : 'bg-gold-500/10 border-gold-500/30 text-gold-600 hover:bg-gold-500/20 hover:border-gold-500/50')}>
          {checkingHealth ? (
            <><div className="w-3.5 h-3.5 border-2 border-gold-600/30 border-t-gold-600 rounded-full animate-spin" />{t('analyzing', lang)}</>
          ) : (
            <><Sparkles className="w-3.5 h-3.5" />{t('runHealthCheck', lang)}</>
          )}
        </button>
      </div>

      {healthResult && (
        <div className="bg-gold-50 border border-gold-200 rounded-xl p-4 flex gap-3 animate-slide-up">
          <Shield className="w-4 h-4 text-gold-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-ink-700">{healthResult}</p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STATS.map((s, i) => (
          <div key={s.key} className={cn('card rounded-xl border p-4 animate-slide-up', s.border)}
            style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', s.bg)}>
              <s.icon className={cn('w-4 h-4', s.color)} />
            </div>
            <div className={cn('text-3xl font-bold tracking-tight', s.color)}>{s.value}</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{t(s.key, lang)}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card rounded-xl border border-black/[0.07] p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">{t('recentCases', lang)}</h2>
          <div className="space-y-2">
            {activeCases.map(c => (
              <Link key={c.id} href={`/cases/${c.id}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/[0.03] transition-colors group">
                <div className={cn('w-2 h-2 rounded-full flex-shrink-0', riskDot(c.risk_score >= 70 ? 'high' : c.risk_score >= 40 ? 'medium' : 'low'))} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{c.title}</p>
                  <p className="text-xs text-gray-500 font-medium truncate">{c.client_name} · {c.practice_area}</p>
                </div>
                <span className={cn('badge text-[10px]', statusColor(c.status))}>{formatStatus(c.status)}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-ink-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Link>
            ))}
          </div>
          <Link href="/cases" className="mt-3 text-xs text-gold-600 hover:text-gold-500 flex items-center gap-1 transition-colors">
            {t('viewAll', lang)} <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="card rounded-xl border border-black/[0.07] p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">{t('recentAlerts', lang)}</h2>
          <div className="space-y-3">
            {recentAlerts.map(a => (
              <div key={a.id} className={cn('p-3 rounded-lg border text-xs', riskColor(a.risk_level))}>
                <p className="font-medium">{a.case_title}</p>
                <p className="mt-0.5 opacity-75">{a.description}</p>
              </div>
            ))}
          </div>
          <Link href="/alerts" className="mt-3 text-xs text-gold-600 hover:text-gold-500 flex items-center gap-1 transition-colors">
            {t('viewAll', lang)} <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
