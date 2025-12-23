import { WebSocketProvider } from "@/lib/context/webSocketContext"

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <WebSocketProvider>{children}</WebSocketProvider>;
};