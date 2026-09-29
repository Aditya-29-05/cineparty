// Generate an unambiguous 6-character uppercase room code
const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export const generateRoomCode = (length = 6) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * CHARS.length);
    result += CHARS[randomIndex];
  }
  return result;
};
