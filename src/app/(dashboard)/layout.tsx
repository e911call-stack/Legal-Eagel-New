'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Scale, LayoutDashboard, FolderOpen, FileText, MessageSquare,
  Receipt, AlertTriangle, Settings, LogOut, Bell, Search,
  ChevronDown, Menu, X, Globe, UserCog, ArrowLeftRight,
} from 'lucide-react';
import { cn, t } from '@/lib/utils';
import { LanguageProvider, useLanguage } from '@/lib/language-context';
import { useSession } from '@/lib/session-context';
import type { Lang } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { href: '/cases',     icon: FolderOpen,       key: 'cases',    badge: 24 },
  { href: '/documents', icon: FileText,          key: 'documents' },
  { href: '/messages',  icon: MessageSquare,     key: 'messages', badge: 7 },
  { href: '/billing',   icon: Receipt,           key: 'billing' },
  { href: '/alerts',    icon: AlertTriangle,     key: 'alerts',   badge: 3, badgeDanger: true },
];

const LANG_OPTIONS: { code: Lang; label: string; flag: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'English',  flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', label: 'Español',  flag: '🇪🇸', dir: 'ltr' },
  { code: 'zh', label: '中文',     flag: '🇨🇳', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
  { code: 'hi', label: 'हिन्दी',   flag: '🇮🇳', dir: 'ltr' },
];

function RoleBanner() {
  const { user, setRole } = useSession();
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center justify-between gap-3 text-xs flex-shrink-0">
      <div className="flex items-center gap-2 text-amber-800">
        <UserCog className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="font-semibold">Demo mode</span>
        <span className="text-amber-400">—</span>
        <span className="text-amber-700">Viewing as <strong>Lawyer (Sarah Chen)</strong></span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setRole('client'); router.push('/client/dashboard'); }}
          className="flex items-center gap-1.5 bg-amber-700 text-white font-semibold px-2.5 py-1 rounded-md hover:bg-amber-800 transition-colors">
          <ArrowLeftRight className="w-3 h-3" /> Switch to Client View
        </button>
        <button onClick={() => setVisible(false)} className="text-amber-400 hover:text-amber-800 transition-colors p-0.5">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function Sidebar({ sidebarOpen, setSidebarOpen }: { sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang } = useLanguage();
  const { user, setRole } = useSession();
  const [langOpen, setLangOpen] = useState(false);
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');
  const currentLang = LANG_OPTIONS.find(l => l.code === lang)!;

  function SidebarContent() {
    return (
      <div className="flex flex-col h-full">
        <div className="px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-display text-base font-bold text-gray-900 leading-none">Legal Eagle</div>
              <div className="text-[10px] text-gray-400 tracking-widest uppercase mt-0.5 font-medium">Legal Platform</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest px-2 mb-2 font-bold">{t('navigation', lang)}</p>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-150 font-medium',
                isActive(item.href) ? 'nav-active' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{t(item.key, lang)}</span>
              {item.badge && (
                <span className={cn(
                  'text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                  item.badgeDanger ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                )}>{item.badge}</span>
              )}
            </Link>
          ))}
          <div className="border-t border-gray-200 my-3" />
          <p className="text-[10px] text-gray-400 uppercase tracking-widest px-2 mb-2 font-bold">{t('system', lang)}</p>
          <Link href="/settings" onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-150">
            <Settings className="w-4 h-4" /> {t('settings', lang)}
          </Link>
        </nav>

        <div className="px-3 py-3 border-t border-gray-200 space-y-2">
          <div className="relative">
            <button onClick={() => setLangOpen(!langOpen)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
              <Globe className="w-3.5 h-3.5 text-gray-400" />
              <span className="flex-1 text-left">{currentLang.flag} {currentLang.label}</span>
              <ChevronDown className={cn('w-3 h-3 text-gray-400 transition-transform', langOpen && 'rotate-180')} />
            </button>
            {langOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg z-50">
                {LANG_OPTIONS.map(l => (
                  <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-2.5 px-3 py-2.5 text-xs font-medium transition-colors',
                      lang === l.code ? 'text-amber-800 bg-amber-50 font-semibold' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    )} dir={l.dir}>
                    <span className="text-base">{l.flag}</span>
                    <span>{l.label}</span>
                    {lang === l.code && <span className="ml-auto text-amber-600">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-amber-800">{user.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-gray-900 truncate">{user.name}</div>
              <div className="text-[10px] text-gray-400 truncate capitalize">{user.role}</div>
            </div>
            <button onClick={() => { setRole('lawyer'); router.push('/login'); }}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title={t('logout', lang)}>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <aside className="hidden lg:flex w-60 flex-col bg-white border-r border-gray-200 flex-shrink-0">
        <SidebarContent />
      </aside>
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 flex flex-col bg-white border-r border-gray-200 h-full shadow-xl">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}

function DashboardShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { lang } = useLanguage();
  const { user } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (user.role === 'client') router.replace('/client/dashboard');
  }, [user.role, router]);

  if (user.role === 'client') return null;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <RoleBanner />
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input type="text" placeholder={t('searchCases', lang)}
                className="pl-9 pr-4 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-400 focus:bg-white w-64 xl:w-80 transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
            <div className="w-8 h-8 rounded-full bg-amber-100 border-2 border-amber-300 flex items-center justify-center">
              <span className="text-xs font-bold text-amber-800">{user.name[0]}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-100">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <DashboardShell>{children}</DashboardShell>
    </LanguageProvider>
  );
}
