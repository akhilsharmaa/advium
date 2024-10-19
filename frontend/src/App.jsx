import { useState } from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'

// Importing Components
import Home from './components/Home';
import SignInSection from './components/SignInSection';
import WriteBlogPage from './components/WriteBlogPage'
// import Dashboard from './components/Dashboard';
// import NotFound from './components/NotFound';

// PrivateRoute Component for Protected Routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken'); // Example authentication check
  return isAuthenticated ? children : <Navigate to="/login" />;
};


// PropTypes validation
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<SignInSection />} />
          
          {/* Protected Routes */}
          <Route
            path="/write"
            element={
              <PrivateRoute>
                <WriteBlogPage />
              </PrivateRoute>
            }
          />

          {/* Catch all other routes */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App
