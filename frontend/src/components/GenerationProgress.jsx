import { motion, AnimatePresence } from 'framer-motion';

/**
 * GenerationProgress - Visual stepper for course generation progress
 *
 * Shows the current step in the generation process with animations
 */
const GenerationProgress = ({ currentStep, steps, error }) => {
  // Default steps if not provided
  const defaultSteps = [
    { id: 'start', label: 'Starting', icon: '🚀' },
    { id: 'plan-generating', label: 'Creating Study Plan', icon: '📝' },
    { id: 'plan-complete', label: 'Plan Created', icon: '✅' },
    { id: 'video-fetching', label: 'Finding Videos', icon: '🎬' },
    { id: 'video-complete', label: 'Videos Found', icon: '✅' },
    { id: 'saving', label: 'Saving Course', icon: '💾' },
    { id: 'complete', label: 'Complete!', icon: '🎉' },
  ];

  const progressSteps = steps || defaultSteps;

  // Find current step index
  const currentIndex = progressSteps.findIndex(s => s.id === currentStep?.type);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Main progress card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200/50 dark:border-dark-border/50 p-6"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
            className="text-4xl mb-2"
          >
            {error ? '❌' : currentStep?.type === 'complete' ? '🎉' : '✨'}
          </motion.div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {error ? 'Generation Failed' : currentStep?.type === 'complete' ? 'Course Ready!' : 'Creating Your Course'}
          </h3>
          <p className="text-sm text-gray-600 dark:text-dark-text-muted mt-1">
            {error || currentStep?.message || 'Please wait...'}
          </p>
        </div>

        {/* Progress steps */}
        <div className="space-y-3">
          {progressSteps.map((step, index) => {
            const isActive = step.id === currentStep?.type;
            const isComplete = currentIndex > index || currentStep?.type === 'complete';
            const isPending = currentIndex < index && currentStep?.type !== 'complete';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                    : isComplete
                      ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                      : 'bg-gray-50 dark:bg-dark-surface border border-transparent'
                }`}
              >
                {/* Step icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : isComplete
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 dark:bg-dark-border text-gray-400 dark:text-dark-text-muted'
                  }`}
                >
                  {isComplete && !isActive ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : isActive ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <span className="text-xs">{index + 1}</span>
                  )}
                </div>

                {/* Step label */}
                <div className="flex-1">
                  <span
                    className={`text-sm font-medium ${
                      isActive
                        ? 'text-primary-700 dark:text-primary-300'
                        : isComplete
                          ? 'text-green-700 dark:text-green-300'
                          : 'text-gray-500 dark:text-dark-text-muted'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Status indicator */}
                {isActive && currentStep?.day && currentStep?.totalDays && (
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                    Day {currentStep.day}/{currentStep.totalDays}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-6">
          <div className="h-2 bg-gray-200 dark:bg-dark-border rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width: error
                  ? '100%'
                  : `${((currentIndex + 1) / progressSteps.length) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                error
                  ? 'bg-red-500'
                  : currentStep?.type === 'complete'
                    ? 'bg-green-500'
                    : 'bg-primary-500'
              }`}
            />
          </div>
          <p className="text-xs text-center text-gray-500 dark:text-dark-text-muted mt-2">
            {error
              ? 'Failed'
              : currentStep?.type === 'complete'
                ? '100% Complete'
                : `${Math.round(((currentIndex + 1) / progressSteps.length) * 100)}% Complete`}
          </p>
        </div>
      </motion.div>

      {/* Tip card */}
      {!error && currentStep?.type !== 'complete' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Did you know?
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                AI is analyzing thousands of learning resources to create your personalized study plan!
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GenerationProgress;
