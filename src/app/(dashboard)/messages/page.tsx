'use client';

import { useState } from 'react';
import { MessageSquare, Send, Lock, User, Search } from 'lucide-react';
import { mockMessages, mockCases } from '@/lib/mock-data';
import { cn, timeAgo, t } from '@/lib/utils';
import { useLanguage } from '@/lib/language-context';

export default function MessagesPage() {
  const { lang } = useLanguage();
  const [selectedCase, setSelectedCase] = useState('all');
  const [search, setSearch] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filtered = mockMessages.filter(m => {
    const matchCase = selectedCase === 'all' || m.case_id === selectedCase;
    const matchSearch = m.content.toLowerCase().includes(search.toLowerCase()) ||
      m.sender_name?.toLowerCase().includes(search.toLowerCase());
    return matchCase && matchSearch;
  });

  return (
    <div className="p-5 lg:p-7 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-gray-900">{t('messages', lang)}</h1>
          <p className="text-ink-500 text-sm mt-0.5">{mockMessages.filter(m => m.status === 'sent').length} {t('unreadMessagesLabel', lang)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('searchMessages', lang)} className="input-field pl-9" />
        </div>
        <select value={selectedCase} onChange={e => setSelectedCase(e.target.value)} className="input-field w-auto">
          <option value="all">{t('allCases', lang)}</option>
          {mockCases.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      <div className="space-y-3 mb-6">
        {filtered.map((msg, i) => (
          <div key={msg.id}
            className={cn('card rounded-xl border p-4 transition-all duration-200 animate-slide-up',
              msg.is_internal_note ? 'border-amber-200 bg-amber-50' :
              msg.status === 'sent' ? 'border-violet-200 bg-violet-50/50' : 'border-black/[0.07]')}
            style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gold-100 border border-gold-300 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-gold-700">{msg.sender_name?.[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">{msg.sender_name}</span>
                    <span className="text-[10px] text-ink-500 capitalize bg-ink-100 px-1.5 py-0.5 rounded">{msg.sender_role}</span>
                    {msg.is_internal_note && (
                      <span className="flex items-center gap-0.5 text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded border border-amber-200">
                        <Lock className="w-2.5 h-2.5" /> {t('internal', lang)}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={cn('text-[10px] px-2 py-0.5 rounded-full',
                      msg.status === 'seen' ? 'text-emerald-600 bg-emerald-50' : 'text-violet-600 bg-violet-50 border border-violet-200')}>
                      {msg.status === 'seen' ? `✓ ${t('seen', lang)}` : `● ${t('unread', lang)}`}
                    </span>
                    <span className="text-xs text-ink-400">{timeAgo(msg.created_at)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed font-medium">{msg.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card rounded-xl border border-black/[0.07] p-4">
        <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)}
          placeholder={t('send', lang) + '…'} rows={3}
          className="input-field resize-none mb-3" />
        <div className="flex justify-end">
          <button className="btn-primary flex items-center gap-2">
            <Send className="w-3.5 h-3.5" />{t('send', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
