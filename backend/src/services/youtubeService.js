// YouTube Data API service
// Fetches relevant educational videos for course lessons

import axios from 'axios';
import env from '../config/env.js';
import { AppError } from '../utils/errors.js';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

/**
 * Search YouTube for educational videos based on keywords
 * 
 * @param {string[]} keywords - Array of search keywords
 * @param {number} maxResults - Maximum number of videos to return (default: 3)
 * @returns {Promise<Array>} Array of video objects with title, description, URL, etc.
 */
export const searchVideos = async (keywords, maxResults = 3) => {
  try {
    // Combine keywords into a search query
    const query = keywords.join(' ');

    // Make API request to YouTube
    const response = await axios.get(`${YOUTUBE_API_BASE}/search`, {
      params: {
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults,
        key: env.youtubeApiKey,
        videoCategoryId: '27', // Education category
        order: 'relevance',
        safeSearch: 'strict',
      },
    });

    // Transform response to our format
    const videos = response.data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    return videos;
  } catch (error) {
    console.error('YouTube API error:', error.response?.data || error.message);
    
    // Return empty array instead of throwing error
    // This allows course generation to continue even if YouTube fails
    return [];
  }
};

/**
 * Enrich course plan with YouTube videos for each lesson
 * 
 * @param {object} coursePlan - The course plan object
 * @returns {Promise<object>} Course plan with videos added to each lesson
 */
export const enrichCourseWithVideos = async (coursePlan) => {
  try {
    // Process lessons in parallel but with timeout per lesson (2 seconds max)
    const enrichedDailyPlan = await Promise.all(
      coursePlan.dailyPlan.map(async (day) => {
        const enrichedLessons = await Promise.all(
          day.lessons.map(async (lesson) => {
            try {
              // Add timeout for each video search (2 seconds max)
              const videoPromise = searchVideos(lesson.keywords || [lesson.title], 2); // Reduced to 2 videos
              const timeoutPromise = new Promise((resolve) => 
                setTimeout(() => resolve([]), 2000)
              );
              
              const videos = await Promise.race([videoPromise, timeoutPromise]);
              
              return {
                ...lesson,
                resources: {
                  videos: Array.isArray(videos) ? videos : [],
                },
              };
            } catch (error) {
              // If video search fails, continue without videos
              return {
                ...lesson,
                resources: {
                  videos: [],
                },
              };
            }
          })
        );

        return {
          ...day,
          lessons: enrichedLessons,
        };
      })
    );

    return {
      ...coursePlan,
      dailyPlan: enrichedDailyPlan,
    };
  } catch (error) {
    console.error('Error enriching course with videos:', error);
    // Return original plan if enrichment fails
    return coursePlan;
  }
};

