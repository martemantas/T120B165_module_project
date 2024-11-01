import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faStar } from '@fortawesome/free-solid-svg-icons';
import Auth from '../../utils/auth';
import { fetchCategories } from '../../utils/fetchCategories.js';
import './BookModal.css';

const CategoryBooks = ( {allCategories} ) => {
    const [user, setUser] = useState('');
    let { category } = useParams(); // Extract the category name from the URL
    const [categoryId, setCategoryId] = useState(null);
    const [books, setBooks] = useState([]);
    const [error, setError] = useState(null);

    // Confirmational modals for deletion 
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState(null);

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
        if(category === undefined){
            try {
                const categoryResponse = await axios.get(
                    `${process.env.REACT_APP_API_REF}categories/title/${book.title}`
                );
                category = categoryResponse.data.data.topic;
            } catch (error) {
                console.error("Error fetching category:", error);
                return;
            }
        }
        navigate(`/${category}/${book.title}`);
    };

    const handleDeleteBook = async () => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books/${selectedBookId}`);
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

    if (error) return <div>{error}</div>;

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
        </div>
    );
};

export default CategoryBooks;
