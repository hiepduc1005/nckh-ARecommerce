import { useState, useEffect, useRef } from "react";
import { Send, Loader, Bot, User, X, LogIn } from "lucide-react";
import "../assets/styles/components/AIChatbox.scss";
import useAuth from "../hooks/UseAuth";
import { createMessage, getMessageByUser } from "../api/messageApi";

export default function AIChatbox() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const { user, token } = useAuth();

  // Load messages when component mounts or chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0 && user && token) {
      loadMessages();
    }
  }, [isOpen, user, token]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current && user && token) {
      inputRef.current.focus();
    }
  }, [isOpen, user, token]);

  const loadMessages = async (pageNumber = 0, append = false) => {
    if (loadingMessages || !token) return;

    setLoadingMessages(true);
    try {
      const response = await getMessageByUser(token, pageNumber, 20);

      if (response && response.content) {
        // Sort messages by timestamp (oldest first)
        const sortedMessages = response.content.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        if (append) {
          setMessages((prev) => [...sortedMessages, ...prev]);
        } else {
          setMessages(sortedMessages);
        }

        setHasMore(!response.last);
        setPage(pageNumber);
      } else {
        // Handle case when API returns null or no data
        setHasMore(false);
        if (!append) {
          setMessages([]);
        }
      }
    } catch (error) {
      console.error("Error loading messages:", error);
      setHasMore(false);
      if (!append) {
        setMessages([]);
      }
    } finally {
      setLoadingMessages(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading || !user || !token) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Save user message first
    const userMessageData = {
      role: "USER",
      userId: user.id,
      content: input.trim(),
    };

    const userQuery = input.trim();
    setInput("");
    setIsLoading(true);

    try {
      // Save user message to database
      const savedUserMessage = await createMessage(userMessageData, token);

      if (savedUserMessage) {
        // Add user message to UI
        setMessages((prev) => [...prev, savedUserMessage]);
      } else {
        // If save failed, still show message in UI but mark as failed
        setMessages((prev) => [
          ...prev,
          {
            ...userMessageData,
            id: `failed-${Date.now()}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }

      // Add initial AI message placeholder
      const tempAiMessage = {
        id: `temp-${Date.now()}`,
        role: "ASSISTANT",
        content: "",
        isLoading: true,
        isTemporary: true,
      };

      setMessages((prev) => [...prev, tempAiMessage]);
      setIsStreaming(true);

      // Call the AI API
      const response = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ query: userQuery }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle SSE streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let aiResponseContent = "";

      const processStream = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              // Save AI response to database after streaming is complete
              if (aiResponseContent) {
                const aiMessageData = {
                  role: "ASSISTANT",
                  userId: user.id,
                  content: aiResponseContent,
                };

                try {
                  const savedAiMessage = await createMessage(
                    aiMessageData,
                    token
                  );

                  // Replace temporary message with saved message
                  setMessages((prev) => {
                    const updatedMessages = [...prev];
                    const tempIndex = updatedMessages.findIndex(
                      (msg) => msg.isTemporary
                    );
                    if (tempIndex !== -1) {
                      updatedMessages[tempIndex] = savedAiMessage;
                    }
                    return updatedMessages;
                  });
                } catch (saveError) {
                  console.error("Error saving AI message:", saveError);
                  // Keep the temporary message but remove loading state
                  setMessages((prev) => {
                    const updatedMessages = [...prev];
                    const tempIndex = updatedMessages.findIndex(
                      (msg) => msg.isTemporary
                    );
                    if (tempIndex !== -1) {
                      updatedMessages[tempIndex] = {
                        ...updatedMessages[tempIndex],
                        isLoading: false,
                        isTemporary: false,
                      };
                    }
                    return updatedMessages;
                  });
                }
              }

              setIsLoading(false);
              setIsStreaming(false);
              break;
            }

            // Decode the chunk
            const chunk = decoder.decode(value, { stream: true });
            buffer += chunk;

            // Process complete SSE messages (split by double newline)
            const events = buffer.split("\n\n");
            buffer = events.pop() || ""; // Keep incomplete event in buffer

            for (const event of events) {
              const lines = event.split("\n");
              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const dataStr = line.slice(6); // Remove 'data: ' prefix

                  // Check for end of stream
                  if (dataStr === "[DONE]") {
                    // Save AI response to database
                    if (aiResponseContent) {
                      const aiMessageData = {
                        role: "ASSISTANT",
                        userId: user.id,
                        content: aiResponseContent,
                      };

                      try {
                        const savedAiMessage = await createMessage(
                          aiMessageData,
                          token
                        );

                        // Replace temporary message with saved message
                        setMessages((prev) => {
                          const updatedMessages = [...prev];
                          const tempIndex = updatedMessages.findIndex(
                            (msg) => msg.isTemporary
                          );
                          if (tempIndex !== -1) {
                            updatedMessages[tempIndex] = savedAiMessage;
                          }
                          return updatedMessages;
                        });
                      } catch (saveError) {
                        console.error("Error saving AI message:", saveError);
                      }
                    }

                    setIsLoading(false);
                    setIsStreaming(false);
                    return;
                  }

                  try {
                    const data = JSON.parse(dataStr);

                    if (data.error) {
                      // Handle error
                      setMessages((prev) => {
                        const updatedMessages = [...prev];
                        const tempIndex = updatedMessages.findIndex(
                          (msg) => msg.isTemporary
                        );
                        if (tempIndex !== -1) {
                          updatedMessages[tempIndex] = {
                            ...updatedMessages[tempIndex],
                            content:
                              "Xin lỗi, đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.",
                            isLoading: false,
                            isTemporary: false,
                          };
                        }
                        return updatedMessages;
                      });
                      setIsLoading(false);
                      setIsStreaming(false);
                      return;
                    }

                    if (data.chunk !== undefined) {
                      aiResponseContent += data.chunk;

                      // Update the temporary AI message with new chunk
                      setMessages((prev) => {
                        const updatedMessages = [...prev];
                        const tempIndex = updatedMessages.findIndex(
                          (msg) => msg.isTemporary
                        );

                        if (tempIndex !== -1) {
                          updatedMessages[tempIndex] = {
                            ...updatedMessages[tempIndex],
                            content: aiResponseContent,
                            isLoading: false,
                          };
                        }

                        return updatedMessages;
                      });
                    }
                  } catch (parseError) {
                    console.warn("Failed to parse SSE data:", dataStr);
                  }
                }
              }
            }
          }
        } catch (streamError) {
          if (streamError.name === "AbortError") {
            console.log("Stream aborted by user");
            return;
          }

          console.error("Stream processing error:", streamError);
          setMessages((prev) => {
            const updatedMessages = [...prev];
            const tempIndex = updatedMessages.findIndex(
              (msg) => msg.isTemporary
            );
            if (tempIndex !== -1) {
              updatedMessages[tempIndex] = {
                ...updatedMessages[tempIndex],
                content:
                  "Xin lỗi, đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.",
                isLoading: false,
                isTemporary: false,
              };
            }
            return updatedMessages;
          });
          setIsLoading(false);
          setIsStreaming(false);
        }
      };

      await processStream();
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Request aborted by user");
        return;
      }

      console.error("Error:", error);

      // Update the temporary AI message with error
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const tempIndex = updatedMessages.findIndex((msg) => msg.isTemporary);
        if (tempIndex !== -1) {
          updatedMessages[tempIndex] = {
            ...updatedMessages[tempIndex],
            content:
              "Xin lỗi, đã xảy ra lỗi khi kết nối với AI. Vui lòng thử lại sau.",
            isLoading: false,
            isTemporary: false,
          };
        }
        return updatedMessages;
      });

      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey && user && token) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const stopStreaming = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsLoading(false);
      setIsStreaming(false);

      // Update the temporary message to remove loading state
      setMessages((prev) => {
        const updatedMessages = [...prev];
        const tempIndex = updatedMessages.findIndex((msg) => msg.isTemporary);
        if (tempIndex !== -1) {
          updatedMessages[tempIndex] = {
            ...updatedMessages[tempIndex],
            isLoading: false,
          };
        }
        return updatedMessages;
      });
    }
  };

  const loadMoreMessages = () => {
    if (hasMore && !loadingMessages && user && token) {
      loadMessages(page + 1, true);
    }
  };

  return (
    <div className="ai-chatbox">
      {/* Main Chat Container */}
      {isOpen && (
        <div className="chat-container">
          {/* Chat Header */}
          <div className="chat-header">
            <div className="header-title">
              <Bot size={20} className="header-icon" />
              <h3>Trợ lý AI</h3>
              {isStreaming && (
                <span className="streaming-indicator">
                  <Loader size={14} className="spinning" />
                  Đang trả lời...
                </span>
              )}
            </div>
            <button onClick={toggleChat} className="close-button">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="messages-area">
            {/* Check if user is logged in */}
            {!user || !token ? (
              <div className="login-required">
                <LogIn size={48} className="login-icon" />
                <h4>Yêu cầu đăng nhập</h4>
                <p>Vui lòng đăng nhập để sử dụng chatbox</p>
              </div>
            ) : (
              <>
                {/* Load More Button */}
                {hasMore && messages.length > 0 && (
                  <div className="load-more-container">
                    <button
                      onClick={loadMoreMessages}
                      disabled={loadingMessages}
                      className="load-more-button"
                    >
                      {loadingMessages ? (
                        <>
                          <Loader size={16} className="spinning" />
                          Đang tải...
                        </>
                      ) : (
                        "Tải thêm tin nhắn cũ"
                      )}
                    </button>
                  </div>
                )}

                {loadingMessages && messages.length === 0 ? (
                  <div className="loading-messages">
                    <Loader size={32} className="spinning" />
                    <p>Đang tải tin nhắn...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="welcome-message">
                    <Bot size={32} className="welcome-icon" />
                    <p>Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message-wrapper ${message.role?.toLowerCase()}`}
                    >
                      <div className={`message ${message.role?.toLowerCase()}`}>
                        <div className="message-header">
                          {message.role === "ASSISTANT" ? (
                            <Bot size={16} className="sender-icon" />
                          ) : (
                            <User size={16} className="sender-icon" />
                          )}
                          <span className="sender-name">
                            {message.role === "ASSISTANT" ? "Trợ lý AI" : "Bạn"}
                          </span>
                        </div>
                        <div className="message-content">
                          {/* Show loading state for AI messages */}
                          {message.role === "ASSISTANT" &&
                          message.isLoading &&
                          (!message.content || message.content === "") ? (
                            <div className="loading-content">
                              <Loader size={16} className="loading-icon" />
                              Đang suy nghĩ...
                            </div>
                          ) : (
                            <>
                              {message.content}
                              {/* Show typing indicator when AI is streaming and message is empty or very short */}
                              {message.role === "ASSISTANT" &&
                                isStreaming &&
                                message.isTemporary &&
                                (!message.content ||
                                  message.content.length < 3) &&
                                !message.isLoading && (
                                  <span className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                  </span>
                                )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <div className="input-container">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  !user || !token
                    ? "Vui lòng đăng nhập để sử dụng"
                    : "Nhập tin nhắn..."
                }
                className="message-input"
                disabled={isLoading || !user || !token}
              />
              {isStreaming ? (
                <button
                  onClick={stopStreaming}
                  className="stop-button"
                  title="Dừng trả lời"
                  disabled={!user || !token}
                >
                  <X size={18} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="send-button"
                  disabled={!input.trim() || isLoading || !user || !token}
                >
                  {isLoading ? (
                    <Loader size={18} className="loading-icon" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Chat Button */}
      {!isOpen && (
        <button onClick={toggleChat} className="chat-toggle-button">
          <Bot size={24} />
        </button>
      )}
    </div>
  );
}
