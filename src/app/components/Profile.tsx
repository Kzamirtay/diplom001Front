import { useState } from "react";
import { motion } from "motion/react";
import { Award, TrendingUp, Calendar } from "lucide-react";

type Tab = "skills" | "achievements" | "history";

export default function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>("skills");

  const skills = [
    { name: "Фонематическое восприятие", value: 75, color: "var(--speech)" },
    { name: "Внимание", value: 62, color: "var(--cognition)" },
    { name: "Память", value: 80, color: "var(--info)" },
    { name: "Артикуляция", value: 55, color: "var(--articulation)" },
    { name: "Словарный запас", value: 70, color: "var(--warning)" },
  ];

  const achievements = [
    {
      id: 1,
      title: "Мастер звуков",
      description: "Выполнено 10 речевых упражнений",
      icon: "🎤",
      unlocked: true,
      date: "15.03.2024",
    },
    {
      id: 2,
      title: "Память чемпиона",
      description: "Правильно запомнил 20 картинок подряд",
      icon: "🧠",
      unlocked: true,
      date: "12.03.2024",
    },
    {
      id: 3,
      title: "Неделя подряд",
      description: "7 дней без пропусков",
      icon: "🔥",
      unlocked: true,
      date: "Сегодня",
    },
    {
      id: 4,
      title: "Супер концентрация",
      description: "Выполнил упражнение без ошибок",
      icon: "🎯",
      unlocked: true,
      date: "10.03.2024",
    },
    {
      id: 5,
      title: "Мастер артикуляции",
      description: "Выполнено 15 артикуляционных упражнений",
      icon: "👄",
      unlocked: false,
      date: "",
    },
    {
      id: 6,
      title: "Месяц занятий",
      description: "30 дней непрерывных тренировок",
      icon: "📅",
      unlocked: false,
      date: "",
    },
  ];

  const history = [
    {
      date: "2024-04-11",
      exercises: 3,
      stars: 45,
      status: "completed",
    },
    {
      date: "2024-04-10",
      exercises: 2,
      stars: 30,
      status: "completed",
    },
    {
      date: "2024-04-09",
      exercises: 4,
      stars: 60,
      status: "completed",
    },
    {
      date: "2024-04-08",
      exercises: 1,
      stars: 15,
      status: "partial",
    },
    {
      date: "2024-04-07",
      exercises: 0,
      stars: 0,
      status: "missed",
    },
    {
      date: "2024-04-06",
      exercises: 3,
      stars: 45,
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="bg-white rounded-xl p-5 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--primary)] to-[var(--secondary)] rounded-full flex items-center justify-center text-3xl shadow-lg">
                👧
              </div>
              <button className="absolute -bottom-0.5 -right-0.5 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-md text-xs">
                ✏️
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl mb-0.5 truncate">Маша</h1>
              <p className="text-sm text-[var(--muted-foreground)]">6 лет</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div
                className="text-2xl mb-0.5"
                style={{ color: "var(--primary)" }}
              >
                Ур. 12
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                1250 XP
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center p-2.5 bg-[var(--background)] rounded-lg">
              <div
                className="text-lg mb-0.5"
                style={{ color: "var(--warning)" }}
              >
                ★ 450
              </div>
              <div className="text-[10px] text-[var(--muted-foreground)] leading-tight">
                Звезд
              </div>
            </div>
            <div className="text-center p-2.5 bg-[var(--background)] rounded-lg">
              <div
                className="text-lg mb-0.5"
                style={{ color: "var(--success)" }}
              >
                🔥 7
              </div>
              <div className="text-[10px] text-[var(--muted-foreground)] leading-tight">
                Дней
              </div>
            </div>
            <div className="text-center p-2.5 bg-[var(--background)] rounded-lg">
              <div
                className="text-lg mb-0.5"
                style={{ color: "var(--primary)" }}
              >
                🏆 12
              </div>
              <div className="text-[10px] text-[var(--muted-foreground)] leading-tight">
                Наград
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-4 px-4">
        <button
          onClick={() => setActiveTab("skills")}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm flex-shrink-0 ${
            activeTab === "skills"
              ? "bg-[var(--primary)] text-white shadow-lg"
              : "bg-white text-gray-700 shadow-md"
          }`}
        >
          <TrendingUp size={16} />
          Навыки
        </button>
        <button
          onClick={() => setActiveTab("achievements")}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm flex-shrink-0 ${
            activeTab === "achievements"
              ? "bg-[var(--primary)] text-white shadow-lg"
              : "bg-white text-gray-700 shadow-md"
          }`}
        >
          <Award size={16} />
          Достижения
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl whitespace-nowrap transition-all text-sm flex-shrink-0 ${
            activeTab === "history"
              ? "bg-[var(--primary)] text-white shadow-lg"
              : "bg-white text-gray-700 shadow-md"
          }`}
        >
          <Calendar size={16} />
          История
        </button>
      </div>

      {/* Skills Tab */}
      {activeTab === "skills" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {skills.map((skill, index) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-4 shadow-md"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="flex-1 text-base">{skill.name}</h3>
                <span
                  className="text-lg font-medium"
                  style={{ color: skill.color }}
                >
                  {skill.value}%
                </span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.value}%` }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: skill.color }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Achievements Tab */}
      {activeTab === "achievements" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-2.5"
        >
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-white rounded-xl p-4 shadow-md text-center ${
                !achievement.unlocked && "opacity-50"
              }`}
            >
              <div className="text-4xl mb-2">
                {achievement.unlocked ? achievement.icon : "🔒"}
              </div>
              <h3 className="mb-1.5 text-sm font-medium leading-tight">
                {achievement.unlocked ? achievement.title : "???"}
              </h3>
              <p className="text-[10px] text-[var(--muted-foreground)] mb-1.5 leading-tight">
                {achievement.unlocked
                  ? achievement.description
                  : "Секретное достижение"}
              </p>
              {achievement.unlocked && achievement.date && (
                <div className="text-[10px] text-[var(--primary)]">
                  {achievement.date}
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* History Tab */}
      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2.5"
        >
          {history.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-3.5 shadow-md"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{
                    backgroundColor:
                      day.status === "completed"
                        ? "var(--success)"
                        : day.status === "partial"
                        ? "var(--warning)"
                        : "var(--border)",
                    color: day.status === "missed" ? "gray" : "white",
                  }}
                >
                  {day.status === "completed"
                    ? "✓"
                    : day.status === "partial"
                    ? "◐"
                    : "○"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium mb-0.5">
                    {new Date(day.date).toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                    })}
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    {day.exercises > 0
                      ? `${day.exercises} упр. • ${day.stars} звезд`
                      : "Пропущено"}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
