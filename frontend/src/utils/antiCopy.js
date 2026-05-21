export const initAntiCopyProtection = () => {
  // Disable right-click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
  });

  // Disable keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey)) {
      const key = e.key.toLowerCase();
      if (['c', 'v', 'x', 'p', 's', 'u', 'a'].includes(key)) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    }
    if (e.key === 'F12' || e.key === 'PrintScreen') {
      e.preventDefault();
      return false;
    }
  });

  // Disable text selection
  const style = document.createElement('style');
  style.innerHTML = `
    * { -webkit-user-select: none !important; user-select: none !important; }
    input, textarea { -webkit-user-select: text !important; user-select: text !important; }
  `;
  document.head.appendChild(style);
  
  console.log('✅ Anti-copy protection active');
};
