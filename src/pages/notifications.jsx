import React from "react";
import { Bell } from "lucide-react";
import {useState,useEffect} from "react";


const styles = {
  notificationsContainer: {
    background: 'black',
    minHeight: '100vh',
  },
  notificationsHeader: {
    background: '#f68712',
    color: '#ffffff',
    fontSize: '2rem',
    fontWeight: 'bold',
    padding: '1.5rem 0',
    textAlign: 'center',
    letterSpacing: '1px',
    boxShadow: '0 2px 8px rgba(6, 18, 61, 0.05)',
  },
  notificationsMain: {
    padding: '2rem 1rem',
    maxWidth: '100%',
    width: '600px',
    margin: '0 auto',
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '5rem',
    textAlign: 'center',
    padding: '0 1rem',
  },
  emptyStateH2: {
    color: '#ffffff',
    marginTop: '1.5rem',
    fontSize: '3rem',
    fontWeight: '600',
  },
  emptyStateP: {
    color: '#ffffff',
    marginTop: '1.5rem',
    fontSize: '5rem',
  },
  notificationCard: {
    display: 'flex',
    alignItems: 'flex-start',
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(6, 18, 61, 0.08)',
    marginBottom: '1.5rem',
    padding: '1rem 1.5rem',
    borderLeft: '5px solid #f68712',
    textAlign: 'left',
    flexWrap: 'wrap',
    width: '100%',
    boxSizing: 'border-box',
  },
  notificationIcon: {
    marginRight: '1rem',
    marginTop: '0.2rem',
    flexShrink: 0,
  },
  notificationContent: {
    flexGrow: 1,
    minWidth: 0,
  },
  notificationTitle: {
    color: '#06123d',
    fontWeight: '700',
    fontSize: '1.1rem',
    wordBreak: 'break-word',
  },
  notificationMessage: {
    color: '#06123d',
    marginTop: '0.2rem',
    wordBreak: 'break-word',
  },
  notificationTime: {
    color: 'black',
    fontSize: '0.85rem',
    marginTop: '0.5rem',
  }
};

export default function Notifications() {

   const [notifications, setNotifications] = useState([]);


  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("notifications")) || [];
    setNotifications(stored);
  }, []);


  return (
    <div style={styles.notificationsContainer}>
      <style>
        {`
          @media (max-width: 768px) {
            .notifications-header {
              font-size: 1.5rem !important;
              padding: 1rem 0 !important;
            }
            .notifications-main {
              padding: 1rem 0.5rem !important;
              width: 100% !important;
            }
            .notification-card {
              flex-direction: column !important;
              padding: 1rem !important;
            }
            .notification-title {
              font-size: 1rem !important;
            }
            .empty-state {
              margin-top: 2.5rem !important;
              padding: 0 1rem !important;
            }
            .empty-state h2 {
              font-size: 1.2rem !important;
            }
            .empty-state p {
              font-size: 0.95rem !important;
            }
          }

          @media (max-width: 480px) {
            .notifications-header {
              font-size: 1.2rem !important;
            }
            .notification-title {
              font-size: 0.95rem !important;
            }
            .empty-state h2 {
              font-size: 1.1rem !important;
            }
            .empty-state p {
              font-size: 0.9rem !important;
            }
          }
        `}
      </style>

      <header className="notifications-header" style={styles.notificationsHeader}>
        Notifications
      </header>

      <main className="notifications-main" style={styles.notificationsMain}>
        {notifications.length === 0 ? (
          <div className="empty-state" style={styles.emptyState}>
            <Bell size={500} color="#f68712" strokeWidth={2.5} />
            <h2 style={styles.emptyStateH2}>No notifications yet</h2>
            <p style={styles.emptyStateP}>You're all caught up!</p>
          </div>
        ) : (
          notifications.map((notif, idx) => (
            <div className="notification-card" style={styles.notificationCard} key={idx}>
              <div style={styles.notificationIcon}>
                <Bell size={24} color="#f68712" />
              </div>
              <div style={styles.notificationContent}>
                <div className="notification-title" style={styles.notificationTitle}>{notif.title}</div>
                <div className="notification-message" style={styles.notificationMessage}>{notif.message}</div>
                <div className="notification-time" style={styles.notificationTime}>{notif.time}</div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
