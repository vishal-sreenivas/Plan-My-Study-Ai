import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { courseAPI } from '../services/api';
import toast from 'react-hot-toast';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    level: 'beginner',
    days: 7,
    timePerDay: 60,
  });
  const [loading, setLoading] = useState(false);

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

    // Show progress toast
    const progressToast = toast.loading('Generating your course... This may take 30-60 seconds.');

    try {
      const response = await courseAPI.generate(formData);
      toast.dismiss(progressToast);
      toast.success('Course generated successfully!');
      navigate(`/course/${response.data.data.course.id}`);
    } catch (error) {
      toast.dismiss(progressToast);
      const errorMsg = error.response?.data?.error || 'Failed to generate course';
      toast.error(errorMsg);
      
      // If timeout or rate limit, show helpful message
      if (errorMsg.includes('timeout') || errorMsg.includes('rate limit')) {
        toast('Please wait a minute and try again with fewer days.', {
          icon: '⏰',
          duration: 5000,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-2xl mx-auto py-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
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
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="btn-primary w-full py-3 text-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <motion.svg
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </motion.svg>
                    Generating your course...
                  </span>
                ) : (
                  'Generate Course'
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default CreateCourse;
