import { OAuth2Client } from 'google-auth-library';
import { logger } from '../utils/logger.js';

let client = null;

const getClient = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    logger.error('GOOGLE_CLIENT_ID environment variable is missing on server');
    throw new Error('Google Sign-In is not configured on the server');
  }
  if (!client) {
    client = new OAuth2Client(clientId);
  }
  return client;
};

export const verifyGoogleIdToken = async (credential) => {
  try {
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const oAuthClient = getClient();
    const ticket = await oAuthClient.verifyIdToken({
      idToken: credential,
      audience: googleClientId,
    });
    return ticket.getPayload();
  } catch (error) {
    logger.error(`Google token verification error: ${error.message}`);
    throw new Error(error.message || 'Invalid Google credential');
  }
};
