import { useEffect } from "react";
import { useSelector } from "react-redux";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase/firebase";
import api from "../api/axios";

export const usePushNotification = () => {
  const accessToken = useSelector((state: any) => state.auth.jwtToken);

  const getDeviceInfo = () => {
    const ua = navigator.userAgent;
    if (/android/i.test(ua)) return "android";
    if (/iphone|ipad/i.test(ua)) return "ios";
    if (/windows/i.test(ua)) return "windows";
    if (/mac/i.test(ua)) return "mac";
    return "unknown";
  };

  useEffect(() => {
    if (!accessToken) return;

    const initPush = async () => {
      try {
        if (!("serviceWorker" in navigator) || !("Notification" in window)) {
          return;
        }

        const registration = await navigator.serviceWorker.register(
          "/firebase-messaging-sw.js",
        );

        await navigator.serviceWorker.ready;

        const permission = await Notification.requestPermission();
        if (permission !== "granted") return;

        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (!token) return;

        await api.post(
          "/api/notification/save-token",
          { fcmToken: token, device: getDeviceInfo() },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        console.log("Push notification setup complete");
      } catch (error) {
        console.error("Push setup error:", error);
      }
    };

    initPush();
  }, [accessToken]);
};
