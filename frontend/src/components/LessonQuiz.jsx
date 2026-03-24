import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * LessonQuiz - Interactive quiz component for lesson comprehension
 *
 * Features:
 * - Start quiz button
 * - Multiple choice questions
 * - Immediate feedback on answer selection
 * - Explanations for correct answers
 * - Progress tracking
 */
const LessonQuiz = ({ quiz, lessonTitle }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});

  if (!quiz || quiz.length === 0) return null;

  // If quiz not started, show start button
  if (!quizStarted) {
    return (
      <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
              Lesson Quiz Available
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-dark-text-muted mb-4">
            Test your knowledge with {quiz.length} question{quiz.length > 1 ? 's' : ''} about this lesson.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setQuizStarted(true)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-lg font-medium shadow-md transition-all text-sm"
          >
            Start Quiz
          </motion.button>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz[currentQuestionIndex];
  const totalQuestions = quiz.length;
  const isAnswered = selectedAnswers[currentQuestionIndex] !== undefined;
  const selectedAnswer = selectedAnswers[currentQuestionIndex];
  const correctAnswer = currentQuestion.correctAnswer?.trim().toUpperCase();
  const isCorrect = selectedAnswer === correctAnswer;

  const handleAnswerSelect = (answer) => {
    if (!isAnswered) {
      setSelectedAnswers({ ...selectedAnswers, [currentQuestionIndex]: answer });
      setShowExplanation({ ...showExplanation, [currentQuestionIndex]: true });
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const getScore = () => {
    let correct = 0;
    quiz.forEach((q, index) => {
      const selectedAnswer = selectedAnswers[index];
      const correctAnswer = q.correctAnswer?.trim().toUpperCase();
      if (selectedAnswer === correctAnswer) {
        correct++;
      }
    });
    return { correct, total: totalQuestions };
  };

  const score = getScore();
  const allAnswered = Object.keys(selectedAnswers).length === totalQuestions;

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h4 className="text-base font-semibold text-gray-900 dark:text-white">
            Lesson Quiz
          </h4>
        </div>

        {/* Score badge */}
        {allAnswered && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`px-3 py-1 rounded-full text-sm font-bold ${
              score.correct === score.total
                ? 'bg-green-500 text-white'
                : score.correct >= score.total * 0.7
                  ? 'bg-yellow-500 text-white'
                  : 'bg-red-500 text-white'
            }`}
          >
            Score: {score.correct}/{score.total}
          </motion.div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-600 dark:text-dark-text-muted mb-2">
          <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
          <span>{Object.keys(selectedAnswers).length}/{totalQuestions} answered</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
            className="h-full bg-purple-500"
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-base font-semibold text-gray-900 dark:text-white mb-4">
            {currentQuestion.question}
          </p>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              // Convert index to letter (0 -> A, 1 -> B, 2 -> C, 3 -> D)
              const optionLetter = String.fromCharCode(65 + index); // A, B, C, D
              const isSelected = selectedAnswer === optionLetter;
              const isCorrectOption = correctAnswer === optionLetter;
              const showCorrect = isAnswered && isCorrectOption;
              const showWrong = isAnswered && isSelected && !isCorrect;

              return (
                <motion.button
                  key={index}
                  whileHover={!isAnswered ? { scale: 1.02 } : {}}
                  whileTap={!isAnswered ? { scale: 0.98 } : {}}
                  onClick={() => handleAnswerSelect(optionLetter)}
                  disabled={isAnswered}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showCorrect
                      ? 'bg-green-100 dark:bg-green-900/30 border-green-500 dark:border-green-600'
                      : showWrong
                        ? 'bg-red-100 dark:bg-red-900/30 border-red-500 dark:border-red-600'
                        : isSelected
                          ? 'bg-purple-100 dark:bg-purple-900/30 border-purple-500 dark:border-purple-600'
                          : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border hover:border-purple-300 dark:hover:border-purple-700'
                  } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {optionLetter}. {option}
                    </span>
                    {showCorrect && (
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {showWrong && (
                      <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {showExplanation[currentQuestionIndex] && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mt-4 p-4 rounded-lg ${
                  isCorrect
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div>
                    <p className={`text-sm font-semibold mb-1 ${
                      isCorrect
                        ? 'text-green-800 dark:text-green-200'
                        : 'text-red-800 dark:text-red-200'
                    }`}>
                      {isCorrect ? 'Correct!' : `Incorrect. The correct answer is ${currentQuestion.correctAnswer}.`}
                    </p>
                    <p className={`text-sm ${
                      isCorrect
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-red-700 dark:text-red-300'
                    }`}>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-dark-border">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-dark-text bg-white dark:bg-dark-card border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-dark-surface disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous
        </button>

        {currentQuestionIndex < totalQuestions - 1 ? (
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-500 rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        ) : (
          allAnswered && (
            <div className="text-sm font-medium text-gray-600 dark:text-dark-text-muted">
              Quiz Complete!
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LessonQuiz;
