'use client';

import { useState, useEffect } from 'react';

type OnboardingModalProps = {
  user: any;
  hasChurch: boolean;
};

export default function OnboardingModal({ user, hasChurch }: OnboardingModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (user && !hasChurch) {
      const dismissed = localStorage.getItem('onboardingDismissed');
      if (!dismissed) {
        setOpen(true);
      }
    }
  }, [user, hasChurch]);

  const dismiss = () => {
    localStorage.setItem('onboardingDismissed', 'true');
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-blue-900">Welcome to St John AFM!</h2>
        <p className="text-gray-600 mb-4">
          Help others discover your church! Add your church and upcoming events so members and visitors can stay connected.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={dismiss}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Dismiss
          </button>
          <a
            href="/dashboard"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Church
          </a>
        </div>
      </div>
    </div>
  );
}
