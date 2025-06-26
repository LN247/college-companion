import { useEffect, useRef, useCallback, useState } from 'react';

const useWebSocket = (groupId, onMessageReceived, onReadReceipt) => {
  const socketRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  const sendMessage = useCallback((message, senderId) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'chat_message',
        content: message,
        sender_id: senderId,
      }));
    }
  }, []);

  const sendReadReceipt = useCallback((messageId) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'message_read',
        message_id: messageId,
      }));
    }
  }, []);

  useEffect(() => {
    if (!groupId) {
      setConnectionStatus('disconnected');
      return;
    }

    setConnectionStatus('connecting');
    
    // Connect to WebSocket server using the Django Channels URL pattern
    socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${groupId}/`);

    socketRef.current.onopen = () => {
      setConnectionStatus('connected');
      console.log('WebSocket connected to group:', groupId);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data);
        
        if (data.type === 'chat_message' && data.message) {
          onMessageReceived(data);
        } else if (data.type === 'read_receipt') {
          onReadReceipt(data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus('error');
    };

    socketRef.current.onclose = (event) => {
      console.log('WebSocket disconnected:', event.code, event.reason);
      setConnectionStatus('disconnected');
    };

    // Clean up on unmount or when groupId changes
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [groupId, onMessageReceived, onReadReceipt]);

  return { 
    sendMessage, 
    sendReadReceipt,
    connectionStatus 
  };
};

export default useWebSocket;