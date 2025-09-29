'use client';

import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import {
  BellIcon,
  Squares2X2Icon,
  CalendarDaysIcon,
  BookmarkIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
import { ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavBar() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [gridMenuOpen, setGridMenuOpen] = useState(false);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);

        // ✅ Fetch last 5 events for notifications
        const { data: events } = await supabase
          .from('events')
          .select('id, title, start_time')
          .order('start_time', { ascending: true })
          .limit(5);
        setNotifications(events || []);
      }
    };
    getUser();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <div className="w-full border-b border-blue-700 sticky top-0 z-30 bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
        {/* ✅ Left: Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-blue-900"
        >
          <Image
            src="/logo.png"
            width={40}
            height={40}
            alt="logo"
            className="rounded-full"
          />
        </Link>

        {/* ✅ Right icons */}
        {user ? (
          <div className="flex items-center gap-4 relative">
            {/* App Grid Dropdown */}
            <div className="relative">
              <button
                className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200"
                onClick={() => {
                  setGridMenuOpen(!gridMenuOpen);
                  setProfileMenuOpen(false);
                  setNotificationMenuOpen(false);
                }}
              >
                <Squares2X2Icon className="h-6 w-6 text-blue-700" />
              </button>

              <AnimatePresence>
                {gridMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-blue-900"
                      onClick={() => setGridMenuOpen(false)}
                    >
                      <HomeIcon className="h-5 w-5 text-blue-600" />
                      Dashboard
                    </Link>
                    <Link
                      href="/events"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-blue-900"
                      onClick={() => setGridMenuOpen(false)}
                    >
                      <CalendarDaysIcon className="h-5 w-5 text-blue-600" />
                      Events
                    </Link>
                    <Link
                      href="/saved-events"
                      className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-blue-900"
                      onClick={() => setGridMenuOpen(false)}
                    >
                      <BookmarkIcon className="h-5 w-5 text-blue-600" />
                      Saved Events
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Messenger / Chat */}
            <Link
              href="/chat"
              className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200"
            >
              <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-blue-700" />
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 relative"
                onClick={() => {
                  setNotificationMenuOpen(!notificationMenuOpen);
                  setProfileMenuOpen(false);
                  setGridMenuOpen(false);
                }}
              >
                <BellIcon className="h-6 w-6 text-blue-700" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <AnimatePresence>
                {notificationMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-72 bg-white border rounded-lg shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <div className="p-3 font-semibold text-blue-900 border-b">
                      Notifications
                    </div>
                    <ul className="max-h-64 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <li
                            key={n.id}
                            className="p-3 border-b hover:bg-blue-50"
                          >
                            <Link href={`/events/${n.id}`}>
                              <div className="font-medium text-blue-800">
                                {n.title}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(n.start_time).toLocaleString()}
                              </div>
                            </Link>
                          </li>
                        ))
                      ) : (
                        <li className="p-3 text-sm text-gray-500">
                          No new notifications.
                        </li>
                      )}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Avatar + Dropdown */}
            <div className="relative">
              <button
                className="flex items-center"
                onClick={() => {
                  setProfileMenuOpen(!profileMenuOpen);
                  setGridMenuOpen(false);
                  setNotificationMenuOpen(false);
                }}
              >
                {profile?.avatar_url ? (
               <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-blue-600 shadow-md">
  <Image
    src={profile.avatar_url}
    alt="Avatar"
    width={40}
    height={40}
    className="object-cover w-full h-full"
  />
</div>

                ) : (
                  <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {profile?.full_name?.[0] || user?.email?.[0]}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Link
                      href="/profile"
                      className="block px-4 py-2 hover:bg-blue-50 text-blue-900"
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      My Profile
                    </Link>
         <button
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-blue-900"
                      onClick={signOut}
                    >
                      Sign out
                    </button>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/auth"
              className="btn text-blue-900 border border-blue-700"
            >
              Login
            </Link>
            <Link href="/auth" className="btn btn-primary">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}


