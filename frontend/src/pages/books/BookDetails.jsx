import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import Auth from '../../utils/auth';
import './BookModal.css';

const BookDetails = () => {
    const { category, title } = useParams();
    const [categoryId, setCategoryId] = useState(null);
    const [book, setBook] = useState(null);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState('');
    const [reviews, setReviews] = useState([]);
    const [isRead, setIsRead] = useState(false);
    const [error, setError] = useState(null);
    const [user, setUser] = useState('');

    const [showReviewDeleteConfirm, setShowReviewDeleteConfirm] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);


    useEffect(() => {
        const userInfo = Auth();
        userInfo ? setUser(userInfo) : setUser('');

        const fetchBookDetails = async () => {
            try {
                const bookResponse = await axios.get(
                    `${process.env.REACT_APP_API_REF}books/${category}/${title}`
                );

                const thisCategoryId = bookResponse.data.data.category;
                const thisBookId = bookResponse.data.data._id;
                setCategoryId(thisCategoryId);
                setBook(bookResponse.data.data);
                try{
                    const reviewResponse = await axios.get(`${process.env.REACT_APP_API_REF}categories/${thisCategoryId}/books/${thisBookId}/reviews`);
                    setReviews(reviewResponse.data.data);

                    const readStatus = await axios.get(`${process.env.REACT_APP_API_REF}reads/${userInfo.id}/${thisBookId}`);
                    if (readStatus.data && Array.isArray(readStatus.data.data)) {
                        setIsRead(false);
                    }
                    else { setIsRead(true); }
                } catch (error) {
                    console.error('Error fetching reviews:', error);
                }
            } catch (error) {
                setError("Could not fetch book details. Please try again later.");
            }
        };

        fetchBookDetails();
    }, [category, title]);

    const handleDeleteReview = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${book._id}/reviews/${selectedReviewId}`);
    
            let updatedReviews;
            try {
                updatedReviews = await axios.get(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${book._id}/reviews`);
                setReviews(updatedReviews.data.data);
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.log('No reviews found for this book. Skipping review update.');
                    updatedReviews = { data: { data: [] } };
                } else {
                    console.error('Error fetching updated reviews:', error);
                    return;
                }
            }
    
            if (updatedReviews.data.data.length === 0) {
                setBook(prev => ({ ...prev, totalReview: null }));
                setReviews([]);
    
                await axios.patch(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${book._id}`, {
                    totalReview: null
                });
            } else {
                const averageRating = calculateAverageRating(updatedReviews.data.data);
                setBook(prev => ({ ...prev, totalReview: averageRating }));
    
                await axios.patch(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${book._id}`, {
                    totalReview: averageRating
                });
            }
    
            setShowReviewDeleteConfirm(false);
        } catch (error) {
            console.error('Error deleting review:', error);
        }
    };

    const confirmDeleteReview = (reviewId) => {
        setSelectedReviewId(reviewId);
        setShowReviewDeleteConfirm(true);
    };

    const submitReview = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in');
            return;
        }

        try {
            const payload = {
                reviewerName: user.userName,
                reviewText: reviewText,
                rating: rating,
                book: book._id,
                createdAt: new Date()
            }
            await axios.post(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${book._id}/reviews`, payload);
            setReviewText('');

            const updatedReviews = await axios.get(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${book._id}/reviews`);
            setReviews(updatedReviews.data.data);

            const averageRating = calculateAverageRating(updatedReviews.data.data);
            setBook(prev => ({ ...prev, totalReview: averageRating }));

            await axios.patch(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${book._id}`, {
                totalReview: averageRating
            });

            setRating('');
        } catch (error) {
            alert('Please fill all fields correctly', error);
        }
    };

    const calculateAverageRating = (reviews) => {
        if (!reviews || reviews.length === 0) return 0;
    
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return (totalRating / reviews.length);
    };

    const markAsRead = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in');
            return;
        }

        try {
            await axios.post(`${process.env.REACT_APP_API_REF}reads`, {
                userId: user.id,
                bookId: book._id
            });
            setIsRead(true);
        } catch (error) {
            console.error('Error marking book as read:', error);
        }
    };

    const removeFromRead = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_REF}reads/${user.id}/${book._id}`);
            setIsRead(false);
        } catch (error) {
            console.error('Error removing from read books:', error);
        }
    };

    if (error) return <div>{error}</div>;
    if (!book) return <div>Loading...</div>;

    return (
        <div className='books-container'>
            <div className="book-details">
                <img src={book.image} alt={book.title} className="img-fluid book-image" />
                <div className="book-info">
                    <h1 className="books-title">{book.title}</h1>
                    <Button onClick={isRead ? removeFromRead : markAsRead } variant={isRead ? 'danger' : 'success'} className="isRead">
                        {isRead ? 'Remove from read books' : "I've read this"}
                    </Button>
                    <p><strong>Author:</strong> {book.author}</p>
                    <p><strong>Description:</strong> {book.description}</p>
                    <p><strong>Published Year:</strong> {book.publishedYear}</p>
                    <p>
                        <strong>Total Review: </strong>
                        <span className="text-warning">
                            {(book.totalReview > 0) ? '⭐'.repeat(book.totalReview) : ' No reviews yet.'}
                        </span>
                    </p>
                </div>
            </div>

            {/* Review submission field */}
            <div className="mb-3 review-section">
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Leave a review..."
                    className="form-control"
                />
                <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon
                            key={star}
                            icon={faStar}
                            className={star <= rating ? 'text-warning' : 'text-muted'}
                            onClick={() => setRating(star)}
                        />
                    ))}
                </div>
                <Button onClick={submitReview} variant="primary" className="mt-2">Submit Review</Button>
            </div>

            {/* List of reviews */}
            <div className="reviews-list mt-3">
                <h5>Reviews:</h5>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review._id} className="border-bottom py-2">
                            <p>{review.reviewText}</p>
                            <div className="rating">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FontAwesomeIcon
                                        key={star}
                                        icon={faStar}
                                        className={star <= review.rating ? 'text-warning' : 'text-muted'}
                                    />
                                ))}
                            </div>
                            <small>- {review.reviewerName}</small>
                            {(review.reviewerName === user.userName || user.role === 'admin') && (
                                <button className="delete-review-button" onClick={() => confirmDeleteReview(review._id)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </div>

            <Modal show={showReviewDeleteConfirm} onHide={() => setShowReviewDeleteConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Review Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this review?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReviewDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteReview}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BookDetails;
