import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Send, Paperclip, Loader2, ChevronLeft, MessageCircle } from "lucide-react";
import { chatAPI } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  role: string;
}

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  is_read: boolean;
  sender?: User;
  receiver?: User;
}

interface Conversation {
  user: User;
  last_message: {
    content: string;
    created_at: string;
    is_read: boolean;
    is_my_message: boolean;
  } | null;
  unread_count: number;
}

export default function Chat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Загружаем список диалогов
  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 30000); // Обновляем каждые 30 сек
    return () => clearInterval(interval);
  }, []);

  // Загружаем сообщения при выборе пользователя
  useEffect(() => {
    if (selectedUser) {
      loadMessages(selectedUser.id);
      const interval = setInterval(() => loadMessages(selectedUser.id), 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  // Скролл вниз при новых сообщениях
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await chatAPI.getConversations();
      setConversations(res.data);
    } catch (err: any) {
      console.error("Ошибка загрузки диалогов:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (userId: number) => {
    try {
      const res = await chatAPI.getMessages(userId);
      // Если ответ с пагинацией - берем data.data, иначе data
      const msgs = res.data.data || res.data;
      setMessages(msgs);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка загрузки сообщений");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedUser) return;

    setSending(true);
    setError("");

    try {
      const res = await chatAPI.sendMessage(selectedUser.id, message);
      setMessages((prev) => [...prev, res.data]);
      setMessage("");
      loadConversations(); // Обновляем список диалогов
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка отправки сообщения");
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Сегодня";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Вчера";
    }
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  };

  // Список диалогов
  if (!selectedUser) {
    return (
      <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <h1 className="text-2xl mb-1">Чат</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Общайтесь с логопедом и специалистами
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : conversations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-5xl mb-3">💬</div>
            <h3 className="mb-1 text-base">Нет диалогов</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              Начните общение со специалистом
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv, index) => (
              <motion.div
                key={conv.user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedUser(conv.user)}
                className="bg-white rounded-xl p-4 shadow-md cursor-pointer active:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-xl flex-shrink-0">
                    {conv.user.avatar_url || (conv.user.role === "specialist" ? "👩‍⚕️" : "👤")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="text-base font-medium truncate">
                        {conv.user.first_name} {conv.user.last_name}
                      </h3>
                      {conv.last_message && (
                        <span className="text-xs text-[var(--muted-foreground)]">
                          {formatTime(conv.last_message.created_at)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[var(--muted-foreground)] truncate">
                      {conv.last_message 
                        ? `${conv.last_message.is_my_message ? "Вы: " : ""}${conv.last_message.content}`
                        : "Нажмите, чтобы начать диалог"
                      }
                    </p>
                  </div>
                  {conv.unread_count > 0 && (
                    <div className="w-5 h-5 bg-[var(--primary)] rounded-full flex items-center justify-center text-xs text-white flex-shrink-0">
                      {conv.unread_count}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Чат с выбранным пользователем
  return (
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] p-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setSelectedUser(null)}
            className="w-8 h-8 flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="w-10 h-10 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-lg shadow-md">
            {selectedUser.avatar_url || (selectedUser.role === "specialist" ? "👩‍⚕️" : "👤")}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base truncate">
              {selectedUser.first_name} {selectedUser.last_name}
            </h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              {selectedUser.role === "specialist" ? "Специалист" : "Родитель"}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 text-sm text-center">
          {error}
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto pb-32">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-[var(--muted-foreground)]">
            <MessageCircle size={48} className="mx-auto mb-3 opacity-30" />
            <p>Начните диалог первым сообщением</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMyMessage = msg.sender_id === user?.id;
            const showDate = index === 0 || 
              formatDate(messages[index - 1].created_at) !== formatDate(msg.created_at);

            return (
              <div key={msg.id}>
                {showDate && (
                  <div className="text-center my-4">
                    <span className="text-xs text-[var(--muted-foreground)] bg-gray-100 px-3 py-1 rounded-full">
                      {formatDate(msg.created_at)}
                    </span>
                  </div>
                )}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${isMyMessage ? "flex-row-reverse" : ""}`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-gray-100">
                    {isMyMessage ? "👤" : (selectedUser.avatar_url || "👩‍⚕️")}
                  </div>
                  <div className={`max-w-[75%] ${isMyMessage ? "items-end" : ""}`}>
                    <div
                      className={`rounded-2xl p-3 shadow-md ${
                        isMyMessage
                          ? "bg-[var(--primary)] text-white rounded-br-md"
                          : "bg-white rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                    <div
                      className={`text-[10px] text-[var(--muted-foreground)] mt-1 px-2 ${
                        isMyMessage ? "text-right" : ""
                      }`}
                    >
                      {formatTime(msg.created_at)}
                      {isMyMessage && msg.is_read && (
                        <span className="ml-1 text-[var(--primary)]">✓✓</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-[var(--border)] max-w-2xl mx-auto z-20">
        {/* Quick Replies */}
        <div className="px-3 pt-2 pb-1">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["Спасибо!", "Хорошо", "Когда следующее?"].map((reply, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMessage(reply)}
                className="bg-white border border-[var(--border)] px-3 py-1.5 rounded-full text-xs whitespace-nowrap shadow-sm active:shadow-md transition-shadow"
              >
                {reply}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-2.5">
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 flex items-center justify-center text-[var(--primary)] rounded-full active:bg-gray-100 transition-colors flex-shrink-0">
              <Paperclip size={16} />
            </button>

            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              placeholder="Сообщение..."
              disabled={sending}
              className="flex-1 px-3 py-2 bg-[var(--background)] rounded-full border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm min-w-0 disabled:opacity-50"
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSend}
              disabled={!message.trim() || sending}
              className="w-8 h-8 flex items-center justify-center bg-[var(--primary)] text-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              {sending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
