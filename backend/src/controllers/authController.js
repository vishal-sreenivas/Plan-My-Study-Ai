// Authentication controller
// Handles user registration and login

import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateToken } from '../utils/jwt.js';
import { AppError } from '../utils/errors.js';
import { asyncHandler } from '../utils/errors.js';

/**
 * Register a new user
 * 
 * Steps:
 * 1. Validate input (email, password, name)
 * 2. Check if user already exists
 * 3. Hash password using bcrypt
 * 4. Create user in database
 * 5. Generate JWT token
 * 6. Return user data and token
 */
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    throw new AppError('Name, email, and password are required', 400);
  }

  // Validate password length
  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  // Hash password (10 rounds of salting)
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
    },
  });

  // Generate JWT token
  const token = generateToken(user.id);

  res.status(201).json({
    success: true,
    data: {
      user,
      token,
    },
  });
});

/**
 * Login user
 * 
 * Steps:
 * 1. Validate email and password
 * 2. Find user by email
 * 3. Compare password with hashed password
 * 4. Generate JWT token
 * 5. Return user data and token
 */
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    throw new AppError('Email and password are required', 400);
  }

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate JWT token
  const token = generateToken(user.id);

  res.json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
});

