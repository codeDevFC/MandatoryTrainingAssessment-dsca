#!/bin/bash
FILE="frontend/src/App.jsx"

# 1. Ensure logos are imported at the top of App.jsx
if ! grep -q "import logo01" "$FILE"; then
  sed -i '' '1i\
import logo01 from "./assets/logo01.jpg";\
import logo2 from "./assets/logo2.jpg";
' "$FILE"
fi

# 2. Create the professional printReport function with dual logos
cat << 'INNER_EOF' > professional_report.js
  const printReport = () => {
    if (!reportData) return;

    const printWindow = window.open('', '_blank');
    const totalDuration = reportData.totalTimeSpent || 0;
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    
    const passedModules = reportData.passedModules || 0;
    const totalAttempts = reportData.totalAttempts || 0;
    const passRate = totalAttempts > 0 ? Math.round((passedModules / totalAttempts) * 100) : 0;
    const avgScore = reportData.averageScore ? reportData.averageScore.toFixed(1) : '0';

    printWindow.document.write(\`
      <!DOCTYPE html>
      <html>
      <head>
        <title>COHT Training Assessment Report - \${reportData.user?.name || 'Student'}</title>
        <meta charset="UTF-8">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif; 
            background: #f0f2f5; padding: 40px; margin: 0 auto; 
          }
          .report-container { 
            max-width: 1100px; margin: 0 auto; background: white; 
            border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; 
          }
          .header { 
            background: linear-gradient(135deg, #1e664e 0%, #0f4a38 100%); 
            color: white; padding: 30px 20px; text-align: center; 
          }
          .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 950px;
            margin: 0 auto;
          }
          .header-logo {
            height: 70px;
            width: auto;
            background: white;
            padding: 8px;
            border-radius: 12px;
            object-fit: contain;
          }
          .header-text-container { flex: 1; text-align: center; }
          .header h1 { font-size: 24px; margin: 0; letter-spacing: 0.5px; }
          .header p { opacity: 0.9; font-size: 13px; margin-top: 5px; }
          .section { padding: 28px 32px; border-bottom: 1px solid #e2e8f0; }
          .section-title { 
            font-size: 18px; font-weight: bold; color: #1e293b; 
            margin-bottom: 20px; padding-bottom: 8px; 
            border-bottom: 3px solid #1e664e; display: inline-block; 
          }
          .info-grid { 
            display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
            gap: 20px; margin-top: 20px; 
          }
          .info-card { 
            background: #f8fafc; padding: 18px 20px; border-radius: 12px; border-left: 4px solid #1e664e; 
          }
          .info-card label { 
            font-size: 11px; color: #64748b; display: block; margin-bottom: 6px; 
            text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; 
          }
          .info-card .value { font-size: 15px; font-weight: 600; color: #1e293b; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }
          .stat-card { text-align: center; padding: 24px 16px; border-radius: 12px; }
          .stat-card.total { background: linear-gradient(135deg, #e0e7ff, #c7d2fe); color: #3730a3; }
          .stat-card.passed { background: linear-gradient(135deg, #d1fae5, #a7f3d0); color: #065f46; }
          .stat-card.failed { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #991b1b; }
          .stat-card.time { background: linear-gradient(135deg, #fef3c7, #fef3c7); color: #92400e; }
          .stat-number { font-size: 36px; font-weight: bold; margin-bottom: 8px; }
          .module-card { 
            background: #ffffff; border-radius: 12px; margin-bottom: 24px; 
            overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); 
          }
          .module-header { 
            padding: 16px 20px; background: #f8fafc; border-bottom: 2px solid #1e664e; 
            display: flex; justify-content: space-between; align-items: center; 
          }
          .module-name { font-size: 16px; font-weight: bold; color: #1e293b; }
          .module-score { 
            display: inline-block; padding: 4px 12px; border-radius: 20px; 
            font-size: 13px; font-weight: 600; 
          }
          .score-passed { background: #d1fae5; color: #065f46; }
          .score-failed { background: #fee2e2; color: #991b1b; }
          .error-table { width: calc(100% - 40px); border-collapse: collapse; margin: 16px 20px; }
          .error-table th { background: #1e664e; color: white; padding: 12px; text-align: left; }
          .error-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
          .no-errors { padding: 20px; text-align: center; color: #16a34a; background: #f0fdf4; border-radius: 8px; margin: 16px 20px; }
          .footer { text-align: center; padding: 24px; background: #f8fafc; font-size: 11px; color: #64748b; }
          @media print { body { background: white; padding: 0; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <div class="header-content">
              <img src="\${logo01}" class="header-logo" />
              <div class="header-text-container">
                <h1>Training Assessment Report</h1>
                <p>Official Training Record - Generated on \${new Date().toLocaleString()}</p>
              </div>
              <img src="\${logo2}" class="header-logo" />
            </div>
          </div>
          <div class="section">
            <div class="section-title">📋 Trainee Information</div>
            <div class="info-grid">
              <div class="info-card"><label>Full Name</label><div class="value">\${reportData.user?.name || 'N/A'}</div></div>
              <div class="info-card"><label>Email Address</label><div class="value">\${reportData.user?.email || 'N/A'}</div></div>
              <div class="info-card"><label>Phone Number</label><div class="value">\${reportData.user?.phone || 'N/A'}</div></div>
              <div class="info-card"><label>Report ID</label><div class="value">\${Math.random().toString(36).substr(2, 9).toUpperCase()}</div></div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">📊 Performance Summary</div>
            <div class="stats-grid">
              <div class="stat-card total"><div class="stat-number">\${totalAttempts}</div><div>Total Attempts</div></div>
              <div class="stat-card passed"><div class="stat-number">\${passedModules}</div><div>✅ Passed</div></div>
              <div class="stat-card failed"><div class="stat-number">\${reportData.failedModules || 0}</div><div>❌ Failed</div></div>
              <div class="stat-card time"><div class="stat-number">\${hours}h \${minutes}m</div><div>⏱️ Total Time</div></div>
            </div>
            <div class="info-card" style="text-align: center; background: #f0fdf4;">
              <label>📈 Overall Pass Rate</label>
              <div class="value" style="font-size: 24px;">\${passRate}% Pass Rate | \${avgScore}% Avg Score</div>
            </div>
          </div>
          <div class="section">
            <div class="section-title">📝 Module Results</div>
            \${(reportData.attempts || []).map(attempt => {
              const percentage = Math.round((attempt.score / 20) * 100);
              const errors = attempt.errors ? (typeof attempt.errors === 'string' ? JSON.parse(attempt.errors) : attempt.errors) : [];
              return \`
                <div class="module-card">
                  <div class="module-header">
                    <span class="module-name">📘 \${attempt.module?.name || 'Unknown Module'}</span>
                    <span class="module-score \${attempt.passed ? 'score-passed' : 'score-failed'}">
                      \${attempt.score}/20 (\${percentage}%) - \${attempt.passed ? 'PASSED' : 'FAILED'}
                    </span>
                  </div>
                  \${errors.length > 0 ? \`
                    <table class="error-table">
                      <thead><tr><th style="width: 10%">#</th><th>Question</th><th style="width: 20%">Your Answer</th><th style="width: 20%">Correct Answer</th></tr></thead>
                      <tbody>
                        \${errors.map((err, idx) => \`
                          <tr><td>\${idx + 1}</td><td>\${err.questionText}</td><td style="color: #dc2626">\${err.userAnswer}</td><td style="color: #16a34a">\${err.correctAnswer}</td></tr>
                        \`).join('')}
                      </tbody>
                    </table>
                  \` : \`<div class="no-errors">✅ Perfect! No incorrect answers in this module.</div>\`}
                </div>
              \`;
            }).join('')}
          </div>
          <div class="footer">
            <p>© \${new Date().getFullYear()} Centre of Healthcare Training - All Rights Reserved</p>
          </div>
        </div>
        <div class="no-print" style="text-align: center; margin-top: 20px; padding-bottom: 40px;">
          <button onclick="window.print()" style="padding: 12px 30px; background: #1e664e; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold; margin-right: 10px;">🖨️ Print Report / Save PDF</button>
          <button onclick="window.close()" style="padding: 12px 30px; background: #64748b; color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: bold;">✕ Close</button>
        </div>
      </body>
      </html>
    \`);
    printWindow.document.close();
  };
INNER_EOF

# Extract content before printReport
sed -n '1,/const printReport = () => {/p' "$FILE" | head -n -1 > App.jsx.new
# Append the version with logos
cat professional_report.js >> App.jsx.new
# Extract content after printReport (assuming the next block is EFFECTS)
sed -n '/\/\/ ============ EFFECTS ============/,$p' "$FILE" >> App.jsx.new

mv App.jsx.new "$FILE"
rm professional_report.js
echo "✅ Professional Report with Dual Logos Restored!"
