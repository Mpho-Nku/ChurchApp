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
  PhotoIcon,
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
  const [unreadCount, setUnreadCount] = useState(0);

  // -------------------------------------------------------
  // LOAD USER + PROFILE + NOTIFICATIONS
  // -------------------------------------------------------
  useEffect(() => {
    const loadData = async () => {
      const { data: auth } = await supabase.auth.getUser();
      const currentUser = auth?.user;
      setUser(currentUser);

      if (!currentUser) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", currentUser.id)
        .single();

      setProfile(profileData);

      // Load notifications
      const { data: notifs } = await supabase
        .from("notifications")
        .select(`
          id,
          type,
          created_at,
          read,
          from,
          post_id,
          comment_id,
          extra,
          profiles:from (full_name, avatar_url)
        `)
        .eq("to", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setNotifications(notifs || []);

      // Count unread
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("to", currentUser.id)
        .eq("read", false);

      setUnreadCount(count || 0);
    };

    loadData();

    // live updates
    const channel = supabase
      .channel("nav-notifs")
      .on(
        "postgres_changes",
        { event: "*", table: "notifications", schema: "public" },
        () => loadData()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  // -------------------------------------------------------
  // FORMAT NOTIFICATION MESSAGE
  // -------------------------------------------------------
  const formatMessage = (n: any) => {
    switch (n.type) {
      case "mention":
        return "mentioned you in a comment";
      case "comment_reply":
        return "replied to your comment";
      case "post_like":
        return "liked your post";
      case "comment_like":
        return "liked your comment";
      default:
        return "sent you a notification";
    }
  };

  return (
    <div className="w-full border-b border-blue-700 sticky top-0 z-30 bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-900">
          <Image src="/logo.png" width={40} height={40} alt="logo" className="rounded-full" />
        </Link>

        {user ? (
          <div className="flex items-center gap-4 relative">

            {/* FEED */}
            <Link
              href="/feed"
              className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200"
            >
              <PhotoIcon className="h-6 w-6 text-blue-700" />
            </Link>

            {/* ------------------------------------------------------
            APP GRID
            ------------------------------------------------------ */}
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
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-blue-900">
                      <HomeIcon className="h-5 w-5 text-blue-600" /> Dashboard
                    </Link>

                    <Link href="/events" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-blue-900">
                      <CalendarDaysIcon className="h-5 w-5 text-blue-600" /> Events
                    </Link>

                    <Link href="/saved-events" className="flex items-center gap-2 px-4 py-2 hover:bg-blue-50 text-blue-900">
                      <BookmarkIcon className="h-5 w-5 text-blue-600" /> Saved Events
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* CHAT */}
            <Link href="/chat" className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200">
              <ChatBubbleOvalLeftEllipsisIcon className="h-6 w-6 text-blue-700" />
            </Link>

            {/* ------------------------------------------------------
              NOTIFICATIONS ICON + DROPDOWN
            ------------------------------------------------------ */}
            <div className="relative">
              <motion.button
                className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 border border-blue-200 relative"
                onClick={() => {
                  setNotificationMenuOpen(!notificationMenuOpen);
                  setProfileMenuOpen(false);
                  setGridMenuOpen(false);
                }}
                animate={unreadCount > 0 ? { rotate: [0, -15, 15, -10, 10, 0] } : {}}
                transition={{ duration: 0.6 }}
              >
                <BellIcon className="h-6 w-6 text-blue-700" />

                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </motion.button>

              <AnimatePresence>
                {notificationMenuOpen && (
                  <motion.div
                    className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50"
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
                          <motion.li
                            key={n.id}
                            whileHover={{ scale: 1.02, backgroundColor: "#f0f9ff" }}
                            className="p-3 border-b cursor-pointer"
                          >
                            <Link href="/notifications">
                              <div className="flex items-center gap-3">
                                {/* Avatar */}
                                {n.profiles?.avatar_url ? (
                                  <Image
                                    src={n.profiles.avatar_url}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                    alt="avatar"
                                  />
                                ) : (
                                  <div className="w-10 h-10 bg-gray-300 rounded-full" />
                                )}

                                <div className="flex-1">
                                  <span className="font-semibold text-blue-900">
                                    {n.profiles?.full_name}
                                  </span>{" "}
                                  <span className="text-sm">{formatMessage(n)}</span>
                                  <p className="text-xs text-gray-500">
                                    {new Date(n.created_at).toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </motion.li>
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

            {/* ------------------------------------------------------
              PROFILE BUTTON + MENU
            ------------------------------------------------------ */}
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
                      width={40}
                      height={40}
                      alt="avatar"
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
            <Link href="/auth" className="btn text-blue-900 border border-blue-700">Login</Link>
            <Link href="/auth" className="btn btn-primary">Sign up</Link>
          </div>
        )}
      </div>
    </div>
  );
}
