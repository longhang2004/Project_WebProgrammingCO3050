// File: frontend/src/main.jsx

import React, { StrictMode } from 'react'; // Import React
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Router>
        {/*
          Correct Nesting Order:
          AuthProvider needs to be an ancestor of CartProvider
          if CartProvider uses useAuth().
        */}
        <AuthProvider> {/* AuthProvider is now the outer provider */}
          <CartProvider> {/* CartProvider is nested inside AuthProvider */}
            <App />
          </CartProvider>
        </AuthProvider>
      </Router>
    </StrictMode>
  );
} else {
  console.error("Failed to find the root element. Ensure an element with ID 'root' exists in your HTML.");
}
