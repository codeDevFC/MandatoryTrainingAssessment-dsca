export const disableContextMenu = () => {
  const handleContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };
  document.addEventListener('contextmenu', handleContextMenu);
  return () => document.removeEventListener('contextmenu', handleContextMenu);
};

export const disableKeyboardShortcuts = () => {
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey)) {
      const key = e.key.toLowerCase();
      if (['c', 'v', 'x', 'p', 's', 'u', 'a'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }
    if (e.key === 'PrintScreen') {
      e.preventDefault();
      return false;
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
};

export const disableTextSelection = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    * {
      -webkit-touch-callout: none !important;
      -webkit-user-select: none !important;
      -khtml-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
      user-select: none !important;
    }
    input, textarea, [contenteditable="true"] {
      -webkit-touch-callout: text !important;
      -webkit-user-select: text !important;
      -khtml-user-select: text !important;
      -moz-user-select: text !important;
      -ms-user-select: text !important;
      user-select: text !important;
    }
    img, svg {
      -webkit-user-drag: none !important;
      user-drag: none !important;
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
  return () => style.remove();
};

export const detectScreenshot = (callback) => {
  let warningCount = 0;
  const handleKeyUp = (e) => {
    if (e.key === 'PrintScreen') {
      warningCount++;
      if (callback) {
        callback({
          type: 'printscreen',
          count: warningCount,
          message: '⚠️ Screenshot attempt detected!'
        });
      }
      setTimeout(() => {
        if (callback) callback({ type: 'clear', count: warningCount });
      }, 3000);
    }
  };
  const handleVisibilityChange = () => {
    if (document.hidden) {
      warningCount++;
      if (callback) {
        callback({
          type: 'visibility',
          count: warningCount,
          message: '⚠️ Screen capture detected!'
        });
      }
    }
  };
  document.addEventListener('keyup', handleKeyUp);
  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => {
    document.removeEventListener('keyup', handleKeyUp);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

export const detectDevTools = (callback) => {
  let devToolsOpen = false;
  const checkDevTools = () => {
    const threshold = 160;
    const widthThreshold = window.outerWidth - window.innerWidth > threshold;
    const heightThreshold = window.outerHeight - window.innerHeight > threshold;
    if (widthThreshold || heightThreshold) {
      if (!devToolsOpen) {
        devToolsOpen = True;
        if (callback) callback({ type: 'devtools', message: '⚠️ Developer Tools detected!' });
      }
    } else if (devToolsOpen) {
      devToolsOpen = false;
    }
  };
  setInterval(checkDevTools, 1000);
};

export const initAntiCopyProtection = () => {
  disableContextMenu();
  disableKeyboardShortcuts();
  disableTextSelection();
  detectScreenshot((data) => {
    if (data.type !== 'clear') console.warn(data.message);
  });
  detectDevTools((data) => console.warn(data.message));
  console.log('✅ Anti-copy protection activated');
};
