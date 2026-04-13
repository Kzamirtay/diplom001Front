import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccessibility, useVibration } from "../../../contexts/AccessibilityContext";

interface SoundExerciseProps {
  onComplete: (score: number, accuracy: number) => void;
}

interface Question {
  sound: string;
  correct: string;
  options: string[];
}

const questions: Question[] = [
  { sound: "Мяу", correct: "🐱", options: ["🐱", "🐶", "🐦"] },
  { sound: "Гав", correct: "🐶", options: ["🐱", "🐶", "🚗"] },
  { sound: "Чик-чирик", correct: "🐦", options: ["🐱", "🐦", "🚗"] },
  { sound: "Бип-бип", correct: "🚗", options: ["🐶", "🐦", "🚗"] },
  { sound: "Му", correct: "🐄", options: ["🐄", "🐶", "🐱"] },
];

export default function SoundExercise({ onComplete }: SoundExerciseProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { vibrateClick, vibrateSuccess, vibrateError } = useVibration();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleOptionClick = useCallback((option: string) => {
    if (showFeedback) return;

    vibrateClick();
    setSelectedOption(option);
    const correct = option === currentQ.correct;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      vibrateSuccess();
      setScore((prev) => prev + 1);
    } else {
      vibrateError();
    }
  }, [currentQ.correct, showFeedback, vibrateClick, vibrateSuccess, vibrateError]);

  const handleNext = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
      setShowFeedback(false);
    } else {
      setIsFinished(true);
    }
  }, [currentQuestion]);

  // Вызываем onComplete при завершении
  useEffect(() => {
    if (isFinished) {
      const totalAccuracy = Math.round((score / questions.length) * 100);
      onComplete(score, totalAccuracy);
    }
  }, [isFinished, onComplete, score]);

  if (isFinished) {
    const totalAccuracy = Math.round((score / questions.length) * 100);
    
    return (
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl"
      >
        <motion.div
          initial={shouldReduceMotion ? false : { scale: 0 }}
          animate={{ scale: 1 }}
          transition={shouldReduceMotion ? {} : { type: "spring", stiffness: 200, damping: 15 }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>
        
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Упражнение завершено!</h2>
        
        <div className="flex gap-8 mb-6">
          <div className="text-center">
            <p className="text-4xl font-bold text-purple-600">{score}/{questions.length}</p>
            <p className="text-sm text-gray-600">правильных ответов</p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-bold text-pink-600">{totalAccuracy}%</p>
            <p className="text-sm text-gray-600">точность</p>
          </div>
        </div>

        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 1 }}
          className="mt-8 text-gray-500 text-sm"
        >
          Сохранение результатов...
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Прогресс бар */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Вопрос {currentQuestion + 1} из {questions.length}</span>
          <span>Счет: {score}</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Вопрос */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={shouldReduceMotion ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          {/* Звук */}
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-4">Какой звук вы слышите?</p>
            <motion.div
              animate={shouldReduceMotion ? {} : {
                scale: [1, 1.1, 1],
              }}
              transition={shouldReduceMotion ? {} : {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full"
            >
              <span className="text-3xl">🔊</span>
              <span className="text-2xl font-bold text-purple-700">
                &quot;{currentQ.sound}&quot;
              </span>
            </motion.div>
          </div>

          {/* Варианты ответов */}
          <div className="grid grid-cols-3 gap-4">
            {currentQ.options.map((option, index) => {
              const isSelected = selectedOption === option;
              const isCorrectAnswer = option === currentQ.correct;
              const showCorrect = showFeedback && isCorrectAnswer;
              const showWrong = showFeedback && isSelected && !isCorrect;

              return (
                <motion.button
                  key={`${currentQuestion}-${index}`}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={shouldReduceMotion ? {} : { delay: index * 0.1 }}
                  whileHover={(!showFeedback && !shouldReduceMotion) ? { scale: 1.05 } : {}}
                  whileTap={(!showFeedback && !shouldReduceMotion) ? { scale: 0.95 } : {}}
                  onClick={() => handleOptionClick(option)}
                  disabled={showFeedback}
                  className={`
                    relative p-6 rounded-xl text-5xl transition-all duration-300
                    ${showCorrect 
                      ? "bg-green-100 border-4 border-green-500 shadow-lg shadow-green-200" 
                      : showWrong 
                        ? "bg-red-100 border-4 border-red-500" 
                        : isSelected 
                          ? "bg-purple-100 border-4 border-purple-500" 
                          : "bg-gray-50 border-4 border-transparent hover:bg-purple-50 hover:border-purple-200"
                    }
                  `}
                >
                  {option}
                  
                  {/* Индикатор правильного/неправильного ответа */}
                  <AnimatePresence>
                    {showCorrect && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-lg"
                      >
                        ✓
                      </motion.div>
                    )}
                    {showWrong && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-lg"
                      >
                        ✕
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>

          {/* Обратная связь */}
          <AnimatePresence>
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mt-8 text-center"
              >
                {isCorrect ? (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={shouldReduceMotion ? {} : { type: "spring", stiffness: 300 }}
                      className="text-4xl mb-2"
                    >
                      🎉
                    </motion.div>
                    <p className="text-green-600 font-bold text-lg">
                      Правильно! Отличная работа!
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={shouldReduceMotion ? {} : { type: "spring", stiffness: 300 }}
                      className="text-4xl mb-2"
                    >
                      💪
                    </motion.div>
                    <p className="text-gray-600 font-medium">
                      Не правильно. Правильный ответ: {currentQ.correct}
                    </p>
                  </div>
                )}

                <motion.button
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}
                  whileHover={!shouldReduceMotion ? { scale: 1.05 } : {}}
                  whileTap={!shouldReduceMotion ? { scale: 0.95 } : {}}
                  onClick={handleNext}
                  className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors"
                >
                  {currentQuestion < questions.length - 1 ? "Следующий вопрос →" : "Завершить упражнение"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
