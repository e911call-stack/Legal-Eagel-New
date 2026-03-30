'use client';

import Link from 'next/link';
import { ArrowUpRight, Clock, FileText, MessageSquare, AlertCircle, CheckCircle2 } from 'lucide-react';
import { mockCases, mockMessages, mockDocuments, mockTasks } from '@/lib/mock-data';
import { cn, statusColor, formatStatus, timeAgo } from '@/lib/utils';
import { useSession } from '@/lib/session-context';

// In a real app this would filter by session user's client_id via RLS.
// For demo, we treat "James Harrison" (case-1) as the logged-in client.
const CLIENT_CASE_IDS = ['case-1'];

export default function ClientDashboard() {
  const { user } = useSession();

  const myCases = mockCases.filter(c => CLIENT_CASE_IDS.includes(c.id));
  const myDocs  = mockDocuments.filter(d => CLIENT_CASE_IDS.includes(d.case_id) && d.is_public_to_client);
  const myMsgs  = mockMessages.filter(m => CLIENT_CASE_IDS.includes(m.case_id) && !m.is_internal_note);
  const myTasks = mockTasks.filter(t => CLIENT_CASE_IDS.includes(t.case_id));

  const unreadMsgs = myMsgs.filter(m => m.status !== 'seen').length;
  const openTasks  = myTasks.filter(t => t.status !== 'done').length;

  const STATS = [
    { label: 'Active Cases',     value: myCases.length,  icon: FileText,      color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-200' },
    { label: 'Documents Shared', value: myDocs.length,   icon: FileText,      color: 'text-violet-600',  bg: 'bg-violet-50',  border: 'border-violet-200' },
    { label: 'Unread Messages',  value: unreadMsgs,      icon: MessageSquare, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { label: 'Open Action Items',value: openTasks,       icon: Clock,         color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-200' },
  ];

  return (
    <div className="p-5 lg:p-7 animate-fade-in">
      {/* Welcome */}
      <div className="mb-6">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-900">
          Good to see you, {user.name.split(' ')[0]}
        </h1>
        <p className="text-slate-500 text-sm mt-0.5 font-medium">
          Here's a summary of your legal matters
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {STATS.map((s, i) => (
          <div key={s.label}
            className={cn('bg-white rounded-xl border p-4 animate-slide-up', s.border)}
            style={{ animationDelay: `${i * 0.05}s` }}>
            <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', s.bg)}>
              <s.icon className={cn('w-4 h-4', s.color)} />
            </div>
            <div className={cn('text-2xl font-bold', s.color)}>{s.value}</div>
            <div className="text-xs font-semibold text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* My Cases */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">My Cases</h2>
            <Link href="/client/cases" className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {myCases.map(c => {
              const risk = c.risk_score >= 70 ? 'high' : c.risk_score >= 40 ? 'medium' : 'low';
              return (
                <Link key={c.id} href={`/client/cases/${c.id}`}
                  className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all group">
                  <div className={cn('w-2 h-2 rounded-full mt-1.5 flex-shrink-0',
                    risk === 'high' ? 'bg-red-400' : risk === 'medium' ? 'bg-amber-400' : 'bg-emerald-400')} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{c.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{c.practice_area} · {c.lawyer_name}</p>
                  </div>
                  <span className={cn('badge text-[10px] flex-shrink-0', statusColor(c.status))}>
                    {formatStatus(c.status)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent messages */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Recent Messages</h2>
            <Link href="/client/messages" className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {myMsgs.slice(0, 4).map(msg => (
              <div key={msg.id} className={cn(
                'flex items-start gap-3 p-3 rounded-lg border transition-all',
                msg.status !== 'seen' ? 'border-blue-200 bg-blue-50/40' : 'border-slate-100'
              )}>
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-[11px] font-bold text-slate-600 flex-shrink-0">
                  {msg.sender_name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900">{msg.sender_name}</p>
                    <span className="text-[10px] text-slate-400">{timeAgo(msg.created_at)}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 truncate">{msg.content}</p>
                </div>
                {msg.status !== 'seen' && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                )}
              </div>
            ))}
            {myMsgs.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No messages yet.</p>
            )}
          </div>
        </div>

        {/* Shared documents */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Documents Shared With You</h2>
          </div>
          <div className="space-y-2">
            {myDocs.slice(0, 5).map(doc => (
              <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all">
                <div className="w-8 h-9 rounded-lg bg-blue-500/10 border border-blue-200 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">{doc.file_name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{formatStatus(doc.doc_type)} · {timeAgo(doc.uploaded_at)}</p>
                </div>
                <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                  Available
                </span>
              </div>
            ))}
            {myDocs.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No documents shared yet.</p>
            )}
          </div>
        </div>

        {/* Action items */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Action Items for You</h2>
          </div>
          <div className="space-y-2">
            {myTasks.filter(t => t.status !== 'done').map(task => (
              <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-amber-100 bg-amber-50/40">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900">{task.title}</p>
                  {task.description && <p className="text-xs text-slate-500 mt-0.5">{task.description}</p>}
                  <p className="text-[10px] text-amber-600 font-semibold mt-1">Due {new Date(task.due_date).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
            {myTasks.filter(t => t.status === 'done').slice(0, 2).map(task => (
              <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 opacity-60">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-500 line-through">{task.title}</p>
              </div>
            ))}
            {myTasks.length === 0 && (
              <p className="text-xs text-slate-400 text-center py-4">No action items.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
