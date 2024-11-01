import jwt from 'jsonwebtoken';
import Review from '../models/Review.js';

export const isConnectedAsAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. User is not an admin." });
        }

        req.user = user;
        next();
    });
};

export const isConnectedAsUser = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        if (user.role !== 'user' && user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. Please login." });
        }

        req.user = user;
        next();
    });
};

export const verifyReviewAuthor = async (req, res, next) => {
    const { reviewID } = req.params;
    const token = req.cookies.token;

    if (!token) {
        return res.status(403).json({ message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const review = await Review.findById(reviewID);

        if (!review) {
            return res.status(404).json({ message: "Review not found." });
        }
        
        // Check if the user is the author of the review or an admin
        if ((review.reviewerName !== decoded.userName) && decoded.role !== "admin") {
            return res.status(403).json({ message: "Access denied. You are not the author of this review." });
        }

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token." });
    }
}