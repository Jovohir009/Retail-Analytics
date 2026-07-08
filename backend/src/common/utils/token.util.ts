import { randomBytes, createHash } from 'crypto';

export function createOpaqueToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashAgentToken(token: string, pepper: string): string {
  return createHash('sha256').update(`${pepper}:${token}`).digest('hex');
}
