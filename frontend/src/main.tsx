import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Anti-copy protection: Disable keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (
    (e.ctrlKey || e.metaKey) && 
    (e.key === 'c' || e.key === 'C' ||
     e.key === 'v' || e.key === 'V' ||
     e.key === 'x' || e.key === 'X' ||
     e.key === 'p' || e.key === 'P' ||
     e.key === 's' || e.key === 'S' ||
     e.key === 'u' || e.key === 'U')
  ) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  
  if (e.key === 'F12') {
    e.preventDefault();
    return false;
  }
  
  if (e.key === 'PrintScreen') {
    e.preventDefault();
    return false;
  }
});

document.addEventListener('contextmenu', function(e) {
  e.preventDefault();
  return false;
});

let screenshotWarningCount = 0;
document.addEventListener('keyup', function(e) {
  if (e.key === 'PrintScreen') {
    screenshotWarningCount++;
    console.warn(`Screenshot detected (${screenshotWarningCount})`);
  }
});

document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    console.warn('Page visibility changed - potential screen capture');
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
