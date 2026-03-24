import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { courseAPI } from '../services/api';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import GenerationProgress from '../components/GenerationProgress';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    level: 'beginner',
    days: 7,
    timePerDay: 60,
  });
  const [loading, setLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState(null);
  const [generationError, setGenerationError] = useState(null);

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setGenerationStep(null);
    setGenerationError(null);

    try {
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

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto py-8 px-4">
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
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="card"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Create New Course
                </h2>
                <p className="text-gray-600 dark:text-dark-text-muted mb-8">
                  Enter your learning goals and we'll generate a personalized study plan powered by AI.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="topic"
                      className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2"
                    >
                      What do you want to learn?
                    </label>
                    <input
                      type="text"
                      id="topic"
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="e.g., React Development, Machine Learning, Spanish Language"
                    />
                    <p className="mt-1 text-sm text-gray-500 dark:text-dark-text-muted">
                      Be specific about the topic you want to master
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="level"
                      className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2"
                    >
                      Your Skill Level
                    </label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="input-field"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="days"
                        className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2"
                      >
                        Total Days
                      </label>
                      <input
                        type="number"
                        id="days"
                        name="days"
                        value={formData.days}
                        onChange={handleChange}
                        required
                        min="1"
                        max="365"
                        className="input-field"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="timePerDay"
                        className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2"
                      >
                        Time per Day (minutes)
                      </label>
                      <input
                        type="number"
                        id="timePerDay"
                        name="timePerDay"
                        value={formData.timePerDay}
                        onChange={handleChange}
                        required
                        min="15"
                        max="480"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full py-3 text-lg"
                  >
                    Generate Course
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CreateCourse;
