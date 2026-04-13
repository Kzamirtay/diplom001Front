import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccessibility, useVibration } from "../../../contexts/AccessibilityContext";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface MemoryExerciseProps {
  onComplete: (score: number, accuracy: number) => void;
}

const EMOJIS = ['🐱', '🐶', '🐦', '🚗', '🐄', '🐟'];

export default function MemoryExercise({ onComplete }: MemoryExerciseProps) {
  const { shouldReduceMotion } = useAccessibility();
  const { vibrateClick, vibrateSuccess } = useVibration();
  
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Initialize game
  const initializeGame = useCallback(() => {
    const shuffledEmojis = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setTimer(0);
    setIsGameActive(true);
    setIsProcessing(false);
    setGameCompleted(false);
  }, []);

  // Start game on mount
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive && !gameCompleted) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isGameActive, gameCompleted]);

  // Handle card click
  const handleCardClick = useCallback(
    (cardId: number) => {
      if (
        isProcessing ||
        flippedCards.includes(cardId) ||
        cards[cardId].isMatched ||
        flippedCards.length >= 2
      ) {
        return;
      }

      vibrateClick();
      const newFlippedCards = [...flippedCards, cardId];
      setFlippedCards(newFlippedCards);

      setCards((prev) =>
        prev.map((card) =>
          card.id === cardId ? { ...card, isFlipped: true } : card
        )
      );

      if (newFlippedCards.length === 2) {
        setIsProcessing(true);
        setMoves((prev) => prev + 1);

        const [firstId, secondId] = newFlippedCards;
        const firstCard = cards[firstId];
        const secondCard = cards[secondId];

        if (firstCard.emoji === secondCard.emoji) {
          // Match found
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) =>
                card.id === firstId || card.id === secondId
                  ? { ...card, isMatched: true }
                  : card
              )
            );
            setMatches((prev) => prev + 1);
            setFlippedCards([]);
            setIsProcessing(false);
            vibrateSuccess();
          }, 500);
        } else {
          // No match
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) =>
                card.id === firstId || card.id === secondId
                  ? { ...card, isFlipped: false }
                  : card
              )
            );
            setFlippedCards([]);
            setIsProcessing(false);
          }, shouldReduceMotion ? 600 : 1000);
        }
      }
    },
    [cards, flippedCards, isProcessing, shouldReduceMotion, vibrateClick, vibrateSuccess]
  );

  // Check game completion
  useEffect(() => {
    if (matches === EMOJIS.length && matches > 0 && !gameCompleted) {
      setGameCompleted(true);
      setIsGameActive(false);

      // Calculate score and accuracy
      const totalPairs = EMOJIS.length;
      const accuracy = totalPairs / moves;
      const timeBonus = Math.max(0, 60 - timer) * 10;
      const movesBonus = Math.max(0, totalPairs * 2 - moves) * 50;
      const score = Math.round(accuracy * 500 + timeBonus + movesBonus + 1000);

      setTimeout(() => {
        onComplete(score, Math.round(accuracy * 100));
      }, 500);
    }
  }, [matches, moves, timer, onComplete, gameCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {/* Stats Bar */}
      <div className="flex justify-between items-center mb-6 bg-white rounded-xl shadow-md p-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Время</p>
            <p className="text-2xl font-bold text-indigo-600 font-mono">
              {formatTime(timer)}
            </p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Попытки</p>
            <p className="text-2xl font-bold text-indigo-600">{moves}</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Найдено</p>
            <p className="text-2xl font-bold text-green-600">
              {matches}/{EMOJIS.length}
            </p>
          </div>
        </div>
        <button
          onClick={initializeGame}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
        >
          🔄 Заново
        </button>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            className="relative aspect-square cursor-pointer"
            onClick={() => handleCardClick(card.id)}
            whileHover={(!card.isFlipped && !card.isMatched && !shouldReduceMotion) ? { scale: 1.05 } : {}}
            whileTap={(!card.isFlipped && !card.isMatched && !shouldReduceMotion) ? { scale: 0.95 } : {}}
          >
            <motion.div
              className="w-full h-full relative"
              initial={false}
              animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
              transition={{ duration: shouldReduceMotion ? 0.2 : 0.4, ease: 'easeInOut' }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card Back (Closed) */}
              <div
                className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg flex items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-3xl text-white/50">?</span>
              </div>

              {/* Card Front (Open) */}
              <div
                className={`absolute inset-0 rounded-xl shadow-lg flex items-center justify-center ${
                  card.isMatched
                    ? 'bg-gradient-to-br from-green-100 to-green-200 ring-2 ring-green-400'
                    : 'bg-white ring-2 ring-indigo-200'
                }`}
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                }}
              >
                <AnimatePresence>
                  {(card.isFlipped || card.isMatched) && (
                    <motion.span
                      initial={shouldReduceMotion ? false : { scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{ duration: shouldReduceMotion ? 0.1 : 0.3, delay: shouldReduceMotion ? 0 : 0.1 }}
                      className="text-4xl sm:text-5xl select-none"
                    >
                      {card.emoji}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Matched Indicator */}
            {card.isMatched && (
              <motion.div
                initial={shouldReduceMotion ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md"
              >
                <span className="text-white text-xs">✓</span>
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <div className="mt-6 text-center text-gray-600 text-sm">
        <p>Найдите все пары одинаковых картинок!</p>
        <p className="text-xs mt-1 text-gray-400">
          Открывайте по 2 карточки. Совпадают — остаются открытыми.
        </p>
      </div>

      {/* Completion Overlay */}
      <AnimatePresence>
        {gameCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={shouldReduceMotion ? false : { scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-sm mx-4"
            >
              <motion.div
                animate={shouldReduceMotion ? {} : { rotate: [0, 10, -10, 10, 0] }}
                transition={shouldReduceMotion ? {} : { duration: 0.5, repeat: 2 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Отлично!</h2>
              <p className="text-gray-600 mb-4">Вы нашли все пары!</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Попыток</p>
                  <p className="text-xl font-bold text-indigo-600">{moves}</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Время</p>
                  <p className="text-xl font-bold text-indigo-600">
                    {formatTime(timer)}
                  </p>
                </div>
              </div>
              <button
                onClick={initializeGame}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors"
              >
                Играть снова
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
