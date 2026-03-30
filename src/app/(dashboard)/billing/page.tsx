'use client';

import { useState } from 'react';
import { Receipt, Plus, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { mockTimeEntries, mockCases } from '@/lib/mock-data';
import { cn, formatCurrency, formatMinutes, timeAgo, t } from '@/lib/utils';
import { useLanguage } from '@/lib/language-context';
import AddTimeEntryModal from '@/components/modals/AddTimeEntryModal';
import type { TimeEntry } from '@/types';

export default function BillingPage() {
  const { lang } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [entries, setEntries] = useState<TimeEntry[]>(mockTimeEntries);

  const BILLING_SUMMARY = [
    { key: 'totalBilledMTD',  value: 4280000,  icon: DollarSign,  color: 'text-amber-700',  bg: 'bg-amber-50' },
    { key: 'hoursLoggedMTD',  value: '142h',   icon: Clock,       color: 'text-blue-700',   bg: 'bg-blue-50' },
    { key: 'unbilledHours',   value: '28h',    icon: TrendingUp,  color: 'text-amber-700',  bg: 'bg-amber-50' },
    { key: 'invoicesPending', value: 3,        icon: Receipt,     color: 'text-violet-700', bg: 'bg-violet-50' },
  ];

  const filtered = filter === 'billed'   ? entries.filter(e => e.is_billed)
                 : filter === 'unbilled' ? entries.filter(e => !e.is_billed)
                 : entries;

  function handleAddEntry(entry: TimeEntry) {
    setEntries(prev => [entry, ...prev]);
  }

  return (
    <div className="p-5 lg:p-7 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-gray-900">{t('billing', lang)}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{t('billingSubtitle', lang)}</p>
        </div>
        <button onClick={() => setShowAddEntry(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />{t('addTime', lang)}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {BILLING_SUMMARY.map((s, i) => (
          <div key={s.key} className="card rounded-xl border border-black/[0.07] p-4 animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', s.bg)}>
              <s.icon className={cn('w-4 h-4', s.color)} />
            </div>
            <div className={cn('text-xl font-bold', s.color)}>
              {typeof s.value === 'number' ? formatCurrency(s.value) : s.value}
            </div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">{t(s.key, lang)}</div>
          </div>
        ))}
      </div>

      <div className="card rounded-xl border border-black/[0.07] p-5 mb-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">{t('budgetOverview', lang)}</h2>
        <div className="space-y-4">
          {mockCases.filter(c => c.budget).map(c => {
            const spent = Math.floor(c.budget! * (c.billing_model === 'hourly' ? 0.65 : 0.72));
            const pct = Math.round((spent / c.budget!) * 100);
            return (
              <div key={c.id}>
                <div className="flex justify-between items-center mb-1.5">
                  <div>
                    <span className="text-sm text-gray-900 font-medium">{c.title}</span>
                    <span className="text-xs text-gray-400 ml-2">{c.billing_model === 'hourly' ? t('hourly', lang) : t('flatFee', lang)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(spent)}</span>
                    <span className="text-xs text-gray-400"> / {formatCurrency(c.budget!)}</span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full transition-all duration-700',
                    pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-500' : 'bg-emerald-500')}
                    style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-[10px] mt-1">
                  <span className="text-gray-400">{pct}% {t('used', lang)}</span>
                  <span className="text-gray-400">{formatCurrency(c.budget! - spent)} {t('remaining', lang)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card rounded-xl border border-black/[0.07] p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-semibold text-gray-900">{t('timeEntries', lang)}</h2>
          <div className="flex gap-1">
            {[['all', t('allEntries', lang)], ['billed', t('billed', lang)], ['unbilled', t('unbilled', lang)]].map(([v, l]) => (
              <button key={v} onClick={() => setFilter(v)}
                className={cn('px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                  filter === v ? 'bg-amber-600 text-white' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100')}>
                {l}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          {filtered.length === 0 && (
            <p className="text-center text-sm text-gray-400 py-6">No time entries found.</p>
          )}
          {filtered.map(e => (
            <div key={e.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors">
              <div className={cn('w-2 h-2 rounded-full flex-shrink-0', e.is_billed ? 'bg-emerald-500' : 'bg-amber-400')} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{e.description}</p>
                <p className="text-xs text-gray-500">{e.case_title} · {timeAgo(e.started_at)}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">{formatMinutes(e.duration_minutes)}</p>
                <p className="text-xs text-gray-400">{e.is_billed ? 'Billed' : 'Unbilled'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AddTimeEntryModal
        open={showAddEntry}
        onClose={() => setShowAddEntry(false)}
        onSave={handleAddEntry}
      />
    </div>
  );
}
