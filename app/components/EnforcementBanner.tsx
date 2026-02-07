"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function EnforcementBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Get logged-in user
      const { data: auth } = await supabase.auth.getUser();
      const user = auth?.user;
      if (!user) return; // not logged in → don't show banner

      // Check if user already has a church
      const { data: churches } = await supabase
        .from("churches")
        .select("id")
        .eq("owner_id", user.id)
        .limit(1);

      // Show banner ONLY if the user has no church
      if (!churches || churches.length === 0) {
        setShow(true);
      }
    };

    load();
  }, []);

  if (!show) return null;

  return (
    <div className="w-full bg-yellow-50 border-b border-yellow-300 py-3 px-4 text-center">
      <p className="text-yellow-800 font-medium">
        ⚠️ Complete your setup to get the best experience.
        <Link href="/onboarding/church" className="underline ml-2">
          Register your church
        </Link>
        {" or "}
        <Link href="/events/add" className="underline">
          share an event you know about.
        </Link>
      </p>
    </div>
  );
}
