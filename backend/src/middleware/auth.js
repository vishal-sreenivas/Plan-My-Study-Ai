// Authentication middleware
// Protects routes by verifying JWT tokens from request headers

import { verifyToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';

/**
 * Middleware to authenticate requests using JWT
 * Expects token in Authorization header as "Bearer <token>"
 */
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token and extract user ID
    const decoded = verifyToken(token);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }
    next(new AppError('Authentication failed', 401));
  }
};

