import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ClickEffect from './utils/MouseClickEffect';
import Home from './pages/home/Home';
import Books from './pages/books/BookModal';
import BookDetails from './pages/books/BookDetails';
import Category from './pages/category/Categories';
import Reads from './pages/my-library/MyLibrary';
import Settings from './pages/extra/Settings';
import Help from './pages/extra/Help';
import Login from './pages/login/Login';
import Admin from './pages/admin/Admin';
import { AuthRoute, AuthRouteLoggedIn, AdminRoute } from './utils/AuthRoute';

import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  // localStorage.removeItem('token'); // for when break the system with wrong api call

  return (
    <Router>
      <div className="main-container">
        <ClickEffect />
        <Navbar />
        <div className='main-content'>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Books allCategories={true} />} />
            <Route path="/category" element={<Category />} />
            <Route path="/my-library" element={<AuthRouteLoggedIn><Reads /></AuthRouteLoggedIn>} />
            <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/help" element={<Help />} />

            <Route path="/:category" element={<Books allCategories={false}/>} />
            <Route path="/:category/:title" element={<BookDetails />} />

            <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
