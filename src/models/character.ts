import mongoose, { Document, Schema } from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Character:
 *       type: object
 *       required:
 *         - name
 *         - episodes
 *       properties:
 *         name:
 *           type: string
 *         episodes:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Episode'
 *         planet:
 *           type: string
 */

export interface ICharacter extends Document {
    name: string;
    episodes: mongoose.Types.ObjectId[];
    planet?: string;
}

const characterSchema: Schema = new Schema({
    name: { type: String, required: true, unique:true},
    episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Episode', required: true }],
    planet: { type: String },
});

export default mongoose.model<ICharacter>('Character', characterSchema);
