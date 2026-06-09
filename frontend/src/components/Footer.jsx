import React from 'react';
import logo01 from '../assets/logo01.jpg';
import logo2 from '../assets/logo2.jpg';

const Footer = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 mt-auto py-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <img 
              src={logo01} 
              alt="COHT" 
              className="h-8 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span>© {new Date().getFullYear()} Centre of Healthcare Training</span>
          </div>
          <div className="flex items-center gap-3">
            <img 
              src={logo2} 
              alt="Accredited" 
              className="h-8 w-auto object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span>Mandatory Training Assessment Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
