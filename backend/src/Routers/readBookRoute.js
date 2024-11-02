import express from 'express';
import ReadBook from './../models/ReadBook.js';
import { isConnectedAsUser } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /readbooks:
 *   post:
 *     tags: [ReadBooks]
 *     summary: Mark a book as read for a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d5f484f40c1a001f4f4c67"
 *               bookId:
 *                 type: string
 *                 example: "60d5f4b8f40c1a001f4f4c68"
 *     responses:
 *       201:
 *         description: Book marked as read successfully
 *       200:
 *         description: Book already marked as read by user
 *       500:
 *         description: Error marking book as read
 */
router.post('/', isConnectedAsUser, async (req, res) => {
    const { userId, bookId } = req.body;

    try {
        const existingReadEntry = await ReadBook.findOne({ userId, bookId });
        if (existingReadEntry) {
            return res.status(200).json({ message: 'Book already marked as read by user.', data: existingReadEntry });
        }
        
        const readEntry = new ReadBook({ userId, bookId });
        await readEntry.save();
        res.status(201).json({ message: 'Book marked as read.', data: readEntry });
    } catch (error) {
        console.error('Error saving read entry:', error);
        res.status(500).json({ message: 'Error marking book as read.', error });
    }
    
});

/**
 * @swagger
 * /readbooks/{userId}:
 *   get:
 *     tags: [ReadBooks]
 *     summary: Retrieve all read books for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved read books
 *       500:
 *         description: Error retrieving read books
 */
router.get('/:userId', isConnectedAsUser, async (req, res) => {
    const { userId } = req.params;

    try {
        const readBooks = await ReadBook.find({ userId }).populate('bookId');

        res.status(200).json({ message: 'Read books retrieved successfully.', data: readBooks });
    } catch (error) {
        console.error('Error retrieving read books:', error);
        res.status(500).json({ message: 'Error retrieving read books.', error });
    }
});

/**
 * @swagger
 * /readbooks/{userId}/{bookId}:
 *   get:
 *     tags: [ReadBooks]
 *     summary: Retrieve a specific read entry for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: The ID of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the read entry
 *       404:
 *         description: Read entry not found
 *       500:
 *         description: Error retrieving read entry
 */
router.get('/:userId/:bookId', isConnectedAsUser, async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        const readEntry = await ReadBook.findOne({ userId, bookId }).populate('bookId');
        
        if (!readEntry) {
            // return res.status(404).json({ message: 'Read entry not found.' });
            return res.status(200).json({ data: [] });
        }
        
        res.status(200).json({ message: 'Read entry retrieved successfully.', data: readEntry });
    } catch (error) {
        console.error('Error retrieving read entry:', error);
        res.status(500).json({ message: 'Error retrieving read books.', error });
    }
});

/**
 * @swagger
 * /readbooks/{userId}/{bookId}:
 *   delete:
 *     tags: [ReadBooks]
 *     summary: Remove a book from the read list for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user
 *         schema:
 *           type: string
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: The ID of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book removed from read list
 *       404:
 *         description: Read entry not found
 *       500:
 *         description: Error removing book from read list
 */
router.delete('/:userId/:bookId', isConnectedAsUser, async (req, res) => {
    const { userId, bookId } = req.params;

    try {
        const result = await ReadBook.findOneAndDelete({ userId, bookId });
        if (result) {
            res.status(200).json({ message: 'Book removed from read list.', data: result });
        } else {
            res.status(404).json({ message: 'Read entry not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error removing book from read list.', error });
    }
});

export default router
