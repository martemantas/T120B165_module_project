import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import './Admin.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Admin() {
    // State for modals
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [showBookModal, setShowBookModal] = useState(false);

    // State for adding category
    const [categoryTopic, setCategoryTopic] = useState('');
    const [categoryImage, setCategoryImage] = useState(null);

    // State for adding book
    const [bookTitle, setBookTitle] = useState('');
    const [bookAuthor, setBookAuthor] = useState('');
    const [bookDescription, setBookDescription] = useState('');
    const [bookPublishedYear, setBookPublishedYear] = useState('');
    const [bookCategory, setBookCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [bookImage, setBookImage] = useState(null);

    // Fetch categories when component loads
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_REF}categories`);
                setCategories(response.data.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        if (!categoryTopic || !categoryImage) {
            alert('Please provide both topic and image.');
            return;
        }
    
        try {
            const base64Image = await toBase64(categoryImage);
            const payload = { topic: categoryTopic, image: base64Image };
    
            await axios.post(`${process.env.REACT_APP_API_REF}categories`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
    
            setShowCategoryModal(false);
            setCategoryTopic('');
            setCategoryImage(null);
        } catch (error) {
            console.error('Error adding category:', error);
        }
    };
    

    const handleAddBook = async () => {
        if (!bookTitle || !bookAuthor || !bookDescription || !bookPublishedYear || !bookCategory) {
            alert('Please fill all required fields.');
            return;
        }

        try {
            const base64Image = await toBase64(bookImage);
            const categoryResponse = await axios.get(
                `${process.env.REACT_APP_API_REF}categories/topic/${bookCategory}`
            );
            const categoryId = categoryResponse.data.data._id;

            const payload = {
                title: bookTitle,
                author: bookAuthor,
                description: bookDescription,
                publishedYear: bookPublishedYear,
                category: [categoryId],
                totalReview: null,
                image: base64Image
            };

            await axios.post(`${process.env.REACT_APP_API_REF}categories/${categoryId}/books`, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            setShowBookModal(false);
            setBookTitle('');
            setBookAuthor('');
            setBookDescription('');
            setBookPublishedYear('');
            setBookCategory('');
        } catch (error) {
            console.error('Error adding book:', error);
        }
    };

    const toBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

    return (
        <div className='admin-container'>
            <div className='button-container'>
                <Button onClick={() => setShowCategoryModal(true)} className='admin-button'>Add Category</Button>
                <Button onClick={() => setShowBookModal(true)} className='admin-button'>Add Book</Button>
            </div>

            {/* Category Modal */}
            <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTopic">
                            <Form.Label>Topic</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category topic"
                                value={categoryTopic}
                                onChange={(e) => setCategoryTopic(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setCategoryImage(e.target.files[0])}
                                required
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddCategory}>
                        Add Category
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Book Modal */}
            <Modal show={showBookModal} onHide={() => setShowBookModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Book</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter book title"
                                value={bookTitle}
                                onChange={(e) => setBookTitle(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formAuthor">
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter author name"
                                value={bookAuthor}
                                onChange={(e) => setBookAuthor(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter book description"
                                value={bookDescription}
                                onChange={(e) => setBookDescription(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formPublishedYear">
                            <Form.Label>Published Year</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter published year"
                                value={bookPublishedYear}
                                onChange={(e) => setBookPublishedYear(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Form.Group controlId="formCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                as="select"
                                value={bookCategory}
                                onChange={(e) => setBookCategory(e.target.value)}
                                required
                            >
                                <option value="">Select category</option>
                                {categories.map((category) => (
                                    <option key={category._id} value={category.topic}>
                                        {category.topic}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="formBookImage">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={(e) => setBookImage(e.target.files[0])}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBookModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddBook}>
                        Add Book
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Admin;
