import mongoose from 'mongoose';

const readBookSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }
},{
    collection: 'reads' 
});

// readBookSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const ReadBook = mongoose.model('ReadBook', readBookSchema);

export default ReadBook;