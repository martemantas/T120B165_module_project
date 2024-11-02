import express from 'express';
import Category from './../models/Category.js';
import Book from './../models/Book.js';
import ReadBook from './../models/ReadBook.js';
import Review from './../models/Review.js';
import { isConnectedAsAdmin } from '../middleware/auth.js';
import { isConnectedAsUser } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Book management
 */

/**
 * @swagger
 * /categories/{categoryID}/books:
 *   post:
 *     tags: [Books]
 *     summary: Add a new book to a category
 *     parameters:
 *       - in: path
 *         name: categoryID
 *         required: true
 *         description: ID of the category to add the book to
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Example Book Title"
 *               author:
 *                 type: string
 *                 example: "Author Name"
 *               description:
 *                 type: string
 *                 example: "Description of the book."
 *               publishedDate:
 *                 type: string
 *                 format: date
 *                 example: "2024-11-01"
 *               isbn:
 *                 type: string
 *                 example: "123-456-789"
 *     responses:
 *       201:
 *         description: Book added successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Error adding book
 */
//post new record
router.post('/categories/:categoryID/books', isConnectedAsAdmin, async (req, res) => {
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

/**
 * @swagger
 * /books:
 *   get:
 *     tags: [Books]
 *     summary: Retrieve all books
 *     responses:
 *       200:
 *         description: Successfully retrieved all books
 *       404:
 *         description: No records found
 *       500:
 *         description: Error fetching books
 */
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

/**
 * @swagger
 * /books/{category}/{title}:
 *   get:
 *     tags: [Books]
 *     summary: Get a book by its title within a category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         description: Category of the book
 *         schema:
 *           type: string
 *       - in: path
 *         name: title
 *         required: true
 *         description: Title of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved book by title
 *       404:
 *         description: Category or book not found
 *       500:
 *         description: Error retrieving book
 */
// Get book by title
router.get('/books/:category/:title', async (req, res) => {
    try {
        const { category, title } = req.params;
        
        const categoryData = await Category.findOne({ topic: category });
        
        if (!categoryData) {
            return res.status(404).json({
                status: "FAILED",
                message: "Category not found"
            });
        }

        const categoryId = categoryData._id;
        const result = await Book.findOne({ category: categoryId, title });

        if (!result) {
            return res.status(404).json({
                status: "FAILED",
                message: "Record not found"
            });
        }
        else{
            res.status(200).json({
                status: "SUCCESS",
                message: "Successfully retrieved book by title",
                data: result
            });
        }
    } catch (error) {
        console.error("Error retrieving book:", error);
        res.status(500).json({
            status: "FAILED",
            message: "An error occurred while retrieving the book"
        });
    }
});

/**
 * @swagger
 * /books/{bookId}:
 *   get:
 *     tags: [Books]
 *     summary: Get a book by its ID
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         description: ID of the book to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved book by ID
 *       404:
 *         description: Record not found
 */
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

/**
 * @swagger
 * /categories/{categoryId}/books:
 *   get:
 *     tags: [Books]
 *     summary: Get all books in a specific category
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID of the category to retrieve books from
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved books for the category
 *       404:
 *         description: No books found for this category
 *       500:
 *         description: Error retrieving books
 */
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

/**
 * @swagger
 * /categories/{categoryID}/books/{bookID}:
 *   get:
 *     tags: [Books]
 *     summary: Get a specific book by its ID in a category
 *     parameters:
 *       - in: path
 *         name: categoryID
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *       - in: path
 *         name: bookID
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved the book
 *       404:
 *         description: Book not found
 *       500:
 *         description: Error retrieving the book
 */
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

/**
 * @swagger
 * /categories/{categoryID}/books/{bookID}:
 *   put:
 *     tags: [Books]
 *     summary: Update a book's details
 *     parameters:
 *       - in: path
 *         name: categoryID
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *       - in: path
 *         name: bookID
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Updated Book Title"
 *               author:
 *                 type: string
 *                 example: "Updated Author Name"
 *               description:
 *                 type: string
 *                 example: "Updated description of the book."
 *     responses:
 *       200:
 *         description: Successfully updated the book
 *       400:
 *         description: Record was not updated
 *       422:
 *         description: Invalid data
 */
//update(put) record
router.put('/categories/:categoryID/books/:bookID', isConnectedAsAdmin, async (req, res) => {
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

/**
 * @swagger
 * /categories/{categoryID}/books/{bookID}:
 *   patch:
 *     tags: [Books]
 *     summary: Partially update a book's details
 *     parameters:
 *       - in: path
 *         name: categoryID
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *       - in: path
 *         name: bookID
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Partially Updated Book Title"
 *               description:
 *                 type: string
 *                 example: "Partially updated description."
 *     responses:
 *       200:
 *         description: Successfully updated the book
 *       404:
 *         description: Record was not found
 *       422:
 *         description: An error occurred while updating the record
 */
// patch record 
router.patch('/categories/:categoryID/books/:bookID', isConnectedAsUser, async (req, res) => {
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

/**
 * @swagger
 * /categories/{categoryID}/books/{bookID}:
 *   delete:
 *     tags: [Books]
 *     summary: Delete a book
 *     parameters:
 *       - in: path
 *         name: categoryID
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *       - in: path
 *         name: bookID
 *         required: true
 *         description: ID of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the book
 *       404:
 *         description: Record was not found
 *       500:
 *         description: Error trying to delete the record
 */
// delete record
router.delete('/categories/:categoryID/books/:bookID', isConnectedAsAdmin, async (req, res) => {
    const { bookID } = req.params;

    try{
        const bookToDelete = await Book.findById(bookID);
        await Review.deleteMany({ book: bookID });
        await ReadBook.deleteMany({ book: bookID });

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