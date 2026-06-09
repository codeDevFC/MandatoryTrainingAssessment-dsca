import React from 'react';
import logo01 from '../assets/logo01.jpg';
import logo2 from '../assets/logo2.jpg';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left - Company Logo with Tagline */}
        <div className="flex items-center gap-3">
          <img 
            src={logo01} 
            alt="COHT Logo" 
            className="h-14 w-auto object-contain bg-white rounded-lg p-1"
            onError={(e) => { console.log('Logo01 failed to load'); e.target.style.display = 'none'; }}
          />
          <div className="border-l-2 border-indigo-400 pl-3">
            <div className="text-white font-bold text-lg">Centre of Healthcare Training</div>
            <div className="text-indigo-300 text-xs">Mandatory Training Assessment</div>
          </div>
        </div>
        
        {/* Right - Accredited Training Logo */}
        <div className="flex items-center gap-2">
          <img 
            src={logo2} 
            alt="Accredited Training Centre" 
            className="h-12 w-auto object-contain bg-white rounded-lg p-1"
            onError={(e) => { console.log('Logo2 failed to load'); e.target.style.display = 'none'; }}
          />
          <div className="text-right">
            <div className="text-white text-xs font-semibold">Accredited Training Centre</div>
            <div className="text-indigo-300 text-[10px]">Quality Assured</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
