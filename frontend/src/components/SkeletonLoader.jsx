import { motion } from 'framer-motion';

// Shimmer overlay for skeleton elements
const ShimmerOverlay = () => (
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent" />
);

// Base skeleton element with shimmer
const SkeletonElement = ({ className }) => (
  <div className={`relative overflow-hidden bg-gray-200 dark:bg-dark-border rounded ${className}`}>
    <ShimmerOverlay />
  </div>
);

const SkeletonCard = () => {
  return (
    <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-xl border border-gray-200/50 dark:border-dark-border/50 p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="flex-1 space-y-2">
            <SkeletonElement className="h-6 w-3/4" />
            <SkeletonElement className="h-4 w-1/2" />
          </div>
          <SkeletonElement className="h-6 w-16" />
        </div>
        <div className="space-y-2">
          <SkeletonElement className="h-2 w-full" />
          <SkeletonElement className="h-2 w-5/6" />
        </div>
        <SkeletonElement className="h-2 w-full rounded-full" />
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
          <div className="space-y-3">
            <SkeletonElement className="h-5 w-3/4" />
            <SkeletonElement className="h-4 w-full" />
            <SkeletonElement className="h-4 w-2/3" />
            <SkeletonElement className="h-8 w-1/3" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Video card skeleton - matches VideoCard dimensions
export const VideoSkeleton = () => {
  return (
    <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 dark:border-dark-border/50 overflow-hidden">
      {/* Thumbnail */}
      <div className="relative aspect-video">
        <SkeletonElement className="h-full w-full rounded-none" />
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-dark-border/50" />
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2">
          <SkeletonElement className="h-5 w-12" />
        </div>
      </div>
      {/* Content */}
      <div className="p-3 space-y-2">
        <SkeletonElement className="h-4 w-full" />
        <SkeletonElement className="h-4 w-3/4" />
        <SkeletonElement className="h-3 w-1/2" />
      </div>
    </div>
  );
};

// Day card skeleton - matches DayCard collapsed state
export const DayCardSkeleton = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 dark:border-dark-border/50 p-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Day number circle */}
          <SkeletonElement className="h-10 w-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <SkeletonElement className="h-5 w-32" />
            <SkeletonElement className="h-3 w-24" />
          </div>
        </div>
        {/* Progress indicator */}
        <SkeletonElement className="h-8 w-20" />
      </div>
    </motion.div>
  );
};

// Multiple day cards skeleton
export const DayListSkeleton = ({ count = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <DayCardSkeleton />
        </motion.div>
      ))}
    </div>
  );
};

// Course detail header skeleton
export const CourseHeaderSkeleton = () => {
  return (
    <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-dark-border/50 p-6 space-y-4">
      {/* Title and badge */}
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <SkeletonElement className="h-8 w-2/3" />
          <SkeletonElement className="h-4 w-1/2" />
        </div>
        <SkeletonElement className="h-6 w-24" />
      </div>
      {/* Stats row */}
      <div className="flex gap-4">
        <SkeletonElement className="h-10 w-24" />
        <SkeletonElement className="h-10 w-24" />
        <SkeletonElement className="h-10 w-24" />
      </div>
      {/* Progress bar */}
      <SkeletonElement className="h-3 w-full rounded-full" />
    </div>
  );
};

// Module card skeleton
export const ModuleSkeleton = () => {
  return (
    <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-xl shadow-md border border-gray-200/50 dark:border-dark-border/50 p-4 space-y-3">
      <SkeletonElement className="h-5 w-3/4" />
      <SkeletonElement className="h-4 w-full" />
      <SkeletonElement className="h-4 w-2/3" />
    </div>
  );
};

// Grid of module skeletons
export const ModuleGridSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }, (_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
        >
          <ModuleSkeleton />
        </motion.div>
      ))}
    </div>
  );
};

// Full course detail page skeleton
export const CourseDetailSkeleton = () => {
  return (
    <div className="space-y-6">
      <CourseHeaderSkeleton />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <DayListSkeleton count={5} />
        </div>
        <div className="space-y-4">
          <ModuleGridSkeleton count={2} />
        </div>
      </div>
    </div>
  );
};

// Tabs skeleton for day navigation
export const TabsSkeleton = () => {
  return (
    <div className="flex gap-2 overflow-hidden pb-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <SkeletonElement key={i} className="h-10 w-20 flex-shrink-0" />
      ))}
    </div>
  );
};

export default SkeletonCard;

