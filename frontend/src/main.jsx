// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router ở đây
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Import CartProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <CartProvider> {/* Bọc App bằng CartProvider */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </CartProvider>
    </Router>
  </StrictMode>,
);
