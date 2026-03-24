// YouTube Data API service
// Fetches relevant educational videos for course lessons with time-budget awareness

import axios from 'axios';
import env from '../config/env.js';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

// Time budget constants
const TIME_BUFFER_MINUTES = 2; // Allow ±2 min flexibility
const MAX_VIDEO_DURATION_MULTIPLIER = 1.5; // Don't pick videos more than 1.5x the lesson time
const MIN_VIDEO_DURATION_SECONDS = 60; // Skip videos under 1 minute (likely intros/shorts)

// Keywords to filter out (full courses, playlists, etc.)
const BLACKLIST_KEYWORDS = [
  'full course', 'complete course', 'complete tutorial', 'full tutorial',
  'crash course', '10 hours', '8 hours', '6 hours', '5 hours', '4 hours',
  'bootcamp', 'masterclass', 'all you need', 'everything you need',
  'zero to hero', 'beginner to advanced', 'complete guide',
  'playlist', 'series', 'part 1 of', 'episode 1'
];

/**
 * Parse ISO 8601 duration string to seconds
 * Example: "PT4M13S" -> 253 seconds, "PT1H2M10S" -> 3730 seconds
 *
 * @param {string} duration - ISO 8601 duration string from YouTube API
 * @returns {number} Duration in seconds
 */
const parseISO8601Duration = (duration) => {
  if (!duration) return 0;

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || 0, 10);
  const minutes = parseInt(match[2] || 0, 10);
  const seconds = parseInt(match[3] || 0, 10);

  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Convert seconds to human-readable duration string
 *
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string (e.g., "4:13" or "1:02:10")
 */
const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Check if video title contains blacklisted keywords
 *
 * @param {string} title - Video title
 * @returns {boolean} True if video should be filtered out
 */
const isBlacklistedVideo = (title) => {
  const lowerTitle = title.toLowerCase();
  return BLACKLIST_KEYWORDS.some(keyword => lowerTitle.includes(keyword));
};

/**
 * Calculate relevance score for a video based on search query match
 * Higher score = more relevant
 *
 * @param {object} video - Video object with title and description
 * @param {string[]} keywords - Search keywords
 * @param {string} lessonTitle - The lesson title
 * @returns {number} Relevance score (0-100)
 */
const calculateRelevanceScore = (video, keywords, lessonTitle) => {
  let score = 0;
  const title = video.title.toLowerCase();
  const description = (video.description || '').toLowerCase();
  const lessonLower = lessonTitle.toLowerCase();

  // Exact lesson title match in video title (highest priority)
  if (title.includes(lessonLower)) {
    score += 40;
  }

  // Keyword matches in title
  keywords.forEach(keyword => {
    const keywordLower = keyword.toLowerCase();
    if (title.includes(keywordLower)) {
      score += 15;
    }
    if (description.includes(keywordLower)) {
      score += 5;
    }
  });

  // Prefer tutorial/explained/introduction style videos
  const goodIndicators = ['tutorial', 'explained', 'introduction', 'intro', 'basics', 'learn', 'how to', 'guide'];
  goodIndicators.forEach(indicator => {
    if (title.includes(indicator)) {
      score += 5;
    }
  });

  // Penalize long generic titles
  if (title.length > 100) {
    score -= 10;
  }

  return Math.max(0, Math.min(100, score));
};

/**
 * Search YouTube and get video details including duration
 * Uses two API calls: search then videos.list for contentDetails
 *
 * @param {string} query - Search query
 * @param {number} maxResults - Maximum results to fetch
 * @returns {Promise<Array>} Array of video objects with duration
 */
