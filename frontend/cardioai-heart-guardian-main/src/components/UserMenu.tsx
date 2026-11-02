import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TIERS } from "@/lib/subscription-tiers";
import { useState } from "react";

const UserMenu = () => {
  const { user, subscription, signOut } = useAuth();
  const navigate = useNavigate();
  const [portalLoading, setPortalLoading] = useState(false);

  if (!user) {
    return (
      <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>
        Sign In
      </Button>
    );
  }

  const tierName = subscription.tierKey
    ? TIERS[subscription.tierKey].name
    : null;

  const handlePortal = async () => {
    setPortalLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("customer-portal");
      if (error) throw error;
      if (data?.url) window.open(data.url, "_blank");
    } catch {
      // silently fail
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {subscription.subscribed && tierName && (
        <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cardio-success/10 text-cardio-success text-xs font-semibold">
          <Sparkles className="w-3 h-3" /> {tierName}
        </span>
      )}
      {subscription.subscribed && (
        <button
          onClick={handlePortal}
          disabled={portalLoading}
          className="hidden md:flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          title="Manage Subscription"
        >
          {portalLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Settings className="w-3.5 h-3.5" />}
        </button>
      )}
      <button
        onClick={signOut}
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        title="Sign Out"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span className="hidden md:inline">Sign Out</span>
      </button>
    </div>
  );
};

export default UserMenu;
