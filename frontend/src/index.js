import React from 'react';
import ReactDOM from 'react-dom/client';  // Correct import for React 18+
import './index.css';
import App from './App';
// Get the container where the app will be rendered
const container = document.getElementById('root');
// Create a root and render the app using createRoot (React 18)
const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);