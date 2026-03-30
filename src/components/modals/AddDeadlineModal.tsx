'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';
import Modal from '@/components/Modal';

export interface NewDeadline {
  id: string;
  type: string;
  date: string;
  internal_note: string | null;
  overdue: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  caseTitle: string;
  onSave: (d: NewDeadline) => void;
}

const DEADLINE_TYPES = [
  'Court Filing',
  'Internal Review',
  'Discovery Response',
  'Deposition',
  'Motion Deadline',
  'Client Review',
  'Expert Report',
  'Trial Preparation',
];

export default function AddDeadlineModal({ open, onClose, caseTitle, onSave }: Props) {
  const nextWeek = new Date(Date.now() + 7 * 86_400_000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    type: 'Court Filing',
    date: nextWeek,
    internal_note: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.date) e.date = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const due = new Date(form.date);
    onSave({
      id: `dl-${Date.now()}`,
      type: form.type,
      date: form.date,
      internal_note: form.internal_note.trim() || null,
      overdue: due < new Date(),
    });
    setForm({ type: 'Court Filing', date: nextWeek, internal_note: '' });
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
    <Modal open={open} onClose={onClose} title="Add Deadline" subtitle={caseTitle} width="sm">
      <div className="space-y-4">

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Deadline Type</label>
          <select className="input-field cursor-pointer" value={form.type} {...field('type')}>
            {DEADLINE_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Due Date <span className="text-red-500">*</span></label>
          <input className="input-field" type="date" value={form.date} {...field('date')} />
          {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Internal Note</label>
          <textarea className="input-field resize-none" rows={3} placeholder="Optional note for attorneys…" value={form.internal_note} {...field('internal_note')} />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">
            <Calendar className="w-4 h-4" /> Add Deadline
          </button>
        </div>
      </div>
    </Modal>
  );
}
