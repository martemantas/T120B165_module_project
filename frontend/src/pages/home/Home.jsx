import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import BookCategories from './BookCategories';
import './Home.css';

function Home() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSearch = () => {
    //todo
    // Change to open book specific
    // should also while typing give suggestions
    console.log(`Searching for "${searchTerm}" in category "${selectedCategory}"`);
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
            <button className="search-button" onClick={handleSearch}>Search</button>
          </div>
        </div>
      </div>
      {/* <BookCategories /> */}
    </div>
  );
}

export default Home;
