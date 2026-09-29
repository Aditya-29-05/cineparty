import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'cineparty_jwt_secret', {
    expiresIn: '7d',
  });
};
