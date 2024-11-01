import express from 'express';
import ReadBook from './../models/ReadBook.js';
import { isConnectedAsUser } from '../middleware/auth.js';

const router = express.Router();

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
