'use client';

import { useState } from 'react';
import {
  User, Shield, Bell, Palette, Key, Save, Eye, EyeOff,
  Copy, RefreshCw, Check, AlertTriangle, Smartphone, Mail,
  Moon, Sun, Monitor, Type, Lock, Zap, Webhook,
  CheckCircle2
} from 'lucide-react';
import { mockUser } from '@/lib/mock-data';
import { cn, t } from '@/lib/utils';
import { useLanguage } from '@/lib/language-context';

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none',
        checked ? 'bg-amber-600' : 'bg-gray-200'
      )}
    >
      <span className={cn(
        'inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform duration-200',
        checked ? 'translate-x-4' : 'translate-x-1'
      )} />
    </button>
  );
}

function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Toast({ show, message }: { show: boolean; message: string }) {
  return (
    <div className={cn(
      'fixed bottom-6 right-6 flex items-center gap-2.5 bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-xl shadow-xl z-50 transition-all duration-300',
      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
    )}>
      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
      {message}
    </div>
  );
}

export default function SettingsPage() {
  const { lang } = useLanguage();
  const [tab, setTab] = useState('profile');
  const [toast, setToast] = useState({ show: false, message: '' });

  /* Profile state */
  const [profile, setProfile] = useState({
    name: mockUser.name,
    email: mockUser.email,
    role: 'Senior Attorney',
    phone: '+1 (555) 234-5678',
    timezone: 'America/New_York',
    bio: 'Specializing in civil litigation and corporate law with 12 years of experience.',
  });

  /* Security state */
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('30');
  const [pwError, setPwError] = useState('');

  /* Notifications state */
  const [notif, setNotif] = useState({
    email_high_risk: true,
    email_deadlines: true,
    email_messages: false,
    email_billing: true,
    push_high_risk: true,
    push_deadlines: false,
    push_messages: true,
    push_billing: false,
    digest_daily: true,
    digest_weekly: false,
  });

  /* Appearance state */
  const [appearance, setAppearance] = useState({
    theme: 'light' as 'light' | 'dark' | 'system',
    fontSize: 'default' as 'compact' | 'default' | 'large',
    reduceMotion: false,
    sidebarCollapsed: false,
  });

  /* API state */
  const [apiKey] = useState('lex_live_sk_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567');
  const [showKey, setShowKey] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.yourfirm.com/legal-eagle');
  const [webhookEvents, setWebhookEvents] = useState({
    case_created: true,
    risk_alert: true,
    deadline_due: false,
    message_sent: false,
  });
  const [keyCopied, setKeyCopied] = useState(false);

  function showToast(message: string) {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 2800);
  }

  function handlePasswordSave() {
    setPwError('');
    if (!passwords.current) { setPwError('Current password is required.'); return; }
    if (passwords.next.length < 8) { setPwError('New password must be at least 8 characters.'); return; }
    if (passwords.next !== passwords.confirm) { setPwError('Passwords do not match.'); return; }
    setPasswords({ current: '', next: '', confirm: '' });
    showToast('Password changed successfully');
  }

  function handleCopyKey() {
    navigator.clipboard.writeText(apiKey);
    setKeyCopied(true);
    setTimeout(() => setKeyCopied(false), 2000);
  }

  const TABS = [
    { key: 'profile',       icon: User,    label: t('profile', lang) },
    { key: 'security',      icon: Shield,  label: t('security', lang) },
    { key: 'notifications', icon: Bell,    label: t('notifications', lang) },
    { key: 'appearance',    icon: Palette, label: t('appearance', lang) },
    { key: 'api',           icon: Key,     label: t('api', lang) },
  ];

  const pwStrength = passwords.next.length === 0 ? 0
    : passwords.next.length < 6 ? 1
    : passwords.next.length < 10 ? 2
    : /[A-Z]/.test(passwords.next) && /[0-9]/.test(passwords.next) && /[^A-Za-z0-9]/.test(passwords.next) ? 4
    : 3;
  const pwStrengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const pwStrengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-emerald-500'];

  return (
    <div className="p-5 lg:p-7 animate-fade-in">
      <Toast show={toast.show} message={toast.message} />

      <div className="mb-6">
        <h1 className="font-display text-2xl lg:text-3xl font-bold text-gray-900">{t('settings', lang)}</h1>
        <p className="text-gray-500 text-sm mt-0.5 font-medium">{t('settingsSubtitle', lang)}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Tab sidebar */}
        <div className="lg:w-48 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 flex-shrink-0">
          {TABS.map(tb => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap',
                tab === tb.key
                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}>
              <tb.icon className="w-4 h-4 flex-shrink-0" />
              {tb.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="flex-1 min-w-0">
          <div className="card rounded-xl border border-gray-200 p-6" key={tab}>

            {/* ── PROFILE ── */}
            {tab === 'profile' && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-base font-bold text-gray-900">{t('profileInfo', lang)}</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-2xl font-bold text-amber-800 font-display flex-shrink-0">
                    {profile.name[0]}
                  </div>
                  <div>
                    <button className="text-sm font-medium text-amber-700 hover:text-amber-600 transition-colors">{t('changePhoto', lang)}</button>
                    <p className="text-xs text-gray-400 mt-0.5">JPG or PNG · Max 4 MB</p>
                  </div>
                </div>

                <Section title="Personal Details">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t('fullName', lang)}</label>
                      <input className="input-field" value={profile.name}
                        onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t('emailAddress', lang)}</label>
                      <input className="input-field" type="email" value={profile.email}
                        onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">{t('role', lang)}</label>
                      <input className="input-field" value={profile.role}
                        onChange={e => setProfile(p => ({ ...p, role: e.target.value }))} />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Phone</label>
                      <input className="input-field" type="tel" value={profile.phone}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                  </div>
                </Section>

                <Section title="Timezone & Bio">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Timezone</label>
                      <select className="input-field" value={profile.timezone}
                        onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Dubai">Dubai (GST)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Bio</label>
                      <textarea className="input-field resize-none" rows={3} value={profile.bio}
                        onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} />
                    </div>
                  </div>
                </Section>

                <button onClick={() => showToast('Profile updated successfully')} className="btn-primary">
                  <Save className="w-4 h-4" /> {t('save', lang)}
                </button>
              </div>
            )}

            {/* ── SECURITY ── */}
            {tab === 'security' && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-base font-bold text-gray-900">Security Settings</h2>

                <Section title="Change Password" description="Use a strong password you don't use elsewhere.">
                  <div className="space-y-3 max-w-md">
                    {(['current', 'next', 'confirm'] as const).map((field, i) => (
                      <div key={field}>
                        <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">
                          {field === 'current' ? 'Current Password' : field === 'next' ? 'New Password' : 'Confirm New Password'}
                        </label>
                        <div className="relative">
                          <input
                            className="input-field pr-10"
                            type={showPw[field] ? 'text' : 'password'}
                            value={passwords[field]}
                            placeholder={field === 'current' ? '••••••••' : field === 'next' ? 'Min. 8 characters' : 'Repeat new password'}
                            onChange={e => setPasswords(p => ({ ...p, [field]: e.target.value }))}
                          />
                          <button type="button" onClick={() => setShowPw(p => ({ ...p, [field]: !p[field] }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPw[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {field === 'next' && passwords.next.length > 0 && (
                          <div className="mt-2">
                            <div className="flex gap-1 mb-1">
                              {[1,2,3,4].map(i => (
                                <div key={i} className={cn('h-1 flex-1 rounded-full transition-colors',
                                  i <= pwStrength ? pwStrengthColor[pwStrength] : 'bg-gray-200')} />
                              ))}
                            </div>
                            <p className="text-xs text-gray-500">Strength: <span className="font-semibold">{pwStrengthLabel[pwStrength]}</span></p>
                          </div>
                        )}
                      </div>
                    ))}
                    {pwError && (
                      <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                        <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" /> {pwError}
                      </div>
                    )}
                    <button onClick={handlePasswordSave} className="btn-primary mt-1">
                      <Lock className="w-4 h-4" /> Update Password
                    </button>
                  </div>
                </Section>

                <Section title="Two-Factor Authentication" description="Add an extra layer of security to your account.">
                  <div className="flex items-center justify-between max-w-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-amber-700" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">Authenticator App</p>
                        <p className="text-xs text-gray-500">{twoFactor ? 'Active — Google Authenticator' : 'Not configured'}</p>
                      </div>
                    </div>
                    <Toggle checked={twoFactor} onChange={setTwoFactor} />
                  </div>
                </Section>

                <Section title="Session Timeout" description="Automatically log out after a period of inactivity.">
                  <div className="max-w-xs space-y-3">
                    <select className="input-field" value={sessionTimeout}
                      onChange={e => setSessionTimeout(e.target.value)}>
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                      <option value="480">8 hours</option>
                      <option value="0">Never</option>
                    </select>
                    <button onClick={() => showToast('Session settings saved')} className="btn-primary">
                      <Save className="w-4 h-4" /> Save Settings
                    </button>
                  </div>
                </Section>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {tab === 'notifications' && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-base font-bold text-gray-900">Notification Preferences</h2>

                {[
                  {
                    title: 'Email Notifications',
                    desc: 'Receive alerts and updates via email.',
                    items: [
                      { key: 'email_high_risk', label: 'High-risk case alerts',   icon: AlertTriangle, color: 'text-red-500' },
                      { key: 'email_deadlines', label: 'Upcoming deadlines',       icon: Zap,           color: 'text-amber-500' },
                      { key: 'email_messages',  label: 'New client messages',      icon: Mail,          color: 'text-blue-500' },
                      { key: 'email_billing',   label: 'Billing & invoice events', icon: CheckCircle2,  color: 'text-emerald-500' },
                    ],
                  },
                  {
                    title: 'Push Notifications',
                    desc: 'In-app and browser push notifications.',
                    items: [
                      { key: 'push_high_risk', label: 'High-risk case alerts',   icon: AlertTriangle, color: 'text-red-500' },
                      { key: 'push_deadlines', label: 'Upcoming deadlines',       icon: Zap,           color: 'text-amber-500' },
                      { key: 'push_messages',  label: 'New client messages',      icon: Mail,          color: 'text-blue-500' },
                      { key: 'push_billing',   label: 'Billing & invoice events', icon: CheckCircle2,  color: 'text-emerald-500' },
                    ],
                  },
                ].map(group => (
                  <Section key={group.title} title={group.title} description={group.desc}>
                    <div className="space-y-1">
                      {group.items.map(item => (
                        <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                          <div className="flex items-center gap-3">
                            <item.icon className={cn('w-4 h-4', item.color)} />
                            <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                          </div>
                          <Toggle
                            checked={notif[item.key as keyof typeof notif]}
                            onChange={v => setNotif(n => ({ ...n, [item.key]: v }))}
                          />
                        </div>
                      ))}
                    </div>
                  </Section>
                ))}

                <Section title="Digest Emails" description="Periodic summaries of your firm's activity.">
                  <div className="space-y-1">
                    {[
                      { key: 'digest_daily',  label: 'Daily digest (8 AM)' },
                      { key: 'digest_weekly', label: 'Weekly summary (Monday)' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                        <Toggle
                          checked={notif[item.key as keyof typeof notif]}
                          onChange={v => setNotif(n => ({ ...n, [item.key]: v }))}
                        />
                      </div>
                    ))}
                  </div>
                </Section>

                <button onClick={() => showToast('Notification preferences saved')} className="btn-primary">
                  <Save className="w-4 h-4" /> Save Preferences
                </button>
              </div>
            )}

            {/* ── APPEARANCE ── */}
            {tab === 'appearance' && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-base font-bold text-gray-900">Appearance</h2>

                <Section title="Theme" description="Choose how Legal Eagle looks for you.">
                  <div className="flex gap-3 flex-wrap">
                    {([
                      { key: 'light', label: 'Light', icon: Sun },
                      { key: 'dark',  label: 'Dark',  icon: Moon },
                      { key: 'system',label: 'System',icon: Monitor },
                    ] as const).map(opt => (
                      <button key={opt.key}
                        onClick={() => setAppearance(a => ({ ...a, theme: opt.key }))}
                        className={cn(
                          'flex flex-col items-center gap-2 px-5 py-4 rounded-xl border-2 text-sm font-semibold transition-all',
                          appearance.theme === opt.key
                            ? 'border-amber-500 bg-amber-50 text-amber-800'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                        )}>
                        <opt.icon className="w-5 h-5" />
                        {opt.label}
                        {appearance.theme === opt.key && <Check className="w-3.5 h-3.5 text-amber-600" />}
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Font Size" description="Adjust text size for readability.">
                  <div className="flex gap-3 flex-wrap">
                    {([
                      { key: 'compact', label: 'Compact', cls: 'text-xs' },
                      { key: 'default', label: 'Default', cls: 'text-sm' },
                      { key: 'large',   label: 'Large',   cls: 'text-base' },
                    ] as const).map(opt => (
                      <button key={opt.key}
                        onClick={() => setAppearance(a => ({ ...a, fontSize: opt.key }))}
                        className={cn(
                          'flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 font-medium transition-all',
                          opt.cls,
                          appearance.fontSize === opt.key
                            ? 'border-amber-500 bg-amber-50 text-amber-800'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        )}>
                        <Type className="w-3.5 h-3.5" />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </Section>

                <Section title="Layout & Motion">
                  <div className="space-y-1 max-w-sm">
                    {[
                      { key: 'reduceMotion',     label: 'Reduce motion',                desc: 'Minimize animations across the app' },
                      { key: 'sidebarCollapsed',  label: 'Collapse sidebar by default',  desc: 'Start with the sidebar minimized' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                          <p className="text-xs text-gray-500">{item.desc}</p>
                        </div>
                        <Toggle
                          checked={appearance[item.key as keyof typeof appearance] as boolean}
                          onChange={v => setAppearance(a => ({ ...a, [item.key]: v }))}
                        />
                      </div>
                    ))}
                  </div>
                </Section>

                <button onClick={() => showToast('Appearance settings saved')} className="btn-primary">
                  <Save className="w-4 h-4" /> Save Appearance
                </button>
              </div>
            )}

            {/* ── API ── */}
            {tab === 'api' && (
              <div className="animate-fade-in space-y-6">
                <h2 className="text-base font-bold text-gray-900">API & Integrations</h2>

                <Section title="API Key" description="Use this key to authenticate requests to the Legal Eagle API.">
                  <div className="space-y-3 max-w-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 relative">
                        <input
                          readOnly
                          className="input-field font-mono text-xs pr-10 bg-gray-50"
                          value={showKey ? apiKey : '•'.repeat(40)}
                        />
                        <button onClick={() => setShowKey(v => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button onClick={handleCopyKey}
                        className={cn(
                          'flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-all flex-shrink-0',
                          keyCopied
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        )}>
                        {keyCopied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                      </button>
                    </div>
                    <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-amber-800">Never share your API key publicly. Treat it like a password and rotate it if compromised.</p>
                    </div>
                    <button onClick={() => showToast('A new API key has been generated')}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors">
                      <RefreshCw className="w-3.5 h-3.5" /> Rotate API Key
                    </button>
                  </div>
                </Section>

                <Section title="Webhook" description="Receive real-time events posted to your server when activity occurs.">
                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Endpoint URL</label>
                      <div className="flex items-center gap-2">
                        <Webhook className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <input className="input-field flex-1" type="url" value={webhookUrl}
                          onChange={e => setWebhookUrl(e.target.value)}
                          placeholder="https://your-server.com/webhook" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 mb-2.5 uppercase tracking-wide">Events to Send</p>
                      <div className="space-y-2">
                        {[
                          { key: 'case_created', label: 'Case created' },
                          { key: 'risk_alert',   label: 'Risk alert triggered' },
                          { key: 'deadline_due', label: 'Deadline approaching' },
                          { key: 'message_sent', label: 'Message sent / received' },
                        ].map(ev => (
                          <label key={ev.key} className="flex items-center gap-3 cursor-pointer group">
                            <button type="button"
                              onClick={() => setWebhookEvents(w => ({ ...w, [ev.key]: !w[ev.key as keyof typeof webhookEvents] }))}
                              className={cn(
                                'w-4 h-4 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0',
                                webhookEvents[ev.key as keyof typeof webhookEvents]
                                  ? 'bg-amber-600 border-amber-600'
                                  : 'border-gray-300 group-hover:border-gray-400'
                              )}>
                              {webhookEvents[ev.key as keyof typeof webhookEvents] && <Check className="w-2.5 h-2.5 text-white" />}
                            </button>
                            <span className="text-sm text-gray-700 font-medium">{ev.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => showToast('Webhook configuration saved')} className="btn-primary">
                      <Save className="w-4 h-4" /> Save Webhook
                    </button>
                  </div>
                </Section>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
