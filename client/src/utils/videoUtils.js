import { getFileExtension } from './fileUtils';

/**
 * Extracts metadata from a local video file directly in the browser.
 * NEVER uploads or sends any bytes to the server.
 * @param {File} file
 * @returns {Promise<{ fileName: string, fileSize: number, fileType: string, duration: number, width: number, height: number }>}
 */
export const extractVideoMetadata = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('No file provided'));
    }

    const videoUrl = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';

    const cleanUp = () => {
      URL.revokeObjectURL(videoUrl);
      video.remove();
    };

    video.onloadedmetadata = () => {
      const metadata = {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type || `video/${getFileExtension(file.name).toLowerCase()}`,
        duration: Math.round(video.duration * 100) / 100, // round to 2 decimals
        width: video.videoWidth,
        height: video.videoHeight,
      };
      cleanUp();
      resolve(metadata);
    };

    video.onerror = () => {
      cleanUp();
      reject(new Error('Failed to load video metadata. The format may not be supported by your browser.'));
    };

    video.src = videoUrl;
  });
};

/**
 * Compares local file metadata with expected room movie metadata.
 * @param {object} local
 * @param {object} expected
 * @param {number} durationTolerance - allowed difference in seconds (default 2s)
 * @returns {{ isMatched: boolean, durationDiff: number, sizeDiff: number, reasons: string[] }}
 */
export const compareVideoMetadata = (local, expected, durationTolerance = 2) => {
  if (!expected || !expected.duration) {
    return { isMatched: true, durationDiff: 0, sizeDiff: 0, reasons: [] };
  }

  const reasons = [];
  const durationDiff = Math.abs((local.duration || 0) - (expected.duration || 0));

  if (durationDiff > durationTolerance) {
    reasons.push(
      `Duration difference of ${Math.round(durationDiff)}s exceeds tolerance (${durationTolerance}s).`
    );
  }

  // File size comparison (informational, not strictly breaking due to different remuxes/containers)
  const sizeDiff = expected.fileSize ? Math.abs((local.fileSize || 0) - (expected.fileSize || 0)) : 0;

  return {
    isMatched: reasons.length === 0,
    durationDiff,
    sizeDiff,
    reasons,
  };
};
