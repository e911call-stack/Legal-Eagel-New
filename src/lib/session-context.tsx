'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import type { UserRole } from '@/types';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  firm_id: string;
  avatar_url?: string;
}

interface SessionContextValue {
  user: SessionUser;
  setRole: (role: UserRole) => void;
}

const LAWYER_USER: SessionUser = {
  id: 'user-1',
  name: 'Sarah Chen',
  email: 'sarah.chen@lexfirm.com',
  role: 'lawyer',
  firm_id: 'firm-1',
};

const CLIENT_USER: SessionUser = {
  id: 'client-1',
  name: 'James Harrison',
  email: 'james.harrison@email.com',
  role: 'client',
  firm_id: 'firm-1',
};

const SessionContext = createContext<SessionContextValue>({
  user: LAWYER_USER,
  setRole: () => {},
});

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser>(LAWYER_USER);

  function setRole(role: UserRole) {
    setUser(role === 'client' ? CLIENT_USER : LAWYER_USER);
  }

  return (
    <SessionContext.Provider value={{ user, setRole }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  return useContext(SessionContext);
}

export { LAWYER_USER, CLIENT_USER };
