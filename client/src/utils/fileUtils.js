/**
 * Formats byte size into human readable string (KB, MB, GB)
 * @param {number} bytes
 * @returns {string}
 */
export const formatFileSize = (bytes) => {
  if (!bytes || isNaN(bytes) || bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Gets file extension in uppercase (e.g. 'MP4', 'MKV')
 * @param {string} fileName
 * @returns {string}
 */
export const getFileExtension = (fileName) => {
  if (!fileName) return '';
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop().toUpperCase() : '';
};
