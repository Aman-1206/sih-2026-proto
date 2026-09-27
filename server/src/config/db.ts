import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './index';
import { User } from '../models/User';

let mongoMemoryServer: MongoMemoryServer | null = null;

export async function migrateIndexes(): Promise<void> {
  try {
    const collection = User.collection;
    const indexes = await collection.indexes();
    const oldPhoneIndex = indexes.find((idx: any) => idx.name === 'phone_1');
    if (oldPhoneIndex && !oldPhoneIndex.partialFilterExpression) {
      console.log('[ORUVIA DB] Legacy un-filtered phone_1 index detected. Dropping index...');
      await collection.dropIndex('phone_1');
      console.log('[ORUVIA DB] Legacy phone_1 index dropped successfully.');
    }
  } catch (_err) {
    // Collection may not exist yet on fresh databases; safe to ignore
  }

  try {
    await User.syncIndexes();
  } catch (err: any) {
    console.warn('[ORUVIA DB] User syncIndexes warning:', err?.message || err);
  }
}

export async function connectDB(): Promise<typeof mongoose> {
  mongoose.set('strictQuery', false);

  const connectOptions: mongoose.ConnectOptions = {
    serverSelectionTimeoutMS: config.isProduction ? 10000 : 3000,
    dbName: config.mongodb.dbName || 'oruvia',
  };

  if (config.isProduction) {
    if (!config.mongodb.uri) {
      throw new Error('[ORUVIA DB] MONGODB_URI environment variable is required in production mode.');
    }

    try {
      await mongoose.connect(config.mongodb.uri, connectOptions);
      console.log('[ORUVIA DB] Connected to MongoDB successfully.');
      await migrateIndexes();
      return mongoose;
    } catch (error: any) {
      console.error('[ORUVIA DB] Production MongoDB connection failed:', error?.message || error);
      throw error;
    }
  }

  // Development / Test environment connection flow
  try {
    await mongoose.connect(config.mongodb.uri, connectOptions);
    console.log('[ORUVIA DB] Connected to MongoDB successfully.');
    await migrateIndexes();
    return mongoose;
  } catch (error: any) {
    if (config.mongodb.useMemoryServerIfFailed) {
      console.warn('[ORUVIA DB] Local/remote MongoDB unreachable. Initializing embedded MongoMemoryServer for development...');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri, { dbName: 'oruvia' });
      console.log('[ORUVIA DB] Connected to In-Memory MongoDB successfully.');
      await migrateIndexes();
      return mongoose;
    }
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
}
