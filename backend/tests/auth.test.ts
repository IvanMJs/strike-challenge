import request from 'supertest';
import app from '../src/app';
import { ROLES } from '../src/config/auth.config';

describe('Auth endpoints', () => {
  describe('POST /api/auth/login', () => {
    it('should authenticate admin user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'admin123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('role', ROLES.ADMIN);
    });

    it('should authenticate regular user with correct credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'user',
          password: 'user123'
        });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('role', ROLES.USER);
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin',
          password: 'wrongpassword'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Invalid credentials');
    });    it('should reject missing credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Username and password are required');
    });

    it('should reject empty strings as credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: '',
          password: ''
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Username and password are required');
    });

    it('should reject when only username is provided', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'admin'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Username and password are required');
    });

    it('should reject when only password is provided', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'admin123'
        });

      expect(res.status).toBe(401);
      expect(res.body).toHaveProperty('message', 'Username and password are required');
    });
  });
});
