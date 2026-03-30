'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Sparkles, Clock, CheckSquare, FileText, MessageSquare,
  AlertTriangle, Calendar, Plus, Check, Upload
} from 'lucide-react';
import Link from 'next/link';
import { mockCases, mockTasks, mockEvents, mockDocuments, mockMessages } from '@/lib/mock-data';
import { cn, riskColor, statusColor, formatStatus, formatDate, timeAgo, riskDot } from '@/lib/utils';
import AddTaskModal from '@/components/modals/AddTaskModal';
import AddDeadlineModal, { type NewDeadline } from '@/components/modals/AddDeadlineModal';
import type { Task } from '@/types';

const TABS = ['Timeline', 'Tasks', 'Deadlines', 'Documents', 'Messages'] as const;
type Tab = typeof TABS[number];

const INITIAL_DEADLINES = [
  { id: 'dl-0', type: 'Court Filing',      date: '2024-04-15', internal_note: 'File motion to compel by April 10 for processing.', overdue: false },
  { id: 'dl-1', type: 'Internal Review',   date: '2024-03-26', internal_note: 'Attorney review of deposition transcripts.',         overdue: true  },
  { id: 'dl-2', type: 'Discovery Response',date: '2024-04-22', internal_note: null,                                                  overdue: false },
];

