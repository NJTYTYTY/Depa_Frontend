/* sw.js — Minimal PWA Service Worker for ngrok compatibility */

// บังคับ skip waiting (ทันทีที่ install เสร็จ ใช้ SW ใหม่เลย)
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

// Claim clients ให้ SW คุมทุกหน้าโดยทันที
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
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
