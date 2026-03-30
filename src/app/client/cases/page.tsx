'use client';

import Link from 'next/link';
import { ArrowUpRight, FolderOpen } from 'lucide-react';
import { mockCases } from '@/lib/mock-data';
import { cn, statusColor, formatStatus, timeAgo } from '@/lib/utils';

// In production this comes from Supabase RLS — only rows where client_id matches session.
const CLIENT_CASE_IDS = ['case-1'];

export default function ClientCasesPage() {
  const myCases = mockCases.filter(c => CLIENT_CASE_IDS.includes(c.id));

  return (
    <div className="p-5 lg:p-7 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-900">My Cases</h1>
        <p className="text-slate-500 text-sm mt-0.5 font-medium">
          {myCases.length} active matter{myCases.length !== 1 ? 's' : ''}
        </p>
      </div>

      {myCases.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm font-medium">No cases assigned to your account.</p>
          <p className="text-slate-400 text-xs mt-1">Contact your attorney to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myCases.map((c, i) => (
            <Link key={c.id} href={`/client/cases/${c.id}`}
              className="bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md flex items-center gap-4 p-5 transition-all duration-200 group animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}>

              {/* Icon */}
              <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                <FolderOpen className="w-5 h-5 text-blue-500" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-sm font-bold text-slate-900 truncate">{c.title}</p>
                  <span className={cn('badge text-[10px]', statusColor(c.status))}>{formatStatus(c.status)}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {c.practice_area} · Attorney: {c.lawyer_name} · Last update {timeAgo(c.last_activity ?? c.created_at)}
                </p>
              </div>

              <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
