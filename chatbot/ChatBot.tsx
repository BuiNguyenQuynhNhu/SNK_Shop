import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "model";
  text: string;
};

export default function ChatBot() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "👋 Xin chào! Tôi là trợ lý SNK Store. Tôi có thể giúp bạn tư vấn giày, size, đổi trả và vận chuyển. Bạn cần hỗ trợ gì?" }
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMsg: Message = { role: "user", text: trimmed };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // Gửi lịch sử hội thoại (bỏ tin nhắn đầu tiên của bot vì đó là lời chào tự định nghĩa)
      const history = newMessages.slice(1, -1).map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("http://localhost:3000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history }),
      });

      const data = await res.json();
      const botReply = data.reply || data.error || "Xin lỗi, tôi không thể phản hồi lúc này.";
      setMessages(prev => [...prev, { role: "model", text: botReply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "model", text: "❌ Không thể kết nối chatbot. Vui lòng kiểm tra backend." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Nút toggle chatbot */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          title="Mở chatbot hỗ trợ"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white",
            border: "none",
            fontSize: 26,
            cursor: "pointer",
            boxShadow: "0 4px 15px rgba(102,126,234,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            transition: "transform 0.2s",
          }}
          onMouseOver={e => (e.currentTarget.style.transform = "scale(1.1)")}
          onMouseOut={e => (e.currentTarget.style.transform = "scale(1)")}
        >
          💬
        </button>
      )}

      {/* Popup chatbot */}
      {open && (
        <div style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 360,
          height: 520,
          zIndex: 1000,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          background: "#fff",
          fontFamily: "'Segoe UI', sans-serif",
        }}>
          {/* Header */}
          <div style={{
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            padding: "14px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20,
              }}>🤖</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>SNK AI Assistant</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>
                  {isLoading ? "⏳ Đang trả lời..." : "● Trực tuyến"}
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", color: "white", fontSize: 20, cursor: "pointer", padding: "0 4px" }}
            >✕</button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "14px 12px",
            background: "#f8f9fa",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "80%",
                  padding: "10px 14px",
                  borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  background: msg.role === "user"
                    ? "linear-gradient(135deg, #667eea, #764ba2)"
                    : "white",
                  color: msg.role === "user" ? "white" : "#333",
                  fontSize: 14,
                  lineHeight: 1.5,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "10px 16px",
                  borderRadius: "18px 18px 18px 4px",
                  background: "white",
                  color: "#888",
                  fontSize: 14,
                  boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                }}>
                  <span>⏳ Đang suy nghĩ</span>
                  <span style={{ animation: "blink 1s infinite" }}>...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: "10px 12px",
            background: "white",
            borderTop: "1px solid #eee",
            display: "flex",
            gap: 8,
            alignItems: "flex-end",
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi... (Enter để gửi)"
              rows={2}
              disabled={isLoading}
              style={{
                flex: 1,
                border: "1px solid #ddd",
                borderRadius: 12,
                padding: "8px 12px",
                fontSize: 14,
                resize: "none",
                outline: "none",
                fontFamily: "inherit",
                background: isLoading ? "#f5f5f5" : "white",
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              style={{
                width: 40,
                height: 40,
                borderRadius: "50%",
                background: input.trim() && !isLoading ? "linear-gradient(135deg, #667eea, #764ba2)" : "#ccc",
                border: "none",
                color: "white",
                fontSize: 18,
                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s",
              }}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}
