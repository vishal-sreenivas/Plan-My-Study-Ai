import { motion } from 'framer-motion';

const ModuleCard = ({ module, index = 0 }) => {
  if (!module) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="group relative"
    >
      <div className="relative bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-2xl shadow-lg dark:shadow-xl border border-gray-200/50 dark:border-dark-border/50 p-6 transition-all duration-300 hover:shadow-2xl hover:border-primary-500/50 dark:hover:border-primary-500/30">
        {/* Left border accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-primary-600 rounded-l-2xl" />

        <div className="pl-4">
          {/* Module Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {module.title}
              </h3>
              {module.description && (
                <p className="text-sm text-gray-600 dark:text-dark-text-muted leading-relaxed">
                  {module.description}
                </p>
              )}
            </div>
            <div className="ml-4 w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-primary-600/10 dark:from-primary-500/20 dark:to-primary-600/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                {index + 1}
              </span>
            </div>
          </div>

          {/* Objectives */}
          {module.objectives && module.objectives.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold text-gray-700 dark:text-dark-text mb-2 uppercase tracking-wide">
                Learning Goals
              </h4>
              <ul className="space-y-2">
                {module.objectives.map((obj, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + idx * 0.05 }}
                    className="flex items-start gap-2 text-sm text-gray-600 dark:text-dark-text-muted"
                  >
                    <svg
                      className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{obj}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ModuleCard;

