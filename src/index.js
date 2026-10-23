import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${process.env.PUBLIC_URL}/sw.js`)
      .catch(err => console.error('Service worker registration failed:', err));
  });
}

// Prośba, żeby przeglądarka nie czyściła lokalnych danych przy braku miejsca
if (navigator.storage && navigator.storage.persist) {
  navigator.storage.persist();
}
