import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import '../../styles/colors.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUsername] = useState('');
  const [error, setError] = useState(null);
  const [isRegisterForm, setIsRegisterForm] = useState(false);
  const navigate = useNavigate()
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = isRegisterForm
        ? process.env.REACT_APP_API_REF + 'api/register'
        : process.env.REACT_APP_API_REF + 'api/login';

      const payload = isRegisterForm
        ? { email, password, userName }
        : { email, password };

      const response = await axios.post(url, payload);

      const token = response.data.token;
      localStorage.setItem('token', token);
      
      navigate('/login')
      window.location.reload();
    }
    catch (error) {
      if (error.response) {
        setError(error.response.data.message);
      }
      else if (error.request) {
        setError('No response from server. Please try again.');
      }
      else {
        setError('Error: ' + error.message);
      }
    }
  };

  const handleSwitchContent = () => {
    setIsRegisterForm((prev) => !prev);
  };

  return (
    <div className={`justify-content-center align-items-center d-flex shadow-lg ${isRegisterForm ? 'active' : ''}`} id='content'>
      <div className='col-md-6 d-flex justify-content-center'>
        {isRegisterForm && (
          <form onSubmit={handleSubmit}>
            <div className='header-text mb-4'>
              <h1>Create Account</h1>
            </div>
            <div className='input-group mb-3'>
              <input type="text" placeholder='Name' onChange={(e) => setUsername(e.target.value)} required className='form-control form-control-lg bg-light fs-6' />
            </div>
            <div className='input-group mb-3'>
              <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} required className='form-control form-control-lg bg-light fs-6' />
            </div>
            <div className='input-group mb-3'>
              <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required className='form-control form-control-lg bg-light fs-6' />
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className='input-group mb-3 justify-content-center'>
              <button type="submit" className='btn border-white text-white w-50 fs-6'>Register</button>
            </div>
          </form>
        )}
      </div>

      <div className='col-md-6 right-box'>
        {!isRegisterForm && (
          <form onSubmit={handleSubmit}>
            <div className='header-text mb-4'>
              <h1>Sign In</h1>
            </div>
            <div className='input-group mb-3'>
              <input type="email" placeholder='Email' onChange={(e) => setEmail(e.target.value)} required className='form-control form-control-lg bg-light fs-6' />
            </div>
            <div className='input-group mb-3'>
              <input type="password" placeholder='Password' onChange={(e) => setPassword(e.target.value)} required className='form-control form-control-lg bg-light fs-6' />
            </div>
            <div className='input-group mb-5 d-flex justify-content-center'>
              <div className='form-check'>
                <input type="checkbox" className='form-check-input'/>
                <label htmlFor="formcheck" className='form-check-label text-secondary'><small>Remember me</small></label>
              </div>
              <div className='forgot'>
                <small><a href="#">Forgot password?</a></small>
              </div>
            </div>
            {error && <p className="text-danger">{error}</p>}
            <div className='input-group mb-3 justify-content-center'>
              <button type="submit" className='btn border-white text-white w-50 fs-6'>Login</button>
            </div>
          </form>
        )}
      </div>

      <div className='switch-content'>
        <div className='switch'>
          <div className='switch-panel switch-left'>
            <h1>Hello, Again</h1>
            <p>We are happy to see you back</p>
            <button className='btn text-white w-50 fs-6' onClick={handleSwitchContent}>Login</button>
          </div>
          <div className='switch-panel switch-right'>
            <h1>Welcome</h1>
            <p>Join Our Unique Platform, Explore a New Experience</p>
            <button className='btn border-white text-white w-50 fs-6' onClick={handleSwitchContent}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
