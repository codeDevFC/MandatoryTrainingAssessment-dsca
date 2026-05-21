import React from 'react';

const Signature = () => {
  return (
    <footer className="w-full mt-auto pt-8 pb-4 border-t border-slate-200 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="text-sm">
            <span className="font-mono text-red-500 font-bold">{'{'}</span>
            <span className="text-slate-500 mx-1 uppercase text-xs sm:text-sm">Designed By</span>
            <span className="text-amber-600 font-semibold text-xs sm:text-sm">Dev{'{FC}'}</span>
            <span className="text-slate-500 mx-1 text-xs sm:text-sm">&amp;</span>
            <span className="text-amber-600 font-semibold text-xs sm:text-sm">Sha{'{Ola}'}</span>
            <span className="font-mono text-red-500 font-bold">{'}'}</span>
          </div>
          <div className="text-[10px] sm:text-xs text-amber-700 mt-1.5 tracking-wide font-medium uppercase">
            ✦ Crafted with precision for DSCA@2026 ✦
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Signature;
