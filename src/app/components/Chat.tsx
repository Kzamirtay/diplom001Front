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
    <div className="min-h-screen flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-[var(--border)] p-3 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-xl shadow-md">
            👩‍⚕️
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="mb-0 text-base truncate">Логопед Анна</h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              в сети
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto pb-32">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex gap-2 ${
              msg.sender === "parent" ? "flex-row-reverse" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 bg-gray-100">
              {msg.avatar}
            </div>
            <div
              className={`max-w-[75%] ${
                msg.sender === "parent" ? "items-end" : ""
              }`}
            >
              <div
                className={`rounded-2xl p-3 shadow-md ${
                  msg.sender === "parent"
                    ? "bg-[var(--primary)] text-white rounded-br-md"
                    : "bg-white rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
              <div
                className={`text-[10px] text-[var(--muted-foreground)] mt-1 px-2 ${
                  msg.sender === "parent" ? "text-right" : ""
                }`}
              >
                {msg.time}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-[var(--border)] max-w-2xl mx-auto z-20">
        {/* Quick Replies */}
        <div className="px-3 pt-2 pb-1">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["Спасибо!", "Хорошо", "Когда следующее?"].map(
              (reply, index) => (
                <motion.button
                  key={index}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMessage(reply)}
                  className="bg-white border border-[var(--border)] px-3 py-1.5 rounded-full text-xs whitespace-nowrap shadow-sm active:shadow-md transition-shadow"
                >
                  {reply}
                </motion.button>
              )
            )}
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
            className="flex-1 px-3 py-2 bg-[var(--background)] rounded-full border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm min-w-0"
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!message.trim()}
            className="w-8 h-8 flex items-center justify-center bg-[var(--primary)] text-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send size={16} />
          </motion.button>
        </div>
        </div>
      </div>
    </div>
  );
}
