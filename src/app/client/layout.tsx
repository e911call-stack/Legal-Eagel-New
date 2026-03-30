'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Scale, LayoutDashboard, FolderOpen, MessageSquare,
  LogOut, Bell, ArrowLeftRight, UserCog, X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useSession } from '@/lib/session-context';
import { LanguageProvider } from '@/lib/language-context';

const CLIENT_NAV = [
  { href: '/client/dashboard', icon: LayoutDashboard, label: 'My Overview' },
  { href: '/client/cases',     icon: FolderOpen,       label: 'My Cases' },
  { href: '/client/messages',  icon: MessageSquare,    label: 'Messages' },
];

function ClientBanner() {
  const { setRole } = useSession();
  const router = useRouter();
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-blue-50 border-b border-blue-200 px-4 py-2 flex items-center justify-between gap-3 text-xs flex-shrink-0">
      <div className="flex items-center gap-2 text-blue-800">
        <UserCog className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="font-semibold">Demo mode</span>
        <span className="text-blue-400">—</span>
        <span className="text-blue-700">Viewing as <strong>Client (James Harrison)</strong></span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => { setRole('lawyer'); router.push('/dashboard'); }}
          className="flex items-center gap-1.5 bg-blue-700 text-white font-semibold px-2.5 py-1 rounded-md hover:bg-blue-800 transition-colors">
          <ArrowLeftRight className="w-3 h-3" /> Switch to Lawyer View
        </button>
        <button onClick={() => setVisible(false)} className="text-blue-400 hover:text-blue-800 transition-colors p-0.5">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setRole } = useSession();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  // Redirect lawyers away from client view
  useEffect(() => {
    if (user.role === 'lawyer') router.replace('/dashboard');
  }, [user.role, router]);

  if (user.role === 'lawyer') return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-56 flex-col bg-white border-r border-slate-200 flex-shrink-0">
        <div className="px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
              <Scale className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-display text-base font-bold text-slate-900 leading-none">Legal Eagle</div>
              <div className="text-[10px] text-slate-400 tracking-widest uppercase mt-0.5 font-medium">Client Portal</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest px-2 mb-2 font-bold">My Portal</p>
          {CLIENT_NAV.map(item => (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                isActive(item.href)
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              )}>
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-3 border-t border-slate-200">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-blue-800">{user.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-900 truncate">{user.name}</div>
              <div className="text-[10px] text-slate-400">Client</div>
            </div>
            <button onClick={() => { setRole('lawyer'); router.push('/login'); }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <ClientBanner />
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div>
            <span className="text-sm font-semibold text-slate-700">Welcome back, {user.name.split(' ')[0]}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all">
              <Bell className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-blue-300 flex items-center justify-center">
              <span className="text-xs font-bold text-blue-800">{user.name[0]}</span>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-slate-50">{children}</main>
      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ClientShell>{children}</ClientShell>
    </LanguageProvider>
  );
}
