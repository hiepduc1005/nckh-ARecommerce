import { useState, useEffect, useRef } from "react";
import { Send, Loader, Bot, User, X, LogIn, Image, Trash2 } from "lucide-react";
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
  const [selectedImages, setSelectedImages] = useState([]); // New state for images
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null); // New ref for file input
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

  // Handle image file selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const maxFiles = 5; // Maximum number of images allowed
    const maxSize = 10 * 1024 * 1024; // 10MB limit per file

    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert("Chỉ cho phép tải lên file hình ảnh!");
        return false;
      }
      if (file.size > maxSize) {
        alert(`File ${file.name} quá lớn. Kích thước tối đa là 10MB.`);
        return false;
      }
      return true;
    });

    if (selectedImages.length + validFiles.length > maxFiles) {
      alert(`Chỉ có thể tải tối đa ${maxFiles} hình ảnh!`);
      return;
    }

    // Convert files to base64 for preview and sending
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target.result,
          name: file.name,
          size: file.size,
        };
        setSelectedImages((prev) => [...prev, imageData]);
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Remove selected image
  const removeImage = (imageId) => {
    setSelectedImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (
      (!input.trim() && selectedImages.length === 0) ||
      isLoading ||
      !user ||
      !token
    )
      return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const messageContent = input.trim();
    const hasImages = selectedImages.length > 0;

    const images = selectedImages.map((img) => img.file);

    const userMessageData = {
      role: "USER",
      userId: user.id,
      content: messageContent || "",
    };

    const formDataCreate = new FormData();
    formDataCreate.append(
      "message",
      new Blob([JSON.stringify(userMessageData)], { type: "application/json" })
    );

    images.forEach((image) => {
      formDataCreate.append("images", image);
    });

    const userQuery = messageContent;
    const imagesToSend = [...selectedImages];

    setInput("");
    setSelectedImages([]);
    setIsLoading(true);

    try {
      const savedUserMessage = await createMessage(formDataCreate, token);
      if (savedUserMessage) {
        setMessages((prev) => [...prev, savedUserMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            ...userMessageData,
            id: `failed-${Date.now()}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }

      const tempAiMessage = {
        id: `temp-${Date.now()}`,
        role: "ASSISTANT",
        content: "",
        isLoading: true,
        isTemporary: true,
      };
      setMessages((prev) => [...prev, tempAiMessage]);
      setIsStreaming(true);

      // --- LOGIC PHÂN TÁCH ENDPOINT ĐÃ ĐƯỢC SỬA LẠI Ở ĐÂY ---
      let endpoint = "";
      let options = {};

      if (hasImages) {
        // TRƯỜNG HỢP 1: GỬI KÈM HÌNH ẢNH
        console.log("Đang gửi yêu cầu có ảnh đến /askimg...");
        endpoint = "http://localhost:5000/askimg";

        const formData = new FormData();
        formData.append("query", userQuery);
        imagesToSend.forEach((image) => {
          formData.append("images", image.file);
        });

        options = {
          method: "POST",
          body: formData, // Trình duyệt tự động đặt Content-Type là multipart/form-data
          signal: abortControllerRef.current.signal,
        };
      } else {
        // TRƯỜNG HỢP 2: CHỈ GỬI VĂN BẢN
        console.log("Đang gửi yêu cầu văn bản đến /ask...");
        endpoint = "http://localhost:5000/ask";

        options = {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Bắt buộc phải có header này
          },
          body: JSON.stringify({ query: userQuery }), // Dữ liệu là JSON
          signal: abortControllerRef.current.signal,
        };
      }

      // Gọi API với endpoint và options đã được quyết định
      const response = await fetch(endpoint, options);

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
                  userId: user?.id,
                  content: aiResponseContent,
                };

                const formData = new FormData();
                formData.append(
                  "message",
                  new Blob([JSON.stringify(aiMessageData)], {
                    type: "application/json",
                  })
                );

                try {
                  const savedAiMessage = await createMessage(formData, token);

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

                      const formData = new FormData();
                      formData.append(
                        "message",
                        new Blob([JSON.stringify(aiMessageData)], {
                          type: "application/json",
                        })
                      );

                      try {
                        const savedAiMessage = await createMessage(
                          formData,
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
                <p>Vui lòng đăng nhập để sử dụng chatbot</p>
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
                  messages?.map((message) => (
                    <div
                      key={message?.id}
                      className={`message-wrapper ${message?.role?.toLowerCase()}`}
                    >
                      <div
                        className={`message ${message?.role?.toLowerCase()}`}
                      >
                        <div className="message-header">
                          {message?.role === "ASSISTANT" ? (
                            <Bot size={16} className="sender-icon" />
                          ) : (
                            <User size={16} className="sender-icon" />
                          )}
                          <span className="sender-name">
                            {message?.role === "ASSISTANT"
                              ? "Trợ lý AI"
                              : "Bạn"}
                          </span>
                        </div>
                        <div className="message-content">
                          {/* Show images if they exist */}
                          {message?.images && message?.images?.length > 0 && (
                            <div className="message-images">
                              {message?.images.map((image, index) => (
                                <div key={image?.id} className="message-image">
                                  <img
                                    src={`http://localhost:8080${image?.imageUrl}`}
                                    alt={image?.name || "Ảnh"}
                                    className="image-preview"
                                  />
                                  {/* <span className="image-info">
                                    {image.name} ({formatFileSize(image.size)})
                                  </span> */}
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Show loading state for AI messages */}
                          {message?.role === "ASSISTANT" &&
                          message.isLoading &&
                          (!message?.content || message?.content === "") ? (
                            <div className="loading-content">
                              <Loader size={16} className="loading-icon" />
                              Đang suy nghĩ...
                            </div>
                          ) : (
                            <>
                              {message?.content}
                              {/* Show typing indicator when AI is streaming and message is empty or very short */}
                              {message?.role === "ASSISTANT" &&
                                isStreaming &&
                                message.isTemporary &&
                                (!message?.content ||
                                  message?.content?.length < 3) &&
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

          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <div className="selected-images-area">
              <div className="selected-images-header">
                <span>Hình ảnh đã chọn ({selectedImages.length}/5)</span>
              </div>
              <div className="selected-images-list">
                {selectedImages.map((image) => (
                  <div key={image?.id} className="selected-image-item">
                    <img
                      src={image?.preview}
                      alt={image?.name}
                      className="selected-image-preview"
                    />
                    <div className="selected-image-info">
                      <span className="image-name">{image?.name}</span>
                      <span className="image-size">
                        {formatFileSize(image?.size)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeImage(image?.id)}
                      className="remove-image-button"
                      title="Xóa hình ảnh"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

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

              {/* Image Upload Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="image-upload-button"
                disabled={
                  isLoading || !user || !token || selectedImages.length >= 5
                }
                title="Tải hình ảnh"
              >
                <Image size={18} />
              </button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageSelect}
                style={{ display: "none" }}
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
                  disabled={
                    (!input.trim() && selectedImages.length === 0) ||
                    isLoading ||
                    !user ||
                    !token
                  }
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
