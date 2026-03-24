import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { courseAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * CourseSharing - Component for managing course sharing settings
 *
 * Features:
 * - Toggle course visibility (public/private)
 * - Generate and display share links
 * - Copy link to clipboard
 * - Visual feedback for sharing status
 */
const CourseSharing = ({ courseId, isOpen, onClose, courseName }) => {
  const [isPublic, setIsPublic] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Load current sharing status when modal opens
  useEffect(() => {
    if (isOpen && courseId) {
      loadSharingStatus();
    }
  }, [isOpen, courseId]);

  const loadSharingStatus = async () => {
    setInitialLoad(true);
    try {
      const response = await courseAPI.getSharingStatus(courseId);
      const { isPublic: currentPublic, shareUrl: currentUrl } = response.data.data;
      setIsPublic(currentPublic);
      setShareUrl(currentUrl || '');
    } catch (error) {
      console.error('Failed to load sharing status:', error);
      toast.error('Failed to load sharing settings');
    } finally {
      setInitialLoad(false);
    }
  };

  const toggleSharing = async () => {
    const newPublicStatus = !isPublic;
    setLoading(true);

    try {
      const response = await courseAPI.shareCourse(courseId, newPublicStatus);
      const { isPublic: updatedPublic, shareUrl: updatedUrl } = response.data.data;

      setIsPublic(updatedPublic);
      setShareUrl(updatedUrl || '');

      if (updatedPublic) {
        toast.success('Course is now publicly shareable!');
      } else {
        toast.success('Course sharing disabled');
      }
    } catch (error) {
      console.error('Failed to update sharing:', error);
      toast.error('Failed to update sharing settings');
    } finally {
      setLoading(false);
    }
  };

  const copyShareLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast.success('Share link copied to clipboard!');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl max-w-md w-full mx-4 p-4 sm:p-6 border border-gray-200 dark:border-dark-border"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Share Course
                </h3>
                <p className="text-sm text-gray-500 dark:text-dark-text-muted">
                  {courseName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface flex items-center justify-center transition-colors"
            >
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {initialLoad ? (
            /* Loading state */
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : (
            <>
              {/* Sharing Toggle */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-surface rounded-xl">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Public Access
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-dark-text-muted">
                      {isPublic
                        ? 'Anyone with the link can view this course'
                        : 'Only you can access this course'
                      }
                    </p>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleSharing}
                    disabled={loading}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${isPublic
                        ? 'bg-blue-600'
                        : 'bg-gray-300 dark:bg-dark-border'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    <motion.div
                      animate={{
                        x: isPublic ? 24 : 2,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
                    />
                  </motion.button>
                </div>
              </div>

              {/* Share Link */}
              <AnimatePresence>
                {isPublic && shareUrl && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <label className="block text-sm font-medium text-gray-700 dark:text-dark-text mb-2">
                      Share Link
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 bg-gray-100 dark:bg-dark-surface border border-gray-200 dark:border-dark-border rounded-lg text-sm text-gray-600 dark:text-dark-text-muted focus:outline-none"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={copyShareLink}
                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Info */}
              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="text-sm text-blue-800 dark:text-blue-300">
                    <p className="font-medium mb-1">About public courses:</p>
                    <ul className="space-y-1 text-xs">
                      <li>• Viewers can see course content but cannot track progress</li>
                      <li>• Your notes and personal data remain private</li>
                      <li>• You can disable sharing anytime</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CourseSharing;