import express from 'express';
import category from "./../models/Category.js"

const router = express.Router();

//post new record
router.post('/categories', async (req, res) => {
    try{
        const data = new category(req.body)
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
router.put('/categories/:id', async (req, res) => {
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
router.patch('/categories/:id', async (req, res) => {
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
router.delete('/categories/:id', async (req, res) => {
    try{
        const _id = req.params.id;
        const result = await category.findByIdAndDelete(_id);

        if(!result){
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