export default function CasePage() {
  const { id } = useParams<{ id: string }>();
  const [tab, setTab] = useState<Tab>('Timeline');
  const [analyzing, setAnalyzing] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  // local state so new items appear immediately
  const [tasks, setTasks] = useState(mockTasks.filter(t => t.case_id === (id ?? mockCases[0].id)));
  const [deadlines, setDeadlines] = useState<NewDeadline[]>(INITIAL_DEADLINES);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddDeadline, setShowAddDeadline] = useState(false);

  const caseData = mockCases.find(c => c.id === id) ?? mockCases[0];
  const events = mockEvents.filter(e => e.case_id === caseData.id);
  const docs = mockDocuments.filter(d => d.case_id === caseData.id);
  const msgs = mockMessages.filter(m => m.case_id === caseData.id);

  const riskLevel = caseData.risk_score >= 70 ? 'high' : caseData.risk_score >= 40 ? 'medium' : 'low';

  async function analyzeCase() {
    setAnalyzing(true);
    await new Promise(r => setTimeout(r, 2200));
    setReport(`Risk Score: ${caseData.risk_score}/100 · ${formatStatus(caseData.risk_category)} detected.\n\nThe AI engine identified ${
      caseData.risk_category === 'missed_deadline'
        ? 'a missed internal review deadline — the motion to compel draft has been in "In Progress" for 11 days without completion.'
        : caseData.risk_category === 'inactivity'
        ? 'no meaningful case activity recorded in 21 days. Court date approaching in 14 days. Immediate attorney review required.'
        : 'an unanswered client message exceeding 96 hours. Client last contacted regarding document submission requirements.'
    }\n\nRecommendation: Schedule immediate review session with assigned attorney.`);
    setAnalyzing(false);
  }

  const eventIcons: Record<string, React.ReactNode> = {
    case_created:       <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">✓</div>,
    document_uploaded:  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center"><FileText className="w-3 h-3 text-blue-400" /></div>,
    message_sent:       <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center"><MessageSquare className="w-3 h-3 text-violet-400" /></div>,
    task_updated:       <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center"><CheckSquare className="w-3 h-3 text-amber-400" /></div>,
    ai_alert_generated: <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center"><AlertTriangle className="w-3 h-3 text-red-400" /></div>,
    deadline_updated:   <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center"><Calendar className="w-3 h-3 text-orange-400" /></div>,
  };

  const eventDescriptions: Record<string, (meta?: Record<string, unknown>) => string> = {
    case_created:       () => 'Case created and intake event generated',
    document_uploaded:  (m) => `Document uploaded: ${m?.file_name ?? 'file'}`,
    message_sent:       (m) => `Message: "${String(m?.preview ?? '').slice(0, 60)}…"`,
    task_updated:       (m) => `Task "${m?.task}" marked as ${formatStatus(String(m?.new_status ?? ''))}`,
    ai_alert_generated: (m) => `AI Alert generated — ${formatStatus(String(m?.alert_type ?? ''))} risk level: ${m?.risk_level}`,
    deadline_updated:   () => 'Deadline updated',
  };

  function handleTaskStatusChange(taskId: string, newStatus: string) {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus as Task['status'] } : t));
  }

  return (
    <div className="p-5 lg:p-7 animate-fade-in">
      {/* Back + header */}
      <div className="mb-6">
        <Link href="/cases" className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 text-sm mb-4 transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Cases
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap mb-2">
              <span className={cn('badge', statusColor(caseData.status))}>{formatStatus(caseData.status)}</span>
              <span className={cn('badge', riskColor(riskLevel))}>
                <div className={cn('w-1.5 h-1.5 rounded-full', riskDot(riskLevel))} />
                {riskLevel} risk · {caseData.risk_score}/100
              </span>
              <span className="text-xs text-gray-500">{caseData.practice_area}</span>
            </div>
            <h1 className="font-display text-2xl lg:text-3xl font-semibold text-gray-900">{caseData.title}</h1>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
              <span>Client: <span className="text-gray-700 font-medium">{caseData.client_name}</span></span>
              <span>Attorney: <span className="text-gray-700 font-medium">{caseData.lawyer_name}</span></span>
              <span>Last activity: <span className="text-gray-700 font-medium">{timeAgo(caseData.last_activity!)}</span></span>
            </div>
          </div>
          <button
            onClick={analyzeCase}
            disabled={analyzing}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all duration-300 flex-shrink-0',
              analyzing
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 cursor-not-allowed'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-600 hover:bg-amber-500/20'
            )}
          >
            {analyzing ? (
              <><div className="w-3.5 h-3.5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" /> Analyzing…</>
            ) : (
              <><Sparkles className="w-3.5 h-3.5" /> Check Case Health</>
            )}
          </button>
        </div>
      </div>

      {/* AI Report */}
      {report && (
        <div className="bg-amber-500/[0.08] border border-amber-500/25 rounded-xl p-4 mb-5 animate-slide-up">
          <div className="flex items-start gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs font-semibold text-amber-600">AI Negligence Detection Report</p>
          </div>
          {report.split('\n\n').map((para, i) => (
            <p key={i} className="text-xs text-gray-600 mb-1.5 last:mb-0">{para}</p>
          ))}
          <button onClick={() => setReport(null)} className="text-gray-500 text-xs hover:text-gray-900 mt-1">Dismiss</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Risk Score', value: `${caseData.risk_score}/100`, color: riskLevel === 'high' ? 'text-red-500' : riskLevel === 'medium' ? 'text-amber-500' : 'text-emerald-500' },
          { label: 'Open Tasks',  value: tasks.filter(t => t.status !== 'done').length, color: 'text-blue-500' },
          { label: 'Documents',   value: docs.length,  color: 'text-violet-500' },
          { label: 'Messages',    value: msgs.length,  color: 'text-amber-500' },
        ].map(item => (
          <div key={item.label} className="card rounded-xl border border-gray-200 p-4 text-center">
            <div className={cn('text-2xl font-bold', item.color)}>{item.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-5 overflow-x-auto">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 whitespace-nowrap',
              tab === t ? 'border-amber-500 text-amber-600' : 'border-transparent text-gray-500 hover:text-gray-900'
            )}>
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="animate-fade-in" key={tab}>

        {tab === 'Timeline' && (
          <div className="space-y-0">
            {events.map((ev, i) => (
              <div key={ev.id} className="flex gap-4 pb-5 last:pb-0">
                <div className="flex flex-col items-center gap-1">
                  {eventIcons[ev.type] ?? <div className="w-6 h-6 rounded-full bg-gray-200" />}
                  {i < events.length - 1 && <div className="w-px flex-1 bg-gray-200 min-h-[20px]" />}
                </div>
                <div className="flex-1 pt-0.5">
                  <p className="text-sm text-gray-900">{eventDescriptions[ev.type]?.(ev.metadata as Record<string, unknown>) ?? ev.type}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{ev.actor_name}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{timeAgo(ev.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Tasks' && (
          <div className="space-y-2">
            {tasks.map(task => (
              <div key={task.id} className="card rounded-xl border border-gray-200 flex items-start gap-3 p-4">
                <div className={cn('w-5 h-5 rounded flex items-center justify-center mt-0.5 flex-shrink-0 border',
                  task.status === 'done' ? 'bg-emerald-500/20 border-emerald-500/30' : 'border-gray-300')}>
                  {task.status === 'done' && <Check className="w-3 h-3 text-emerald-500" />}
                </div>
                <div className="flex-1">
                  <p className={cn('text-sm font-medium', task.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-900')}>
                    {task.title}
                  </p>
                  {task.description && <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>}
                  <div className="flex items-center gap-2 mt-1.5">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-500">Due {formatDate(task.due_date)}</span>
                    <span className="text-gray-300">·</span>
                    <span className="text-xs text-gray-500">{task.assignee_name}</span>
                  </div>
                </div>
                <select
                  value={task.status}
                  onChange={e => handleTaskStatusChange(task.id, e.target.value)}
                  className="input-field w-auto text-xs py-1 cursor-pointer">
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            ))}
            <button
              onClick={() => setShowAddTask(true)}
              className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-xs text-gray-500 hover:text-gray-900 hover:border-gray-400 flex items-center justify-center gap-2 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Task
            </button>
          </div>
        )}

        {tab === 'Documents' && (
          <div className="space-y-2">
            <button className="w-full py-3 rounded-xl border border-dashed border-amber-500/30 text-xs text-amber-600 hover:text-amber-500 flex items-center justify-center gap-2 transition-colors mb-3">
              <Upload className="w-3.5 h-3.5" /> Upload Document
            </button>
            {docs.map(doc => (
              <div key={doc.id} className="card rounded-xl border border-gray-200 flex items-center gap-3 p-4">
                <div className="w-8 h-10 rounded-lg bg-blue-500/15 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.file_name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span>{formatStatus(doc.doc_type)}</span>
                    <span>·</span><span>{doc.uploaded_by_name}</span>
                    <span>·</span><span>{timeAgo(doc.uploaded_at)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {doc.is_public_to_client
                    ? <span className="text-[10px] text-emerald-600 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">Client visible</span>
                    : <span className="text-[10px] text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">Internal only</span>
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'Messages' && (
          <div className="space-y-3">
            {msgs.map(msg => (
              <div key={msg.id} className={cn(
                'card rounded-xl border p-4',
                msg.is_internal_note ? 'border-amber-500/20 bg-amber-500/5' : 'border-gray-200'
              )}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-[10px] text-amber-700 font-bold flex-shrink-0">
                      {msg.sender_name?.[0]}
                    </div>
                    <span className="text-xs font-medium text-gray-900">{msg.sender_name}</span>
                    {msg.is_internal_note && (
                      <span className="text-[10px] text-amber-600 bg-amber-400/10 px-1.5 py-0.5 rounded">Internal Note</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full',
                      msg.status === 'seen' ? 'text-emerald-600 bg-emerald-400/10' : 'text-gray-400 bg-gray-100')}>
                      {msg.status === 'seen' ? 'Seen' : 'Sent'}
                    </span>
                    <span className="text-xs text-gray-400">{timeAgo(msg.created_at)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{msg.content}</p>
              </div>
            ))}
            <div className="card rounded-xl border border-gray-200 p-4">
              <textarea rows={3} placeholder="Write a message to client…" className="input-field resize-none mb-3" />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
                  <input type="checkbox" className="rounded" /> Internal note only
                </label>
                <button className="btn-primary flex items-center gap-1.5 text-xs py-1.5 px-3">
                  <MessageSquare className="w-3.5 h-3.5" /> Send
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === 'Deadlines' && (
          <div className="space-y-3">
            {deadlines.map((d) => (
              <div key={d.id} className={cn('card rounded-xl border p-4 flex items-start gap-4',
                d.overdue ? 'border-red-500/25 bg-red-500/5' : 'border-gray-200')}>
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  d.overdue ? 'bg-red-500/20' : 'bg-amber-500/15')}>
                  <Calendar className={cn('w-5 h-5', d.overdue ? 'text-red-400' : 'text-amber-500')} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-gray-900">{d.type}</p>
                    {d.overdue && (
                      <span className="text-[10px] text-red-500 bg-red-400/10 px-1.5 py-0.5 rounded-full border border-red-400/20">Overdue</span>
                    )}
                  </div>
                  <p className="text-xs font-mono text-gray-500">{d.date}</p>
                  {d.internal_note && <p className="text-xs text-gray-500 mt-1">{d.internal_note}</p>}
                </div>
              </div>
            ))}
            <button
              onClick={() => setShowAddDeadline(true)}
              className="w-full py-3 rounded-xl border border-dashed border-gray-300 text-xs text-gray-500 hover:text-gray-900 hover:border-gray-400 flex items-center justify-center gap-2 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Deadline
            </button>
          </div>
        )}
      </div>

      {/* Modals */}
      <AddTaskModal
        open={showAddTask}
        onClose={() => setShowAddTask(false)}
        caseId={caseData.id}
        caseTitle={caseData.title}
        onSave={task => setTasks(prev => [...prev, task])}
      />
      <AddDeadlineModal
        open={showAddDeadline}
        onClose={() => setShowAddDeadline(false)}
        caseTitle={caseData.title}
        onSave={d => setDeadlines(prev => [...prev, d])}
      />
    </div>
  );
}