const searchVideosWithDuration = async (query, maxResults = 10) => {
  try {
    // Step 1: Search for videos
    const searchResponse = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
        key: env.youtubeApiKey,
        videoCategoryId: '27', // Education category
        order: 'relevance',
        safeSearch: 'strict',
        videoEmbeddable: 'true', // Only embeddable videos
        videoSyndicated: 'true', // Videos that can play outside YouTube
      },
    });

    if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
      return [];
    }

    // Extract video IDs
    const videoIds = searchResponse.data.items.map(item => item.id.videoId).join(',');

    // Step 2: Get video details including duration
    const detailsResponse = await axios.get(`${YOUTUBE_API_BASE}/videos`, {
      params: {
        part: 'contentDetails,statistics,snippet',
        id: videoIds,
        key: env.youtubeApiKey,
      },
    });

    // Combine search results with duration data
    const videos = detailsResponse.data.items.map(item => {
      const durationSeconds = parseISO8601Duration(item.contentDetails.duration);
      return {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id}`,
        durationSeconds,
        durationFormatted: formatDuration(durationSeconds),
        viewCount: parseInt(item.statistics?.viewCount || 0, 10),
      };
    });

    return videos;
  } catch (error) {
    console.error('YouTube API error:', error.response?.data || error.message);
    return [];
  }
};

/**
 * Select the best video for a lesson within time budget
 *
 * Strategy:
 * 1. Filter out blacklisted videos (full courses, playlists, etc.)
 * 2. Filter out videos too short (< 1 min) or too long (> 1.5x lesson time)
 * 3. Score remaining videos by relevance
 * 4. Pick the highest-scoring video that fits the remaining time budget
 * 5. If none fit, pick the shortest relevant video as fallback
 *
 * @param {Array} videos - Array of video objects with duration
 * @param {object} lesson - Lesson object with title, keywords, estimatedMinutes
 * @param {number} remainingBudgetSeconds - Remaining time budget for the day in seconds
 * @returns {object|null} Selected video object or null
 */
const selectBestVideo = (videos, lesson, remainingBudgetSeconds) => {
  if (!videos || videos.length === 0) return null;

  const lessonMaxSeconds = (lesson.estimatedMinutes || 10) * 60 * MAX_VIDEO_DURATION_MULTIPLIER;
  const keywords = lesson.keywords || [lesson.title];

  // Step 1: Filter out bad videos
  let candidates = videos.filter(video => {
    // Skip blacklisted videos
    if (isBlacklistedVideo(video.title)) {
      return false;
    }

    // Skip too short videos
    if (video.durationSeconds < MIN_VIDEO_DURATION_SECONDS) {
      return false;
    }

    // Skip videos way too long for this lesson
    if (video.durationSeconds > lessonMaxSeconds) {
      return false;
    }

    return true;
  });

  if (candidates.length === 0) {
    // Fallback: relax filters and try again
    candidates = videos.filter(video =>
      !isBlacklistedVideo(video.title) &&
      video.durationSeconds >= MIN_VIDEO_DURATION_SECONDS
    );
  }

  if (candidates.length === 0) return null;

  // Step 2: Score candidates by relevance
  candidates = candidates.map(video => ({
    ...video,
    relevanceScore: calculateRelevanceScore(video, keywords, lesson.title),
  }));

  // Step 3: Sort by relevance score (descending)
  candidates.sort((a, b) => b.relevanceScore - a.relevanceScore);

  // Step 4: Find the best video that fits the remaining budget
  const budgetWithBuffer = remainingBudgetSeconds + (TIME_BUFFER_MINUTES * 60);

  for (const video of candidates) {
    if (video.durationSeconds <= budgetWithBuffer) {
      return {
        ...video,
        withinBudget: true,
      };
    }
  }

  // Step 5: Fallback - pick the shortest relevant video and flag it
  const shortestVideo = candidates.reduce((shortest, current) =>
    current.durationSeconds < shortest.durationSeconds ? current : shortest
  );

  return {
    ...shortestVideo,
    withinBudget: false,
    budgetExceededBy: shortestVideo.durationSeconds - remainingBudgetSeconds,
  };
};

/**
 * Build an optimized search query for a lesson
 * Combines lesson title with keywords for better results
 *
 * @param {object} lesson - Lesson object
 * @param {string} courseTopic - Overall course topic
 * @returns {string} Optimized search query
 */
const buildSearchQuery = (lesson, courseTopic) => {
  const parts = [];

  // Start with lesson title (most specific)
  parts.push(lesson.title);

  // Add first 2 keywords if different from title
  if (lesson.keywords && lesson.keywords.length > 0) {
    const titleLower = lesson.title.toLowerCase();
    const uniqueKeywords = lesson.keywords
      .filter(kw => !titleLower.includes(kw.toLowerCase()))
      .slice(0, 2);
    parts.push(...uniqueKeywords);
  }

  // Add "tutorial" or "explained" to get educational content
  parts.push('tutorial');

  return parts.join(' ');
};

/**
 * Enrich course plan with YouTube videos respecting time budget
 *
 * TIME BUDGET ALLOCATION STRATEGY:
 * ================================
 * 1. Each day has a total time budget (e.g., 10 minutes)
 * 2. For each lesson in a day, we allocate time proportionally based on estimatedMinutes
 * 3. We track remaining budget as we select videos for each lesson
 * 4. Videos are selected to fit within the remaining budget
 * 5. If a video exceeds the budget, we flag it but still include it (graceful degradation)
 * 6. The ±2 minute buffer allows some flexibility in matching
 *
 * VIDEO SELECTION STRATEGY:
 * =========================
 * 1. Search YouTube with lesson-specific query (title + keywords + "tutorial")
 * 2. Fetch video durations using contentDetails API
 * 3. Filter out: full courses, playlists, too short (<1 min), too long (>1.5x lesson time)
 * 4. Score videos by relevance (title match, keyword match, good indicators)
 * 5. Select highest-scoring video that fits the time budget
 * 6. Fallback to shortest video if none fit
 *
 * @param {object} coursePlan - The course plan object from OpenAI
 * @param {number} timePerDay - Daily time budget in minutes (default: 30)
 * @returns {Promise<object>} Course plan with videos added to each lesson
 */
export const enrichCourseWithVideos = async (coursePlan, timePerDay = 30) => {
  try {
    const courseTopic = coursePlan.topic || '';
    const dailyBudgetSeconds = timePerDay * 60;

    console.log(`[YouTube] Enriching course "${courseTopic}" with ${timePerDay} min/day budget`);

    const enrichedDailyPlan = [];

    // Process each day sequentially to manage API rate limits
    for (const day of coursePlan.dailyPlan) {
      let remainingBudgetSeconds = dailyBudgetSeconds;
      const enrichedLessons = [];

      // Calculate total estimated time for the day to allocate proportionally
      const totalEstimatedMinutes = day.lessons.reduce(
        (sum, lesson) => sum + (lesson.estimatedMinutes || 10),
        0
      );

      console.log(`[YouTube] Day ${day.day}: ${day.lessons.length} lessons, ${totalEstimatedMinutes} min estimated`);

      for (const lesson of day.lessons) {
        try {
          // Calculate this lesson's share of the time budget
          const lessonShare = (lesson.estimatedMinutes || 10) / totalEstimatedMinutes;
          const lessonBudgetSeconds = Math.floor(dailyBudgetSeconds * lessonShare);

          // Build optimized search query
          const searchQuery = buildSearchQuery(lesson, courseTopic);

          console.log(`[YouTube]   Lesson "${lesson.title}" - searching: "${searchQuery}" (budget: ${Math.floor(remainingBudgetSeconds / 60)}min remaining)`);

          // Search with timeout
          const searchPromise = searchVideosWithDuration(searchQuery, 8);
          const timeoutPromise = new Promise((resolve) =>
            setTimeout(() => resolve([]), 5000) // 5 second timeout
          );

          const videos = await Promise.race([searchPromise, timeoutPromise]);

          // Select the best video within budget
          const selectedVideo = selectBestVideo(videos, lesson, remainingBudgetSeconds);

          if (selectedVideo) {
            // Update remaining budget
            remainingBudgetSeconds -= selectedVideo.durationSeconds;

            console.log(`[YouTube]     Selected: "${selectedVideo.title}" (${selectedVideo.durationFormatted}) ${selectedVideo.withinBudget ? '✓' : '⚠ exceeds budget'}`);

            enrichedLessons.push({
              ...lesson,
              resources: {
                videos: [{
                  id: selectedVideo.id,
                  title: selectedVideo.title,
                  description: selectedVideo.description,
                  thumbnail: selectedVideo.thumbnail,
                  channelTitle: selectedVideo.channelTitle,
                  url: selectedVideo.url,
                  duration: selectedVideo.durationFormatted,
                  durationSeconds: selectedVideo.durationSeconds,
                  withinBudget: selectedVideo.withinBudget,
                }],
              },
            });
          } else {
            console.log(`[YouTube]     No suitable video found`);
            enrichedLessons.push({
              ...lesson,
              resources: { videos: [] },
            });
          }

          // Small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (error) {
          console.error(`[YouTube] Error processing lesson "${lesson.title}":`, error.message);
          enrichedLessons.push({
            ...lesson,
            resources: { videos: [] },
          });
        }
      }

      // Calculate day's video stats
      const dayVideoDuration = enrichedLessons.reduce((sum, lesson) => {
        const video = lesson.resources?.videos?.[0];
        return sum + (video?.durationSeconds || 0);
      }, 0);

      console.log(`[YouTube] Day ${day.day} complete: ${Math.floor(dayVideoDuration / 60)}min of videos (budget: ${timePerDay}min)`);

      enrichedDailyPlan.push({
        ...day,
        lessons: enrichedLessons,
        videoStats: {
          totalDurationSeconds: dayVideoDuration,
          totalDurationFormatted: formatDuration(dayVideoDuration),
          budgetSeconds: dailyBudgetSeconds,
          withinBudget: dayVideoDuration <= dailyBudgetSeconds + (TIME_BUFFER_MINUTES * 60),
        },
      });
    }

    return {
      ...coursePlan,
      dailyPlan: enrichedDailyPlan,
    };

  } catch (error) {
    console.error('[YouTube] Error enriching course with videos:', error);
    // Return original plan if enrichment fails
    return coursePlan;
  }
};

/**
 * Search YouTube for educational videos (legacy function for backwards compatibility)
 *
 * @param {string[]} keywords - Array of search keywords
 * @param {number} maxResults - Maximum number of videos to return
 * @returns {Promise<Array>} Array of video objects
 */
export const searchVideos = async (keywords, maxResults = 3) => {
  const query = keywords.join(' ');
  const videos = await searchVideosWithDuration(query, maxResults);
  return videos.map(v => ({
    id: v.id,
    title: v.title,
    description: v.description,
    thumbnail: v.thumbnail,
    channelTitle: v.channelTitle,
    publishedAt: v.publishedAt,
    url: v.url,
    duration: v.durationFormatted,
    durationSeconds: v.durationSeconds,
  }));
};

