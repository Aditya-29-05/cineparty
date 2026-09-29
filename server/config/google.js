import { OAuth2Client } from 'google-auth-library';
import { logger } from '../utils/logger.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleIdToken = async (credential) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    return ticket.getPayload();
  } catch (error) {
    logger.error(`Google token verification error: ${error.message}`);
    throw new Error('Invalid Google credential');
  }
};
