'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ChurchOnboardingPopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [hasChurch, setHasChurch] = useState(false);
  const [hasEvents, setHasEvents] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      // ✅ fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('onboarding_dismissed,onboarding_remind_until')
        .eq('id', user.id)
        .single();

      setProfile(profileData);

      // ✅ stop if dismissed permanently
      if (profileData?.onboarding_dismissed) return;

      // ✅ stop if remind later not expired
      if (
        profileData?.onboarding_remind_until &&
        new Date(profileData.onboarding_remind_until) > new Date()
      ) {
        return;
      }

      // ✅ Check if user has church
      const { data: churches } = await supabase
        .from('churches')
        .select('id')
        .eq('created_by', user.id)
        .limit(1);

      const churchExists = churches && churches.length > 0;
      setHasChurch(churchExists);

      // ✅ Check events
      if (churchExists) {
        const { data: events } = await supabase
          .from('events')
          .select('id')
          .eq('created_by', user.id)
          .limit(1);

        setHasEvents(events && events.length > 0);
      }

      if (!churchExists || (churchExists && !hasEvents)) {
        setShowPopup(true);
      }
    };

    checkOnboarding();
  }, [hasEvents]);

  // ✅ Permanent dismiss
  const handleDismiss = async () => {
    if (!user) return;
    await supabase.from('profiles').update({ onboarding_dismissed: true }).eq('id', user.id);
    setShowPopup(false);
  };

  // ✅ Remind me later (7 days)
  const handleRemindLater = async () => {
    if (!user) return;
    const remindUntil = new Date();
    remindUntil.setDate(remindUntil.getDate() + 7);
    await supabase
      .from('profiles')
      .update({ onboarding_remind_until: remindUntil.toISOString() })
      .eq('id', user.id);
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md text-center animate-fadeIn">
        <h2 className="text-2xl font-bold text-blue-900">✨ Welcome!</h2>

        {!hasChurch ? (
          <p className="text-gray-600 mt-2">
            Start by adding your church so members can connect and follow updates.
          </p>
        ) : !hasEvents ? (
          <p className="text-gray-600 mt-2">
            You already have a church 🎉. Next, add your first event to engage members!
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {!hasChurch ? (
            <a href="/dashboard" className="btn btn-primary">
              Add Church
            </a>
          ) : !hasEvents ? (
            <a href="/dashboard" className="btn btn-primary">
              Add Event
            </a>
          ) : null}

          <button
            onClick={handleRemindLater}
            className="btn border text-gray-600 hover:bg-gray-100"
          >
            Remind Me Later
          </button>

          <button
            onClick={handleDismiss}
            className="btn border text-gray-600 hover:bg-gray-100"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
