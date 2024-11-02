import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    publishedYear: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    totalReview: {
        type: Number,
        default: '',
        min: 1,
        max: 5,
    },
    image: {
        type: String,
        required: false
    }
});

const Book = mongoose.model('Book', bookSchema);

export default Book;