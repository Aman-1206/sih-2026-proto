import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { connectDB } from './config/db';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { seedDatabase } from './scripts/seed';
import { Dataset } from './models/Dataset';

const app = express();

// Security & Middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: config.clientUrl || 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser());
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Serve local uploads
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

// Health Check
app.get('/health', (_req, res) => {
  res.json({
    status: 'healthy',
    product: 'ORUVIA',
    tagline: 'Knowledge, alive.',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

async function startServer() {
  try {
    await connectDB();

    // Check if database needs initial seeding
    const datasetCount = await Dataset.countDocuments();
    if (datasetCount === 0) {
      console.log('[ORUVIA] Empty database detected. Auto-seeding initial scientific repository...');
      await seedDatabase();
    }

    const server = app.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(` ORUVIA Server running on http://localhost:${config.port}`);
      console.log(` Tagline: "Knowledge, alive."`);
      console.log(` Environment: ${config.env}`);
      console.log(` Client Origin: ${config.clientUrl}`);
      console.log(`====================================================`);
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`[ORUVIA DB] Port ${config.port} is already in use by another running server instance.`);
      } else {
        console.error('[ORUVIA] Server error:', error);
      }
    });

    return server;
  } catch (error) {
    console.error('[ORUVIA] Failed to start server:', error);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'test') {
  startServer();
}

export { app, startServer };
