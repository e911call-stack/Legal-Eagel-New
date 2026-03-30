'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, Sparkles, Clock, MessageSquare, Calendar, RefreshCw, Shield } from 'lucide-react';
import Link from 'next/link';
import { mockAlerts } from '@/lib/mock-data';
import { cn, riskColor, timeAgo, t } from '@/lib/utils';
import { useLanguage } from '@/lib/language-context';
import type { AIAlert } from '@/types';

export default function AlertsPage() {
  const { lang } = useLanguage();
  const [alerts, setAlerts] = useState(mockAlerts);
  const [running, setRunning] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');
  const [lastRun, setLastRun] = useState('2 hours ago');

  const TYPE_ICONS: Record<AIAlert['type'], React.ReactNode> = {
    inactivity:         <Clock className="w-4 h-4" />,
    unanswered_message: <MessageSquare className="w-4 h-4" />,
    missed_deadline:    <Calendar className="w-4 h-4" />,
  };

  const TYPE_LABEL_KEYS: Record<AIAlert['type'], string> = {
    inactivity:         'caseInactivity',
    unanswered_message: 'unansweredMessage',
    missed_deadline:    'missedDeadline',
  };

  async function runEngine() {
    setRunning(true);
    await new Promise(r => setTimeout(r, 2800));
    setLastRun('just now');
    setRunning(false);
  }

  function resolve(id: string) {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true, resolved_at: new Date().toISOString(), resolved_by: 'Sarah Chen' } : a));
  }

  const filtered = alerts.filter(a =>
    filter === 'active' ? !a.resolved : filter === 'resolved' ? a.resolved : true
  );

  const activeCount   = alerts.filter(a => !a.resolved).length;
  const resolvedCount = alerts.filter(a =>  a.resolved).length;

  return (
    <div className="p-5 lg:p-7 animate-fade-in">
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-gray-900">{t('alerts', lang)}</h1>
          <p className="text-gray-500 text-sm mt-0.5 font-medium">{t('negligenceEngine', lang)} · {t('lastRun', lang)}: <span className="text-gold-600">{lastRun}</span></p>
        </div>
        <button onClick={runEngine} disabled={running}
          className={cn('flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-300',
            running ? 'bg-gold-50 border-gold-300 text-gold-600 cursor-not-allowed' : 'bg-gold-50 border-gold-300 text-gold-600 hover:bg-gold-100')}>
          {running ? (
            <><div className="w-3.5 h-3.5 border-2 border-gold-600/30 border-t-gold-600 rounded-full animate-spin" />{t('running', lang)}</>
          ) : (
            <><RefreshCw className="w-3.5 h-3.5" />{t('runEngine', lang)}</>
          )}
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {[
          ['active',   t('activeAlerts', lang),   activeCount],
          ['resolved', t('resolvedAlerts', lang),  resolvedCount],
          ['all',      t('allAlerts', lang),        alerts.length],
        ].map(([v, l, count]) => (
          <button key={v} onClick={() => setFilter(v as any)}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all',
              filter === v ? 'bg-ink-900 text-white border-ink-900' : 'bg-white text-ink-600 border-black/10 hover:border-black/20')}>
            {l} <span className={cn('text-[11px] px-1.5 py-0.5 rounded-full font-bold',
              filter === v ? 'bg-white/20 text-white' : 'bg-ink-100 text-ink-500')}>{count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((a, i) => (
          <div key={a.id}
            className={cn('card rounded-xl border p-4 animate-slide-up transition-all',
              a.resolved ? 'border-black/[0.05] opacity-60' : 'border-black/[0.07]')}
            style={{ animationDelay: `${i * 0.04}s` }}>
            <div className="flex items-start gap-3">
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                a.risk_level === 'high' ? 'bg-red-50 text-red-600' : a.risk_level === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600')}>
                {TYPE_ICONS[a.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs font-medium text-ink-500">{t(TYPE_LABEL_KEYS[a.type], lang)}</span>
                  <span className={cn('badge text-[10px]', riskColor(a.risk_level))}>{a.risk_level}</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{a.case_title}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">{a.description}</p>
                {a.resolved && a.resolved_by && (
                  <p className="text-[10px] text-emerald-600 mt-1">✓ {t('resolvedBy', lang)}: {a.resolved_by} · {timeAgo(a.resolved_at!)}</p>
                )}
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                <span className="text-xs text-ink-400">{timeAgo(a.created_at)}</span>
                {!a.resolved && (
                  <button onClick={() => resolve(a.id)}
                    className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 hover:bg-emerald-100 transition-colors font-medium">
                    {t('resolveAlert', lang)}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
