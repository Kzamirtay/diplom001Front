import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { childrenAPI } from '../services/api';
import { useAuth } from './AuthContext';

interface AccessibilitySettings {
  // Аутизм-friendly режим
  autismMode: boolean;
  // СДВГ-режим
  adhdMode: boolean;
  // Виброотклик
  vibrationEnabled: boolean;
  // Размер шрифта (0-3)
  fontSize: number;
  // Скорость речи TTS (0.5-2.0)
  ttsSpeed: number;
  // Высокий контраст
  highContrast: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSettings: (newSettings: Partial<AccessibilitySettings>) => Promise<void>;
  isLoading: boolean;
  // Хелперы
  shouldReduceMotion: boolean;
  shouldUseCalmColors: boolean;
  shouldUseShortSessions: boolean;
  shouldVibrate: boolean;
  fontSizeClass: string;
}

const defaultSettings: AccessibilitySettings = {
  autismMode: false,
  adhdMode: false,
  vibrationEnabled: true,
  fontSize: 1,
  ttsSpeed: 1,
  highContrast: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const { currentChild } = useAuth();
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем настройки при смене ребенка
  useEffect(() => {
    if (currentChild) {
      loadSettings();
    } else {
      setIsLoading(false);
    }
  }, [currentChild]);

  // Применяем настройки к документу
  useEffect(() => {
    applySettingsToDocument();
  }, [settings]);

  const loadSettings = async () => {
    if (!currentChild) return;
    
    setIsLoading(true);
    try {
      const response = await childrenAPI.getById(currentChild.id);
      const accessibilitySettings = response.data.accessibility_settings || {};
      
      setSettings({
        ...defaultSettings,
        ...accessibilitySettings,
      });
    } catch (error) {
      console.error('Ошибка загрузки настроек доступности:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<AccessibilitySettings>) => {
    if (!currentChild) return;

    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);

    try {
      await childrenAPI.update(currentChild.id, {
        accessibility_settings: updatedSettings,
      });
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
      // Откатываем при ошибке
      setSettings(settings);
    }
  };

  const applySettingsToDocument = () => {
    const root = document.documentElement;
    
    // Размер шрифта
    const fontSizeMap: Record<number, string> = {
      0: '14px',
      1: '16px',
      2: '18px',
      3: '20px',
    };
    root.style.fontSize = fontSizeMap[settings.fontSize] || '16px';

    // Аутизм-режим: спокойные цвета
    if (settings.autismMode) {
      root.classList.add('autism-mode');
      root.classList.remove('adhd-mode');
    } else if (settings.adhdMode) {
      root.classList.add('adhd-mode');
      root.classList.remove('autism-mode');
    } else {
      root.classList.remove('autism-mode', 'adhd-mode');
    }

    // Высокий контраст
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  };

  // Хелперы
  const shouldReduceMotion = settings.autismMode;
  const shouldUseCalmColors = settings.autismMode;
  const shouldUseShortSessions = settings.adhdMode;
  const shouldVibrate = settings.vibrationEnabled && 'vibrate' in navigator;

  const fontSizeClass = {
    0: 'text-sm',
    1: 'text-base',
    2: 'text-lg',
    3: 'text-xl',
  }[settings.fontSize] || 'text-base';

  const value: AccessibilityContextType = {
    settings,
    updateSettings,
    isLoading,
    shouldReduceMotion,
    shouldUseCalmColors,
    shouldUseShortSessions,
    shouldVibrate,
    fontSizeClass,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

// Хук для вибрации
export function useVibration() {
  const { shouldVibrate } = useAccessibility();

  const vibrate = (pattern: number | number[] = 50) => {
    if (shouldVibrate && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const vibrateSuccess = () => vibrate([50, 100, 50]);
  const vibrateError = () => vibrate([100, 50, 100]);
  const vibrateClick = () => vibrate(30);

  return { vibrate, vibrateSuccess, vibrateError, vibrateClick };
}
