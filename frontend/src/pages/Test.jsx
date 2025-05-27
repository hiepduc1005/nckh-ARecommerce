import React, { useState, useEffect, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketTest = () => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [userId, setUserId] = useState("fd2d52b5-069a-4cf1-9ebc-f72b52fbf5ae");
  const [notifications, setNotifications] = useState([]);
  const clientRef = useRef(null);

  useEffect(() => {
    // Cleanup khi component unmount
    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, []);

  const connect = () => {
    // Tạo STOMP client với SockJS
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/chat"),
      connectHeaders: {
        // Có thể thêm headers nếu cần authentication
      },
      debug: function (str) {
        console.log("STOMP: " + str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function (frame) {
      console.log("Connected: " + frame);
      setConnected(true);

      // Subscribe đến topic chung
      client.subscribe(
        "/topic/fd2d52b5-069a-4cf1-9ebc-f72b52fbf5ae",
        function (message) {
          const parsedMessage = JSON.parse(message.body);
          console.log("Received from topic:", parsedMessage);
          setMessages((prev) => [
            ...prev,
            {
              type: "topic",
              content: parsedMessage,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }
      );

      // Subscribe đến queue cá nhân cho notifications
      client.subscribe(`/queue/${userId}`, function (message) {
        console.log("Received notification:", message.body);
        setNotifications((prev) => [
          ...prev,
          {
            content: message.body,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      });

      // Subscribe đến queue chung
      client.subscribe("/queue/notifications", function (message) {
        console.log("Received from queue:", message.body);
        setMessages((prev) => [
          ...prev,
          {
            type: "queue",
            content: message.body,
            timestamp: new Date().toLocaleTimeString(),
          },
        ]);
      });
    };

    client.onStompError = function (frame) {
      console.error("Broker reported error: " + frame.headers["message"]);
      console.error("Additional details: " + frame.body);
    };

    client.onWebSocketError = function (error) {
      console.error("WebSocket error:", error);
    };

    client.onDisconnect = function () {
      console.log("Disconnected");
      setConnected(false);
    };

    clientRef.current = client;
    client.activate();
  };

  const disconnect = () => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      setConnected(false);
      setMessages([]);
      setNotifications([]);
    }
  };

  const sendMessage = () => {
    if (clientRef.current && connected && inputMessage.trim()) {
      // Gửi message đến server
      clientRef.current.publish({
        destination: "/app/chat",
        body: JSON.stringify({
          content: inputMessage,
          sender: userId,
          timestamp: new Date(),
        }),
      });
      setInputMessage("");
    }
  };

  const testServerEndpoint = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/notifications/test"
      );
      const result = await response.text();
      console.log("Server test result:", result);
      setMessages((prev) => [
        ...prev,
        {
          type: "server-test",
          content: `Server response: ${result}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error("Error testing server endpoint:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "error",
          content: `Error: ${error.message}`,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          STOMP WebSocket Test
        </h1>

        {/* Connection Controls */}
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={connect}
            disabled={connected}
            className={`px-4 py-2 rounded font-medium ${
              connected
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Connect
          </button>
          <button
            onClick={disconnect}
            disabled={!connected}
            className={`px-4 py-2 rounded font-medium ${
              !connected
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-red-500 text-white hover:bg-red-600"
            }`}
          >
            Disconnect
          </button>
          <div
            className={`px-3 py-1 rounded text-sm font-medium ${
              connected
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {connected ? "Connected" : "Disconnected"}
          </div>
        </div>

        {/* User ID Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User ID (for personal notifications):
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your user ID"
          />
        </div>

        {/* Test Server Endpoint */}
        <button
          onClick={testServerEndpoint}
          className="mb-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 font-medium"
        >
          Test Server Endpoint (/test)
        </button>
      </div>

      {/* Message Input */}
      {connected && (
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message here..."
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-medium"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Messages Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Messages */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            General Messages
          </h2>
          <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500">No messages yet...</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} className="mb-2 p-2 bg-white rounded border">
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        msg.type === "topic"
                          ? "bg-blue-100 text-blue-800"
                          : msg.type === "queue"
                          ? "bg-green-100 text-green-800"
                          : msg.type === "server-test"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {msg.type}
                    </span>
                    <span className="text-xs text-gray-500">
                      {msg.timestamp}
                    </span>
                  </div>
                  <div className="mt-1 text-sm">
                    {typeof msg.content === "string"
                      ? msg.content
                      : JSON.stringify(msg.content)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Personal Notifications */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Personal Notifications
          </h2>
          <div className="bg-yellow-50 rounded-lg p-4 h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications yet...</p>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={index}
                  className="mb-2 p-2 bg-yellow-100 rounded border"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                      notification
                    </span>
                    <span className="text-xs text-gray-500">
                      {notification.timestamp}
                    </span>
                  </div>
                  <div className="mt-1 text-sm">{notification.content}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">
          Debug Info:
        </h3>
        <div className="text-xs text-gray-600 space-y-1">
          <div>WebSocket URL: ws://localhost:8080/chat</div>
          <div>User ID: {userId}</div>
          <div>Subscriptions:</div>
          <ul className="ml-4 list-disc">
            <li>/topic/messages (broadcast messages)</li>
            <li>/user/{userId}/queue/notifications (personal notifications)</li>
            <li>/queue/notifications (general queue)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WebSocketTest;
