import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Home.css';
import './bookAnimation.css';

function Home() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const getAllCategories = async () => {
      try{
        setIsLoading(true);
        const response = await axios.get(process.env.REACT_APP_API_REF+'categories');
        setCategories(response.data.data);
      }
      catch(error){
        console.error('Error fetching categories:', error);
      }
      finally{
        setIsLoading(false);
      }
    }

    if(!isLoading && categories.length === 0){
      getAllCategories();
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm) {
        fetchBooks();
      } else {
        setSearchResults([]);
      }
    }, 0);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, selectedCategory]);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_REF}books?title=${searchTerm}`);
      const allBooks = response.data.data;

      const categoryPromises = allBooks.map(book => 
        axios.get(`${process.env.REACT_APP_API_REF}categories/${book.category}`).then(res => {
          return { ...book, categoryName: res.data.data.topic };
        })
      );

      const booksWithCategories = await Promise.all(categoryPromises);

      const filteredBooks = booksWithCategories.filter((book) => {
        const matchesSearchTerm = book.title.toLowerCase().startsWith(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All Categories' || book.categoryName === selectedCategory;

        return matchesSearchTerm && matchesCategory;
      });

      setSearchResults(
        filteredBooks.length > 0 ? filteredBooks : [{ title: 'No match for your search' }]
      );
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleBookSelection = (book) => {
    if (book.title === 'No match for your search') return;

    navigate(`/${book.categoryName}/${book.title}`);
  };

  const handleSearchSubmit = () => {
    if (searchResults.length > 0 && searchResults[0].title !== 'No match for your search') {
      handleBookSelection(searchResults[0]);
    }
  };

  return (
    <div className='main-home'>
      <div className="discover-container">
        <h1 className="discover-title">Explore</h1>
        <div className="search-bar">
          <select 
            className="category-dropdown"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}>
            <option>All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category.topic}>
                {category.topic}
              </option>
            ))}
          </select>
          <div className="input-container">
            <div className="search-icon">
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <input
              type="text"
              className="search-input"
              placeholder="Find the book you like..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button" onClick={handleSearchSubmit}>Search</button>
          </div>
        </div>

        {searchResults.length > 0 && (
          <div className="search-results">
            {searchResults[0].title === 'No match for your search' ? (
              <p>No match for your search</p>
            ) : (
            searchResults.map((book, index) => (
              <div
                key={index}
                className="search-result-item"
                onClick={() => handleBookSelection(book)}
              >
                {book.title}
              </div>
            ))
          )}
          </div>
        )}
      </div>
      <div class="book">
        <div class="book__pg-shadow"></div>
        <div class="book__pg"></div>
        <div class="book__pg book__pg--2"></div>
        <div class="book__pg book__pg--3"></div>
        <div class="book__pg book__pg--4"></div>
        <div class="book__pg book__pg--5"></div>
      </div>
    </div>
  );
}

export default Home;
