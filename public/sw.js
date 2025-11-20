self.addEventListener("push", function (event) {
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(data.title || "New Notification", {
      body: data.body,
      icon: data.icon || "/icon.png",
      data: { url: data.url },
      badge: "/badge.png",
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
