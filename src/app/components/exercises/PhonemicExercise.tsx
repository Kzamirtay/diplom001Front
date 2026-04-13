import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility, useVibration } from "../../../contexts/AccessibilityContext";

interface PhonemicExerciseProps {
  onComplete: (score: number, accuracy: number) => void;
}

interface WordData {
  image: string;
  word: string;
  firstSound: string;
  options: string[];
}

const words: WordData[] = [
  { image: "🐱", word: "КОТ", firstSound: "К", options: ["К", "Т", "М", "С"] },
  { image: "🐶", word: "ПЕС", firstSound: "П", options: ["П", "С", "К", "М"] },
  { image: "🏠", word: "ДОМ", firstSound: "Д", options: ["Д", "М", "О", "К"] },
  { image: "🌳", word: "ЛЕС", firstSound: "Л", options: ["Л", "С", "Е", "К"] },
  { image: "🚗", word: "АВТО", firstSound: "А", options: ["А", "В", "Т", "О"] },
];

export default function PhonemicExercise({ onComplete }: PhonemicExerciseProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { vibrateClick, vibrateSuccess, vibrateError } = useVibration();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  const handleOptionClick = useCallback((option: string) => {
    if (showFeedback) return;

    vibrateClick();
    setSelectedOption(option);
    const correct = option === currentWord.firstSound;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      vibrateSuccess();
      setScore(prev => prev + 1);
    } else {
      vibrateError();
    }

    // Переход к следующему слову через 1.5 секунды
    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        // Завершение упражнения
        const actualScore = correct ? score + 1 : score;
        const accuracy = Math.round((actualScore / words.length) * 100);
        onComplete(actualScore, accuracy);
      }
    }, shouldReduceMotion ? 800 : 1500);
  }, [currentIndex, currentWord.firstSound, score, showFeedback, onComplete, vibrateClick, vibrateSuccess, vibrateError, shouldReduceMotion]);

  const getOptionStyle = (option: string) => {
    if (!showFeedback) {
      return selectedOption === option
        ? "bg-blue-500 text-white border-blue-500"
        : "bg-white text-gray-800 border-gray-300 hover:border-blue-400 hover:bg-blue-50";
    }

    if (option === currentWord.firstSound) {
      return "bg-green-500 text-white border-green-500";
    }

    if (option === selectedOption && !isCorrect) {
      return "bg-red-500 text-white border-red-500";
    }

    return "bg-gray-100 text-gray-400 border-gray-200";
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      {/* Прогресс бар */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Вопрос {currentIndex + 1} из {words.length}</span>
          <span>Счёт: {score}</span>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Контейнер вопроса */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          {/* Заголовок */}
          <h2 className="text-xl text-gray-700 mb-6">
            Выбери первый звук слова
          </h2>

          {/* Картинка и слово */}
          <div className="mb-8">
            <motion.div
              className="text-8xl mb-4"
              initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={shouldReduceMotion ? {} : { delay: 0.1, duration: 0.4, type: "spring" }}
            >
              {currentWord.image}
            </motion.div>
            <motion.div
              className="text-4xl font-bold text-gray-800 tracking-wider"
              initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={shouldReduceMotion ? {} : { delay: 0.2, duration: 0.4 }}
            >
              {currentWord.word}
            </motion.div>
          </div>

          {/* Варианты ответа */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {currentWord.options.map((option, index) => (
              <motion.button
                key={option}
                onClick={() => handleOptionClick(option)}
                disabled={showFeedback}
                className={`
                  relative py-6 px-8 rounded-xl border-2 font-bold text-4xl
                  transition-all duration-200 shadow-sm
                  ${getOptionStyle(option)}
                  ${showFeedback ? 'cursor-default' : 'cursor-pointer active:scale-95'}
                `}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={shouldReduceMotion ? {} : { delay: 0.3 + index * 0.1, duration: 0.3 }}
                whileHover={(!showFeedback && !shouldReduceMotion) ? { scale: 1.05 } : {}}
                whileTap={(!showFeedback && !shouldReduceMotion) ? { scale: 0.95 } : {}}
              >
                {option}
                
                {/* Иконка правильного/неправильного ответа */}
                {showFeedback && option === currentWord.firstSound && (
                  <motion.span
                    className="absolute -top-2 -right-2 text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={shouldReduceMotion ? {} : { type: "spring", stiffness: 500, damping: 15 }}
                  >
                    ✅
                  </motion.span>
                )}
                {showFeedback && option === selectedOption && !isCorrect && (
                  <motion.span
                    className="absolute -top-2 -right-2 text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={shouldReduceMotion ? {} : { type: "spring", stiffness: 500, damping: 15 }}
                  >
                    ❌
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Обратная связь */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                className={`mt-6 text-xl font-semibold ${
                  isCorrect ? 'text-green-600' : 'text-red-600'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {isCorrect ? 'Правильно! Молодец! 🎉' : 'Попробуй ещё раз! 💪'}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
