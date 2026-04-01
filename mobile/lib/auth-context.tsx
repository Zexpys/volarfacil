import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';
import type { Session } from '@supabase/supabase-js';

type AuthContextValue = {
  ready: boolean;
  session: Session | null;
};

const AuthContext = createContext<AuthContextValue>({
  ready: false,
  session: null,
});

export function AuthProvider({
  children,
  value,
}: {
  children: ReactNode;
  value: AuthContextValue;
}) {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
