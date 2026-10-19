/**
 * YouTube Utility Helper
 * Extracts video ID, validates links, and provides embed / thumbnail URLs
 */

export function extractYouTubeId(urlOrId) {
  if (!urlOrId || typeof urlOrId !== 'string') return null;
  const trimmed = urlOrId.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    // Handling youtu.be/xxx
    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];

    // Handling shorts/xxx
    const shortsMatch = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
    if (shortsMatch) return shortsMatch[1];

    // Handling embed/xxx
    const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];

    // Handling watch?v=xxx
    const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];

    // Handling /live/xxx
    const liveMatch = trimmed.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
    if (liveMatch) return liveMatch[1];
  } catch (e) {
    console.error('Error parsing YouTube URL:', e);
  }

  return null;
}

export function isValidYouTubeUrl(url) {
  return extractYouTubeId(url) !== null;
}

export function getYouTubeEmbedUrl(urlOrId, autoplay = true) {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return '';
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&rel=0&modestbranding=1&enablejsapi=1`;
}

export function getYouTubeThumbnail(urlOrId, quality = 'hq') {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return null;
  if (quality === 'max') {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

export function getYouTubeWatchUrl(urlOrId) {
  const videoId = extractYouTubeId(urlOrId);
  if (!videoId) return '';
  return `https://www.youtube.com/watch?v=${videoId}`;
}
