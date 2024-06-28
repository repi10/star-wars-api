import request from 'supertest';
import app from '../../src/app';
import mongoose from 'mongoose';
import Character from '../../src/models/character';
import Episode from '../../src/models/episode';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI || '');
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await Character.deleteMany({});
    await Episode.deleteMany({});

    const episodeData = [
        { title: 'NEWHOPE' },
        { title: 'EMPIRE' },
        { title: 'JEDI' },
    ];

    const insertedEpisodes = await Episode.insertMany(episodeData);
    const episodeMap = insertedEpisodes.reduce((map: any, episode) => {
        map[episode.title] = episode._id;
        return map;
    }, {});

    const characterData = [
        { name: 'Luke Skywalker', episodes: [episodeMap.NEWHOPE, episodeMap.EMPIRE, episodeMap.JEDI] },
        { name: 'Darth Vader', episodes: [episodeMap.NEWHOPE, episodeMap.EMPIRE, episodeMap.JEDI] },
        { name: 'Han Solo', episodes: [episodeMap.NEWHOPE, episodeMap.EMPIRE, episodeMap.JEDI] },
        { name: 'Leia Organa', episodes: [episodeMap.NEWHOPE, episodeMap.EMPIRE, episodeMap.JEDI], planet: 'Alderaan' },
        { name: 'Wilhuff Tarkin', episodes: [episodeMap.NEWHOPE] },
        { name: 'C-3PO', episodes: [episodeMap.NEWHOPE, episodeMap.EMPIRE, episodeMap.JEDI] },
        { name: 'R2-D2', episodes: [episodeMap.NEWHOPE, episodeMap.EMPIRE, episodeMap.JEDI] },
    ];

    await Character.insertMany(characterData);
});

describe('GET /api/characters', () => {
    it('should get a paginated list of characters', async () => {
        const res = await request(app).get('/api/characters?page=1&limit=2');
        expect(res.statusCode).toEqual(200);
        expect(res.body.results).toHaveLength(2);
        expect(res.body.page).toBe(1);
        expect(res.body.limit).toBe(2);
        expect(res.body.total).toBe(7);
    });
});

describe('GET /api/characters/:name', () => {
    it('should get a single character by name', async () => {
        const res = await request(app).get('/api/characters/Luke Skywalker');
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('Luke Skywalker');
        expect(res.body.episodes).toHaveLength(3);
    });
});

describe('POST /api/characters', () => {
    it('should create a new character', async () => {
        const res = await request(app)
            .post('/api/characters')
            .send({
                name: 'Yoda',
                episodes: ['EMPIRE', 'JEDI']
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toBe('Yoda');
        expect(res.body.episodes).toHaveLength(2);
    });
});

describe('PUT /api/characters/:name', () => {
    it('should update a character', async () => {
        const res = await request(app)
            .put('/api/characters/Luke Skywalker')
            .send({
                name: 'Luke Skywalker',
                episodes: ['EMPIRE', 'JEDI']
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('Luke Skywalker');
        expect(res.body.episodes).toHaveLength(2);
    });
});

describe('DELETE /api/characters/:name', () => {
    it('should delete a character', async () => {
        const res = await request(app).delete('/api/characters/Luke Skywalker');
        expect(res.statusCode).toEqual(204);
    });
});
