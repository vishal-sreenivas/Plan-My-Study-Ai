import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { notesAPI } from '../services/api';
import toast from 'react-hot-toast';

/**
 * LessonNotes - A collapsible notes editor for lessons
 *
 * Features:
 * - Auto-save on blur or after typing delay
 * - Markdown support (basic textarea for now)
 * - Collapsible interface
 * - Shows note count indicator
 */
const LessonNotes = ({ courseId, day, lessonId, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasNote, setHasNote] = useState(false);

  // Load note on mount and when props change
  useEffect(() => {
    loadNote();
  }, [courseId, day, lessonId]);

  const loadNote = async () => {
    try {
      const response = await notesAPI.getNote(courseId, day, lessonId);
      const noteContent = response.data.data.note?.content || '';
      setContent(noteContent);
      setInitialContent(noteContent);
      setHasNote(noteContent.length > 0);
    } catch (error) {
      console.error('Failed to load note:', error);
    }
  };

  const saveNote = async (noteContent) => {
    if (noteContent === initialContent) return; // No changes

    setIsSaving(true);
    try {
      await notesAPI.saveNote(courseId, day, lessonId, noteContent);
      setInitialContent(noteContent);
      setHasNote(noteContent.length > 0);
      if (noteContent.trim()) {
        toast.success('Note saved!', { duration: 1500 });
      }
    } catch (error) {
      console.error('Failed to save note:', error);
      toast.error('Failed to save note');
    } finally {
      setIsSaving(false);
    }
  };

  // Auto-save on blur
  const handleBlur = () => {
    if (content !== initialContent) {
      saveNote(content);
    }
  };

  // Auto-save with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (content !== initialContent && content !== '') {
        saveNote(content);
      }
    }, 2000); // 2 second delay

    return () => clearTimeout(timeoutId);
  }, [content]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const characterCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  return (
    <div className={`${className}`}>
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleToggle}
        className={`
          w-full flex items-center justify-between p-3 rounded-lg border transition-all
          ${isOpen
            ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
            : hasNote
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
              : 'bg-gray-50 dark:bg-dark-surface border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-border'
          }
        `}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-md ${hasNote ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-dark-border'}`}>
            <svg className={`w-4 h-4 ${hasNote ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-dark-text-muted'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>

          <div className="text-left">
            <span className="font-medium text-gray-900 dark:text-white text-sm">
              Notes
            </span>
            {hasNote && (
              <div className="text-xs text-gray-500 dark:text-dark-text-muted">
                {wordCount} words
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isSaving && (
            <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}

          {hasNote && (
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
          )}

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </div>
      </motion.button>

      {/* Notes Editor */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={handleBlur}
                placeholder="Add your notes about this lesson...

Tips:
• Key concepts and takeaways
• Questions to review later
• Personal insights and connections
• Code snippets or examples"
                className="w-full h-32 sm:h-40 p-3 border border-gray-200 dark:border-dark-border rounded-lg resize-none bg-white dark:bg-dark-card text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-dark-text-muted focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-sm font-mono leading-relaxed touch-manipulation"
              />

              {/* Footer with stats */}
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500 dark:text-dark-text-muted">
                <div>
                  {characterCount > 0 && (
                    <span>
                      {wordCount} words, {characterCount} characters
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {content !== initialContent && (
                    <span className="text-orange-500">Unsaved changes</span>
                  )}
                  {isSaving && (
                    <span className="text-blue-500">Saving...</span>
                  )}
                  <span className="text-gray-400">Auto-saves</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LessonNotes;