import { useState, useEffect } from "react";
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
  Palette,
  Watch,
  Vibrate,
  Type,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useAccessibility } from "../../contexts/AccessibilityContext";
import { useVibration } from "../../contexts/AccessibilityContext";

export default function Settings() {
  const { logout } = useAuth();
  const { settings, updateSettings, isLoading } = useAccessibility();
  const { vibrateClick, vibrateSuccess } = useVibration();
  
  // Локальное состояние для мгновенной обратной связи
  const [localSettings, setLocalSettings] = useState(settings);
  const [saving, setSaving] = useState(false);

  // Синхронизация с глобальным состоянием
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleToggle = async (key: keyof typeof settings) => {
    vibrateClick();
    const newValue = !localSettings[key];
    
    // Мгновенное обновление UI
    setLocalSettings(prev => ({ ...prev, [key]: newValue }));
    
    // Сохранение на сервере
    setSaving(true);
    try {
      await updateSettings({ [key]: newValue });
      if (newValue) vibrateSuccess();
    } finally {
      setSaving(false);
    }
  };

  const handleSliderChange = async (key: 'fontSize' | 'ttsSpeed', value: number) => {
    vibrateClick();
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    
    setSaving(true);
    try {
      await updateSettings({ [key]: value });
    } finally {
      setSaving(false);
    }
  };

  const Toggle = ({
    enabled,
    onChange,
    id,
  }: {
    enabled: boolean;
    onChange: () => void;
    id: string;
  }) => (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 ${
        enabled ? "bg-[var(--primary)]" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--primary)]/30 border-t-[var(--primary)] rounded-full animate-spin" />
      </div>
    );
  }

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
          {saving && <span className="ml-2 text-[var(--primary)]">• Сохранение...</span>}
        </p>
      </motion.div>

      {/* Profile */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-3">
          Профиль
        </h3>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white rounded-xl p-4 shadow-md flex items-center gap-3 active:shadow-lg transition-shadow"
        >
          <div className="w-10 h-10 bg-[var(--primary)]/10 rounded-full flex items-center justify-center">
            <User size={20} style={{ color: "var(--primary)" }} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">Редактировать профиль</p>
          </div>
          <ChevronRight size={20} className="text-[var(--muted-foreground)]" />
        </motion.button>
      </div>

      {/* Accessibility Settings */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-3">
          Доступность (ОВЗ)
        </h3>
        
        <div className="space-y-3">
          {/* Аутизм-friendly режим */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <Palette size={20} className="text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Аутизм-friendly режим</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Спокойные цвета, минимум анимаций
                </p>
              </div>
              <Toggle
                enabled={localSettings.autismMode}
                onChange={() => handleToggle('autismMode')}
                id="autism-mode"
              />
            </div>
          </motion.div>

          {/* СДВГ-режим */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Watch size={20} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">СДВГ-режим</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Короткие сессии, частые перерывы
                </p>
              </div>
              <Toggle
                enabled={localSettings.adhdMode}
                onChange={() => handleToggle('adhdMode')}
                id="adhd-mode"
              />
            </div>
          </motion.div>

          {/* Виброотклик */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Vibrate size={20} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Виброотклик</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  Вибрация при касании
                </p>
              </div>
              <Toggle
                enabled={localSettings.vibrationEnabled}
                onChange={() => handleToggle('vibrationEnabled')}
                id="vibration"
              />
            </div>
          </motion.div>

          {/* Размер шрифта */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Type size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Размер шрифта</p>
                <p className="text-xs text-[var(--muted-foreground)]">
                  {['Маленький', 'Средний', 'Большой', 'Очень большой'][localSettings.fontSize]}
                </p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="1"
              value={localSettings.fontSize}
              onChange={(e) => handleSliderChange('fontSize', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${(localSettings.fontSize / 3) * 100}%, #e5e7eb ${(localSettings.fontSize / 3) * 100}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
              <span>А</span>
              <span>А</span>
              <span>А</span>
              <span>А</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* General */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-[var(--muted-foreground)] uppercase tracking-wide mb-3">
          Общие
        </h3>
        
        <div className="space-y-3">
          {/* Язык */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Globe size={20} className="text-indigo-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Язык</p>
                <p className="text-xs text-[var(--muted-foreground)]">Русский</p>
              </div>
              <ChevronRight size={20} className="text-[var(--muted-foreground)]" />
            </div>
          </motion.div>

          {/* Тема */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-4 shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Moon size={20} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Тема</p>
                <p className="text-xs text-[var(--muted-foreground)]">Светлая</p>
              </div>
              <ChevronRight size={20} className="text-[var(--muted-foreground)]" />
            </div>
          </motion.div>

          {/* Звук */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-xl p-4 shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Volume2 size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Звук</p>
              </div>
            </div>
            <Toggle enabled={true} onChange={() => {}} id="sound" />
          </motion.div>

          {/* Уведомления */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-4 shadow-md flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <Bell size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="font-medium">Уведомления</p>
              </div>
            </div>
            <Toggle enabled={true} onChange={() => {}} id="notifications" />
          </motion.div>
        </div>
      </div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        whileTap={{ scale: 0.98 }}
        onClick={logout}
        className="w-full bg-white rounded-xl p-3.5 shadow-md text-[var(--error)] flex items-center justify-center gap-2 active:bg-red-50 transition-colors text-sm"
      >
        <LogOut size={18} />
        <span>Выйти из аккаунта</span>
      </motion.button>
    </div>
  );
}
