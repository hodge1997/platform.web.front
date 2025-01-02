// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import FunctionPage from './components/FunctionPage/FunctionPage';
import SearchPage from './components/SearchPage/SearchPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import the ProtectedRoute component
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import RecitePage from './components/RecitePage/RecitePage';

function App() {
  return (
    <AuthProvider> {/* Wrap the entire app with AuthProvider */}
      <Router>
        <NavBar /> {/* Include the NavBar so it's always visible */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/recite" element={<RecitePage />} />
          <Route
            path="/function"
            element={
              <ProtectedRoute>
                <FunctionPage />
              </ProtectedRoute>
            }
          /> {/* Protecting the FunctionPage route */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
