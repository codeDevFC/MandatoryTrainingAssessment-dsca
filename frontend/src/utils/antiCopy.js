// Disable right-click
export const disableContextMenu = () => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };
  document.addEventListener('contextmenu', handleContextMenu);
  return () => document.removeEventListener('contextmenu', handleContextMenu);
};

// Disable keyboard shortcuts
export const disableKeyboardShortcuts = () => {
  const handleKeyDown = (e) => {
    // Prevent Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+P, Ctrl+S, Ctrl+U
    if ((e.ctrlKey || e.metaKey) && 
        (e.key === 'c' || e.key === 'v' || e.key === 'x' || 
         e.key === 'p' || e.key === 's' || e.key === 'u' ||
         e.key === 'C' || e.key === 'V' || e.key === 'X' ||
         e.key === 'P' || e.key === 'S' || e.key === 'U')) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
    
    // Prevent F12 (DevTools)
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    
    // Prevent PrintScreen
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      return false;
    }
  };
  
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
};

// Disable text selection
export const disableTextSelection = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    input, textarea {
      -webkit-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
    }
  `;
  document.head.appendChild(style);
  return () => style.remove();
};

// Detect screenshot attempts
export const detectScreenshot = (callback) => {
  let warningCount = 0;
  
  const handleKeyUp = (e) => {
    if (e.key === 'PrintScreen') {
      warningCount++;
      callback(`Screenshot attempt detected! (${warningCount})`);
      setTimeout(() => callback(''), 3000);
    }
  };
  
  // Detect PrintScreen via blur
  const handleVisibilityChange = () => {
    if (document.hidden) {
      warningCount++;
      callback(`Screen capture detected! (${warningCount})`);
      setTimeout(() => callback(''), 3000);
    }
  };
  
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    document.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};
