import React, { useState } from 'react';
import { FaMoon, FaSun, FaBell, FaClock } from 'react-icons/fa';
import '../Styles/Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    darkMode: false,
    reminders: true,
    notifications: true,
    emailNotifications: true,
    pushNotifications: true
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="settings-page">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-8">Settings</h2>

        {/* Theme Settings */}
        <div className="settings-section mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Theme Settings</h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {settings.darkMode ? <FaMoon className="text-gray-600" /> : <FaSun className="text-yellow-500" />}
                <span>Dark Mode</span>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={settings.darkMode}
                  onChange={() => handleToggle('darkMode')}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        {/* Reminder Settings */}
        <div className="settings-section mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Reminder Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaClock className="text-blue-500" />
                  <span>Enable Reminders</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.reminders}
                    onChange={() => handleToggle('reminders')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaBell className="text-green-500" />
                  <span>Enable Notifications</span>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={() => handleToggle('notifications')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="settings-section">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Email Notifications</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle('emailNotifications')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span>Push Notifications</span>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleToggle('pushNotifications')}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 