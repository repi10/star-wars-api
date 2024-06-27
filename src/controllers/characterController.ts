import { Request, Response } from 'express';
import Character from '../models/character';
import Episode from '../models/episode';

// Helper function to get episode IDs from titles
const getEpisodeIds = async (titles: string[]) => {
    const episodes = await Episode.find({ title: { $in: titles } });
    return episodes.map(episode => episode._id);
};

// Get all characters with pagination
export const getCharacters = async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const startIndex = (page - 1) * limit;
    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
        return res.status(400).json({ message: 'Invalid page or limit parameters' });
    }
    try {
        const characters = await Character.find()
            .populate('episodes')
            .skip(startIndex)
            .limit(limit);
        const total = await Character.countDocuments();
        res.json({ page, limit, total, results: characters });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single character by name
export const getCharacter = async (req: Request, res: Response) => {
    if (!req.params.name) {
        return res.status(400).json({ message: 'No name specified' });
    }
    try {
        const character = await Character.findOne({ name: req.params.name }).populate('episodes');
        if (character) {
            res.json(character);
        } else {
            res.status(404).json({ message: 'Character not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// Create a new character
export const createCharacter = async (req: Request, res: Response) => {
    const { name, episodes, planet } = req.body;
    if(!name || !episodes){
        return res.status(400).json({ message: 'Name and episodes are required' });
    }
    try {
        const episodeIds = await getEpisodeIds(episodes);
        const newCharacter = new Character({ name, episodes: episodeIds, planet });
        const savedCharacter = await newCharacter.save();
        res.status(201).json(savedCharacter);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Update a character
export const updateCharacter = async (req: Request, res: Response) => {
    const { name, episodes, planet } = req.body;
    try {
        const episodeIds = await getEpisodeIds(episodes);
        const updatedCharacter = await Character.findOneAndUpdate(
            { name: req.params.name },
            { name, episodes: episodeIds, planet },
            { new: true, runValidators: true }
        );
        if (updatedCharacter) {
            res.json(updatedCharacter);
        } else {
            res.status(404).json({ message: 'Character not found' });
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a character
export const deleteCharacter = async (req: Request, res: Response) => {
    if (!req.params.name) {
        return res.status(400).json({ message: 'No name specified' });
    }
    try {
        const deletedCharacter = await Character.findOneAndDelete({ name: req.params.name });
        if (deletedCharacter) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Character not found' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
