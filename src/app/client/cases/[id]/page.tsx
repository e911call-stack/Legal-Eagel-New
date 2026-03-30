'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, FileText, MessageSquare, Calendar, Clock,
  CheckCircle2, Circle, Upload, Send,
} from 'lucide-react';
import { mockCases, mockDocuments, mockMessages, mockEvents, mockTasks } from '@/lib/mock-data';
import { cn, statusColor, formatStatus, timeAgo, formatDate } from '@/lib/utils';

const TABS = ['Overview', 'Documents', 'Messages', 'Timeline'] as const;
type Tab = typeof TABS[number];

export default function ClientCasePage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>('Overview');
  const [newMessage, setNewMessage] = useState('');

  const caseData = mockCases.find(c => c.id === id) ?? mockCases[0];

  // Enforce visibility rules — client sees ONLY public documents and non-internal messages
  const docs  = mockDocuments.filter(d => d.case_id === caseData.id && d.is_public_to_client);
  const msgs  = mockMessages.filter(m => m.case_id === caseData.id && !m.is_internal_note);
  const tasks = mockTasks.filter(t => t.case_id === caseData.id); // tasks visible to client
  const events = mockEvents.filter(e => e.case_id === caseData.id && e.actor_role !== 'lawyer'); // exclude internal lawyer events

  const deadlines = [
    { type: 'Court Filing',      date: '2024-04-15', note: 'Documents must be filed by this date.' },
    { type: 'Discovery Response',date: '2024-04-22', note: null },
  ];

  function handleSendMessage() {
    if (!newMessage.trim()) return;
    setNewMessage('');
    // In production: POST to Supabase messages table
  }

  return (
    <div className="p-5 lg:p-7 animate-fade-in">
      {/* Back */}
      <Link href="/client/cases" className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm mb-4 transition-colors w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to My Cases
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={cn('badge', statusColor(caseData.status))}>{formatStatus(caseData.status)}</span>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{caseData.practice_area}</span>
            </div>
            <h1 className="font-display text-xl lg:text-2xl font-bold text-slate-900 mb-1">{caseData.title}</h1>
            <p className="text-sm text-slate-500">
              Attorney: <span className="text-slate-700 font-medium">{caseData.lawyer_name}</span>
              <span className="mx-2 text-slate-300">·</span>
              Last update: <span className="text-slate-700 font-medium">{timeAgo(caseData.last_activity!)}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick stats — no risk scores, no internal data */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { label: 'Documents',      value: docs.length,  icon: FileText,      color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200' },
          { label: 'Messages',       value: msgs.length,  icon: MessageSquare, color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
          { label: 'Upcoming Dates', value: deadlines.length, icon: Calendar,  color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
        ].map(item => (
          <div key={item.label} className={cn('bg-white rounded-xl border p-4 text-center', item.border)}>
            <div className={cn('w-8 h-8 rounded-lg mx-auto flex items-center justify-center mb-2', item.bg)}>
              <item.icon className={cn('w-4 h-4', item.color)} />
            </div>
            <div className={cn('text-xl font-bold', item.color)}>{item.value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 mb-5 overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap',
              tab === t ? 'border-blue-500 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'
            )}>
            {t}
          </button>
        ))}
      </div>

      <div className="animate-fade-in" key={tab}>

        {/* ── Overview ── */}
        {tab === 'Overview' && (
          <div className="space-y-4">
            {/* Upcoming deadlines */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Important Dates</h3>
              <div className="space-y-3">
                {deadlines.map((d, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                    <Calendar className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{d.type}</p>
                      <p className="text-xs font-mono text-amber-700 mt-0.5">{d.date}</p>
                      {d.note && <p className="text-xs text-slate-600 mt-1">{d.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action items */}
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wide">Action Items</h3>
              <div className="space-y-2">
                {tasks.map(task => (
                  <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border border-slate-100">
                    {task.status === 'done'
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                      : <Circle className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                    }
                    <div className="flex-1">
                      <p className={cn('text-sm font-medium', task.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-900')}>
                        {task.title}
                      </p>
                      {task.status !== 'done' && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                          <Clock className="w-3 h-3" /> Due {formatDate(task.due_date)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {tasks.length === 0 && <p className="text-xs text-slate-400 text-center py-3">No action items.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ── Documents ── (client-visible only) ── */}
        {tab === 'Documents' && (
          <div className="space-y-3">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs text-slate-500 mb-3">Only documents explicitly shared with you by your attorney are shown here.</p>
              <button className="w-full py-3 rounded-xl border border-dashed border-blue-300 text-xs text-blue-600 hover:text-blue-500 flex items-center justify-center gap-2 transition-colors">
                <Upload className="w-3.5 h-3.5" /> Upload a Document to Your Attorney
              </button>
            </div>
            {docs.map(doc => (
              <div key={doc.id} className="bg-white rounded-xl border border-slate-200 flex items-center gap-3 p-4">
                <div className="w-8 h-10 rounded-lg bg-blue-500/10 border border-blue-200 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{doc.file_name}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>{formatStatus(doc.doc_type)}</span>
                    <span>·</span>
                    <span>Shared {timeAgo(doc.uploaded_at)}</span>
                  </div>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors flex-shrink-0">
                  Download
                </button>
              </div>
            ))}
            {docs.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No documents have been shared with you yet.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Messages ── (no internal notes) ── */}
        {tab === 'Messages' && (
          <div className="space-y-3">
            {msgs.map(msg => (
              <div key={msg.id} className={cn(
                'bg-white rounded-xl border p-4',
                msg.sender_role === 'client' ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200'
              )}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0',
                      msg.sender_role === 'client' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                    )}>
                      {msg.sender_name?.[0]}
                    </div>
                    <span className="text-xs font-semibold text-slate-900">{msg.sender_name}</span>
                    {msg.sender_role === 'lawyer' && (
                      <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Attorney</span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 flex-shrink-0">{timeAgo(msg.created_at)}</span>
                </div>
                <p className="text-sm text-slate-700">{msg.content}</p>
              </div>
            ))}
            {msgs.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500">No messages yet. Send a message to your attorney below.</p>
              </div>
            )}
            {/* Compose */}
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Send a Message</p>
              <textarea
                rows={3}
                placeholder="Write a message to your attorney…"
                className="input-field resize-none mb-3"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-3 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="w-3.5 h-3.5" /> Send Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Timeline ── (public events only) ── */}
        {tab === 'Timeline' && (
          <div className="space-y-0">
            {[
              { label: 'Case opened', date: caseData.created_at, icon: '📁' },
              { label: 'Documents uploaded by attorney', date: caseData.updated_at, icon: '📄' },
              { label: 'Status updated to ' + formatStatus(caseData.status), date: caseData.last_activity ?? caseData.updated_at, icon: '⚖️' },
            ].map((ev, i, arr) => (
              <div key={i} className="flex gap-4 pb-5 last:pb-0">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-sm flex-shrink-0">{ev.icon}</div>
                  {i < arr.length - 1 && <div className="w-px flex-1 bg-slate-200 min-h-[20px]" />}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-sm text-slate-900 font-medium">{ev.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{timeAgo(ev.date)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
