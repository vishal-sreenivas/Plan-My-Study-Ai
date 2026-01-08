import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { activityAPI } from '../services/api';
import toast from 'react-hot-toast';

const CalendarHeatmap = () => {
  const [activities, setActivities] = useState([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hoveredDay, setHoveredDay] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

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

  // Generate calendar grid (last 365 days)
  const generateCalendar = () => {
    const today = new Date();
    const days = [];
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 365);

    // Create a map of activities by date string
    const activityMap = new Map();
    activities.forEach((activity) => {
      const dateStr = new Date(activity.date).toISOString().split('T')[0];
      activityMap.set(dateStr, activity.count);
    });

    // Generate all days
    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const count = activityMap.get(dateStr) || 0;
      days.push({
        date: new Date(date),
        dateStr,
        count,
      });
    }

    // Group into weeks (7 days per week)
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    return weeks;
  };

  const getColor = (count) => {
    if (count === 0) return 'bg-gray-200 dark:bg-dark-border';
    if (count >= 1 && count <= 2) return 'bg-green-300 dark:bg-green-500';
    if (count >= 3 && count <= 5) return 'bg-green-500 dark:bg-green-600';
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

  const weeks = generateCalendar();
  const monthLabels = [];
  const currentYear = new Date().getFullYear();
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Calculate month positions
  let lastMonth = -1;
  weeks.forEach((week, weekIndex) => {
    if (week.length > 0) {
      const firstDay = week[0].date;
      const month = firstDay.getMonth();
      if (month !== lastMonth) {
        monthLabels.push({ month, weekIndex });
        lastMonth = month;
      }
    }
  });

  if (loading) {
    return (
      <div className="glass-card p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-dark-border rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 dark:bg-dark-border rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
          Activity Calendar
        </h3>
        <p className="text-sm text-gray-600 dark:text-dark-text-muted">
          {totalContributions} contributions in the last year
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels */}
          <div className="flex mb-2 h-4">
            {monthLabels.map(({ month, weekIndex }) => (
              <div
                key={`${month}-${weekIndex}`}
                className="text-xs text-gray-500 dark:text-dark-text-muted"
                style={{
                  marginLeft: weekIndex === 0 ? '0' : `${weekIndex * 13}px`,
                }}
              >
                {months[month]}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 mr-2">
              {['Mon', '', 'Wed', '', 'Fri', '', ''].map((day, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-500 dark:text-dark-text-muted h-3 w-8 text-right"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <div className="flex gap-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1">
                  {week.map((day, dayIndex) => {
                    const isHovered = hoveredDay === day.dateStr;
                    return (
                      <div key={day.dateStr} className="relative">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (weekIndex * 7 + dayIndex) * 0.001 }}
                          onMouseEnter={() => setHoveredDay(day.dateStr)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`w-3 h-3 rounded ${getColor(day.count)} transition-all cursor-pointer ${
                            isHovered ? 'ring-2 ring-primary-500 scale-125 z-10' : ''
                          }`}
                        />
                        {isHovered && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 dark:bg-dark-surface text-white text-xs px-3 py-2 rounded shadow-lg whitespace-nowrap pointer-events-none z-50"
                          >
                            {day.count} {day.count === 1 ? 'activity' : 'activities'} on {formatDate(day.dateStr)}
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
      <div className="flex items-center gap-2 mt-4 text-xs text-gray-600 dark:text-dark-text-muted">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded bg-gray-200 dark:bg-dark-border"></div>
          <div className="w-3 h-3 rounded bg-green-300 dark:bg-green-500"></div>
          <div className="w-3 h-3 rounded bg-green-500 dark:bg-green-600"></div>
          <div className="w-3 h-3 rounded bg-green-700 dark:bg-green-800"></div>
        </div>
        <span>More</span>
      </div>

    </motion.div>
  );
};

export default CalendarHeatmap;

