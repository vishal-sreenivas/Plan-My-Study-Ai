import { motion } from 'framer-motion';
import { useState } from 'react';

const VideoCard = ({ video, index = 0 }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  if (!video) return null;

  return (
    <motion.a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group relative block"
    >
      <div className="relative bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-xl shadow-md dark:shadow-lg border border-gray-200/50 dark:border-dark-border/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-primary-500/50 dark:hover:border-primary-500/30">
        <div className="flex gap-4 p-4">
          {/* Thumbnail */}
          <div className="relative flex-shrink-0 w-32 h-20 rounded-lg overflow-hidden bg-gray-200 dark:bg-dark-border">
            {!imageLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-dark-border" />
            )}
            <img
              src={video.thumbnail}
              alt={video.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />
            {/* Play overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {video.title}
            </h5>
            <p className="text-xs text-gray-500 dark:text-dark-text-muted mb-2">
              {video.channelTitle}
            </p>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-dark-text-muted">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Watch on YouTube</span>
            </div>
          </div>
        </div>
      </div>
    </motion.a>
  );
};

export default VideoCard;

