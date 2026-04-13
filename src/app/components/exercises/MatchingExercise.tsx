import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { useAccessibility, useVibration } from "../../../contexts/AccessibilityContext";

interface MatchingPair {
  image: string;
  word: string;
  sound: string;
}

interface MatchingExerciseProps {
  onComplete: (score: number, accuracy: number) => void;
}

const pairs: MatchingPair[] = [
  { image: "🐱", word: "Кот", sound: "Мяу" },
  { image: "🐶", word: "Собака", sound: "Гав" },
  { image: "🐦", word: "Птица", sound: "Чик" },
  { image: "🚗", word: "Машина", sound: "Бип" },
  { image: "🐄", word: "Корова", sound: "Му" },
];

// Дополнительные варианты для создания выбора
const distractors: MatchingPair[] = [
  { image: "🐷", word: "Свинья", sound: "Хрю" },
  { image: "🐑", word: "Овца", sound: "Бе" },
  { image: "🐴", word: "Лошадь", sound: "Иго-го" },
  { image: "🐔", word: "Курица", sound: "Ко-ко" },
];

// Перемешать массив
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function MatchingExercise({ onComplete }: MatchingExerciseProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { vibrateClick, vibrateSuccess, vibrateError } = useVibration();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const currentPair = pairs[currentIndex];
  const progress = ((currentIndex) / pairs.length) * 100;

  // Генерируем варианты ответа для текущего вопроса
  const options = useMemo(() => {
    const correctAnswer = currentPair;
    
    // Выбираем 3 случайных неправильных ответа
    const availableDistractors = distractors.filter(d => d.sound !== correctAnswer.sound);
    const randomDistractors = shuffle(availableDistractors).slice(0, 3);
    
    // Объединяем правильный и неправильные ответы и перемешиваем
    return shuffle([correctAnswer, ...randomDistractors]);
  }, [currentPair]);

  const handleOptionSelect = useCallback((option: MatchingPair) => {
    if (isAnswered) return;

    vibrateClick();
    const correct = option.sound === currentPair.sound;
    setSelectedOption(option.sound);
    setIsCorrect(correct);
    setIsAnswered(true);

    if (correct) {
      vibrateSuccess();
      setScore(prev => prev + 1);
    } else {
      vibrateError();
    }
  }, [currentPair, isAnswered, vibrateClick, vibrateSuccess, vibrateError]);

  // Обработчик завершения упражнения
  const handleComplete = useCallback(() => {
    const accuracy = Math.round((score / pairs.length) * 100);
    onComplete(score, accuracy);
  }, [score, onComplete]);

  // Переход к следующему вопросу
  const handleNextQuestion = useCallback(() => {
    if (currentIndex < pairs.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      handleComplete();
    }
  }, [currentIndex, handleComplete]);

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      {/* Прогресс бар */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Вопрос {currentIndex + 1} из {pairs.length}
          </span>
          <span className="text-sm font-medium text-gray-600">
            Счёт: {score}
          </span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Основная область */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {/* Заголовок */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Найди пару!
            </h2>
            <p className="text-gray-600">
              Выбери правильный звук для этого изображения
            </p>
          </div>

          {/* Левая часть - изображение */}
          <div className="flex justify-center">
            <motion.div
              className="w-40 h-40 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={!shouldReduceMotion ? { scale: 1.05 } : {}}
              whileTap={!shouldReduceMotion ? { scale: 0.95 } : {}}
            >
              <span className="text-7xl">{currentPair.image}</span>
            </motion.div>
          </div>

          {/* Правая часть - варианты ответа */}
          <div className="grid grid-cols-2 gap-4 max-w-lg mx-auto">
            {options.map((option, index) => {
              const isSelected = selectedOption === option.sound;
              const isCorrectAnswer = option.sound === currentPair.sound;
              const showCorrect = isAnswered && isCorrectAnswer;
              const showWrong = isAnswered && isSelected && !isCorrectAnswer;

              return (
                <motion.button
                  key={`${currentIndex}-${option.sound}`}
                  initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={shouldReduceMotion ? {} : { delay: index * 0.1 }}
                  whileHover={(!isAnswered && !shouldReduceMotion) ? { scale: 1.05 } : {}}
                  whileTap={(!isAnswered && !shouldReduceMotion) ? { scale: 0.95 } : {}}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isAnswered}
                  className={`
                    relative p-4 rounded-xl border-2 transition-all duration-200
                    flex flex-col items-center gap-2
                    ${showCorrect 
                      ? "border-green-500 bg-green-50" 
                      : showWrong 
                        ? "border-red-500 bg-red-50" 
                        : isSelected 
                          ? "border-blue-500 bg-blue-50" 
                          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                    }
                    ${isAnswered && !isSelected && !isCorrectAnswer ? "opacity-60" : ""}
                  `}
                >
                  {/* Иконка изображения для варианта */}
                  <span className="text-3xl">{option.image}</span>
                  
                  {/* Слово */}
                  <span className="font-medium text-gray-800">{option.word}</span>
                  
                  {/* Звук */}
                  <span className="text-sm text-gray-500 italic">"{option.sound}"</span>

                  {/* Иконка правильности */}
                  {showCorrect && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2"
                    >
                      <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full" />
                    </motion.div>
                  )}
                  {showWrong && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2"
                    >
                      <XCircle className="w-8 h-8 text-red-500 bg-white rounded-full" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Обратная связь */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-center"
              >
                <div
                  className={`
                    inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold
                    ${isCorrect 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                    }
                  `}
                >
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Правильно! 🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5" />
                      <span>Не правильно. Правильный ответ: "{currentPair.sound}"</span>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Кнопка далее */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center"
              >
                <button
                  onClick={handleNextQuestion}
                  className="
                    px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 
                    text-white font-semibold rounded-full
                    hover:from-blue-600 hover:to-purple-600
                    transform hover:scale-105 transition-all duration-200
                    shadow-lg hover:shadow-xl
                  "
                >
                  {currentIndex < pairs.length - 1 ? "Следующий вопрос →" : "Завершить 🎊"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
