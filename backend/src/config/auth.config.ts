import dotenv from 'dotenv';
import { Secret } from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';

dotenv.config();

export const JWT_SECRET = (process.env.JWT_SECRET || 'your-secret-key') as Secret;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
type StringValue = string & SignOptions['expiresIn'];
export const JWT_EXPIRES: StringValue = JWT_EXPIRES_IN as StringValue;

// Define user roles
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];
