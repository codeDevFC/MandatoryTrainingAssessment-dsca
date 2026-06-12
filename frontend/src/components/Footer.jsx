import React from 'react';
import { Link } from 'react-router-dom';
import logo01 from '../assets/logo01.jpg';
import logo2 from '../assets/logo2.jpg';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left - Company Info */}
          <div className="flex items-center gap-3">
            <img 
              src={logo01} 
              alt="COHT" 
              className="h-8 w-auto object-contain bg-white rounded-lg p-1"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div>
              <div className="text-sm font-semibold">Centre of Healthcare Training</div>
              <div className="text-xs text-slate-400">Mandatory Training Assessment Portal</div>
            </div>
          </div>
          
          {/* Center - Quick Links (only show on larger screens) */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            <Link to="/" className="text-slate-300 hover:text-white transition">Home</Link>
            <Link to="/register" className="text-slate-300 hover:text-white transition">Register</Link>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400 text-xs">trainercourses.com</span>
          </div>
          
          {/* Right - Accredited Logo */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-semibold text-emerald-400">Accredited Training Centre</div>
              <div className="text-[10px] text-slate-400">Quality Assured</div>
            </div>
            <img 
              src={logo2} 
              alt="Accredited" 
              className="h-8 w-auto object-contain bg-white rounded-lg p-1"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          </div>
        </div>
        
        {/* Mobile quick links */}
        <div className="flex items-center justify-center gap-4 mt-4 md:hidden text-xs">
          <Link to="/" className="text-slate-300 hover:text-white transition">Home</Link>
          <Link to="/register" className="text-slate-300 hover:text-white transition">Register</Link>
          <span className="text-slate-500">trainercourses.com</span>
        </div>
        
        {/* Copyright */}
        <div className="text-center mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500">
          © {new Date().getFullYear()} Centre of Healthcare Training. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
