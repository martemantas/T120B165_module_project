import express from 'express';
import Category from '../models/Category.js';
import Book from '../models/Book.js';
import Review from '../models/Review.js';
import { isConnectedAsUser, verifyReviewAuthor } from '../middleware/auth.js';

const router = express.Router();

//post new record
router.post('/categories/:categoryID/books/:bookID/reviews', isConnectedAsUser, async (req, res) => {
    try{
        const { bookID } = req.params;

        const book = await Book.findById(bookID);
        const rating = req.body.rating;

        if (!book) {
            return res.status(404).json({
                status: 'FAILED',
                message: 'Book not found'
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(422).json({
                status: 'FAILED',
                message: 'Invalid rating. Rating should be between 1 and 5'
            });
        }

        const newReview = new Review({
            ...req.body,
            book: bookID
        });

        const savedReview = await newReview.save();

        res.status(201).json({
            status:"SUCCESS",
            message: "new Review posted successfully",
            data: savedReview
        })
    }
    catch(error){
        res.status(422).json({
            status: "FAILED",
            message: "Unprocessable entity: Invalid data",
            error: error.message
        });
    }
});

//get all records
router.get('/reviews', async (req, res) => {
    try {
        const result = await Review.find();
        if(!result || result.length === 0){
            res.status(404).json({
                status:"FAILED",
                message: "No reviews found"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "Successfully retrieved all reviews",
                data: result
            })
        }
    } 
    catch (error) {
        res.status(500).json({ 
            status: "ERROR", 
            message: "Error fetching reviews", 
            error: error.message 
        });
    }
});

// get by ID
router.get('/reviews/:id', async (req, res) => {
    try{
        const _id = req.params.id;
        const result = await Review.findById(_id);

        if(!result){
            res.status(404).json({
                status:"FAILED",
                message: "Record not found"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "successfully retrieved Review by ID",
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

// Get review by book id
router.get('/categories/:categoryID/books/:bookID/reviews', async (req, res) => {
    try {
        const bookID = req.params.bookID;
        const reviews = await Review.find({ book: bookID });

        if (!reviews || reviews.length === 0) {
            return res.status(200).json({ data: [] });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Successfully retrieved reviews for the book",
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "An error occurred while retrieving reviews",
            error: error.message
        });
    }
});

// GET a specific review by its ID
router.get('/categories/:categoryID/books/:bookID/reviews/:reviewID', async (req, res) => {
    const { bookID, reviewID } = req.params;

    try {
        const review = await Review.findOne({ _id: reviewID, book: bookID });
        if (!review) {
            return res.status(404).json({
                status: "FAILED",
                message: "Review not found"
            });
        }

        res.status(200).json({
            status: "SUCCESS",
            message: "Successfully retrieved the review",
            data: review
        });
    } catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "An error occurred while retrieving the review",
            error: error.message
        });
    }
});

//update (PUT) record
router.put('/categories/:categoryID/books/:bookID/reviews/:reviewID', isConnectedAsUser, verifyReviewAuthor, async (req, res) => {
    const { bookID, reviewID } = req.params;
    const rating = req.body.rating;
    
    try{
        if (rating < 1 || rating > 5) {
            return res.status(422).json({
                status: 'FAILED',
                message: 'Invalid rating. Rating should be between 1 and 5'
            });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            reviewID,
            { ...req.body, book: [bookID] },
            { new: true }
        );

        if(!updatedReview){
            res.status(400).json({
                status:"FAILED",
                message: "Bad payload"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "Record was successfully updated",
                data: updatedReview
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

//update (PATCH) record
router.patch('/categories/:categoryID/books/:bookID/reviews/:reviewID', isConnectedAsUser, verifyReviewAuthor, async (req, res) => {
    const { bookID, reviewID } = req.params;
    const rating = req.body.rating;
    
    try{
        if (rating < 1 || rating > 5) {
            return res.status(422).json({
                status: 'FAILED',
                message: 'Invalid rating. Rating should be between 1 and 5'
            });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            reviewID,
            { ...req.body, book: [bookID] },
            { new: true }
        );

        if(!updatedReview){
            res.status(404).json({
                status:"FAILED",
                message: "Record not found"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "Record was successfully updated",
                data: updatedReview
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
router.delete('/categories/:categoryID/books/:bookID/reviews/:reviewID', isConnectedAsUser, verifyReviewAuthor, async (req, res) => {
    const { categoryID, bookID, reviewID } = req.params;
    
    try {
        const deletedReview = await Review.findByIdAndDelete(reviewID);

        if(!deletedReview){
            res.status(404).json({
                status:"FAILED",
                message: "Record was not deleted"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "Record was successfully deleted",
                data: deletedReview
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