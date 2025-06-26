importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBNz53Rg2gy7pYW7A440Idtqy4KRfYhn_Q",
  authDomain: "college-companion-ai.firebaseapp.com",
  projectId: "college-companion-ai",
  storageBucket: "college-companion-ai.firebasestorage.app",
  messagingSenderId: "1003153371617",
  appId: "1:1003153371617:web:8a41a8eb434f39ab3ee2a0",
  measurementId: "G-BV72NJJNY7"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || "/images/college-logo.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { data } = event.notification;
  if (data?.type === "assignment") {
    event.waitUntil(clients.openWindow("/assignments/" + data.assignmentId));
  } else if (data?.type === "announcement") {
    event.waitUntil(clients.openWindow("/announcements"));
  } else {
    event.waitUntil(clients.openWindow("/"));
  }
});
