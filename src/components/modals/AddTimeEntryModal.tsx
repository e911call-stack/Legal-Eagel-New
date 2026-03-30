'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';
import Modal from '@/components/Modal';
import { mockCases } from '@/lib/mock-data';
import type { TimeEntry } from '@/types';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (e: TimeEntry) => void;
}

export default function AddTimeEntryModal({ open, onClose, onSave }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState({
    case_id: mockCases[0].id,
    description: '',
    date: today,
    start_time: '09:00',
    end_time: '10:00',
    is_billed: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function getDurationMinutes() {
    const [sh, sm] = form.start_time.split(':').map(Number);
    const [eh, em] = form.end_time.split(':').map(Number);
    return Math.max(0, (eh * 60 + em) - (sh * 60 + sm));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.description.trim()) e.description = 'Description is required';
    if (getDurationMinutes() <= 0) e.end_time = 'End time must be after start time';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    const selectedCase = mockCases.find(c => c.id === form.case_id)!;
    const started = new Date(`${form.date}T${form.start_time}:00`).toISOString();
    const ended   = new Date(`${form.date}T${form.end_time}:00`).toISOString();
    onSave({
      id: `te-${Date.now()}`,
      case_id: form.case_id,
      case_title: selectedCase.title,
      lawyer_id: 'user-1',
      lawyer_name: 'Sarah Chen',
      started_at: started,
      ended_at: ended,
      duration_minutes: getDurationMinutes(),
      description: form.description.trim(),
      is_billed: form.is_billed,
    });
    setForm({ case_id: mockCases[0].id, description: '', date: today, start_time: '09:00', end_time: '10:00', is_billed: false });
    setErrors({});
    onClose();
  }

  function field(key: string) {
    return {
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [key]: e.target.value })),
    };
  }

  const durationMins = getDurationMinutes();
  const durationLabel = durationMins > 0
    ? `${Math.floor(durationMins / 60)}h ${durationMins % 60}m`
    : '—';

  return (
    <Modal open={open} onClose={onClose} title="Add Time Entry" subtitle="Log billable or non-billable time">
      <div className="space-y-4">

        {/* Case */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Case</label>
          <select className="input-field cursor-pointer" value={form.case_id} {...field('case_id')}>
            {mockCases.map(c => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description <span className="text-red-500">*</span></label>
          <textarea className="input-field resize-none" rows={2} placeholder="e.g. Drafted motion to compel; client call" value={form.description} {...field('description')} />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Date</label>
          <input className="input-field" type="date" value={form.date} {...field('date')} />
        </div>

        {/* Start / End / Duration */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Start</label>
            <input className="input-field" type="time" value={form.start_time} {...field('start_time')} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">End</label>
            <input className="input-field" type="time" value={form.end_time} {...field('end_time')} />
            {errors.end_time && <p className="text-xs text-red-500 mt-1">{errors.end_time}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Duration</label>
            <div className="input-field bg-gray-50 text-gray-500 flex items-center gap-1.5 cursor-default select-none">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              {durationLabel}
            </div>
          </div>
        </div>

        {/* Billed toggle */}
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
          <input
            type="checkbox"
            checked={form.is_billed}
            onChange={e => setForm(f => ({ ...f, is_billed: e.target.checked }))}
            className="w-4 h-4 rounded border-gray-300 accent-amber-700 cursor-pointer"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">Mark as billed</p>
            <p className="text-xs text-gray-500">This entry has already been invoiced to the client</p>
          </div>
        </label>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">
            <Clock className="w-4 h-4" /> Log Time
          </button>
        </div>
      </div>
    </Modal>
  );
}
