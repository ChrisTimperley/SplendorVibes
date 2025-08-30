import request from 'supertest';
import app from '../src/index';

describe('Server Health', () => {
  it('should respond to health check', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('Game API', () => {
  it('should handle game creation', async () => {
    const response = await request(app)
      .post('/api/games')
      .send({ playerName: 'Test Player' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.players).toHaveLength(1);
    expect(response.body.players[0].name).toBe('Test Player');
  });
});
