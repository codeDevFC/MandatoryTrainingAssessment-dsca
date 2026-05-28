import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initAntiCopyProtection } from './utils/antiCopy'

// Initialize anti-copy protection
initAntiCopyProtection();

// Cold start loading indicator
const showColdStartMessage = () => {
  const existing = document.getElementById('cold-start-message');
  if (existing) return;
  const div = document.createElement('div');
  div.id = 'cold-start-message';
  div.innerHTML = '<div style="position: fixed; bottom: 20px; left: 20px; z-index: 9999; background: #1e293b; color: white; padding: 12px 20px; border-radius: 12px; font-size: 13px; font-family: monospace; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">' +
    '<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #10b981; margin-right: 8px; animation: pulse 1.5s infinite;"></span>' +
    '🔄 Server waking up - first request may take 15-30s' +
    '</div>' +
    '<style>@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }</style>';
  document.body.appendChild(div);
};

const hideColdStartMessage = () => {
  const el = document.getElementById('cold-start-message');
  if (el) el.remove();
};

showColdStartMessage();
setTimeout(hideColdStartMessage, 35000);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
