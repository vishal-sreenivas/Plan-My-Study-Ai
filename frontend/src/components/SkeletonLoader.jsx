import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-xl border border-gray-200/50 dark:border-dark-border/50 p-6">
      <div className="animate-pulse space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <div className="h-6 bg-gray-200 dark:bg-dark-border rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-1/2"></div>
          </div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-dark-border rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-2 bg-gray-200 dark:bg-dark-border rounded"></div>
          <div className="h-2 bg-gray-200 dark:bg-dark-border rounded w-5/6"></div>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-dark-border rounded-full"></div>
      </div>
    </div>
  );
};

export const CourseSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <SkeletonCard />
        </motion.div>
      ))}
    </div>
  );
};

export const LessonSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-xl shadow-md dark:shadow-lg border border-gray-200/50 dark:border-dark-border/50 p-5"
        >
          <div className="animate-pulse space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-dark-border rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-dark-border rounded w-2/3"></div>
            <div className="h-8 bg-gray-200 dark:bg-dark-border rounded w-1/3"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonCard;

