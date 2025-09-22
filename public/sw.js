/* sw.js — Minimal PWA Service Worker for ngrok compatibility */

// บังคับ skip waiting (ทันทีที่ install เสร็จ ใช้ SW ใหม่เลย)
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Claim clients ให้ SW คุมทุกหน้าโดยทันที
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Push notification event listener
self.addEventListener("push", (event) => {
  console.log("Push event received:", event);
  
  if (event.data) {
    try {
      const data = event.data.json();
      console.log("Push data:", data);
      
      const options = {
        body: data.body || "คุณได้รับการแจ้งเตือนใหม่",
        icon: data.icon || "/icons/icon-192x192.png",
        badge: data.badge || "/icons/icon-72x72.png",
        image: data.image,
        data: {
          ...data.data,
          url: data.url  // เก็บ URL ไว้ใน data object
        },
        tag: data.tag || "shrimp-sense-notification",
        requireInteraction: data.requireInteraction || false,
        silent: data.silent || false,
        vibrate: data.vibrate || [200, 100, 200],
        actions: data.actions || [
          {
            action: "view",
            title: "ดู",
            icon: "/icons/icon-72x72.png"
          },
          {
            action: "close",
            title: "ปิด",
            icon: "/icons/icon-72x72.png"
          }
        ]
      };
      
      event.waitUntil(
        self.registration.showNotification(data.title || "ShrimpSense", options)
      );
    } catch (error) {
      console.error("Error parsing push data:", error);
      
      // Fallback notification
      event.waitUntil(
        self.registration.showNotification("ShrimpSense", {
          body: "คุณได้รับการแจ้งเตือนใหม่",
          icon: "/icons/icon-192x192.png",
          badge: "/icons/icon-72x72.png",
          tag: "shrimp-sense-notification"
        })
      );
    }
  } else {
    // No data, show default notification
    event.waitUntil(
      self.registration.showNotification("ShrimpSense", {
        body: "คุณได้รับการแจ้งเตือนใหม่",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-72x72.png",
        tag: "shrimp-sense-notification"
      })
    );
  }
});

// Notification click event listener
self.addEventListener("notificationclick", (event) => {
  console.log("Notification clicked:", event);
  
  event.notification.close();
  
  if (event.action === "close") {
    return;
  }
  
  // Default action or "view" action
  const urlToOpen = event.notification.data?.url || "/";
  
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === urlToOpen && "focus" in client) {
            return client.focus();
          }
        }
        
        // If no existing window, open a new one
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      })
  );
});

// Background sync for offline functionality
self.addEventListener("sync", (event) => {
  console.log("Background sync:", event.tag);
  
  if (event.tag === "background-sync") {
    event.waitUntil(
      // Handle background sync tasks here
      Promise.resolve()
    );
  }
});

// Minimal fetch handler — ให้ทำงานปกติ เว้นไม่ต้องยุ่งกับ static ที่สำคัญ
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // ไม่ intercept manifest, sw.js, icons, และไฟล์สำคัญอื่นๆ
  if (
    url.pathname === "/manifest.json" ||
    url.pathname === "/sw.js" ||
    url.pathname.startsWith("/icons/") ||
    url.pathname.startsWith("/_next/") ||
    url.pathname.includes(".js") ||
    url.pathname.includes(".css") ||
    url.pathname.includes(".png") ||
    url.pathname.includes(".jpg") ||
    url.pathname.includes(".svg") ||
    url.pathname.includes(".ico") ||
    url.pathname.includes(".woff") ||
    url.pathname.includes(".woff2") ||
    url.pathname.includes(".ttf") ||
    url.pathname.includes(".eot")
  ) {
    return; // ปล่อยผ่านเลย ไม่ต้อง intercept
  }

  // สำหรับ navigation requests (หน้าเว็บ) ให้ใช้ network first
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          // ถ้า network ล้มเหลว ให้แสดง offline page
          return caches.match('/offline.html');
        })
    );
    return;
  }

  // สำหรับ API requests ให้ใช้ network only
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return new Response('API offline', { status: 503 });
        })
    );
    return;
  }

  // ถ้าอยาก offline cache เพิ่ม ค่อยใส่ logic ตรงนี้
  // ตอนนี้ปล่อยให้ browser fetch ตามปกติ
});
