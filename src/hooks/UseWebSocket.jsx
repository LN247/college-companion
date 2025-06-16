import { useEffect, useRef, useCallback } from 'react';

const useWebSocket = (roomName, onMessageReceived, onReadReceipt) => {
  const socketRef = useRef(null);

  const sendMessage = useCallback((message, senderId) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'chat_message',
        message,
        sender_id: senderId,
        room: roomName,
      }));
    }
  }, [roomName]);

  const sendReadReceipt = useCallback((messageId) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'read_receipt',
        message_id: messageId,
        room: roomName,
      }));
    }
  }, [roomName]);

  useEffect(() => {
    if (!roomName) return;

    // Connect to WebSocket server (adjust the URL and path as needed)
    socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);

    socketRef.current.onopen = () => {
      // Optionally send a join message if your backend expects it
      // socketRef.current.send(JSON.stringify({ type: 'join', room: roomName }));
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'chat_message') {
        onMessageReceived(data);
      } else if (data.type === 'read_receipt') {
        onReadReceipt(data);
      }
    };

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        // Optionally send a leave message if your backend expects it
        // socketRef.current.send(JSON.stringify({ type: 'leave', room: roomName }));
        socketRef.current.close();
      }
    };
  }, [roomName, onMessageReceived, onReadReceipt]);

  return { sendMessage, sendReadReceipt };
};

export default useWebSocket;