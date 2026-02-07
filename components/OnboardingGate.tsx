"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import EnforcementBanner from "@/app/components/EnforcementBanner";

export default function OnboardingGate() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;

      if (!user) {
        setShowBanner(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("church_id")
        .eq("id", user.id)
        .single();

      setShowBanner(!profile?.church_id);
    };

    loadProfile();
  }, []);

  return showBanner ? <EnforcementBanner /> : null;
}
