import React from 'react';

const Signature = () => {
  return (
    <div className="mt-12 pt-6 border-t border-slate-200 text-center signature-container pb-8">
      <div className="text-sm">
        <span className="font-mono text-red-500 font-bold">{"{"}</span>
        <span className="text-slate-500 mx-1 uppercase">Designed By</span>
        <span className="text-amber-600 font-semibold">Dev{"{FC}"}</span>
        <span className="text-slate-500 mx-1">&</span>
        <span className="text-amber-600 font-semibold">Sha{"{Ola}"}</span>
        <span className="font-mono text-red-500 font-bold">{"}"}</span>
      </div>
      <div className="text-xs text-amber-700 mt-1 tracking-wide font-medium uppercase">
        ✦ Crafted with precision for DSCA@2026 ✦
      </div>
    </div>
  );
};

export default Signature;
