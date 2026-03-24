import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * DayTabs - Horizontal scrollable tab navigation for course days
 *
 * Features:
 * - Auto-scrolls to active day
 * - Shows completion status per day
 * - Highlights current day based on course start date
 * - Mobile-friendly horizontal scroll with snap
 * - Day regeneration with confirmation modal
 */
const DayTabs = ({
  days,
  activeDay,
  onDayChange,
  completionMap,
  courseCreatedAt,
  courseId,
  onRegenerateDay,
  regeneratingDay
}) => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [dayToRegenerate, setDayToRegenerate] = useState(null);

  // Calculate which day is "today" based on course start date
  const getCurrentCourseDay = () => {
    if (!courseCreatedAt) return 1;
    const startDate = new Date(courseCreatedAt);
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(Math.max(1, diffDays), days.length);
  };

  const currentCourseDay = getCurrentCourseDay();

  // Calculate completion for each day
  const getDayCompletion = (day) => {
    if (!day.lessons || day.lessons.length === 0) return { completed: 0, total: 0, percent: 0 };

    let completed = 0;
    const total = day.lessons.length;

    day.lessons.forEach(lesson => {
      const key = `${day.day}-${lesson.id}`;
      if (completionMap.get(key)) {
        completed++;
      }
    });

    return {
      completed,
      total,
      percent: Math.round((completed / total) * 100),
    };
  };

  // Check scroll position for arrow visibility
  const updateArrows = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll active day into view
  useEffect(() => {
    if (scrollRef.current) {
      const activeButton = scrollRef.current.querySelector(`[data-day="${activeDay}"]`);
      if (activeButton) {
        activeButton.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
    updateArrows();
  }, [activeDay]);

  // Initialize arrow visibility
  useEffect(() => {
    updateArrows();
    window.addEventListener('resize', updateArrows);
    return () => window.removeEventListener('resize', updateArrows);
  }, [days]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleOpenRegenerateModal = (e, dayNumber) => {
    e.stopPropagation(); // Prevent day selection
    setDayToRegenerate(dayNumber);
    setShowConfirmModal(true);
  };

  const handleConfirmRegenerate = () => {
    if (dayToRegenerate && onRegenerateDay) {
      onRegenerateDay(dayToRegenerate);
    }
    setShowConfirmModal(false);
    setDayToRegenerate(null);
  };

  const handleCancelRegenerate = () => {
    setShowConfirmModal(false);
    setDayToRegenerate(null);
  };

  return (
    <div className="relative mb-6">
      {/* Left scroll arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-dark-card shadow-lg rounded-full border border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Tabs container */}
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-2 px-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {days.map((day) => {
          const completion = getDayCompletion(day);
          const isActive = activeDay === day.day;
          const isToday = currentCourseDay === day.day;
          const isCompleted = completion.percent === 100;
          const isRegenerating = regeneratingDay === day.day;

          return (
            <motion.div
              key={day.day}
              className="relative group flex-shrink-0"
            >
              <motion.button
                data-day={day.day}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onDayChange(day.day)}
                disabled={isRegenerating}
                className={`
                  relative snap-start px-4 py-3 rounded-xl font-medium transition-all
                  min-w-[100px] flex flex-col items-center gap-1
                  ${isRegenerating
                    ? 'opacity-50 cursor-not-allowed'
                    : isActive
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/25'
                      : isCompleted
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                        : 'bg-white dark:bg-dark-card text-gray-700 dark:text-dark-text border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-surface'
                  }
                `}
              >
                {/* Regenerating spinner */}
                {isRegenerating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-dark-card/50 rounded-xl backdrop-blur-sm">
                    <svg className="animate-spin h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                )}

                {/* Day number */}
                <span className="text-sm font-bold">Day {day.day}</span>

                {/* Progress indicator */}
                <div className="flex items-center gap-1">
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-dark-text-muted'}`}>
                      {completion.completed}/{completion.total}
                    </span>
                  )}
                </div>

                {/* Today indicator */}
                {isToday && !isActive && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white dark:border-dark-card" />
                )}

                {/* Active indicator line */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-2 right-2 h-1 bg-white/40 rounded-full"
                  />
                )}
              </motion.button>

              {/* Regenerate button - always visible on mobile, hover on desktop */}
              {onRegenerateDay && !isRegenerating && (
                <button
                  onClick={(e) => handleOpenRegenerateModal(e, day.day)}
                  className="absolute -top-2 -right-2 w-7 h-7 md:w-6 md:h-6 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all flex items-center justify-center z-10 touch-manipulation"
                  title="Regenerate this day"
                >
                  <svg className="w-4 h-4 md:w-3.5 md:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Right scroll arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white dark:bg-dark-card shadow-lg rounded-full border border-gray-200 dark:border-dark-border text-gray-600 dark:text-dark-text hover:bg-gray-50 dark:hover:bg-dark-surface transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Gradient fade on edges */}
      <div className="absolute left-0 top-0 bottom-2 w-8 bg-gradient-to-r from-gray-50 dark:from-dark-bg to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-gray-50 dark:from-dark-bg to-transparent pointer-events-none" />

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={handleCancelRegenerate}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-dark-border"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    Regenerate Day {dayToRegenerate}?
                  </h3>
                  <p className="text-gray-600 dark:text-dark-text-muted text-sm">
                    This will create new lessons and content for Day {dayToRegenerate}. Your current progress for this day will be preserved, but the lesson content will be replaced.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancelRegenerate}
                  className="px-4 py-2 bg-gray-100 dark:bg-dark-surface text-gray-700 dark:text-dark-text rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-dark-border transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmRegenerate}
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium shadow-lg transition-all"
                >
                  Regenerate Day
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DayTabs;
