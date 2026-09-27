import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { config } from './index';

let mongoMemoryServer: MongoMemoryServer | null = null;

export async function connectDB(): Promise<typeof mongoose> {
  mongoose.set('strictQuery', false);

  try {
    // Attempt connecting to the configured MongoDB URI with a short timeout
    await mongoose.connect(config.mongodb.uri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[ORUVIA DB] Connected to MongoDB at ${config.mongodb.uri}`);
    return mongoose;
  } catch (error: any) {
    if (config.mongodb.useMemoryServerIfFailed) {
      console.warn(`[ORUVIA DB] Local/remote MongoDB unreachable (${error.message}). Initializing embedded MongoMemoryServer for development...`);
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[ORUVIA DB] Connected to In-Memory MongoDB at ${memoryUri}`);
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
