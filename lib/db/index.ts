import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Disable prefetch as it is not supported for "Transaction" pool mode
const connectionString = process.env.DATABASE_URL!;

// Optimize connection for better TTFB
// Connection pooling with optimized settings for faster response
const client = postgres(connectionString, {
  prepare: false,
  max: 15, // Increased pool size for better concurrency
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 5, // Reduced connection timeout for faster failures
  max_lifetime: 60 * 30, // 30 minutes max connection lifetime
});

export const db = drizzle(client, { schema });

