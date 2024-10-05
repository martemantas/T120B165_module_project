import express from 'express';
import book from "../models/Book.js"

const router = express.Router();

//post new record
router.post('/books', async (req, res) => {
    try{
        const data = new book(req.body)
        const result = await data.save()

        if(!result){
            res.status(400).json({
                status:"FAILED",
                message: "post of book failed"
            })
        }
        else{
            res.status(201).json({
                status:"SUCCESS",
                message: "new book posted successfully",
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
router.get('/books', async (req, res) => {
    try {
        const result = await book.find();
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
router.get('/books/:id', async (req, res) => {
    try{
        const _id = req.params.id;
        const result = await book.findById(_id);

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

//update(put) record
router.put('/books/:id', async (req, res) => {
    try{
        const _id = req.params.id;
        const result = await book.findByIdAndUpdate(_id, req.body, {new: true});

        if(!result){
            res.status(400).json({
                status:"FAILED",
                message: "Record was not updated"
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

// patch record todo
router.patch('/books/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const result = await book.findByIdAndUpdate(_id, req.body, { new: true });

        if(!result){
            res.status(404).json({
                status:"FAILED",
                message: "Record was not found"
            })
        }
        else{
            res.status(200).json({
                status:"SUCCESS",
                message: "Record was successfully updated",
                data: result
            })
        }
    } catch (error) { //todo make sure correct
        res.status(422).json({
            status: "ERROR",
            message: "An error occurred while updating the record",
            error: error.message
        });
    }
});

// delete record
router.delete('/books/:id', async (req, res) => {
    try{
        const _id = req.params.id;
        const result = await book.findByIdAndDelete(_id);

        if(!result){
            res.status(404).json({
                status:"FAILED",
                message: "Record was not deleted"
            })
        }
        else{
            res.status(200).json({
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