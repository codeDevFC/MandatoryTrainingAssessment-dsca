import React from 'react';
import logo01 from '../assets/logo01.jpg';
import logo2 from '../assets/logo2.jpg';

const Header = () => {
  return (
    <div className="bg-gradient-to-r from-[#1E664E] to-[#15573F] px-4 py-3 shadow-lg">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-3 md:flex-row md:justify-between md:gap-4">
          {/* Left Logo Section - Company Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <img 
              src={logo01} 
              alt="COHT - Centre of Healthcare Training" 
              className="h-10 w-auto object-contain bg-white rounded-lg p-1 md:h-14"
              onError={(e) => { 
                console.log('Logo01 failed to load');
                e.target.style.display = 'none';
              }}
            />
            <div className="border-l-2 border-emerald-400 pl-2 md:pl-3">
              <div className="text-white font-bold text-sm md:text-lg">
                Centre of Healthcare Training
              </div>
              <div className="text-emerald-200 text-[10px] md:text-xs">
                Mandatory Training Assessment
              </div>
            </div>
          </div>
          
          {/* Right Logo Section - Accredited Training Logo */}
          <div className="flex items-center gap-2">
            <img 
              src={logo2} 
              alt="Accredited Training Centre" 
              className="h-9 w-auto object-contain bg-white rounded-lg p-1 md:h-12"
              onError={(e) => { 
                console.log('Logo2 failed to load');
                e.target.style.display = 'none';
              }}
            />
            <div className="text-right">
              <div className="text-white text-[10px] font-semibold md:text-xs">
                Accredited Training Centre
              </div>
              <div className="text-emerald-200 text-[8px] md:text-[10px]">
                Quality Assured
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
