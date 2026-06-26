const request = require('supertest');
const app = require('./app');
const pool = require('./db');

// Clean up test users after all tests finish
afterAll(async () => {
  await pool.query("DELETE FROM users WHERE email LIKE '%@test.waloo%'");
  await pool.end();
});

describe('POST /api/auth/register', () => {
  it('should register a new user and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testregister',
        email: 'testregister@test.waloo',
        password: 'password123',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe('testregister');
  });

  it('should reject registration with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'incomplete' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should reject registration with a short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'shortpass',
        email: 'shortpass@test.waloo',
        password: '123',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/6 characters/);
  });

  it('should reject duplicate email registration', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testregister2',
        email: 'testregister@test.waloo',
        password: 'password123',
      });
    expect(res.statusCode).toBe(409);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/auth/login', () => {
  it('should login with correct credentials and return a token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testregister@test.waloo',
        password: 'password123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testregister@test.waloo',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should reject login with missing fields', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'testregister@test.waloo' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /api/auth/me', () => {
  it('should return user data with a valid token', async () => {
    // Login first to get a token
    const login = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testregister@test.waloo',
        password: 'password123',
      });
    const token = login.body.token;

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('username');
    expect(res.body.username).toBe('testregister');
  });

  it('should reject request with no token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.statusCode).toBe(401);
  });

  it('should reject request with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer faketoken123');
    expect(res.statusCode).toBe(401);
  });
});