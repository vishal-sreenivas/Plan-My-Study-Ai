import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import Navbar from './Navbar';
import SidebarHistory from './SidebarHistory';

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [historyOpen, setHistoryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg transition-colors">
      <Navbar />
      <SidebarHistory isOpen={historyOpen} onClose={() => setHistoryOpen(false)} />

      <main>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Floating History Button */}
      {user && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setHistoryOpen(true)}
          className="fixed bottom-8 right-8 w-14 h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center z-30 transition-colors"
          aria-label="Open history"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Clock face circle */}
            <circle cx="12" cy="12" r="9" />
            {/* Clock hands (pointing to 10 and 2 o'clock) */}
            <line x1="12" y1="12" x2="10.5" y2="8" />
            <line x1="12" y1="12" x2="13.5" y2="8" />
            {/* Counter-clockwise arrow (starts top-right, curves down, left, then up) */}
            <path d="M18 6 Q 20 8, 20 12 Q 20 16, 18 18 Q 16 20, 12 20 Q 8 20, 6 18" />
            {/* Arrowhead pointing left */}
            <path d="M6 18 L 4 16 M6 18 L 4 20" />
          </svg>
        </motion.button>
      )}
    </div>
  );
};

export default Layout;
