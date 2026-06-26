const request = require('supertest');
const app = require('./app');
const pool = require('./db');

let token;
let createdWashroomId;

// Register a test user and get a token before tests run
beforeAll(async () => {
  // Clean up any leftover test data first
  await pool.query("DELETE FROM users WHERE email = 'washroomtest@test.waloo'");

  const res = await request(app)
    .post('/api/auth/register')
    .send({
      username: 'washroomtester',
      email: 'washroomtest@test.waloo',
      password: 'password123',
    });
  token = res.body.token;
});

// Clean up test data after all tests finish
afterAll(async () => {
  if (createdWashroomId) {
    await pool.query('DELETE FROM washrooms WHERE id = $1', [createdWashroomId]);
  }
  await pool.query("DELETE FROM users WHERE email = 'washroomtest@test.waloo'");
  await pool.end();
});

describe('GET /api/washrooms', () => {
  it('should return an array of washrooms', async () => {
    const res = await request(app).get('/api/washrooms');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should filter washrooms by search term', async () => {
    const res = await request(app).get('/api/washrooms?search=library');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return empty array for unmatched search', async () => {
    const res = await request(app).get('/api/washrooms?search=zzznomatch999');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(0);
  });
});

describe('POST /api/washrooms', () => {
  it('should create a washroom when authenticated', async () => {
    const res = await request(app)
      .post('/api/washrooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Washroom',
        address: '1 Test Street',
        latitude: 6.9271,
        longitude: 79.8612,
        description: 'A test washroom',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe('Test Washroom');
    createdWashroomId = res.body.id;
  });

  it('should reject creation without a token', async () => {
    const res = await request(app)
      .post('/api/washrooms')
      .send({
        name: 'Unauth Washroom',
        address: '2 Test Street',
        latitude: 6.9271,
        longitude: 79.8612,
      });
    expect(res.statusCode).toBe(401);
  });

  it('should reject creation with missing required fields', async () => {
    const res = await request(app)
      .post('/api/washrooms')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'No Address' });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should reject invalid coordinates', async () => {
    const res = await request(app)
      .post('/api/washrooms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Bad Coords',
        address: '3 Test Street',
        latitude: 999,
        longitude: 79.8612,
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/Latitude/);
  });
});

describe('GET /api/washrooms/:id', () => {
  it('should return a single washroom with reviews array', async () => {
    const res = await request(app).get(`/api/washrooms/${createdWashroomId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('name');
    expect(res.body).toHaveProperty('reviews');
    expect(Array.isArray(res.body.reviews)).toBe(true);
  });

  it('should return 404 for non-existent washroom', async () => {
    const res = await request(app).get('/api/washrooms/999999');
    expect(res.statusCode).toBe(404);
  });
});