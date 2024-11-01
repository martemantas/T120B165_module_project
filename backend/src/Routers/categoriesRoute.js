import express from 'express';
import category from "./../models/Category.js"
import book from "./../models/Book.js"
import review from "./../models/Review.js"
import { isConnectedAsAdmin } from '../middleware/auth.js';

const router = express.Router();

//post new record
router.post('/categories', isConnectedAsAdmin, async (req, res) => {
    try{
        const { topic, image } = req.body;

        if (!topic || !image) {
            return res.status(400).json({
                status: "FAILED",
                message: "Topic and image are required."
            });
        }

        const data = new category({topic, image})
        const result = await data.save()

        if(!result){
            res.status(400).json({
                status:"FAILED",
                message: "Bad payload."
            })
        }
        else{
            res.status(201).json({
                status:"SUCCESS",
                message: "new category posted successfully",
                data: result
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

//get all records
router.get('/categories', async (req, res) => {
    try {
        const result = await category.find();
        if(!result || result.length === 0){
            res.status(404).json({
                status:"FAILED",
                message: "No categories found"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "Successfully retrieved all categories",
                data: result
            })
        }
    } 
    catch (error) {
        res.status(500).json({ 
            status: "ERROR", 
            message: "Error fetching categories", 
            error: error.message 
        });
    }
});

// get by name
router.get('/categories/topic/:topic', async (req, res) => {
    try{
        const topic = req.params;
        const result = await category.findOne(topic);

        if(!result){
            res.status(404).json({
                status:"FAILED",
                message: "Record not found"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "successfully retrieved category by topic name",
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

// get by ID
router.get('/categories/:id', async (req, res) => {
    try{
        const _id = req.params.id;
        const result = await category.findById(_id);

        if(!result){
            res.status(404).json({
                status:"FAILED",
                message: "Record not found"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "successfully retrieved category by ID",
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

//update (PUT) record
router.put('/categories/:id', isConnectedAsAdmin, async (req, res) => {
    try{
        const _id = req.params.id;
        const result = await category.findByIdAndUpdate(_id, req.body, {new: true});

        if(!result){
            res.status(400).json({
                status:"FAILED",
                message: "Bad payload"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "Record was successfully updated",
                data: result
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
router.patch('/categories/:id', isConnectedAsAdmin, async (req, res) => {
    try {
        const _id = req.params.id;
        const result = await category.findByIdAndUpdate(_id, req.body, { new: true });

        if(!result){
            res.status(404).json({
                status:"FAILED",
                message: "Record not found"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "Record was successfully updated",
                data: result
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
router.delete('/categories/:id', isConnectedAsAdmin, async (req, res) => {
    try{
        const _id = req.params.id;

        const categoryToDelete = await category.findById(_id);    
        const booksToDelete = await book.find({ category: _id });
        const bookIds = booksToDelete.map(book => book._id);

        await review.deleteMany({ book: { $in: bookIds } });
        await book.deleteMany({ category: _id });

        const result = await category.findByIdAndDelete(_id);

        if(!categoryToDelete || !booksToDelete || !result){
            res.status(404).json({
                status:"FAILED",
                message: "Record was not deleted"
            })
        }
        else{
            res.status(200).json({ //204 gal?
                status:"SUCCESS",
                message: "Record was successfully deleted",
                data: result
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