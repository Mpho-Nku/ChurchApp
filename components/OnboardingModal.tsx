"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function OnboardingModal({
  user,
  hasChurch,
}: {
  user: any;
  hasChurch: boolean;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!user) return;

    const checkProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("church_id")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Profile load error:", error);
        return;
      }

      const alreadyDismissed =
        typeof window !== "undefined"
          ? localStorage.getItem("dismiss_onboarding")
          : null;

      /** LOGIC:
       * Only show onboarding when:
       * 1. user exists
       * 2. user has no church in profile
       * 3. homepage didn't load a church for user
       * 4. user has not dismissed
       */
      if (!data?.church_id && !hasChurch && !alreadyDismissed) {
        setShow(true);
      }
    };

    checkProfile();
  }, [user, hasChurch]);

  const close = () => {
    localStorage.setItem("dismiss_onboarding", "1");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      {/* Modal */}
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fadeIn relative">
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 text-xl"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-blue-900 mb-3 text-center">
          Complete Your Setup
        </h2>
        <p className="text-gray-700 text-center mb-6">
          Before using the platform, please register your church.  
          This helps us link events, members & circuits correctly.
        </p>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {[
            "Church Name",
            "Location",
            "Church Type",
            "Final Details",
          ].map((step, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100"
            >
              <div className="h-8 w-8 bg-blue-600 text-white flex items-center justify-center rounded-full font-semibold">
                {index + 1}
              </div>
              <p className="text-blue-900 font-medium">{step}</p>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <Link href="/onboarding/church/add">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold text-lg transition">
            Start Registration →
          </button>
        </Link>

        {/* Skip */}
        <button
          onClick={close}
          className="block mx-auto mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Skip for now
        </button>
      </div>

      {/* Fade-in animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.35s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
