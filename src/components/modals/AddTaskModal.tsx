'use client';

import { useState } from 'react';
import { CheckSquare } from 'lucide-react';
import Modal from '@/components/Modal';
import type { Task, TaskStatus } from '@/types';

const LAWYERS = ['Sarah Chen', 'Marcus Williams', 'James Park', 'Priya Patel'];

interface Props {
  open: boolean;
  onClose: () => void;
  caseId: string;
  caseTitle: string;
  onSave: (t: Task) => void;
}

export default function AddTaskModal({ open, onClose, caseId, caseTitle, onSave }: Props) {
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().split('T')[0];

  const [form, setForm] = useState({
    title: '',
    description: '',
    due_date: tomorrow,
    status: 'not_started' as TaskStatus,
    assignee_name: 'Sarah Chen',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.title.trim())    e.title    = 'Task title is required';
    if (!form.due_date)        e.due_date = 'Due date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onSave({
      id: `task-${Date.now()}`,
      case_id: caseId,
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      status: form.status,
      assignee_id: 'user-1',
      assignee_name: form.assignee_name,
      due_date: new Date(form.due_date).toISOString(),
      created_at: new Date().toISOString(),
    });
    setForm({ title: '', description: '', due_date: tomorrow, status: 'not_started', assignee_name: 'Sarah Chen' });
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
    <Modal open={open} onClose={onClose} title="Add Task" subtitle={caseTitle}>
      <div className="space-y-4">

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Task Title <span className="text-red-500">*</span></label>
          <input className="input-field" placeholder="e.g. Draft motion to compel" value={form.title} {...field('title')} />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Description</label>
          <textarea className="input-field resize-none" rows={3} placeholder="Optional details about this task…" value={form.description} {...field('description')} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Due Date <span className="text-red-500">*</span></label>
            <input className="input-field" type="date" value={form.due_date} {...field('due_date')} />
            {errors.due_date && <p className="text-xs text-red-500 mt-1">{errors.due_date}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Initial Status</label>
            <select className="input-field cursor-pointer" value={form.status} {...field('status')}>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Assign To</label>
          <select className="input-field cursor-pointer" value={form.assignee_name} {...field('assignee_name')}>
            {LAWYERS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
          <button onClick={onClose} className="btn-ghost">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary">
            <CheckSquare className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>
    </Modal>
  );
}
