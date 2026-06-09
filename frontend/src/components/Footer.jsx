import React from 'react';
import logo01 from '../assets/logo01.jpg';
import logo2 from '../assets/logo2.jpg';

const Footer = () => {
  return (
    <footer className="bg-slate-100 border-t border-slate-200 mt-auto py-4">
      <div className="max-w-7xl mx-auto px-4">
        {/* Mobile layout - stacked */}
        <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between">
          
          {/* Left side - Logo and copyright */}
          <div className="flex items-center gap-2">
            <img 
              src={logo01} 
              alt="COHT" 
              className="h-6 w-auto object-contain md:h-8"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-[10px] text-slate-500 md:text-xs">
              © {new Date().getFullYear()} Centre of Healthcare Training
            </span>
          </div>
          
          {/* Right side - Accredited logo and text */}
          <div className="flex items-center gap-2">
            <img 
              src={logo2} 
              alt="Accredited" 
              className="h-6 w-auto object-contain md:h-8"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-[10px] text-slate-500 md:text-xs">
              Mandatory Training Assessment Portal
            </span>
          </div>
        </div>
        
        {/* Small brand text */}
        <div className="text-center mt-3">
          <p className="text-[8px] text-slate-400 md:text-[10px]">
            trainercourses.com
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
