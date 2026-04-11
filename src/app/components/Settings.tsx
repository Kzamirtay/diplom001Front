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
      className={`w-11 h-6 rounded-full transition-colors relative flex-shrink-0 ${
        enabled ? "bg-[var(--primary)]" : "bg-gray-300"
      }`}
    >
      <motion.div
        animate={{ x: enabled ? 18 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-md"
      />
    </button>
  );

  return (
    <div className="min-h-screen p-4 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl mb-1">Настройки</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Персонализируйте приложение
        </p>
      </motion.div>

      {/* Profile Section */}
      <div className="mb-5">
        <h3 className="mb-2 text-base">Профиль</h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <button className="w-full flex items-center justify-between p-3.5 active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2.5">
              <User size={18} style={{ color: "var(--primary)" }} />
              <span className="text-sm">Редактировать профиль</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </motion.div>
      </div>

      {/* General Settings */}
      <div className="mb-5">
        <h3 className="mb-2 text-base">Общие</h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md overflow-hidden divide-y divide-gray-100"
        >
          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Globe size={18} style={{ color: "var(--primary)" }} />
                <div>
                  <div className="text-sm font-medium">Язык</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    Русский
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>

          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Moon size={18} style={{ color: "var(--primary)" }} />
                <div>
                  <div className="text-sm font-medium">Тема</div>
                  <div className="text-xs text-[var(--muted-foreground)]">
                    Светлая
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </div>
          </div>

          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Volume2 size={18} style={{ color: "var(--primary)" }} />
                <span className="text-sm">Звук</span>
              </div>
              <Toggle enabled={soundEnabled} onChange={setSoundEnabled} />
            </div>
          </div>

          <div className="p-3.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Bell size={18} style={{ color: "var(--primary)" }} />
                <span className="text-sm">Уведомления</span>
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
      <div className="mb-5">
        <h3 className="mb-2 text-base">Доступность (ОВЗ)</h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-md overflow-hidden divide-y divide-gray-100"
        >
          <button className="w-full flex items-center justify-between p-3.5 active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-2.5">
              <Accessibility size={18} style={{ color: "var(--primary)" }} />
              <div className="text-left">
                <div className="text-sm font-medium">Профиль ОВЗ</div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  Стандартный режим
                </div>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <div className="p-3.5">
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm">Размер шрифта</span>
                <span className="text-sm text-[var(--primary)]">Средний</span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                defaultValue="1"
                className="w-full accent-[var(--primary)]"
              />
              <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mt-1">
                <span>Маленький</span>
                <span>Большой</span>
              </div>
            </div>
          </div>

          <div className="p-3.5">
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm">Скорость речи (TTS)</span>
                <span className="text-sm text-[var(--primary)]">{ttsSpeed}x</span>
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
              <div className="flex justify-between text-[10px] text-[var(--muted-foreground)] mt-1">
                <span>0.5x</span>
                <span>2x</span>
              </div>
            </div>
          </div>

          <div className="p-3.5">
            <div className="space-y-2.5">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 accent-[var(--primary)] rounded flex-shrink-0"
                />
                <div>
                  <div className="text-sm font-medium">Аутизм-friendly режим</div>
                  <div className="text-xs text-[var(--muted-foreground)] leading-tight">
                    Спокойные цвета, минимум анимаций
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 accent-[var(--primary)] rounded flex-shrink-0"
                />
                <div>
                  <div className="text-sm font-medium">СДВГ-режим</div>
                  <div className="text-xs text-[var(--muted-foreground)] leading-tight">
                    Короткие сессии, частые перерывы
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 mt-0.5 accent-[var(--primary)] rounded flex-shrink-0"
                />
                <div>
                  <div className="text-sm font-medium">Виброотклик</div>
                  <div className="text-xs text-[var(--muted-foreground)] leading-tight">
                    Вибрация при касании
                  </div>
                </div>
              </label>
            </div>
          </div>
        </motion.div>
      </div>

      {/* About */}
      <div className="mb-5">
        <h3 className="mb-2 text-base">О приложении</h3>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-md overflow-hidden divide-y divide-gray-100"
        >
          <button className="w-full flex items-center justify-between p-3.5 active:bg-gray-50 transition-colors">
            <span className="text-sm">Версия приложения</span>
            <span className="text-sm text-[var(--muted-foreground)]">1.0.0</span>
          </button>
          <button className="w-full flex items-center justify-between p-3.5 active:bg-gray-50 transition-colors">
            <span className="text-sm">Помощь и поддержка</span>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3.5 active:bg-gray-50 transition-colors">
            <span className="text-sm">Политика конфиденциальности</span>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </motion.div>
      </div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white rounded-xl p-3.5 shadow-md text-[var(--error)] flex items-center justify-center gap-2 active:bg-red-50 transition-colors text-sm"
      >
        <LogOut size={18} />
        <span>Выйти из аккаунта</span>
      </motion.button>
    </div>
  );
}
