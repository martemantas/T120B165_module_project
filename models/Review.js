import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    reviewerName: {
        type: String,
        required: [true, "Reviewer name is required"],
        trim: true
    },
    reviewText: {
        type: String,
        required: [true, "Review text is required"],
        minlength: [10, "Review must be at least 10 characters long"]
    },
    rating: {
        type: Number,
        required: [true, "Rating is required"],
        min: [1, "Rating must be at least 1"],
        max: [5, "Rating must be at most 5"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;