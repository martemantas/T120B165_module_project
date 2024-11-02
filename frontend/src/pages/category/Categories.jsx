import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BookCategories from '../home/BookCategories';

function Home() {
  const [categories, setCategories] = useState([]);
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

  return (
    <div style={{ width: '100%' }}>
      <BookCategories />
    </div>
  );
}

export default Home;
