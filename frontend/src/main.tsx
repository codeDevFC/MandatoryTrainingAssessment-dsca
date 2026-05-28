import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initAntiCopyProtection }
import { showColdStartMessage, hideColdStartMessage } from './utils/antiCopy'

initAntiCopyProtection();
showColdStartMessage();
setTimeout(hideColdStartMessage, 35000);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
