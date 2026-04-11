import { motion } from "motion/react";
import {
  TrendingUp,
  Calendar,
  Award,
  MessageCircle,
  Plus,
} from "lucide-react";
import { Link } from "react-router";

export default function ParentDashboard() {
  const children = [
    {
      id: 1,
      name: "Маша",
      age: 6,
      avatar: "👧",
      weekProgress: 85,
      exercisesToday: 2,
      streak: 7,
    },
    {
      id: 2,
      name: "Петя",
      age: 8,
      avatar: "👦",
      weekProgress: 62,
      exercisesToday: 1,
      streak: 3,
    },
  ];

  const notifications = [
    {
      id: 1,
      child: "Маша",
      message: "Получено достижение: Мастер звуков!",
      time: "10 минут назад",
      type: "achievement",
    },
    {
      id: 2,
      child: "Петя",
      message: "Выполнено 1 упражнение",
      time: "2 часа назад",
      type: "exercise",
    },
    {
      id: 3,
      child: "Маша",
      message: "Новое задание от логопеда",
      time: "Вчера",
      type: "assignment",
    },
  ];

  return (
    <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl mb-1">Родительская панель</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Отслеживайте прогресс ваших детей
        </p>
      </motion.div>

      {/* Children Cards */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg">Дети</h2>
          <button className="flex items-center gap-1.5 text-sm text-[var(--primary)] hover:underline">
            <Plus size={18} />
            Добавить
          </button>
        </div>

        <div className="space-y-3">
          {children.map((child, index) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-lg active:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-2xl shadow-lg flex-shrink-0">
                  {child.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base truncate">
                    {child.name}, {child.age} лет
                  </h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {child.exercisesToday} упр. сегодня
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <div
                    className="text-xl mb-0.5"
                    style={{ color: "var(--success)" }}
                  >
                    {child.weekProgress}%
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    неделя
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span>Недельный прогресс</span>
                  <span>{child.weekProgress}%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${child.weekProgress}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.8 }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, var(--primary), var(--secondary))",
                    }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <Calendar
                    size={18}
                    className="mx-auto mb-0.5"
                    style={{ color: "var(--primary)" }}
                  />
                  <div className="text-xs font-medium">{child.streak} дн</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">
                    серия
                  </div>
                </div>
                <div className="text-center">
                  <Award
                    size={18}
                    className="mx-auto mb-0.5"
                    style={{ color: "var(--warning)" }}
                  />
                  <div className="text-xs font-medium">5 нов</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">
                    наград
                  </div>
                </div>
                <div className="text-center">
                  <TrendingUp
                    size={18}
                    className="mx-auto mb-0.5"
                    style={{ color: "var(--success)" }}
                  />
                  <div className="text-xs font-medium">+15%</div>
                  <div className="text-[10px] text-[var(--muted-foreground)]">
                    рост
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Chat Access */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <Link to="/chat">
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-xl p-5 text-white shadow-lg active:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-1 text-base">Чат со специалистом</h3>
                <p className="text-white text-opacity-90 text-sm">
                  Задайте вопрос логопеду
                </p>
              </div>
              <MessageCircle size={28} className="flex-shrink-0" />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Notifications */}
      <div>
        <h2 className="mb-3 text-lg">Уведомления</h2>
        <div className="space-y-2.5">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-xl p-3.5 shadow-md"
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0"
                  style={{
                    backgroundColor:
                      notification.type === "achievement"
                        ? "var(--warning)"
                        : notification.type === "exercise"
                        ? "var(--success)"
                        : "var(--info)",
                    color: "white",
                  }}
                >
                  {notification.type === "achievement"
                    ? "🏆"
                    : notification.type === "exercise"
                    ? "✓"
                    : "📋"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-medium text-sm">{notification.child}</span>
                    <span className="text-[10px] text-[var(--muted-foreground)]">
                      • {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--muted-foreground)] leading-tight">
                    {notification.message}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
