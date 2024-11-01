import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import Auth from '../../utils/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../books/BookModal.css';

const MyLibrary = () => {
    const [readBooks, setReadBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [error, setError] = useState(null);
    const user = Auth();

    useEffect(() => {
        fetchReadBooks();
    }, []);

    const fetchReadBooks = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_REF}reads/${user.id}`);
            setReadBooks(response.data.data.map(readEntry => readEntry.bookId));
        } catch (error) {
            setError('Error fetching read books.');
            console.error(error);
        }
    };

    const handleBookOpen = async (book) => {
        setSelectedBook(book);
        setShowModal(true);

        try {
            const response = await axios.get(`${process.env.REACT_APP_API_REF}categories/${book.category}/books/${book._id}/reviews`);
            setReviews(response.data.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedBook(null);
        setReviews([]);
    };

    return (
        <div className='books-container'>
            <h2 className='books-title'>My Library</h2>
            {error && <p className="text-danger">{error}</p>}
            {readBooks.length > 0 ? (
                <div className="book-list">
                    {readBooks.map((book) => (
                        <div key={book._id} className="book-item" onClick={() => handleBookOpen(book)}>
                            <img src={book.image} alt={book.title} />
                            <p className="book-title">{book.title}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No books marked as read yet.</p>
            )}

            <Modal show={showModal} onHide={closeModal} centered>
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
                                </div>
                            ))
                        ) : (
                            <p>No reviews yet.</p>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MyLibrary;
