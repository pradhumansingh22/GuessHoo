"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

export type WebSocketContextType = {
  sendMessage: (type: string, data?: any) => void;
  socket: WebSocket | null;
  lastMessage: any;
};

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) throw new Error("WebSocketContext not found");
  return context;
};

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");
    ws.onopen = () => {
      console.log("Connected to websocket server");
      setSocket(ws);
    };
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setLastMessage(msg);
    };

    ws.onerror = (err) => console.log("WebSocket error", err);
    ws.onclose = () => console.warn("WebSocket disconnected");

    return () => ws.close();
  }, []);

  const sendMessage = (type: string, data:any) => {
    if (socket?.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type, data }));
    } else {
      console.warn("WebSocket not open, cannot send:", type);
    }
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, socket, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};
