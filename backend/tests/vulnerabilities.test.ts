import request from 'supertest';
import app from '../src/app';
import { getAuthHeader, testVulnerability } from './testHelpers';

describe('Vulnerability endpoints', () => {
  describe('GET /api/vulnerabilities', () => {
    it('should get all vulnerabilities for admin', async () => {
      const res = await request(app)
        .get('/api/vulnerabilities')
        .set(getAuthHeader('admin'));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should get all vulnerabilities for regular user', async () => {
      const res = await request(app)
        .get('/api/vulnerabilities')
        .set(getAuthHeader('user'));

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBeTruthy();
    });

    it('should reject unauthorized request', async () => {
      const res = await request(app)
        .get('/api/vulnerabilities');

      expect(res.status).toBe(401);
    });
  });

  describe('POST /api/vulnerabilities', () => {
    it('should create vulnerability for admin', async () => {
      const res = await request(app)
        .post('/api/vulnerabilities')
        .set(getAuthHeader('admin'))
        .send(testVulnerability);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe(testVulnerability.title);
    });

    it('should create vulnerability for regular user', async () => {
      const res = await request(app)
        .post('/api/vulnerabilities')
        .set(getAuthHeader('user'))
        .send(testVulnerability);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe(testVulnerability.title);
    });    it('should reject invalid vulnerability data', async () => {
      const res = await request(app)
        .post('/api/vulnerabilities')
        .set(getAuthHeader('admin'))
        .send({ title: '' }); // Missing required fields

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid data');
    });

    it('should reject vulnerability with invalid status', async () => {
      const res = await request(app)
        .post('/api/vulnerabilities')
        .set(getAuthHeader('admin'))
        .send({
          ...testVulnerability,
          status: 'InvalidStatus'
        });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error', 'Invalid data');
    });

    it('should reject vulnerability creation without authentication', async () => {
      const res = await request(app)
        .post('/api/vulnerabilities')
        .send(testVulnerability);

      expect(res.status).toBe(401);
    });

    it('should handle malformed JSON in request body', async () => {
      const res = await request(app)
        .post('/api/vulnerabilities')
        .set(getAuthHeader('admin'))
        .set('Content-Type', 'application/json')
        .send('{"malformed json"');

      expect(res.status).toBe(400);
    });
  });

  describe('PUT /api/vulnerabilities/:id', () => {
    it('should update vulnerability for admin', async () => {
      // First create a vulnerability
      const createRes = await request(app)
        .post('/api/vulnerabilities')
        .set(getAuthHeader('admin'))
        .send(testVulnerability);

      const updateRes = await request(app)
        .put(`/api/vulnerabilities/${createRes.body.id}`)
        .set(getAuthHeader('admin'))
        .send({ ...testVulnerability, title: 'Updated Title' });

      expect(updateRes.status).toBe(200);
      expect(updateRes.body.title).toBe('Updated Title');
    });

    it('should reject update from regular user', async () => {
      const res = await request(app)
        .put('/api/vulnerabilities/1')
        .set(getAuthHeader('user'))
        .send(testVulnerability);

      expect(res.status).toBe(403);
    });
  });

  describe('DELETE /api/vulnerabilities/:id', () => {
    it('should delete vulnerability for admin', async () => {
      // First create a vulnerability
      const createRes = await request(app)
        .post('/api/vulnerabilities')
        .set(getAuthHeader('admin'))
        .send(testVulnerability);

      const deleteRes = await request(app)
        .delete(`/api/vulnerabilities/${createRes.body.id}`)
        .set(getAuthHeader('admin'));

      expect(deleteRes.status).toBe(204);
    });

    it('should reject delete from regular user', async () => {
      const res = await request(app)
        .delete('/api/vulnerabilities/1')
        .set(getAuthHeader('user'));

      expect(res.status).toBe(403);
    });
  });
});
