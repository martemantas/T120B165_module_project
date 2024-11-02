import express from 'express';
import category from "./../models/Category.js"
import book from "./../models/Book.js"
import review from "./../models/Review.js"
import { isConnectedAsAdmin } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a new category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "New Category Topic"
 *               image:
 *                 type: string
 *                 example: "http://example.com/image.jpg"
 *     responses:
 *       201:
 *         description: Successfully created a new category
 *       400:
 *         description: Topic and image are required
 *       422:
 *         description: Invalid data
 */
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

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Retrieve all categories
 *     responses:
 *       200:
 *         description: Successfully retrieved all categories
 *       404:
 *         description: No categories found
 *       500:
 *         description: Error fetching categories
 */
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

/**
 * @swagger
 * /categories/topic/{topic}:
 *   get:
 *     tags: [Categories]
 *     summary: Retrieve a category by topic
 *     parameters:
 *       - in: path
 *         name: topic
 *         required: true
 *         description: The topic of the category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved category by topic
 *       404:
 *         description: Record not found
 */
// get by category name
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

/**
 * @swagger
 * /categories/title/{title}:
 *   get:
 *     tags: [Categories]
 *     summary: Retrieve a category by book title
 *     parameters:
 *       - in: path
 *         name: title
 *         required: true
 *         description: The title of the book
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved category by book title
 *       404:
 *         description: Book or category not found
 */
// get by book name
router.get('/categories/title/:title', async (req, res) => {
    try{
        const { title } = req.params;

        const bookData = await book.findOne({ title });

        if (!bookData) {
            return res.status(404).json({
                status: "FAILED",
                message: "Book not found"
            });
        }

        const result = await category.findOne({ _id: bookData.category} );

        if(!result){
            res.status(404).json({
                status:"FAILED",
                message: "Record not found"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "successfully retrieved category by book title name",
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
 * /categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Retrieve a category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved category by ID
 *       404:
 *         description: Record not found
 */
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

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update a category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "Updated Category Topic"
 *               image:
 *                 type: string
 *                 example: "http://example.com/updated-image.jpg"
 *     responses:
 *       200:
 *         description: Successfully updated the category
 *       400:
 *         description: Bad payload
 *       422:
 *         description: Invalid data
 */
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

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     tags: [Categories]
 *     summary: Partially update a category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               topic:
 *                 type: string
 *                 example: "Partially Updated Topic"
 *               image:
 *                 type: string
 *                 example: "http://example.com/partially-updated-image.jpg"
 *     responses:
 *       200:
 *         description: Successfully updated the category
 *       404:
 *         description: Record not found
 *       422:
 *         description: Invalid data
 */
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

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete a category
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully deleted the category
 *       404:
 *         description: Record was not deleted
 *       500:
 *         description: An error occurred while trying to delete the record
 */
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