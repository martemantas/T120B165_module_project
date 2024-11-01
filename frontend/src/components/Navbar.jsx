import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faList, faBookmark, faCog, faQuestionCircle, faSignOutAlt, faSignInAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './Navbar.css';

const menuItems = [
  { path: '/discover', label: 'Discover', icon: faBook },
  { path: '/category', label: 'Category', icon: faList },
  { path: '/my-library', label: 'My Library', icon: faBookmark },
];
const settingItems = [
  { path: '/settings', label: 'Settings', icon: faCog },
  { path: '/help', label: 'Help', icon: faQuestionCircle },
];

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if(token){
      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.exp * 1000 < Date.now()) {
          handleLogout();
        }
        else{
          setIsLoggedIn(true);
          setUserName(decodedToken.userName);
        }
      }
      catch(error){
        console.error('Error decoding token:', error);
        handleLogout();
      }
    }
  }, []);

  const handleLogout = async () => {
    try{
      axios.post(process.env.REACT_APP_API_REF+'api/logout');
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserName(null);
      window.location.href = '/'; // not sure about this logic
    }
    catch(error){
      console.error("Logout error:", error);
    };
  };

  const renderWelcomeMessage = () => (
    <div className="welcome-message">
      <FontAwesomeIcon icon={faUserCircle} className="avatar-icon" />
      <p>{userName}</p>
    </div>
  );

  return (
    <nav className="sidebar">
      <h1 className="sidebar-title"><Link to='/'>THE BOOKS</Link></h1>
      {isLoggedIn && renderWelcomeMessage()}
      <p className="sidebar-menu-title">MENU</p>

      <div className="sidebar-menu">
        {menuItems.map((item, index) => (
          <Link key={index} to={item.path} className="sidebar-button">
            <FontAwesomeIcon icon={item.icon} className="icon" />
            {item.label}
          </Link>
        ))}
      </div>

      <hr className="sidebar-divider" />

      <div className="sidebar-menu">
        {settingItems.map((item, index) => (
          <Link key={index} to={item.path} className="sidebar-button">
            <FontAwesomeIcon icon={item.icon} className="icon" />
            {item.label}
          </Link>
        ))}
      </div>

      <hr className="sidebar-divider" />

      {isLoggedIn ? (
        <button onClick={handleLogout} className="sidebar-button">
          <FontAwesomeIcon icon={faSignOutAlt} className="icon" />
          Log out
        </button>
      ) : (
        <Link to="/login" className="sidebar-button">
          <FontAwesomeIcon icon={faSignInAlt} className="icon" />
          Log in
        </Link>
      )}
    </nav>
  );
}

export default Navbar;
