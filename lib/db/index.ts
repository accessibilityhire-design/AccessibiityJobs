import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Validate DATABASE_URL is present
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const connectionString = process.env.DATABASE_URL;

// Optimize connection for better TTFB and reliability
// Connection pooling with optimized settings for faster response
const client = postgres(connectionString, {
  prepare: false,
  max: 10, // Connection pool size
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  max_lifetime: 60 * 30, // 30 minutes max connection lifetime
  // Retry logic for transient failures
  connection: {
    application_name: 'accessibilityjobs',
  },
  // Handle connection errors gracefully
  onnotice: () => {}, // Suppress notices
  debug: process.env.NODE_ENV === 'development',
});

export const db = drizzle(client, { schema });

