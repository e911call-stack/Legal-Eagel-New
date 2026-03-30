'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, ArrowUpRight } from 'lucide-react';
import { mockCases } from '@/lib/mock-data';
import { cn, riskDot, riskColor, statusColor, formatStatus, timeAgo, t } from '@/lib/utils';
import { useLanguage } from '@/lib/language-context';
import NewCaseModal from '@/components/modals/NewCaseModal';
import type { Case, CaseStatus } from '@/types';

export default function CasesPage() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [showNewCase, setShowNewCase] = useState(false);
  const [cases, setCases] = useState<Case[]>(mockCases);

  const STATUS_FILTERS = [
    { label: t('allCasesLabel', lang), value: 'all' },
    { label: t('open', lang),          value: 'open' },
    { label: t('preFiling', lang),     value: 'pre_filing' },
    { label: t('inCourt', lang),       value: 'in_court' },
    { label: t('closed', lang),        value: 'closed' },
  ];

  const filtered = cases.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      c.practice_area.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchRisk = riskFilter === 'all' ||
      (riskFilter === 'high'   && c.risk_score >= 70) ||
      (riskFilter === 'medium' && c.risk_score >= 40 && c.risk_score < 70) ||
      (riskFilter === 'low'    && c.risk_score < 40);
    return matchSearch && matchStatus && matchRisk;
  });

  function handleNewCase(c: Case) {
    setCases(prev => [c, ...prev]);
  }

  return (
    <div className="p-5 lg:p-7 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-gray-900">{t('cases', lang)}</h1>
          <p className="text-gray-500 text-sm mt-0.5 font-medium">
            {cases.length} {t('totalCases', lang)} · {cases.filter(c => c.status !== 'closed').length} {t('active', lang)}
          </p>
        </div>
        <button onClick={() => setShowNewCase(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />{t('newCase', lang)}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('searchCases', lang)} className="input-field pl-9" />
        </div>
        <div className="flex gap-2">
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field w-auto cursor-pointer">
            {STATUS_FILTERS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
          <select value={riskFilter} onChange={e => setRiskFilter(e.target.value)} className="input-field w-auto cursor-pointer">
            <option value="all">{t('allRisk', lang)}</option>
            <option value="high">{t('highRisk', lang)}</option>
            <option value="medium">{t('mediumRisk', lang)}</option>
            <option value="low">{t('lowRisk', lang)}</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No cases match your filters.</div>
        )}
        {filtered.map((c, i) => {
          const risk = c.risk_score >= 70 ? 'high' : c.risk_score >= 40 ? 'medium' : 'low';
          return (
            <Link key={c.id} href={`/cases/${c.id}`}
              className="card flex items-center gap-4 p-4 rounded-xl border border-black/[0.07] hover:border-amber-400/40 hover:shadow-md transition-all duration-200 group animate-slide-up"
              style={{ animationDelay: `${i * 0.03}s` }}>
              <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', riskDot(risk))} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold text-gray-900 truncate">{c.title}</p>
                  <span className={cn('badge text-[10px]', statusColor(c.status))}>{formatStatus(c.status)}</span>
                </div>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  {c.client_name} · {c.practice_area} · {timeAgo(c.last_activity ?? c.created_at)}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className={cn('text-sm font-bold', risk === 'high' ? 'text-red-600' : risk === 'medium' ? 'text-amber-600' : 'text-emerald-600')}>
                  {c.risk_score}
                </div>
                <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">{t('riskLevel', lang)}</div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </Link>
          );
        })}
      </div>

      <NewCaseModal
        open={showNewCase}
        onClose={() => setShowNewCase(false)}
        onSave={handleNewCase}
      />
    </div>
  );
}
