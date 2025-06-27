import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const CALENDAR_API_SCOPE = 'https://www.googleapis.com/auth/calendar.readonly';

function GoogleCalendarIntegration({ onEventsLoaded }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState([]);

  const handleSuccess = async (credentialResponse) => {
    const { access_token } = credentialResponse;
    setIsAuthenticated(true);

    try {
      // Fetch calendar events
      const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
      }

      const data = await response.json();
      const formattedEvents = data.items.map(event => ({
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        description: event.description,
        location: event.location,
        source: 'google'
      }));

      setEvents(formattedEvents);
      onEventsLoaded(formattedEvents);
    } catch (error) {
      console.error('Error fetching calendar events:', error);
    }
  };

  const handleError = () => {
    console.error('Google Calendar login failed');
    setIsAuthenticated(false);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        {!isAuthenticated ? (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            scope={CALENDAR_API_SCOPE}
            useOneTap
          />
        ) : (
          <div style={{ 
            backgroundColor: '#4285f4', 
            color: 'white', 
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            display: 'inline-block'
          }}>
            Connected to Google Calendar
          </div>
        )}
      </GoogleOAuthProvider>
    </div>
  );
}

export default GoogleCalendarIntegration; 