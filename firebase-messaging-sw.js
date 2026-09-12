
importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/12.2.1/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCqrrsFXVqgVDGsO-JTZiKa2N8lzDBqkM0",
  authDomain: "fazal-e-karm.firebaseapp.com",
  projectId: "fazal-e-karm",
  storageBucket: "fazal-e-karm.firebasestorage.app",
  messagingSenderId: "768507616623",
  appId: "1:768507616623:web:c0a43a292762d814905c9a"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {

  const title = payload.notification?.title || "🕌 Azaan Booking";

  const options = {
    body: payload.notification?.body || "Azaan booking available hai.",
    
    icon: "/Fazal-e-karam/3859.png",
    
    badge: "/Fazal-e-karam/3859.png",

    // Notification ko screen par zyada der tak rakhne ka request
    requireInteraction: true,

    // Stronger vibration pattern
    vibrate: [400, 200, 400, 200, 800, 300, 800],

    // Same notification ko update karne ke liye
    tag: "azaan-booking",

    // New notification par dobara alert/vibration
    renotify: true
  };

  self.registration.showNotification(title, options);
});


// Notification par tap karne par app open karo
self.addEventListener("notificationclick", (event) => {

  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then((clientList) => {

      for (const client of clientList) {
        if ("focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(
          "https://pathan-coder.github.io/Fazal-e-karam/"
        );
      }

    })
  );
});
