const request = require('supertest');
const express = require('express');
const catalogRoutes = require('../src/catalog/routes');

const app = express();
app.use(express.json());
app.use('/api/catalog', catalogRoutes);

describe('Catalog Service API', () => {
  test('GET /api/catalog/status should return service status', async () => {
    const response = await request(app).get('/api/catalog/status');
    
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('service', 'Content Catalog');
    expect(response.body).toHaveProperty('status', 'active');
    expect(response.body).toHaveProperty('movies');
    expect(response.body).toHaveProperty('shows');
  });
  
  test('GET /api/catalog/movies should return all movies', async () => {
    const response = await request(app).get('/api/catalog/movies');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  test('GET /api/catalog/shows should return all shows', async () => {
    const response = await request(app).get('/api/catalog/shows');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  test('GET /api/catalog/search should return search results', async () => {
    const response = await request(app).get('/api/catalog/search?query=a');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  test('GET /api/catalog/search should require a query parameter', async () => {
    const response = await request(app).get('/api/catalog/search');
    
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
  });
});