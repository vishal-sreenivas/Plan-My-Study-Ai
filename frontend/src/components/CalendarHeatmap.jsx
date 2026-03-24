import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { activityAPI } from '../services/api';
import toast from 'react-hot-toast';

const CalendarHeatmap = ({ activities: propActivities }) => {
  const [activities, setActivities] = useState(propActivities || []);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(!propActivities);
  const [hoveredDay, setHoveredDay] = useState(null);
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'streak'

  useEffect(() => {
    // Only fetch if activities not provided as props
    if (!propActivities) {
      fetchActivities();
    } else {
      setActivities(propActivities);
      setLoading(false);
    }
  }, [propActivities]);

  const fetchActivities = async () => {
    try {
      const response = await activityAPI.getAll();
      setActivities(response.data.data.activities);
      setTotalContributions(response.data.data.totalContributions || 0);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      toast.error('Failed to load activity calendar');
    } finally {
      setLoading(false);
    }
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get today's date string for comparison
  const todayStr = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  }, []);

  // Generate calendar grid (last 52 weeks + current partial week)
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Create activity map
    const activityMap = new Map();
    activities.forEach((activity) => {
      const dateStr = new Date(activity.date).toISOString().split('T')[0];
      activityMap.set(dateStr, activity.count);
    });

    // Find the start date: go back ~1 year and align to Sunday
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 364); // Go back ~1 year
    // Align to the previous Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    // Generate weeks (columns) with days (rows)
    const weeksArray = [];
    const monthLabelsArray = [];
    let currentDate = new Date(startDate);
    let lastMonth = -1;

    while (currentDate <= today) {
      const week = [];
      const weekStartMonth = currentDate.getMonth();

      // Check if we should add a month label for this week
      if (weekStartMonth !== lastMonth) {
        monthLabelsArray.push({
          month: weekStartMonth,
          weekIndex: weeksArray.length,
        });
        lastMonth = weekStartMonth;
      }

      // Fill in the 7 days of this week (Sun-Sat)
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const cellDate = new Date(currentDate);
        cellDate.setDate(currentDate.getDate() + dayOfWeek);

        if (cellDate > today) {
          // Future date - add empty placeholder
          week.push(null);
        } else {
          const dateStr = cellDate.toISOString().split('T')[0];
          week.push({
            date: new Date(cellDate),
            dateStr,
            count: activityMap.get(dateStr) || 0,
            dayOfWeek,
          });
        }
      }

      weeksArray.push(week);
      // Move to next week
      currentDate.setDate(currentDate.getDate() + 7);
    }

    return { weeks: weeksArray, monthLabels: monthLabelsArray };
  }, [activities]);

  // Calculate streak data
  const streakData = useMemo(() => {
    if (activities.length === 0) {
      return { currentStreak: 0, longestStreak: 0, streakDays: [] };
    }

    // Create a set of active dates
    const activeDates = new Set();
    activities.forEach((activity) => {
      if (activity.count > 0) {
        const dateStr = new Date(activity.date).toISOString().split('T')[0];
        activeDates.add(dateStr);
      }
    });

    // Calculate current streak (counting back from today)
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let checkDate = new Date(today);

    // Check if today has activity, if not start from yesterday
    const todayDateStr = checkDate.toISOString().split('T')[0];
    if (!activeDates.has(todayDateStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (true) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (activeDates.has(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    const sortedDates = Array.from(activeDates).sort();

    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const diffDays = Math.round((currDate - prevDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      currentStreak,
      longestStreak,
      activeDates,
    };
  }, [activities]);

  const getColor = (count) => {
    if (count === 0) return 'bg-gray-200 dark:bg-dark-border';
    if (count <= 2) return 'bg-green-300 dark:bg-green-500';
    if (count <= 5) return 'bg-green-500 dark:bg-green-600';
    return 'bg-green-700 dark:bg-green-800';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="glass-card p-6 mb-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-dark-border rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-dark-border rounded"></div>
        </div>
      </div>
    );
  }

  const cellSize = 12; // Size of each cell in pixels
  const cellGap = 3;   // Gap between cells
  const totalCellSize = cellSize + cellGap;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-6"
    >
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Activity Calendar
          </h3>
          <p className="text-sm text-gray-600 dark:text-dark-text-muted">
            {totalContributions} contributions in the last year
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
              viewMode === 'calendar'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-dark-surface'
            }`}
          >
            Calendar
          </button>
          <button
            onClick={() => setViewMode('streak')}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all flex items-center gap-1.5 ${
              viewMode === 'streak'
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-dark-text-muted hover:bg-gray-200 dark:hover:bg-dark-surface'
            }`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
            Streak
          </button>
        </div>
      </div>

      {viewMode === 'streak' ? (
        /* Streak View */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="py-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Streak */}
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-white/90 font-medium">Current Streak</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{streakData.currentStreak}</span>
                <span className="text-white/80">{streakData.currentStreak === 1 ? 'day' : 'days'}</span>
              </div>
              {streakData.currentStreak > 0 && (
                <p className="text-sm text-white/70 mt-2">
                  Keep going! You're on fire!
                </p>
              )}
              {streakData.currentStreak === 0 && (
                <p className="text-sm text-white/70 mt-2">
                  Start studying today to begin your streak!
                </p>
              )}
            </div>

            {/* Longest Streak */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-5 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span className="text-white/90 font-medium">Longest Streak</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">{streakData.longestStreak}</span>
                <span className="text-white/80">{streakData.longestStreak === 1 ? 'day' : 'days'}</span>
              </div>
              {streakData.currentStreak >= streakData.longestStreak && streakData.currentStreak > 0 && (
                <p className="text-sm text-white/70 mt-2">
                  You're at your best! New record!
                </p>
              )}
              {streakData.currentStreak < streakData.longestStreak && streakData.longestStreak > 0 && (
                <p className="text-sm text-white/70 mt-2">
                  {streakData.longestStreak - streakData.currentStreak} more days to beat your record!
                </p>
              )}
            </div>
          </div>

          {/* Streak Stats */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-dark-surface rounded-xl">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalContributions}</p>
                <p className="text-xs text-gray-500 dark:text-dark-text-muted">Total Activities</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {streakData.activeDates?.size || 0}
                </p>
                <p className="text-xs text-gray-500 dark:text-dark-text-muted">Active Days</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {streakData.activeDates?.size ? Math.round((streakData.activeDates.size / 365) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500 dark:text-dark-text-muted">Consistency</p>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        /* Calendar View */
        <>
          <div className="overflow-x-auto">
            <div className="inline-block">
              {/* Month labels */}
              <div className="flex ml-10 mb-1" style={{ height: '16px' }}>
                {monthLabels.map(({ month, weekIndex }, index) => {
                  // Calculate position and width for this month label
                  const nextMonthIndex = monthLabels[index + 1]?.weekIndex ?? weeks.length;
                  const monthWidth = (nextMonthIndex - weekIndex) * totalCellSize;

                  return (
                    <div
                      key={`${month}-${weekIndex}`}
                      className="text-xs text-gray-500 dark:text-dark-text-muted shrink-0"
                      style={{
                        width: `${monthWidth}px`,
                      }}
                    >
                      {months[month]}
                    </div>
                  );
                })}
              </div>

              {/* Calendar grid */}
              <div className="flex">
                {/* Day labels */}
                <div className="flex flex-col mr-2" style={{ gap: `${cellGap}px` }}>
                  {dayLabels.map((day, i) => (
                    <div
                      key={i}
                      className="text-xs text-gray-500 dark:text-dark-text-muted text-right pr-1 flex items-center justify-end"
                      style={{ height: `${cellSize}px`, width: '32px' }}
                    >
                      {i % 2 === 1 ? day : ''}
                    </div>
                  ))}
                </div>

                {/* Weeks grid */}
                <div className="flex" style={{ gap: `${cellGap}px` }}>
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col" style={{ gap: `${cellGap}px` }}>
                      {week.map((day, dayIndex) => {
                        if (day === null) {
                          // Empty cell for future dates
                          return (
                            <div
                              key={`empty-${dayIndex}`}
                              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                            />
                          );
                        }

                        const isHovered = hoveredDay === day.dateStr;
                        const isToday = day.dateStr === todayStr;
                        return (
                          <div key={day.dateStr} className="relative">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: Math.min(weekIndex * 0.01, 0.5) }}
                              onMouseEnter={() => setHoveredDay(day.dateStr)}
                              onMouseLeave={() => setHoveredDay(null)}
                              className={`rounded-sm ${getColor(day.count)} transition-all cursor-pointer ${
                                isHovered ? 'ring-2 ring-primary-500 scale-125 z-10' : ''
                              } ${isToday ? 'ring-2 ring-offset-1 ring-blue-500 dark:ring-blue-400' : ''}`}
                              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
                            />
                            {isHovered && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 dark:bg-dark-surface text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap pointer-events-none z-50"
                              >
                                <strong>{day.count} {day.count === 1 ? 'activity' : 'activities'}</strong>
                                {isToday && <span className="ml-1 text-blue-300">(Today)</span>}
                                <br />
                                {formatDate(day.dateStr)}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                                  <div className="border-4 border-transparent border-t-gray-900 dark:border-t-dark-surface"></div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between gap-2 mt-4 text-xs text-gray-600 dark:text-dark-text-muted">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-dark-border ring-2 ring-offset-1 ring-blue-500"></div>
              <span>Today</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Less</span>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-gray-200 dark:bg-dark-border"></div>
                <div className="w-3 h-3 rounded-sm bg-green-300 dark:bg-green-500"></div>
                <div className="w-3 h-3 rounded-sm bg-green-500 dark:bg-green-600"></div>
                <div className="w-3 h-3 rounded-sm bg-green-700 dark:bg-green-800"></div>
              </div>
              <span>More</span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default CalendarHeatmap;

