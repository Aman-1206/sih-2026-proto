import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/oruvia',
    useMemoryServerIfFailed: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'oruvia_super_secure_jwt_secret_dev_2026_earth_systems',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'oruvia_super_secure_refresh_secret_dev_2026',
    expiresIn: '2h',
    refreshExpiresIn: '7d',
  },
  ai: {
    provider: process.env.AI_PROVIDER || 'mock', // 'mock' | 'openai' | 'gemini'
    apiKey: process.env.AI_API_KEY || '',
    model: process.env.AI_MODEL || 'oruvia-earth-rag-v1',
  },
  storage: {
    provider: (process.env.STORAGE_PROVIDER as 'local' | 's3' | 'r2') || 'local',
    localUploadDir: path.resolve(__dirname, '../../uploads'),
    s3: {
      bucket: process.env.S3_BUCKET || '',
      region: process.env.S3_REGION || 'us-east-1',
      endpoint: process.env.S3_ENDPOINT || '',
    },
  },
  redis: {
    url: process.env.REDIS_URL || '',
  }
};
