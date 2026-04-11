import { useState } from "react";
import { motion } from "motion/react";
import {
  Globe,
  Moon,
  Volume2,
  Bell,
  Accessibility,
  User,
  LogOut,
  ChevronRight,
} from "lucide-react";

export default function Settings() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [ttsSpeed, setTtsSpeed] = useState(1);

  const Toggle = ({
    enabled,
    onChange,
  }: {
    enabled: boolean;
    onChange: (val: boolean) => void;
  }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`w-12 h-7 rounded-full transition-colors relative ${
        enabled ? "bg-[var(--primary)]" : "bg-gray-300"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        className="w-5 h-5 bg-white rounded-full absolute top-1 shadow-md"
      />
    </button>
  );

  return (
    <div className="min-h-screen p-6 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl mb-2">Настройки</h1>
        <p className="text-[var(--muted-foreground)]">
          Персонализируйте приложение
        </p>
      </motion.div>

      {/* Profile Section */}
      <div className="mb-6">
        <h3 className="mb-3">Профиль</h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden"
        >
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <User size={20} style={{ color: "var(--primary)" }} />
              <span>Редактировать профиль</span>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </motion.div>
      </div>

      {/* General Settings */}
      <div className="mb-6">
        <h3 className="mb-3">Общие</h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden divide-y divide-gray-100"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe size={20} style={{ color: "var(--primary)" }} />
                <div>
                  <div className="font-medium">Язык</div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Русский
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon size={20} style={{ color: "var(--primary)" }} />
                <div>
                  <div className="font-medium">Тема</div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Светлая
                  </div>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 size={20} style={{ color: "var(--primary)" }} />
                <span>Звук</span>
              </div>
              <Toggle enabled={soundEnabled} onChange={setSoundEnabled} />
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={20} style={{ color: "var(--primary)" }} />
                <span>Уведомления</span>
              </div>
              <Toggle
                enabled={notificationsEnabled}
                onChange={setNotificationsEnabled}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Accessibility Settings */}
      <div className="mb-6">
        <h3 className="mb-3">Доступность (ОВЗ)</h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden divide-y divide-gray-100"
        >
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Accessibility size={20} style={{ color: "var(--primary)" }} />
              <div className="text-left">
                <div className="font-medium">Профиль ОВЗ</div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  Стандартный режим
                </div>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <div className="p-4">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span>Размер шрифта</span>
                <span className="text-[var(--primary)]">Средний</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                defaultValue="1"
                className="w-full accent-[var(--primary)]"
              />
              <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
                <span>Маленький</span>
                <span>Большой</span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <span>Скорость речи (TTS)</span>
                <span className="text-[var(--primary)]">{ttsSpeed}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.25"
                value={ttsSpeed}
                onChange={(e) => setTtsSpeed(Number(e.target.value))}
                className="w-full accent-[var(--primary)]"
              />
              <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
                <span>0.5x</span>
                <span>2x</span>
              </div>
            </div>
          </div>

          <div className="p-4">
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-[var(--primary)] rounded"
                />
                <div>
                  <div className="font-medium">Аутизм-friendly режим</div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Спокойные цвета, минимум анимаций
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 accent-[var(--primary)] rounded"
                />
                <div>
                  <div className="font-medium">СДВГ-режим</div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Короткие сессии, частые перерывы
                  </div>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 accent-[var(--primary)] rounded"
                />
                <div>
                  <div className="font-medium">Виброотклик</div>
                  <div className="text-sm text-[var(--muted-foreground)]">
                    Вибрация при касании
                  </div>
                </div>
              </label>
            </div>
          </div>
        </motion.div>
      </div>

      {/* About */}
      <div className="mb-6">
        <h3 className="mb-3">О приложении</h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-md overflow-hidden divide-y divide-gray-100"
        >
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <span>Версия приложения</span>
            <span className="text-[var(--muted-foreground)]">1.0.0</span>
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <span>Помощь и поддержка</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
            <span>Политика конфиденциальности</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </motion.div>
      </div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white rounded-2xl p-4 shadow-md text-[var(--error)] flex items-center justify-center gap-2 hover:bg-red-50 transition-colors"
      >
        <LogOut size={20} />
        <span>Выйти из аккаунта</span>
      </motion.button>
    </div>
  );
}
