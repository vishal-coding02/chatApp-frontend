importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js",
);

importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBzOboRsjRsAJWN7R0YOEOo8YelQvW2Xnk",
  authDomain: "chat-app-notifications-3db88.firebaseapp.com",
  projectId: "chat-app-notifications-3db88",
  messagingSenderId: "1074750633300",
  appId: "1:1074750633300:web:4f07f9e6c3443f9f1dc4c1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const title = payload.data?.title || "New Message";

  const body = payload.data?.body || "";

  const data = payload.data || {};

  self.registration.showNotification(title, {
    body,
    icon: "/logo.png",
    data,
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(clients.openWindow("/"));
});
