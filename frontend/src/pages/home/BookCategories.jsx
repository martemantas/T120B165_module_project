import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './BookCategories.css';

function BookCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const categoryListRef = useRef(null);

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

  const handleCategoryClick = (category) => {
    navigate(`/${category.topic}`);
  };

  const scrollCategoryList = (direction) => {
    if (categoryListRef.current) {
        const scrollAmount = 600;
        categoryListRef.current.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    }
  };

  return (
    <div className="book-categories">
      <h2 className="section-title">Pick a category</h2>
      <div className="scroll-container">
        <button className="scroll-button left" onClick={() => scrollCategoryList(-1)}>{"<"}</button>
        <div className="category-list" ref={categoryListRef}>
          {categories.map((category) => (
            <div key={category._id} className="category-item" onClick={() => handleCategoryClick(category)}>
              <img src={category.image} alt={category.topic} className="category-image" />
              <p className="category-name">{category.topic}</p>
            </div>
          ))}
        </div>
        <button className="scroll-button right" onClick={() => scrollCategoryList(1)}>{">"}</button>
      </div>
    </div>
  );
}

export default BookCategories;
