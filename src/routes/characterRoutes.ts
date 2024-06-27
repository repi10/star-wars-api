import express from 'express';
import {
  getCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter
} from '../controllers/characterController';

const router = express.Router();

/**
 * @swagger
 * /characters:
 *   get:
 *     summary: Get all characters
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of characters
 */
router.get('/characters', getCharacters);

/**
 * @swagger
 * /characters/{name}:
 *   get:
 *     summary: Get a single character
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Character name
 *     responses:
 *       200:
 *         description: A character
 *       404:
 *         description: Character not found
 */
router.get('/characters/:name', getCharacter);

/**
 * @swagger
 * /characters:
 *   post:
 *     summary: Create a new character
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Character'
 *     responses:
 *       201:
 *         description: Character created
 *       400:
 *         description: Invalid input
 */
router.post('/characters', createCharacter);

/**
 * @swagger
 * /characters/{name}:
 *   put:
 *     summary: Update a character
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Character name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Character'
 *     responses:
 *       200:
 *         description: Character updated
 *       404:
 *         description: Character not found
 */
router.put('/characters/:name', updateCharacter);

/**
 * @swagger
 * /characters/{name}:
 *   delete:
 *     summary: Delete a character
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Character name
 *     responses:
 *       204:
 *         description: Character deleted
 *       404:
 *         description: Character not found
 */
router.delete('/characters/:name', deleteCharacter);

export default router;