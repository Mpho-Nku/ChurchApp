'use client';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';
import { BellIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

export default function NavBar() {
  const [user, setUser] = useState<any>(null);
  const [open, setOpen] = useState(false); // drawer toggle
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unread, setUnread] = useState(false);
  const [weekendEvents, setWeekendEvents] = useState<any[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  // 🔔 Fetch notifications + realtime
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('events')
        .select('id,title,start_time,church_id')
        .gt('start_time', new Date().toISOString()) // filter out past events
        .order('start_time', { ascending: true })
        .limit(10);

      const events = data || [];
      setNotifications(events);

      const seen = JSON.parse(localStorage.getItem('seenNotifications') || '[]');
      const unseen = events.some((e) => !seen.includes(e.id));
      setUnread(unseen);
    };

    fetchNotifications();

    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications((prev) => [payload.new, ...prev].slice(0, 10));
            setUnread(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // 📅 Weekend events
  useEffect(() => {
    if (!user) return;

    const now = new Date();

    const friday = new Date(now);
    friday.setDate(now.getDate() - now.getDay() + 5);
    friday.setHours(0, 0, 0, 0);

    const sunday = new Date(friday);
    sunday.setDate(friday.getDate() + 2);
    sunday.setHours(23, 59, 59, 999);

    supabase
      .from('events')
      .select('id,title,start_time,church_id')
      .gte('start_time', friday.toISOString())
      .lte('start_time', sunday.toISOString())
      .order('start_time', { ascending: true })
      .then(({ data }) => setWeekendEvents(data || []));
  }, [user]);

  const markAsRead = () => {
    const seen = notifications.map((n) => n.id);
    localStorage.setItem('seenNotifications', JSON.stringify(seen));
    setUnread(false);
  };

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    location.reload();
  };

  return (
    <div className="w-full border-b border-blue-800 sticky top-0 z-30 backdrop-blur bg-white/80">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-blue-900">
          <Image src="/logo.png" width={40} height={40} alt="logo" className="rounded-full" />
          St John AFM
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {!user ? (
            <>
              <Link href="/auth" className="btn">Login</Link>
              <Link href="/auth" className="btn btn-primary">Sign up</Link>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="btn">Dashboard</Link>
              <Link href="/saved-events" className="btn">Saved Events</Link>
              <button className="btn" onClick={signOut}>Sign out</button>

              {/* 🔔 Notification Bell */}
              <button
                className="relative p-2"
                onClick={() => {
                  setOpen(true);
                  markAsRead();
                }}
              >
                <BellIcon className={`h-6 w-6 ${unread ? 'text-blue-600' : 'text-gray-400'}`} />
                {unread && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </>
          )}

          {/* Hamburger */}
          <button className="md:hidden text-blue-900" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* 🔔 Notifications Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 z-50 flex justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white w-full sm:w-96 h-full shadow-lg flex flex-col"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="font-bold text-lg text-blue-900">Notifications</h2>
                <button onClick={() => setOpen(false)}>
                  <XMarkIcon className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              {/* Notifications list */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-3 font-semibold text-blue-900">Upcoming Events</div>
                <ul className="divide-y">
                  {notifications.map((n) => (
                    <li key={n.id} className="p-3 hover:bg-gray-50">
                      <Link href={`/churches/${n.church_id}`} onClick={() => setOpen(false)}>
                        <div className="font-medium text-blue-800">{n.title}</div>
                        <div className="text-xs text-gray-500">
                          {new Date(n.start_time).toLocaleString()}
                        </div>
                      </Link>
                    </li>
                  ))}
                  {notifications.length === 0 && (
                    <li className="p-3 text-sm text-gray-500">No new events.</li>
                  )}
                </ul>

                {weekendEvents.length > 0 && (
                  <>
                    <div className="p-3 font-semibold text-blue-900 border-t">This Weekend</div>
                    <ul className="divide-y">
                      {weekendEvents.map((ev) => (
                        <li key={ev.id} className="p-3 hover:bg-gray-50">
                          <Link href={`/churches/${ev.church_id}`} onClick={() => setOpen(false)}>
                            <div className="font-medium text-blue-800">{ev.title}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(ev.start_time).toLocaleString()}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed top-0 right-0 w-64 h-full bg-white shadow-lg z-50 p-6 space-y-4"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
          >
            {!user ? (
              <>
                <Link href="/auth" className="btn w-full" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link href="/auth" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>Sign up</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="btn w-full" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/saved-events" className="btn w-full" onClick={() => setMenuOpen(false)}>Saved Events</Link>
                <button className="btn w-full" onClick={signOut}>Sign out</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}