import mongoose, { Document, Schema } from 'mongoose';
/**
 * @swagger
 * components:
 *   schemas:
 *     Episode:
 *       type: string
 */
export interface IEpisode extends Document {
    title: string;
}

const episodeSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
});

export default mongoose.model<IEpisode>('Episode', episodeSchema);