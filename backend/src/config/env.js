// Environment variable validation
// Ensures all required environment variables are present before starting the server

import dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'GROQ_API_KEY',
  'YOUTUBE_API_KEY',
  'FRONTEND_URL',
];

// PORT is optional (defaults to 5000 or Render's PORT)

// Validate that all required environment variables are set
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPlease check your .env file.');
  process.exit(1);
}

export default {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  groqApiKey: process.env.GROQ_API_KEY,
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
};

