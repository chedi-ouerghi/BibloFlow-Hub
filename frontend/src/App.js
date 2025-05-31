// src/App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { getCurrentUser, logout } from './api/authapi';

// Pages principales
import Home from './pages/Home';
import LivreDetails from './pages/LivreDetails';

// Composants d'authentification
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import RegisterAuteur from './components/Auth/RegisterAuteur';
import Profile from './components/Auth/Profile';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Header from './components/_components/Header';

// Dashboard
import Dashboard from './components/dashboard/Main';
import ListLivre from './components/_components/ListLivre';

// Chatbot
import Chatbot from './components/Chatbot';

function AppContent() {
  const location = useLocation();
  const [user, setUser] = useState(getCurrentUser());
  const [triggerGreeting, setTriggerGreeting] = useState(false);

  // Detect login by monitoring user changes
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser && !user) {
      setUser(currentUser);
      setTriggerGreeting(true);
    } else if (!currentUser && user) {
      setUser(null);
      setTriggerGreeting(false);
    }
  }, [location, user]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const showHeader = location.pathname !== '/';

  return (
    <>
      {showHeader && <Header user={user} handleLogout={handleLogout} />}
      {/* <Chatbot triggerGreeting={triggerGreeting} /> */}
      <Routes>
        <Route path="/" element={<Home user={user} handleLogout={handleLogout} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register-auteur" element={<RegisterAuteur />} />
        <Route path="/livre/:id" element={<LivreDetails />} />
        <Route path="/Lives" element={<ListLivre />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute roles={['admin', 'auteur']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;