import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { getTierByProductId, type TierKey } from "@/lib/subscription-tiers";

interface SubscriptionState {
  subscribed: boolean;
  tierKey: TierKey | null;
  subscriptionEnd: string | null;
  loading: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionState;
  refreshSubscription: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionState>({
    subscribed: false,
    tierKey: null,
    subscriptionEnd: null,
    loading: true,
  });

  const checkSubscription = useCallback(async (currentSession: Session | null) => {
    if (!currentSession) {
      setSubscription({ subscribed: false, tierKey: null, subscriptionEnd: null, loading: false });
      return;
    }
    setSubscription((s) => ({ ...s, loading: true }));
    try {
      const { data, error } = await supabase.functions.invoke("check-subscription");
      if (error) throw error;
      setSubscription({
        subscribed: data.subscribed ?? false,
        tierKey: getTierByProductId(data.product_id),
        subscriptionEnd: data.subscription_end ?? null,
        loading: false,
      });
    } catch (err) {
  console.error("checkSubscription failed:", err);
  setSubscription({
    subscribed: false,
    tierKey: null,
    subscriptionEnd: null,
    loading: false,
  });
}
  }, []);

  const refreshSubscription = useCallback(async () => {
    await checkSubscription(session);
  }, [checkSubscription, session]);

  useEffect(() => {
    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
        checkSubscription(newSession);
      }
    );

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      checkSubscription(s);
    });

    return () => authSub.unsubscribe();
  }, [checkSubscription]);

  // Auto-refresh subscription every 60s
  useEffect(() => {
    if (!session) return;
    const id = setInterval(() => checkSubscription(session), 60_000);
    return () => clearInterval(id);
  }, [session, checkSubscription]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, subscription, refreshSubscription, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
