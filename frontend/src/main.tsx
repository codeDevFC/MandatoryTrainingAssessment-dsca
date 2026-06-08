import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Register from './Register'
import './index.css'

const pathname = window.location.pathname;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {pathname === '/register' ? <Register /> : <App />}
  </React.StrictMode>
);
