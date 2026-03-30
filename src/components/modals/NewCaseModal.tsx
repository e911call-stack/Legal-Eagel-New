'use client';

import { useState } from 'react';
import { FolderOpen } from 'lucide-react';
import Modal from '@/components/Modal';
import type { Case, CaseStatus, BillingModel } from '@/types';

const PRACTICE_AREAS = [
  'Civil Litigation', 'Estate Planning', 'Immigration', 'Family Law',
  'Intellectual Property', 'Corporate Law', 'Criminal Defense', 'Real Estate',
  'Employment Law', 'Tax Law',
];

const LAWYERS = ['Sarah Chen', 'Marcus Williams', 'James Park', 'Priya Patel'];

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (c: Case) => void;
}

export default function NewCaseModal({ open, onClose, onSave }: Props) {
  const [form, setForm] = useState({
    title: '',
    client_name: '',
    practice_area: 'Civil Litigation',
    status: 'open' as CaseStatus,
    billing_model: 'hourly' as BillingModel,
    budget: '',
    lawyer_name: 'Sarah Chen',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim())       e.title       = 'Case title is required';
    if (!form.client_name.trim()) e.client_name = 'Client name is required';
    if (form.budget && isNaN(Number(form.budget))) e.budget = 'Budget must be a number';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const now = new Date().toISOString();
    onSave({
      id: `case-${Date.now()}`,
      firm_id: 'firm-1',
      title: form.title.trim(),
      client_name: form.client_name.trim(),
      practice_area: form.practice_area,
      status: form.status,
      billing_model: form.billing_model,
      budget: form.budget ? Math.round(Number(form.budget) * 100) : undefined,
      lawyer_name: form.lawyer_name,
      risk_score: 0,
      risk_category: 'none',
      created_at: now,
      updated_at: now,
      last_activity: now,
    });
    setForm({ title: '', client_name: '', practice_area: 'Civil Litigation', status: 'open', billing_model: 'hourly', budget: '', lawyer_name: 'Sarah Chen', notes: '' });
    setErrors({});
    onClose();
  }

  function field(key: string) {
    return {
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [key]: e.target.value })),
    };
  }

  return (
    <Modal open={open} onClose={onClose} title="New Case" subtitle="Create a new matter for your firm">
      <div className="space-y-4">

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Case Title <span className="text-red-500">*</span></label>
          <input className="input-field" placeholder="e.g. Smith v. Acme Corp." value={form.title} {...field('title')} />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        {/* Client name */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Client Name <span className="text-red-500">*</span></label>
          <input className="input-field" placeholder="e.g. John Smith" value={form.client_name} {...field('client_name')} />
          {errors.client_name && <p className="text-xs text-red-500 mt-1">{errors.client_name}</p>}
        </div>

        {/* Practice area + Status */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Practice Area</label>
            <select className="input-field cursor-pointer" value={form.practice_area} {...field('practice_area')}>
              {PRACTICE_AREAS.map(a => <option key={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
            <select className="input-field cursor-pointer" value={form.status} {...field('status')}>
              <option value="open">Open</option>
              <option value="pre_filing">Pre-Filing</option>
              <option value="in_court">In Court</option>
            </select>
          </div>
        </div>

        {/* Billing model + Budget */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Billing Model</label>
            <select className="input-field cursor-pointer" value={form.billing_model} {...field('billing_model')}>
              <option value="hourly">Hourly</option>
              <option value="flat_fee">Flat Fee</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Budget ($)</label>
            <input className="input-field" type="number" min="0" placeholder="e.g. 50000" value={form.budget} {...field('budget')} />
            {errors.budget && <p className="text-xs text-red-500 mt-1">{errors.budget}</p>}
          </div>
        </div>

        {/* Assigned lawyer */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Assigned Attorney</label>
          <select className="input-field cursor-pointer" value={form.lawyer_name} {...field('lawyer_name')}>
            {LAWYERS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Initial Notes</label>
          <textarea className="input-field resize-none" rows={3} placeholder="Brief description of the matter…" value={form.notes} {...field('notes')} />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">
            <FolderOpen className="w-4 h-4" /> Create Case
          </button>
        </div>
      </div>
    </Modal>
  );
}
