import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Character from './src/models/character';
import Episode from './src/models/episode';

dotenv.config();

const seedEpisodes = [
    { title: 'NEWHOPE' },
    { title: 'EMPIRE' },
    { title: 'JEDI' },
];

const seedCharacters = [
    { name: 'Luke Skywalker', episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'] },
    { name: 'Darth Vader', episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'] },
    { name: 'Han Solo', episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'] },
    { name: 'Leia Organa', episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'], planet: 'Alderaan' },
    { name: 'Wilhuff Tarkin', episodes: ['NEWHOPE'] },
    { name: 'C-3PO', episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'] },
    { name: 'R2-D2', episodes: ['NEWHOPE', 'EMPIRE', 'JEDI'] },
];

const seedDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');

        await Character.deleteMany({});
        await Episode.deleteMany({});

        const insertedEpisodes = await Episode.insertMany(seedEpisodes);
        const episodeMap = insertedEpisodes.reduce((map: any, episode) => {
            map[episode.title] = episode._id;
            return map;
        }, {});

        const charactersWithEpisodeIds = seedCharacters.map(character => ({
            ...character,
            episodes: character.episodes.map(title => episodeMap[title]),
        }));

        await Character.insertMany(charactersWithEpisodeIds);

        console.log('Database seeded successfully');
        process.exit(0);
    } catch (error: any) {
        console.error(`Error seeding database: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();
