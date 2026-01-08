// JWT utility functions for token generation and verification
// Used for authentication and authorization

import jwt from 'jsonwebtoken';
import env from '../config/env.js';

/**
 * Generate a JWT token for a user
 * @param {string} userId - User's unique identifier
 * @returns {string} JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: '7d', // Token expires in 7 days
  });
};

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {object} Decoded token payload
 * @throws {Error} If token is invalid
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

