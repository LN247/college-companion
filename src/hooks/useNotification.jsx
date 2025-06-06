// src/hooks/useNotifications.js
import { useEffect } from "react";
import { requestForToken, onMessageListener } from "../firebase";
import axios from "axios";

const useNotifications = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Request permission
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          // Get token
          const token = await requestForToken();
          if (token) {
            // Send token to backend
            await axios.post(
              "/api/save-fcm-token/",
              { token },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
          }
        }

        // Listen for foreground messages
        onMessageListener()
          .then((payload) => {
            console.log("Foreground notification:", payload);
            // Display notification UI
          })
          .catch((err) => console.log("Failed: ", err));
      } catch (error) {
        console.error("Notification setup error:", error);
      }
    };

    setupNotifications();
  }, []);

  return null;
};

export default useNotifications;
