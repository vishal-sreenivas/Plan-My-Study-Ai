// Database configuration and Prisma client initialization
// This file creates a singleton Prisma client instance to be used throughout the app

import { PrismaClient } from '@prisma/client';

// Create a single Prisma client instance
// In development, this prevents multiple instances during hot-reloading
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;

