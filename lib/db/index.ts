import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Disable prefetch as it is not supported for "Transaction" pool mode
const connectionString = process.env.DATABASE_URL!;

// Optimize connection for better TTFB
// Connection pooling with optimized settings
const client = postgres(connectionString, {
  prepare: false,
  max: 10, // Maximum number of connections in the pool
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  transform: {
    undefined: null, // Transform undefined to null for PostgreSQL compatibility
  },
});

export const db = drizzle(client, { schema });

