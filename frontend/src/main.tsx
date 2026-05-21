import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initAntiCopyProtection } from './utils/antiCopy'

initAntiCopyProtection();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
