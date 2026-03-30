'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Scale, ChevronRight, ChevronLeft, Check, Building2, Users, MapPin, Globe, Sparkles, ArrowRight } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Firm Info', icon: Building2 },
  { id: 2, label: 'Team Setup', icon: Users },
  { id: 3, label: 'Jurisdiction', icon: MapPin },
  { id: 4, label: 'Preferences', icon: Globe },
  { id: 5, label: 'AI Setup', icon: Sparkles },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    firmName: '',
    address: '',
    city: '',
    state: '',
    jurisdiction: 'US',
    teamSize: '',
    practiceAreas: [] as string[],
    language: 'en',
    aiAlerts: true,
    dailyDigest: true,
  });

  const PRACTICE_AREAS = ['Civil Litigation', 'Family Law', 'Immigration', 'Estate Planning', 'Criminal Defense', 'IP & Technology', 'Real Estate', 'Corporate'];

  function toggle(area: string) {
    setData(d => ({
      ...d,
      practiceAreas: d.practiceAreas.includes(area)
        ? d.practiceAreas.filter(a => a !== area)
        : [...d.practiceAreas, area],
    }));
  }

  function next() { if (step < 5) setStep(s => s + 1); else router.push('/dashboard'); }
  function back() { if (step > 1) setStep(s => s - 1); }

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center p-6">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-gold-500/8 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
            <Scale className="w-4 h-4 text-ink-950" />
          </div>
          <span className="font-display text-2xl font-semibold text-white">LEXORA</span>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10 px-4">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step > s.id ? 'bg-gold-500 text-ink-950' :
                  step === s.id ? 'bg-gold-500/20 border-2 border-gold-500 text-gold-400' :
                  'bg-ink-800 border border-white/10 text-ink-500'
                }`}>
                  {step > s.id ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
                </div>
                <span className={`text-xs hidden sm:block ${step >= s.id ? 'text-ink-300' : 'text-ink-600'}`}>
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`h-px mx-2 flex-1 w-12 sm:w-20 transition-colors duration-300 ${
                  step > s.id ? 'bg-gold-500/50' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="card border border-white/8 rounded-2xl p-8" key={step}>
          {/* Step content */}
          {step === 1 && (
            <div className="animate-slide-up">
              <h2 className="font-display text-2xl font-semibold text-white mb-1">Firm Information</h2>
              <p className="text-ink-400 text-sm mb-6">Tell us about your law firm</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-ink-400 mb-1.5 uppercase tracking-wide font-medium">Firm Name *</label>
                  <input className="input-field" placeholder="e.g. Chen & Associates Law Group" value={data.firmName}
                    onChange={e => setData(d => ({ ...d, firmName: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs text-ink-400 mb-1.5 uppercase tracking-wide font-medium">Street Address</label>
                  <input className="input-field" placeholder="123 Legal Street, Suite 400" value={data.address}
                    onChange={e => setData(d => ({ ...d, address: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-ink-400 mb-1.5 uppercase tracking-wide font-medium">City</label>
                    <input className="input-field" placeholder="New York" value={data.city}
                      onChange={e => setData(d => ({ ...d, city: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-xs text-ink-400 mb-1.5 uppercase tracking-wide font-medium">State</label>
                    <input className="input-field" placeholder="NY" value={data.state}
                      onChange={e => setData(d => ({ ...d, state: e.target.value }))} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-slide-up">
              <h2 className="font-display text-2xl font-semibold text-white mb-1">Team Setup</h2>
              <p className="text-ink-400 text-sm mb-6">Help us customize LEXORA for your team size</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-ink-400 mb-3 uppercase tracking-wide font-medium">Number of Attorneys</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1', '2–5', '6–10', '10+'].map(size => (
                      <button key={size} onClick={() => setData(d => ({ ...d, teamSize: size }))}
                        className={`py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          data.teamSize === size
                            ? 'bg-gold-500/15 border-gold-500/60 text-gold-400'
                            : 'border-white/10 text-ink-400 hover:border-white/20 hover:text-white'
                        }`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-ink-400 mb-3 uppercase tracking-wide font-medium">Practice Areas</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRACTICE_AREAS.map(area => (
                      <button key={area} onClick={() => toggle(area)}
                        className={`py-2.5 px-3 rounded-lg border text-sm text-left transition-all duration-200 flex items-center gap-2 ${
                          data.practiceAreas.includes(area)
                            ? 'bg-gold-500/10 border-gold-500/40 text-gold-300'
                            : 'border-white/8 text-ink-400 hover:border-white/15 hover:text-white'
                        }`}>
                        {data.practiceAreas.includes(area) && <Check className="w-3 h-3 text-gold-400" />}
                        {area}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-slide-up">
              <h2 className="font-display text-2xl font-semibold text-white mb-1">Jurisdiction</h2>
              <p className="text-ink-400 text-sm mb-6">The AI engine uses jurisdiction to apply the correct legal standards</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-ink-400 mb-3 uppercase tracking-wide font-medium">Primary Jurisdiction</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { code: 'US', label: '🇺🇸 United States', desc: 'ABA Rules of Professional Conduct' },
                      { code: 'JO', label: '🇯🇴 Jordan', desc: 'Jordanian Bar Association Rules' },
                      { code: 'AE', label: '🇦🇪 UAE', desc: 'UAEBA Standards' },
                      { code: 'ES', label: '🇪🇸 Spain', desc: 'CGAE Rules' },
                    ].map(j => (
                      <button key={j.code} onClick={() => setData(d => ({ ...d, jurisdiction: j.code }))}
                        className={`p-3 rounded-xl border text-left transition-all duration-200 ${
                          data.jurisdiction === j.code
                            ? 'bg-gold-500/12 border-gold-500/50 text-gold-300'
                            : 'border-white/8 text-ink-400 hover:border-white/15'
                        }`}>
                        <div className="text-sm font-medium mb-0.5">{j.label}</div>
                        <div className="text-xs text-ink-500">{j.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-slide-up">
              <h2 className="font-display text-2xl font-semibold text-white mb-1">Platform Preferences</h2>
              <p className="text-ink-400 text-sm mb-6">Customize your LEXORA experience</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-ink-400 mb-3 uppercase tracking-wide font-medium">Interface Language</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: 'en', label: '🇺🇸 English' },
                      { code: 'ar', label: '🇸🇦 العربية' },
                      { code: 'es', label: '🇪🇸 Español' },
                    ].map(l => (
                      <button key={l.code} onClick={() => setData(d => ({ ...d, language: l.code }))}
                        className={`py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                          data.language === l.code
                            ? 'bg-gold-500/15 border-gold-500/60 text-gold-400'
                            : 'border-white/10 text-ink-400 hover:border-white/20 hover:text-white'
                        }`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3 mt-2">
                  {[
                    { key: 'aiAlerts', label: 'AI Alert Notifications', desc: 'Get notified when the Negligence Detection Engine flags a case' },
                    { key: 'dailyDigest', label: 'Daily Case Digest', desc: 'Receive a morning summary of all active case statuses' },
                  ].map(opt => (
                    <div key={opt.key} className="flex items-start justify-between p-4 rounded-xl border border-white/8 bg-ink-800/30">
                      <div>
                        <p className="text-sm font-medium text-white">{opt.label}</p>
                        <p className="text-xs text-ink-500 mt-0.5">{opt.desc}</p>
                      </div>
                      <button
                        onClick={() => setData(d => ({ ...d, [opt.key]: !d[opt.key as 'aiAlerts' | 'dailyDigest'] }))}
                        className={`mt-0.5 w-10 h-5 rounded-full transition-all duration-300 relative flex-shrink-0 ${
                          data[opt.key as 'aiAlerts' | 'dailyDigest'] ? 'bg-gold-500' : 'bg-ink-700'
                        }`}
                      >
                        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${
                          data[opt.key as 'aiAlerts' | 'dailyDigest'] ? 'left-5' : 'left-0.5'
                        }`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-slide-up text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold-400/20 to-gold-600/10 border border-gold-500/30 flex items-center justify-center mx-auto mb-5">
                <Sparkles className="w-7 h-7 text-gold-400" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-white mb-2">AI Engine Ready</h2>
              <p className="text-ink-400 text-sm mb-8 max-w-md mx-auto">
                LEXORA's Negligence Detection Engine has been configured for your firm. It will monitor all active cases and alert you to:
              </p>
              <div className="grid grid-cols-1 gap-3 text-left mb-8">
                {[
                  { icon: '⏰', title: 'Inactivity Detection', desc: 'No meaningful activity in 14+ days → Medium risk flag' },
                  { icon: '💬', title: 'Unanswered Messages', desc: 'Client messages unanswered 72+ hours → Alert generated' },
                  { icon: '📅', title: 'Missed Deadlines', desc: 'Internal review dates passed without completion → High risk' },
                ].map(item => (
                  <div key={item.title} className="flex gap-3 p-3.5 rounded-xl bg-gold-500/5 border border-gold-500/15">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                      <p className="text-xs text-ink-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-xl p-3 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <p className="text-xs text-emerald-300">Setup complete · AI engine will run its first analysis tonight at midnight</p>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
            <button onClick={back} disabled={step === 1}
              className="flex items-center gap-1.5 text-sm text-ink-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex gap-1.5">
              {STEPS.map(s => (
                <div key={s.id} className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.id === step ? 'w-5 bg-gold-500' : s.id < step ? 'w-1.5 bg-gold-500/40' : 'w-1.5 bg-white/10'
                }`} />
              ))}
            </div>
            <button onClick={next}
              className="btn-primary flex items-center gap-1.5">
              {step === 5 ? (
                <><ArrowRight className="w-4 h-4" /> Enter Platform</>
              ) : (
                <>Next <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
