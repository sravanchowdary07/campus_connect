import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [liveNotifications, setLiveNotifications] = useState([]);

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      transports: ['websocket', 'polling']
    });

    setSocket(newSocket);

    newSocket.on('new_announcement', (data) => {
      setLiveNotifications((prev) => [
        { id: Date.now(), text: `📢 New Announcement: ${data.title}`, type: 'announcement', data },
        ...prev.slice(0, 9)
      ]);
    });

    newSocket.on('new_event', (data) => {
      setLiveNotifications((prev) => [
        { id: Date.now(), text: `🎪 New Campus Event: ${data.title}`, type: 'event', data },
        ...prev.slice(0, 9)
      ]);
    });

    newSocket.on('complaint_status_update', (data) => {
      setLiveNotifications((prev) => [
        { id: Date.now(), text: `🛠️ Complaint Status Updated: ${data.title}`, type: 'complaint', data },
        ...prev.slice(0, 9)
      ]);
    });

    return () => newSocket.close();
  }, []);

  const dismissNotification = (id) => {
    setLiveNotifications((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <SocketContext.Provider value={{ socket, liveNotifications, dismissNotification }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
