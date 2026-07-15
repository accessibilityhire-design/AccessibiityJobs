// Admin authentication using environment variables
// Sessions are HMAC-signed cookies; forging requires the ADMIN_SESSION_SECRET.
import { createHmac, timingSafeEqual } from 'crypto';

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 24 hours

function getSessionSecret(): string {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD; // fallback so existing deploys keep working
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET (or ADMIN_PASSWORD) must be set');
  }
  return secret;
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function sign(payload: string): string {
  return createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export async function verifyAdmin(username: string, password: string) {
  try {
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured in environment variables');
      return null;
    }

    const usernameOk = safeEqual(username, adminUsername);
    const passwordOk = safeEqual(password, adminPassword);
    if (usernameOk && passwordOk) {
      return { username: adminUsername };
    }

    return null;
  } catch (error) {
    console.error('Error verifying admin:', error);
    return null;
  }
}

export function createSessionToken(username: string): string {
  const payload = Buffer.from(
    JSON.stringify({ username, exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000 })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined): { username: string } | null {
  if (!token) return null;
  const dotIndex = token.lastIndexOf('.');
  if (dotIndex <= 0) return null;
  const payload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  try {
    if (!safeEqual(signature, sign(payload))) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (typeof data.username !== 'string' || typeof data.exp !== 'number') return null;
    if (Date.now() > data.exp) return null;
    return { username: data.username };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE = SESSION_MAX_AGE_SECONDS;
