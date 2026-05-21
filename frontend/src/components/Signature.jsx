import React from 'react';
const Signature = () => {
return (
<footer className="w-full mt-auto pt-8 pb-4 border-t border-slate-200 bg-slate-50/50">
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
<div className="text-center">
<div className="flex flex-wrap justify-center items-center gap-1 text-sm">
<span className="font-mono text-red-500 font-bold">{'{'}</span>
<span className="text-slate-500 uppercase text-[10px] sm:text-xs">Designed By</span>
<span className="text-amber-600 font-semibold text-xs sm:text-sm">Dev{'{FC}'}</span>
<span className="text-slate-500 text-xs sm:text-sm">&</span>
<span className="text-amber-600 font-semibold text-xs sm:text-sm">Sha{'{Ola}'}</span>
<span className="font-mono text-red-500 font-bold">{'}'}</span>
</div>
<div className="text-[9px] sm:text-xs text-amber-700 mt-1.5 tracking-wide font-medium uppercase break-words px-4">
✦ Crafted with precision for DSCA@2026 ✦
</div>
</div>
</div>
</footer>
);
};
export default Signature;
