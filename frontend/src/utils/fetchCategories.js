import axios from 'axios';

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_REF}categories`);
    return response.data.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};
