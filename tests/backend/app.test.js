const request = require('supertest');
const app = require('../../server');

describe('Backend Smoke Test', () => {
    it('should return events from /api/events', async () => {
        const res = await request(app).get('/api/events');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should return news from /api/news', async () => {
        const res = await request(app).get('/api/news');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBeTruthy();
    });
});
