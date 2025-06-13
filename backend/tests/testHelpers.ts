import express from 'express';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, ROLES } from '../src/config/auth.config';

// Create test tokens
export const createTestToken = (role: 'admin' | 'user' = 'user') => {
  return jwt.sign(
    { 
      id: role === 'admin' ? '1' : '2',
      username: role,
      role: role === 'admin' ? ROLES.ADMIN : ROLES.USER
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
};

// Test headers with auth token
export const getAuthHeader = (role: 'admin' | 'user' = 'user') => ({
  Authorization: `Bearer ${createTestToken(role)}`
});

// Test vulnerability data
export const testVulnerability = {
  title: 'Test Vulnerability',
  description: 'Test Description',
  criticality: 'High',
  cwe: 'CWE-79',
  suggestedFix: 'Fix the issue',
  status: 'Pending Fix'
};
