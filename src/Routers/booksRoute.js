import express from 'express';
import Category from './../models/Category.js';
import Book from './../models/Book.js';
import Review from './../models/Review.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

//post new record
router.post('/categories/:categoryID/books', verifyAdmin, async (req, res) => {
    try{
        const { categoryID } = req.params;
        
        const category = await Category.findById(categoryID);
        if (!category) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Category not found'
            });
        }

        const newBook = new Book({
            ...req.body,
            category: categoryID
        });

        const savedBook = await newBook.save();
        
        res.status(201).json({
            status: "SUCCESS",
            message: `Book added successfully under category: ${category.topic}`,
            data: savedBook
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "An error occurred while adding the book",
            error: error.message
        });
    }
});

//get all records
router.get('/books', async (req, res) => {
    try {
        const result = await Book.find();
        if(!result){
            res.status(404).json({
                status:"FAILED",
                message: "No records found"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "successfully retrieved all books",
                data: result
            })
        }
    } 
    catch (error) {
      res.status(500).json({ message: "Error fetching books", error });
    }
});

// get by ID
router.get('/books/:bookId', async (req, res) => {
    try{
        const _id = req.params.bookId;
        const result = await Book.findById(_id);

        if(!result){
            res.status(404).json({
                status:"FAILED",
                message: "Record not found"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "successfully retrieved book by ID",
                data: result
            })
        }
    }
    catch(error){
        res.status(404).json({
            status:"FAILED",
            message: "Record not found"
        })
    }
});

// Get book by category id
router.get('/categories/:categoryId/books', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const books = await Book.find({ category: categoryId });

        if (!books || books.length === 0) {
            return res.status(404).json({
                status: "FAILED",
                message: "No books found for this category"
            });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Successfully retrieved books for the category",
            data: books
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "An error occurred while retrieving books",
            error: error.message
        });
    }
});

// GET a specific book by its ID
router.get('/categories/:categoryID/books/:bookID', async (req, res) => {
    const { categoryID, bookID } = req.params;

    try {
        const book = await Book.findOne({ _id: bookID, category: categoryID });
        if (!book) {
            return res.status(404).json({
                status: "FAILED",
                message: "Book not found"
            });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Successfully retrieved the book",
            data: book
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "An error occurred while retrieving the book",
            error: error.message
        });
    }
});

//update(put) record
router.put('/categories/:categoryID/books/:bookID', verifyAdmin, async (req, res) => {
    const { categoryID, bookID } = req.params;
    
    try{
        const updatedBook = await Book.findByIdAndUpdate(
            bookID,
            { ...req.body, category: [categoryID] },
            { new: true }
        );

        if(!updatedBook){
            res.status(400).json({
                status:"FAILED",
                message: "Record was not updated"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "Record was successfully updated",
                data: updatedBook
            })
        }
    }
    catch(error){
        res.status(422).json({
            status: "FAILED",
            message: "Unprocessable entity: Invalid data",
            error: error.message
        });
    }
});

// patch record 
router.patch('/categories/:categoryID/books/:bookID', verifyAdmin, async (req, res) => {
    const { categoryID, bookID } = req.params;
    
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            bookID,
            { ...req.body },
            { new: true }
        );

        if (!updatedBook) {
            return res.status(404).json({
                status: "FAILED",
                message: "Record was not found"
            });
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "Record was successfully updated",
                data: updatedBook
            })
        }
    } catch (error) {
        res.status(422).json({
            status: "ERROR",
            message: "An error occurred while updating the record",
            error: error.message
        });
    }
});

// delete record
router.delete('/categories/:categoryID/books/:bookID', verifyAdmin, async (req, res) => {
    const { bookID } = req.params;

    try{
        const bookToDelete = await Book.findById(bookID);
        await Review.deleteMany({ book: bookID });

        const deletedBook = await Book.findByIdAndDelete(bookID);

        if(!bookToDelete || !deletedBook){
            res.status(404).json({
                status:"FAILED",
                message: "Record was not found"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "Record was successfully deleted",
                data: deletedBook
            })
        }
    }
    catch(error){
        res.status(500).json({
            status: "ERROR",
            message: "An error occurred while trying to delete the record",
            error: error.message
        });
    }
});

export default router