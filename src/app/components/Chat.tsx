import { useState } from "react";
import { motion } from "motion/react";
import { Send, Paperclip, Mic } from "lucide-react";

export default function Chat() {
  const [message, setMessage] = useState("");

  const messages = [
    {
      id: 1,
      sender: "specialist",
      text: "Добрый день! Как проходят занятия с Машей?",
      time: "10:30",
      avatar: "👩‍⚕️",
    },
    {
      id: 2,
      sender: "parent",
      text: "Здравствуйте! Все отлично, она с удовольствием выполняет упражнения.",
      time: "10:35",
      avatar: "👨",
    },
    {
      id: 3,
      sender: "specialist",
      text: "Замечательно! Я заметила хороший прогресс в речевых упражнениях. Рекомендую добавить упражнение 'Составь слово'.",
      time: "10:37",
      avatar: "👩‍⚕️",
    },
    {
      id: 4,
      sender: "parent",
      text: "Спасибо за рекомендацию! Попробуем сегодня вечером.",
      time: "10:40",
      avatar: "👨",
    },
    {
      id: 5,
      sender: "specialist",
      text: "Отлично! Если будут вопросы - пишите.",
      time: "10:41",
      avatar: "👩‍⚕️",
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] p-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-2xl shadow-md">
            👩‍⚕️
          </div>
          <div className="flex-1">
            <h2 className="mb-0">Логопед Анна</h2>
            <p className="text-sm text-[var(--muted-foreground)]">
              в сети
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex gap-3 ${
              msg.sender === "parent" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 bg-gray-100">
              {msg.avatar}
            </div>
            <div
              className={`max-w-[75%] ${
                msg.sender === "parent" ? "items-end" : ""
              }`}
            >
              <div
                className={`rounded-2xl p-4 shadow-md ${
                  msg.sender === "parent"
                    ? "bg-[var(--primary)] text-white rounded-br-md"
                    : "bg-white rounded-bl-md"
                }`}
              >
                <p>{msg.text}</p>
              </div>
              <div
                className={`text-xs text-[var(--muted-foreground)] mt-1 px-2 ${
                  msg.sender === "parent" ? "text-right" : ""
                }`}
              >
                {msg.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Replies */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["Спасибо!", "Хорошо", "Когда следующее занятие?"].map(
            (reply, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => setMessage(reply)}
                className="bg-white border border-[var(--border)] px-4 py-2 rounded-full text-sm whitespace-nowrap shadow-sm hover:shadow-md transition-shadow"
              >
                {reply}
              </motion.button>
            )
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-[var(--border)] p-4">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center text-[var(--primary)] rounded-full hover:bg-gray-100 transition-colors">
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Напишите сообщение..."
            className="flex-1 px-4 py-3 bg-[var(--background)] rounded-full border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />

          <button className="w-10 h-10 flex items-center justify-center text-[var(--primary)] rounded-full hover:bg-gray-100 transition-colors">
            <Mic size={20} />
          </button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-10 h-10 flex items-center justify-center bg-[var(--primary)] text-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
