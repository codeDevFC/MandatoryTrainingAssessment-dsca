import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo01 from '../assets/logo01.jpg';
import logo2 from '../assets/logo2.jpg';

const Header = () => {
  const location = useLocation();
  const isRegisterPage = location.pathname === '/register';
  
  return (
    <div className="bg-gradient-to-r from-[#1E664E] to-[#0F4A38] shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Left - Company Logo */}
          <div className="flex items-center gap-3">
            <img 
              src={logo01} 
              alt="Centre of Healthcare Training" 
              className="h-12 w-auto object-contain bg-white rounded-xl p-1.5 shadow-md md:h-14"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="hidden md:block border-l-2 border-emerald-400 pl-3">
              <div className="text-white font-bold text-sm leading-tight">
                Centre of Healthcare Training
              </div>
              <div className="text-emerald-200 text-[10px]">
                Mandatory Training Assessment
              </div>
            </div>
          </div>
          
          {/* Center - Page Title (shows on all pages) */}
          <div className="text-center">
            <div className="text-white font-bold text-sm md:hidden">
              COHT Training
            </div>
            <div className="text-white font-semibold text-base md:text-lg hidden md:block">
              {isRegisterPage ? 'Student Registration' : 'Mandatory Training Assessment'}
            </div>
          </div>
          
          {/* Right - Accredited Logo */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <div className="text-white text-[10px] font-semibold">
                Accredited Training Centre
              </div>
              <div className="text-emerald-200 text-[8px]">
                Quality Assured
              </div>
            </div>
            <img 
              src={logo2} 
              alt="Accredited Training Centre" 
              className="h-11 w-auto object-contain bg-white rounded-xl p-1.5 shadow-md md:h-13"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
        
        {/* Mobile bottom text */}
        <div className="text-center mt-2 md:hidden">
          <div className="text-white text-[10px] font-medium">
            Centre of Healthcare Training
          </div>
          <div className="text-emerald-200 text-[8px]">
            Mandatory Training Assessment
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
