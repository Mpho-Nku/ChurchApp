export async function registerPush() {
  if (!("serviceWorker" in navigator)) return null;
  if (!("PushManager" in window)) return null;

  // register SW
  const sw = await navigator.serviceWorker.register("/sw.js");

  // ask permission
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return null;

  const subscription = await sw.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  });

  // save to supabase
  const res = await fetch("/api/register-device", {
    method: "POST",
    body: JSON.stringify(subscription),
  });

  return subscription;
}
