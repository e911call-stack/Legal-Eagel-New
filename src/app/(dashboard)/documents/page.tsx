'use client';

import { useState } from 'react';
import { FileText, Upload, Search, Eye, Lock, Download, Calendar, User } from 'lucide-react';
import { mockDocuments } from '@/lib/mock-data';
import { cn, formatStatus, timeAgo, t } from '@/lib/utils';
import { useLanguage } from '@/lib/language-context';
import type { DocType } from '@/types';

function fileSize(bytes?: number) {
  if (!bytes) return '—';
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const { lang } = useLanguage();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const TYPE_COLORS: Record<DocType, string> = {
    pleading:  'text-blue-600 bg-blue-50 border-blue-200',
    contract:  'text-violet-600 bg-violet-50 border-violet-200',
    draft:     'text-amber-600 bg-amber-50 border-amber-200',
    evidence:  'text-red-600 bg-red-50 border-red-200',
    other:     'text-ink-500 bg-ink-100 border-ink-200',
  };

  const filtered = mockDocuments.filter(d => {
    const matchSearch = d.file_name.toLowerCase().includes(search.toLowerCase()) ||
      d.case_title?.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (typeFilter === 'all' || d.doc_type === typeFilter);
  });

  return (
    <div className="p-5 lg:p-7 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-bold text-gray-900">{t('documents', lang)}</h1>
          <p className="text-gray-500 text-sm mt-0.5 font-medium">{mockDocuments.length} {t('filesAcross', lang)}</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Upload className="w-4 h-4" />{t('uploadDocument', lang)}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t('searchDocs', lang)} className="input-field pl-9" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field w-auto">
          <option value="all">{t('allTypes', lang)}</option>
          <option value="pleading">{t('pleading', lang)}</option>
          <option value="contract">{t('contract', lang)}</option>
          <option value="draft">{t('draft', lang)}</option>
          <option value="evidence">{t('evidence', lang)}</option>
          <option value="other">{t('other', lang)}</option>
        </select>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((doc, i) => (
          <div key={doc.id} className="card rounded-xl border border-black/[0.07] hover:border-gold-400/40 hover:shadow-md transition-all duration-200 animate-slide-up p-5"
            style={{ animationDelay: `${i * 0.04}s` }}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-12 rounded-lg bg-blue-50 border border-blue-200 flex flex-col items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{doc.file_name}</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5 truncate">{doc.case_title}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={cn('badge text-[10px]', TYPE_COLORS[doc.doc_type])}>{t(doc.doc_type, lang)}</span>
              <span className="text-[10px] text-ink-400">{fileSize(doc.file_size)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
