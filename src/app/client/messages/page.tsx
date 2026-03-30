'use client';

import { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { mockMessages, mockCases } from '@/lib/mock-data';
import { cn, timeAgo } from '@/lib/utils';

const CLIENT_CASE_IDS = ['case-1'];

export default function ClientMessagesPage() {
  const [newMessage, setNewMessage] = useState('');

  // Only show messages for client's cases, never internal notes
  const msgs = mockMessages.filter(
    m => CLIENT_CASE_IDS.includes(m.case_id) && !m.is_internal_note
  );

  function getCase(caseId: string) {
    return mockCases.find(c => c.id === caseId);
  }

  return (
    <div className="p-5 lg:p-7 animate-fade-in">
      <div className="mb-6">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-slate-900">Messages</h1>
        <p className="text-slate-500 text-sm mt-0.5 font-medium">
          Communication with your attorney
        </p>
      </div>

      <div className="space-y-3 mb-4">
        {msgs.map(msg => (
          <div key={msg.id} className={cn(
            'bg-white rounded-xl border p-4',
            msg.sender_role === 'client' ? 'border-blue-200 bg-blue-50/30 ml-8' : 'border-slate-200 mr-8'
          )}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold',
                  msg.sender_role === 'client' ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-700'
                )}>
                  {msg.sender_name?.[0]}
                </div>
                <span className="text-xs font-semibold text-slate-900">{msg.sender_name}</span>
                {msg.sender_role === 'lawyer' && (
                  <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">Attorney</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">{getCase(msg.case_id)?.title}</span>
                <span className="text-xs text-slate-400">{timeAgo(msg.created_at)}</span>
              </div>
            </div>
            <p className="text-sm text-slate-700">{msg.content}</p>
          </div>
        ))}
        {msgs.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <MessageSquare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No messages yet.</p>
          </div>
        )}
      </div>

      {/* Compose */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 sticky bottom-4 shadow-lg">
        <textarea
          rows={3}
          placeholder="Write a message to your attorney…"
          className="input-field resize-none mb-3"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <div className="flex justify-end">
          <button
            onClick={() => setNewMessage('')}
            disabled={!newMessage.trim()}
            className="btn-primary flex items-center gap-1.5 text-xs disabled:opacity-50 disabled:cursor-not-allowed">
            <Send className="w-3.5 h-3.5" /> Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
