// YouTube utility functions for video handling

/**
 * Extract YouTube video ID from various YouTube URL formats
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null if invalid
 */
export const extractYouTubeVideoId = (url) => {
  if (!url) return null;
  
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
};

/**
 * Generate YouTube embed URL from video ID
 * @param {string} videoId - YouTube video ID
 * @param {object} options - Embed options
 * @returns {string} - YouTube embed URL
 */
export const getYouTubeEmbedUrl = (videoId, options = {}) => {
  if (!videoId) return null;
  
  const defaultOptions = {
    autoplay: 1,
    mute: 1,
    controls: 0,
    showinfo: 0,
    rel: 0,
    modestbranding: 1,
    playsinline: 1,
    enablejsapi: 1,
    origin: window.location.origin
  };
  
  const embedOptions = { ...defaultOptions, ...options };
  const params = new URLSearchParams(embedOptions);
  
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
};

/**
 * Generate YouTube thumbnail URL from video ID
 * @param {string} videoId - YouTube video ID
 * @param {string} quality - Thumbnail quality (default, mqdefault, hqdefault, sddefault, maxresdefault)
 * @returns {string} - YouTube thumbnail URL
 */
export const getYouTubeThumbnail = (videoId, quality = 'hqdefault') => {
  if (!videoId) return null;
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`;
};

/**
 * Check if URL is a YouTube URL
 * @param {string} url - URL to check
 * @returns {boolean} - True if YouTube URL
 */
export const isYouTubeUrl = (url) => {
  if (!url) return false;
  return /(?:youtube\.com|youtu\.be)/.test(url);
};

/**
 * Get video duration from YouTube API (requires API key)
 * This is a placeholder for future implementation
 * @param {string} videoId - YouTube video ID
 * @returns {Promise<number>} - Duration in seconds
 */
export const getYouTubeDuration = async (videoId) => {
  // TODO: Implement with YouTube Data API v3
  // For now, return a default duration
  return 180; // 3 minutes default
};

/**
 * Create YouTube player configuration
 * @param {string} videoId - YouTube video ID
 * @param {object} playerOptions - Player configuration options
 * @returns {object} - Player configuration
 */
export const createYouTubePlayerConfig = (videoId, playerOptions = {}) => {
  return {
    videoId,
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      showinfo: 0,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      enablejsapi: 1,
      origin: window.location.origin,
      ...playerOptions
    }
  };
};
