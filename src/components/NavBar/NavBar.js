import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './NavBar.css';  // Import the CSS file
import { AuthContext } from '../../contexts/AuthContext'; // Import AuthContext

const NavBar = () => {
  const { isLoggedIn, userEmail, logout } = useContext(AuthContext); // Use AuthContext
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Use logout function from context
    navigate('/login');
  };

  const handleIndexClick = () => navigate('/');
  const handleDownloadClick = () => alert('Download feature is not yet implemented.');
  const handleContactUsClick = () => alert('Contact us at support@example.com.');
  const handleHelpCenterClick = () => {
    alert('Redirecting to the Help Center...');
    navigate('/help-center');
  };
  const handleSearchClick = () => alert('Search feature is not yet implemented.');
  const handleLoginClick = () => navigate('/login');
  const handleRegisterClick = () => navigate('/register');

  return (
    <nav className="navbar">
      <div className="itemlists">
        <ul >
          <li><button className="nav-button" onClick={handleIndexClick}>Home Page</button></li>
          <li><button className="nav-button" onClick={handleContactUsClick}>Contact Us</button></li>
          <li><button className="nav-button" onClick={handleHelpCenterClick}>Help Center</button></li>
          {isLoggedIn ? (
            <>
              <li><button className="nav-button">User: {userEmail}</button></li>
              <li><button className="nav-button" onClick={handleLogout}>Logout</button></li>
            </>
          ) : (
            <>
              <li><button className="nav-button" onClick={handleLoginClick}>Login</button></li>
              <li><button className="nav-button" onClick={handleRegisterClick}>Register</button></li>
            </>
          )}
        </ul>
      </div>
    </nav>

  );
};

export default NavBar;
