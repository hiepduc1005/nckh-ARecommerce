import React, { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { SOCKET_URL } from "../utils/ultils";

export const useStompSocket = () => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(SOCKET_URL),

      reconnectDelay: 5000,
      onConnect: () => {
        console.log("STOMP connected");
        setConnected(true);
      },
      onDisconnect: () => {
        console.log("STOMP disconnected");
        setConnected(false);
      },

      debug: (str) => console.log(str),
    });

    stompClient.activate();
    clientRef.current = stompClient;
  }, []);

  return { client: clientRef.current, connected };
};
