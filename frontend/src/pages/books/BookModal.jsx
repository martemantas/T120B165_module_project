import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import Auth from '../../utils/auth';
import { fetchCategories } from '../../utils/fetchCategories.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BookModal.css';

const CategoryBooks = ( {allCategories} ) => {
    const [user, setUser] = useState('');
    const { category } = useParams(); // Extract the category name from the URL
    const [categoryId, setCategoryId] = useState(null);
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState('');
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const [isRead, setIsRead] = useState(false);

    // Confirmational modals for deletion 
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);
    const [showReviewDeleteConfirm, setShowReviewDeleteConfirm] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = Auth();
        setUser(userInfo || '');
        
        const fetchBooks = async () => {
            try{
                let url;
                if (allCategories) {
                    url = `${process.env.REACT_APP_API_REF}books`;
                } 
                else {
                    const categories = await fetchCategories();
                    const matchedCategory = categories.find(cat => cat.topic === category);
                    
                    if (!matchedCategory) {
                        navigate('/');
                        return;
                    }

                    // const categoryResponse = await axios.get(
                    //     `${process.env.REACT_APP_API_REF}categories/topic/${category}`
                    // );
                    // const categoryId = categoryResponse.data.data._id;
                    const categoryId = matchedCategory._id;
                    setCategoryId(categoryId);

                    url = `${process.env.REACT_APP_API_REF}categories/${categoryId}/books`;
                }
                    
                const response = await axios.get(url);
                setBooks(response.data.data);
            }
            catch(error){
                setError(`Could not fetch books${allCategories ? '' : ` for category ${category}`}.`);
            }
        }

        fetchBooks();
    }, [allCategories, category, navigate]);

    const handleBookOpen = async (book) => {
        setSelectedBook(book);
        setShowModal(true);
        
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${book._id}/reviews`);
            setReviews(response.data.data);

            const readStatus = await axios.get(`${process.env.REACT_APP_API_REF}reads/${user.id}/${book._id}`);
            if (readStatus.data && Array.isArray(readStatus.data.data)) {
                setIsRead(false);
            }
            else { setIsRead(true); }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleDeleteBook = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${selectedBookId}`);
            // fetchCategoryAndBooks();
            setShowDeleteConfirm(false);
            setBooks(books.filter(book => book._id !== selectedBookId));
        } catch (error) {
            console.error('Error deleting book:', error);
        }
    };

    const confirmDeleteBook = (bookId) => {
        setSelectedBookId(bookId);
        setShowDeleteConfirm(true);
    };

    const handleDeleteReview = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${selectedBook._id}/reviews/${selectedReviewId}`);
    
            let updatedReviews;
            try {
                updatedReviews = await axios.get(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${selectedBook._id}/reviews`);
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
                setSelectedBook(prev => ({ ...prev, totalReview: null }));
                setReviews([]);
    
                await axios.patch(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${selectedBook._id}`, {
                    totalReview: null
                });
            } else {
                const averageRating = calculateAverageRating(updatedReviews.data.data);
                setSelectedBook(prev => ({ ...prev, totalReview: averageRating }));
    
                await axios.patch(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${selectedBook._id}`, {
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
        try {
            const payload = {
                reviewerName: user.userName,
                reviewText: reviewText,
                rating: rating,
                book: selectedBookId,
                createdAt: new Date()
            }
            await axios.post(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${selectedBook._id}/reviews`, payload);
            setReviewText('');

            const updatedReviews = await axios.get(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${selectedBook._id}/reviews`);
            setReviews(updatedReviews.data.data);

            const averageRating = calculateAverageRating(updatedReviews.data.data);
            setSelectedBook(prev => ({ ...prev, totalReview: averageRating }));

            await axios.patch(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${selectedBook._id}`, {
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
        try {
            await axios.post(`${process.env.REACT_APP_API_REF}reads`, {
                userId: user.id,
                bookId: selectedBook._id
            });
            setIsRead(true);
        } catch (error) {
            console.error('Error marking book as read:', error);
        }
    };

    const removeFromRead = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_REF}reads/${user.id}/${selectedBook._id}`);
            setIsRead(false);
        } catch (error) {
            console.error('Error removing from read books:', error);
        }
    };
    
    const closeModal = () => {
        setShowModal(false);
        setSelectedBook(null);
        setReviewText('');
        setReviews([]);
    };

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className='books-container'>
            <h2 className='books-title'>{allCategories ? "Dicover from all books" : `Books in ${category}`}</h2>
                {books.length > 0 ? (
                    <div className="book-list">
                        {books.map((book) => (
                            <div key={book._id} className="book-item" onClick={() => handleBookOpen(book)}>
                                {user && user.role === 'admin' && (<button className="delete-button" onClick={(e) => {
                                        e.stopPropagation();
                                        confirmDeleteBook(book._id); }} >
                                        <FontAwesomeIcon icon={faTrash }/>
                                </button>)}
                                <img src={book.image} alt={book.title} />
                                <p className="book-title">{book.title}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No books found in this category.</p>
                )}

            <Modal show={showModal} onHide={closeModal} centered className="custom-modal">
                <Modal.Header closeButton>
                    <Modal.Title>{selectedBook?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-content-wrapper">
                        <img src={selectedBook?.image} alt={selectedBook?.title} className="img-fluid book-image" />
                        <div className="book-info">
                            <p><strong>Author:</strong> {selectedBook?.author}</p>
                            <p><strong>Description:</strong> {selectedBook?.description}</p>
                            <p><strong>Published Year:</strong> {selectedBook?.publishedYear}</p>
                            <p>
                                <strong>Total Review: </strong>
                                <span className="text-warning">
                                    {(selectedBook?.totalReview > 0) ? '⭐'.repeat(selectedBook?.totalReview) : ' No reviews yet.'}
                                </span>
                            </p>
                        </div>
                    </div>
                    <Button onClick={isRead ? removeFromRead : markAsRead } variant={isRead ? 'danger' : 'success'} className="mt-3">
                        {isRead ? 'Remove from read books' : "I've read this"}
                    </Button>

                    {/* Review submission field */}
                    <div className="mb-3">
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
                                    {(review.reviewerName === user.userName || user.role === 'admin')&& (
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
                </Modal.Body>
            </Modal>

            <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this book?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteBook}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

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

export default CategoryBooks;
