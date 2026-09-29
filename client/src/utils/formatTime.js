/**
 * Formats seconds into HH:MM:SS or MM:SS
 * @param {number} totalSeconds
 * @returns {string}
 */
export const formatTime = (totalSeconds) => {
  if (isNaN(totalSeconds) || totalSeconds === null || totalSeconds === undefined) {
    return '00:00';
  }

  const sec = Math.floor(Math.abs(totalSeconds));
  const hours = Math.floor(sec / 3600);
  const minutes = Math.floor((sec % 3600) / 60);
  const seconds = sec % 60;

  const pad = (num) => String(num).padStart(2, '0');

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${pad(minutes)}:${pad(seconds)}`;
};
