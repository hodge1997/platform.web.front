import React, { useContext, useEffect, useCallback, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginPage.css';
import { AuthContext } from '../../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isWaitingForGoogle, setIsWaitingForGoogle] = useState(false);
  const [googlePopup, setGooglePopup] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleLoginSuccess = useCallback((token, email) => {
    login(token, email);
    toast.success('Login successful!', {
      autoClose: 10, // Show toast for 1 second
      onClose: () => navigate('/', { replace: true })
    });
  }, [login, navigate]);

  const handleLoginResponse = useCallback(async (response, email) => {
    if (response.ok) {
      const result = await response.json();
      const accessToken = result.data?.accessToken || result.data?.token || result.token;
      if (accessToken) {
        handleLoginSuccess(accessToken, email);
      } else {
        console.error('Login failed: No token received.');
        toast.error('Login failed: No token received.');
      }
    } else {
      const errorData = await response.json();
      console.error('Login failed:', errorData);
      toast.error('Login failed: ' + errorData.message);
    }
    setIsLoggingIn(false);
  }, [handleLoginSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await fetch('https://cp.dhytv.com/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      await handleLoginResponse(response, email);
    } catch (error) {
      console.error('Error during login:', error);
      toast.error('An error occurred during login. Please try again.');
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLoginClick = useCallback(() => {
    console.log('Opening Google login popup');
    const popup = window.open(
      'https://cp.dhytv.com/v1/google/sign-in',
      'google-login',
      `width=600,height=600,top=${window.screen.height / 2 - 300},left=${window.screen.width / 2 - 300}`
    );
    if (!popup || popup.closed || typeof popup.closed === 'undefined') {
      console.error('Popup was blocked');
      toast.error('Popup was blocked. Please allow popups for this site.');
    } else {
      console.log('Popup opened successfully');
      setGooglePopup(popup);
      setIsWaitingForGoogle(true);
    }
  }, []);

  const handleMessage = useCallback(async (event) => {
    console.log('Message received:', event);
    console.log('Message origin:', event.origin);
    console.log('Message data:', event.data);

    if (event.origin !== "https://cp.dhytv.com") {
      console.error('Received message from unexpected origin:', event.origin);
      return;
    }

    if (event.source !== googlePopup) {
      console.error('Received message from unexpected source');
      return;
    }

    const { type, code, message, data } = event.data;

    if (type !== 'GOOGLE_LOGIN') {
      console.log('Ignoring non-Google login message');
      return;
    }

    if (code === 200 && data) {
      const token = data.replace('Bearer ', '');
      console.log('Token extracted:', token);
      handleLoginSuccess(token, 'google-user@example.com'); // You might want to get the actual email from the Google response
    } else {
      console.error('Login failed:', message);
      toast.error(`Login failed: ${message}`);
    }

    setIsWaitingForGoogle(false);
    setGooglePopup(null);
  }, [handleLoginSuccess]);

  useEffect(() => {
    console.log('Adding message event listener');
    window.addEventListener('message', handleMessage);
    return () => {
      console.log('Removing message event listener');
      window.removeEventListener('message', handleMessage);
    };
  }, [handleMessage]);

  useEffect(() => {
    let timer;
    if (isWaitingForGoogle) {
      timer = setTimeout(() => {
        setIsWaitingForGoogle(false);
        setGooglePopup(null);
        toast.error('Google login timed out. Please try again.');
      }, 60000); // 1 minute timeout
    }
    return () => clearTimeout(timer);
  }, [isWaitingForGoogle]);

  return (
    <div className="back-ground">
      <div className="login-page">
        <ToastContainer
          position="top-right"
          autoClose={1000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <h1 className="artistic-word">Login</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email:</label>
            <input
              type="text"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              required
            />
          </div>
          <button type="submit" className="nav-button" disabled={isWaitingForGoogle || isLoggingIn}>
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="separator">
          <hr className="separator-line" />
          <span className="separator-text">or</span>
          <hr className="separator-line" />
        </div>

        <div className="google-login">
          <button onClick={handleGoogleLoginClick} className="nav-button" disabled={isWaitingForGoogle || isLoggingIn}>
            {isWaitingForGoogle ? 'Logging in with Google...' : 'Login with Google'}
          </button>
        </div>

        <p>Don't have a username? <Link to="/register">Register here</Link></p>
        {isLoggingIn && <div className="login-overlay">Logging in...</div>}
      </div>
    </div>
  );
};

export default LoginPage;