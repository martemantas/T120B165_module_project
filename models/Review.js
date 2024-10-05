import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    reviewerName: {
        type: String,
        required: true
    },
    reviewText: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;