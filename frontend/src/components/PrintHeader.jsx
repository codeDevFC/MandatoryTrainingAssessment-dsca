import React from 'react';

const PrintHeader = () => {
  return (
    <div className="print-header" style={{ display: 'none' }}>
      <style>{`
        @media print {
          .print-header {
            display: block !important;
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: white;
            border-bottom: 2px solid #4f46e5;
            padding: 15px;
            margin-bottom: 20px;
            z-index: 1000;
          }
          .print-header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 100%;
          }
          .print-header-left {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .print-header-left img {
            max-height: 50px;
          }
          .print-header-text h3 {
            margin: 0;
            color: #1e293b;
            font-size: 14px;
          }
          .print-header-text p {
            margin: 0;
            color: #64748b;
            font-size: 10px;
          }
          .print-header-right {
            text-align: right;
          }
          .print-header-right img {
            max-height: 40px;
          }
          .print-header-right p {
            margin: 5px 0 0;
            font-size: 9px;
            color: #64748b;
          }
          body {
            margin-top: 100px;
          }
        }
      `}</style>
      <div className="print-header-content">
        <div className="print-header-left">
          <div>
            <h3>Centre of Healthcare Training</h3>
            <p>Mandatory Training Assessment - Official Report</p>
          </div>
        </div>
        <div className="print-header-right">
          <p>Accredited Training Centre</p>
          <p>Quality Assured</p>
        </div>
      </div>
    </div>
  );
};

export default PrintHeader;
