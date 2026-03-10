/**
 * Formatting utilities for the OnaFlix frontend.
 * Originally used in the v1 movie cards before the redesign.
 */

export function formatRuntime(minutes) {
  if (!minutes || minutes <= 0) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function formatRating(rating) {
  if (rating === null || rating === undefined) return 'NR';
  return rating.toFixed(1);
}

export function formatYear(year) {
  if (!year) return 'Unknown';
  return year.toString();
}

export function formatCurrency(cents) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

export function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const GENRE_COLORS = {
  Action: '#e74c3c',
  Comedy: '#f39c12',
  Drama: '#3498db',
  Horror: '#8e44ad',
  'Sci-Fi': '#1abc9c',
  Romance: '#e91e63',
  Thriller: '#34495e',
  Animation: '#2ecc71',
  Documentary: '#95a5a6',
  Fantasy: '#9b59b6',
};

export function getGenreColor(genre) {
  return GENRE_COLORS[genre] || '#7f8c8d';
}
