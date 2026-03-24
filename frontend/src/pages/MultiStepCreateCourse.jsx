import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { courseAPI } from '../services/api';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import GenerationProgress from '../components/GenerationProgress';

/**
 * MultiStepCreateCourse - Enhanced course creation with onboarding wizard
 *
 * Steps:
 * 1. Learning Goal - What to learn with examples and suggestions
 * 2. Skill Assessment - Current level with detailed descriptions
 * 3. Time Planning - Duration and daily commitment with recommendations
 * 4. Review & Generate - Summary and final confirmation
 */
const MultiStepCreateCourse = () => {
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    topic: '',
    level: 'beginner',
    days: 7,
    timePerDay: 60,
  });

  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);
  const [isFirstTime, setIsFirstTime] = useState(true);

  // Generation state
  const [loading, setLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState(null);
  const [generationError, setGenerationError] = useState(null);

  // Check if user is first-time (from localStorage)
  useEffect(() => {
    const hasCreatedCourse = localStorage.getItem('hasCreatedCourse');
    setIsFirstTime(!hasCreatedCourse);
  }, []);

  const totalSteps = 4;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'days' || field === 'timePerDay' ? parseInt(value) : value,
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setGenerationStep(null);
    setGenerationError(null);

    try {
      // Mark user as having created a course
      localStorage.setItem('hasCreatedCourse', 'true');

      // Use SSE for real-time progress updates
      const course = await courseAPI.generateWithProgress(formData, (event) => {
        setGenerationStep(event);

        if (event.type === 'error') {
          setGenerationError(event.message);
        }
      });

      toast.success('Course generated successfully!');
      navigate(`/course/${course.id}`);
    } catch (error) {
      const errorMsg = error.message || 'Failed to generate course';
      setGenerationError(errorMsg);
      toast.error(errorMsg);

      // Reset after error
      setTimeout(() => {
        setLoading(false);
        setGenerationStep(null);
        setGenerationError(null);
      }, 3000);
    }
  };

  // Popular topic suggestions
  const topicSuggestions = [
    'React Development',
    'Machine Learning',
    'Python Programming',
    'Data Science',
    'Web Design',
    'Digital Marketing',
    'Spanish Language',
    'Photography',
    'Graphic Design',
    'Node.js Backend',
    'Mobile App Development',
    'Cybersecurity',
  ];

  // Level descriptions
  const levelDescriptions = {
    beginner: {
      title: 'Complete Beginner',
      description: 'I\'m starting from scratch with little to no prior knowledge',
      icon: '🌱',
      features: ['Start with fundamentals', 'Gentle learning curve', 'More practice exercises'],
    },
    intermediate: {
      title: 'Some Experience',
      description: 'I have basic knowledge and want to build upon it',
      icon: '🚀',
      features: ['Skip basic concepts', 'Focus on practical skills', 'Intermediate challenges'],
    },
    advanced: {
      title: 'Advanced Learner',
      description: 'I\'m experienced and want to master advanced topics',
      icon: '🎯',
      features: ['Advanced concepts only', 'Complex projects', 'Expert-level material'],
    },
  };

  // Time recommendations
  const timeRecommendations = [
    { days: 3, timePerDay: 30, description: 'Quick Intro', subtitle: 'Get a taste of the subject' },
    { days: 7, timePerDay: 60, description: 'One Week Intensive', subtitle: 'Popular choice for focused learning' },
    { days: 14, timePerDay: 45, description: 'Two Week Journey', subtitle: 'Balanced pace with good depth' },
    { days: 30, timePerDay: 30, description: 'Monthly Challenge', subtitle: 'Sustainable daily habit' },
  ];

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-600 dark:text-dark-text-muted">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-gray-200 dark:bg-dark-border rounded-full h-2">
        <motion.div
          className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );

  const renderStep1 = () => (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4"
        >
          🎯
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          What do you want to learn?
        </h2>
        <p className="text-gray-600 dark:text-dark-text-muted">
          Tell us your learning goal and we'll create a personalized study plan
        </p>
      </div>

      {/* Main Input */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-dark-text">
          Learning Topic
        </label>
        <input
          type="text"
          value={formData.topic}
          onChange={(e) => handleChange('topic', e.target.value)}
          placeholder="e.g., React Development, Machine Learning, Spanish Language..."
          className="input-field text-lg py-4 text-center"
          autoFocus
        />

        {/* Popular Suggestions */}
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-600 dark:text-dark-text-muted mb-3">
            Popular topics:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {topicSuggestions.map((suggestion, idx) => (
              <motion.button
                key={suggestion}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleChange('topic', suggestion)}
                className="px-3 py-2 bg-gray-100 dark:bg-dark-surface hover:bg-primary-100 dark:hover:bg-primary-900/30 text-gray-700 dark:text-dark-text hover:text-primary-700 dark:hover:text-primary-300 rounded-lg text-sm font-medium transition-colors border border-transparent hover:border-primary-200 dark:hover:border-primary-800"
              >
                {suggestion}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Onboarding tip for first-time users */}
        {isFirstTime && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
          >
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-blue-800 dark:text-blue-300">
                <p className="font-medium mb-1">💡 Pro tip:</p>
                <p>Be specific about what you want to learn. Instead of "programming," try "React web development" or "Python for data analysis" for better results.</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-end pt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextStep}
          disabled={!formData.topic.trim()}
          className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4"
        >
          🎓
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          What's your current level?
        </h2>
        <p className="text-gray-600 dark:text-dark-text-muted">
          Help us tailor the content difficulty to match your experience with <span className="font-medium">{formData.topic}</span>
        </p>
      </div>

      {/* Level Selection */}
      <div className="space-y-4">
        {Object.entries(levelDescriptions).map(([level, info]) => (
          <motion.div
            key={level}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * Object.keys(levelDescriptions).indexOf(level) }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleChange('level', level)}
            className={`
              p-6 rounded-xl border-2 cursor-pointer transition-all
              ${formData.level === level
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hover:border-primary-300 dark:hover:border-primary-700'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">{info.icon}</div>
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-2 ${
                  formData.level === level
                    ? 'text-primary-900 dark:text-primary-100'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {info.title}
                </h3>
                <p className={`text-sm mb-3 ${
                  formData.level === level
                    ? 'text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-dark-text-muted'
                }`}>
                  {info.description}
                </p>
                <ul className={`text-xs space-y-1 ${
                  formData.level === level
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-gray-500 dark:text-dark-text-muted'
                }`}>
                  {info.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              {formData.level === level && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                >
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevStep}
          className="btn-secondary px-8 py-3"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextStep}
          className="btn-primary px-8 py-3"
        >
          Continue
        </motion.button>
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4"
        >
          ⏰
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Plan your time commitment
        </h2>
        <p className="text-gray-600 dark:text-dark-text-muted">
          Choose a schedule that fits your lifestyle for learning <span className="font-medium">{formData.topic}</span>
        </p>
      </div>

      {/* Quick Recommendations */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Popular Plans:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {timeRecommendations.map((rec, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                handleChange('days', rec.days);
                handleChange('timePerDay', rec.timePerDay);
              }}
              className={`
                p-4 rounded-xl border-2 cursor-pointer transition-all
                ${formData.days === rec.days && formData.timePerDay === rec.timePerDay
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-dark-border bg-white dark:bg-dark-card hover:border-primary-300 dark:hover:border-primary-700'
                }
              `}
            >
              <h4 className="font-bold text-gray-900 dark:text-white mb-1">{rec.description}</h4>
              <p className="text-sm text-gray-600 dark:text-dark-text-muted mb-2">{rec.subtitle}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {rec.days} days
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {rec.timePerDay} min/day
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Custom Settings */}
      <div className="p-6 bg-gray-50 dark:bg-dark-surface rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Or customize your plan:</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
              Total Days
            </label>
            <input
              type="number"
              value={formData.days}
              onChange={(e) => handleChange('days', e.target.value)}
              min="1"
              max="365"
              className="input-field"
            />
            <p className="text-xs text-gray-500 dark:text-dark-text-muted mt-1">1-365 days</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
              Minutes per Day
            </label>
            <input
              type="number"
              value={formData.timePerDay}
              onChange={(e) => handleChange('timePerDay', e.target.value)}
              min="15"
              max="480"
              className="input-field"
            />
            <p className="text-xs text-gray-500 dark:text-dark-text-muted mt-1">15-480 minutes</p>
          </div>
        </div>

        {/* Time calculation */}
        <div className="mt-4 p-3 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border">
          <p className="text-sm text-gray-600 dark:text-dark-text-muted">
            <span className="font-medium">Total study time:</span>{' '}
            {Math.round((formData.days * formData.timePerDay) / 60)} hours over {formData.days} days
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevStep}
          className="btn-secondary px-8 py-3"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={nextStep}
          className="btn-primary px-8 py-3"
        >
          Review Plan
        </motion.button>
      </div>
    </motion.div>
  );

  const renderStep4 = () => (
    <motion.div
      key="step4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-3xl text-white mx-auto mb-4"
        >
          🚀
        </motion.div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ready to generate your course?
        </h2>
        <p className="text-gray-600 dark:text-dark-text-muted">
          Review your learning plan and create your personalized course
        </p>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Your Learning Plan</h3>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Topic</p>
              <p className="text-gray-600 dark:text-dark-text-muted">{formData.topic}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <span className="text-lg">{levelDescriptions[formData.level].icon}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Level</p>
              <p className="text-gray-600 dark:text-dark-text-muted">{levelDescriptions[formData.level].title}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">Duration</p>
              <p className="text-gray-600 dark:text-dark-text-muted">
                {formData.days} days × {formData.timePerDay} minutes = {Math.round((formData.days * formData.timePerDay) / 60)} total hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What to expect */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          What to expect:
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Personalized daily lessons tailored to your {formData.level} level
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Curated video resources and learning materials
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Interactive quizzes and progress tracking
          </li>
          <li className="flex items-start gap-2">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Notes feature to capture your insights
          </li>
        </ul>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={prevStep}
          className="btn-secondary px-8 py-3"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSubmit}
          disabled={loading}
          className="btn-primary px-8 py-3 text-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Generate My Course
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="progress"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="py-8"
              >
                <GenerationProgress
                  currentStep={generationStep}
                  error={generationError}
                />

                {/* Cancel button */}
                {generationError && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mt-6"
                  >
                    <button
                      onClick={() => {
                        setLoading(false);
                        setGenerationStep(null);
                        setGenerationError(null);
                      }}
                      className="text-gray-600 dark:text-dark-text-muted hover:text-gray-900 dark:hover:text-white underline"
                    >
                      Try again
                    </button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="wizard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="card max-w-2xl mx-auto"
              >
                {renderProgressBar()}

                <AnimatePresence mode="wait">
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                  {currentStep === 4 && renderStep4()}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default MultiStepCreateCourse;