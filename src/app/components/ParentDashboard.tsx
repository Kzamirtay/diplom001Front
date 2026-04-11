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
    <div className="min-h-screen p-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-2">Родительская панель</h1>
        <p className="text-[var(--muted-foreground)]">
          Отслеживайте прогресс ваших детей
        </p>
      </motion.div>

      {/* Children Cards */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2>Дети</h2>
          <button className="flex items-center gap-2 text-[var(--primary)] hover:underline">
            <Plus size={20} />
            Добавить ребенка
          </button>
        </div>

        <div className="space-y-4">
          {children.map((child, index) => (
            <motion.div
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-3xl shadow-lg">
                  {child.avatar}
                </div>
                <div className="flex-1">
                  <h3>
                    {child.name}, {child.age} лет
                  </h3>
                  <p className="text-[var(--muted-foreground)]">
                    {child.exercisesToday} упражнени{child.exercisesToday === 1 ? "е" : "я"} сегодня
                  </p>
                </div>
                <div className="text-right">
                  <div
                    className="text-2xl mb-1"
                    style={{ color: "var(--success)" }}
                  >
                    {child.weekProgress}%
                  </div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    за неделю
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Недельный прогресс</span>
                  <span>{child.weekProgress}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
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
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <Calendar
                    size={20}
                    className="mx-auto mb-1"
                    style={{ color: "var(--primary)" }}
                  />
                  <div className="text-sm">{child.streak} дней</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    серия
                  </div>
                </div>
                <div className="text-center">
                  <Award
                    size={20}
                    className="mx-auto mb-1"
                    style={{ color: "var(--warning)" }}
                  />
                  <div className="text-sm">5 новых</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    наград
                  </div>
                </div>
                <div className="text-center">
                  <TrendingUp
                    size={20}
                    className="mx-auto mb-1"
                    style={{ color: "var(--success)" }}
                  />
                  <div className="text-sm">+15%</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
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
        className="mb-8"
      >
        <Link to="/chat">
          <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="mb-2">Чат со специалистом</h3>
                <p className="text-white text-opacity-90">
                  Задайте вопрос логопеду
                </p>
              </div>
              <MessageCircle size={32} />
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Notifications */}
      <div>
        <h2 className="mb-4">Уведомления</h2>
        <div className="space-y-3">
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-md"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
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
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{notification.child}</span>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      • {notification.time}
                    </span>
                  </div>
                  <p className="text-[var(--muted-foreground)]">
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
