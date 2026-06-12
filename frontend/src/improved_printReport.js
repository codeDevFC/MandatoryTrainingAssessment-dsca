const printReport = () => {
  if (!reportData) return;
  
  const printWindow = window.open('', '_blank');
  const totalDuration = reportData.totalTimeSpent || 0;
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const seconds = totalDuration % 60;
  
  // Helper function to safely get value
  const getValue = (obj, path, defaultValue = 'N/A') => {
    return path.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : defaultValue), obj);
  };
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Assessment Report - ${getValue(reportData, 'user.name', getValue(reportData, 'user.email', 'Student'))}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
          background: #f0f2f5;
        }
        
        .report-container {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: white;
          padding: 40px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 28px;
          margin-bottom: 8px;
          letter-spacing: 1px;
        }
        
        .header p {
          opacity: 0.9;
          font-size: 14px;
        }
        
        .section {
          padding: 24px 32px;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1e293b;
          margin-bottom: 20px;
          padding-bottom: 8px;
          border-bottom: 3px solid #4f46e5;
          display: inline-block;
        }
        
        /* Info Grid with proper spacing */
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .info-card {
          background: #f8fafc;
          padding: 16px 20px;
          border-radius: 12px;
          border-left: 4px solid #4f46e5;
        }
        
        .info-card label {
          font-size: 12px;
          color: #64748b;
          display: block;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }
        
        .info-card .value {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          word-break: break-word;
        }
        
        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin: 24px 0;
        }
        
        .stat-card {
          text-align: center;
          padding: 24px 16px;
          border-radius: 12px;
          transition: transform 0.2s;
        }
        
        .stat-card.total {
          background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
          color: #3730a3;
        }
        
        .stat-card.passed {
          background: linear-gradient(135deg, #d1fae5, #a7f3d0);
          color: #065f46;
        }
        
        .stat-card.failed {
          background: linear-gradient(135deg, #fee2e2, #fecaca);
          color: #991b1b;
        }
        
        .stat-card.time {
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #92400e;
        }
        
        .stat-number {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        
        .stat-label {
          font-size: 13px;
          font-weight: 500;
        }
        
        /* Module Cards */
        .module-card {
          background: #ffffff;
          border-radius: 12px;
          margin-bottom: 24px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .module-header {
          padding: 16px 20px;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-bottom: 2px solid #4f46e5;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .module-name {
          font-size: 16px;
          font-weight: bold;
          color: #1e293b;
        }
        
        .module-score {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 600;
        }
        
        .score-passed {
          background: #d1fae5;
          color: #065f46;
        }
        
        .score-failed {
          background: #fee2e2;
          color: #991b1b;
        }
        
        /* Error Table */
        .error-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }
        
        .error-table th {
          background: #4f46e5;
          color: white;
          padding: 12px;
          text-align: left;
          font-size: 13px;
          font-weight: 600;
        }
        
        .error-table td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 13px;
          vertical-align: top;
        }
        
        .error-table tr:hover {
          background: #f8fafc;
        }
        
        .wrong-answer {
          color: #dc2626;
          font-weight: 500;
        }
        
        .correct-answer {
          color: #16a34a;
          font-weight: 500;
        }
        
        .no-errors {
          padding: 20px;
          text-align: center;
          color: #16a34a;
          background: #f0fdf4;
          border-radius: 8px;
          margin-top: 16px;
        }
        
        .footer {
          text-align: center;
          padding: 24px;
          background: #f8fafc;
          font-size: 12px;
          color: #64748b;
          border-top: 1px solid #e2e8f0;
        }
        
        @media print {
          body {
            padding: 0;
            background: white;
          }
          .report-container {
            box-shadow: none;
          }
          .no-print {
            display: none;
          }
          .stat-card {
            break-inside: avoid;
          }
          .module-card {
            break-inside: avoid;
          }
        }
        
        @media (max-width: 768px) {
          body {
            padding: 20px;
          }
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="report-container">
        <div class="header">
          <h1>📊 COHT Training Assessment Report</h1>
          <p>Official Training Record - Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <!-- Trainee Information with proper spacing -->
        <div class="section">
          <div class="section-title">👤 Trainee Information</div>
          <div class="info-grid">
            <div class="info-card">
              <label>Full Name</label>
              <div class="value">${getValue(reportData, 'user.name', 'N/A')}</div>
            </div>
            <div class="info-card">
              <label>Email Address</label>
              <div class="value">${getValue(reportData, 'user.email', 'N/A')}</div>
            </div>
            <div class="info-card">
              <label>Role</label>
              <div class="value">${getValue(reportData, 'user.role', 'Trainee')}</div>
            </div>
            <div class="info-card">
              <label>Training Route</label>
              <div class="value">${getValue(reportData, 'user.trainingRoute', 'Full Access') === 'CUSTOM' ? '🎯 Custom Selection' : '📚 Full Access (All Modules)'}</div>
            </div>
            <div class="info-card">
              <label>Joined Date</label>
              <div class="value">${reportData.user?.joinedAt ? new Date(reportData.user.joinedAt).toLocaleDateString() : 'N/A'}</div>
            </div>
            <div class="info-card">
              <label>Report ID</label>
              <div class="value">${Math.random().toString(36).substr(2, 8).toUpperCase()}</div>
            </div>
          </div>
        </div>
        
        <!-- Performance Summary -->
        <div class="section">
          <div class="section-title">📈 Performance Summary</div>
          <div class="stats-grid">
            <div class="stat-card total">
              <div class="stat-number">${reportData.totalAttempts || 0}</div>
              <div class="stat-label">Total Attempts</div>
            </div>
            <div class="stat-card passed">
              <div class="stat-number">${reportData.passedModules || 0}</div>
              <div class="stat-label">✅ Passed Modules</div>
            </div>
            <div class="stat-card failed">
              <div class="stat-number">${reportData.failedModules || 0}</div>
              <div class="stat-label">❌ Failed Modules</div>
            </div>
            <div class="stat-card time">
              <div class="stat-number">${hours}h ${minutes}m ${seconds}s</div>
              <div class="stat-label">⏱️ Total Time Spent</div>
            </div>
          </div>
          <div class="info-card" style="margin-top: 16px; text-align: center; background: #f0fdf4;">
            <label>Average Score</label>
            <div class="value" style="font-size: 24px;">${reportData.averageScore ? reportData.averageScore.toFixed(1) : 0}%</div>
          </div>
        </div>
        
        <!-- Detailed Module Results -->
        <div class="section">
          <div class="section-title">📝 Detailed Module Results & Incorrect Answers</div>
          ${(reportData.attempts || []).map(attempt => {
            const errors = attempt.errors || [];
            return `
              <div class="module-card">
                <div class="module-header">
                  <span class="module-name">📖 ${attempt.module?.name || 'Unknown Module'}</span>
                  <span class="module-score ${attempt.passed ? 'score-passed' : 'score-failed'}">
                    ${attempt.score}/20 - ${attempt.passed ? '✅ PASSED' : '❌ FAILED'}
                  </span>
                </div>
                ${errors.length > 0 ? `
                  <table class="error-table">
                    <thead>
                      <tr>
                        <th style="width: 8%">#</th>
                        <th style="width: 47%">Question</th>
                        <th style="width: 20%">Your Answer</th>
                        <th style="width: 20%">Correct Answer</th>
                        <th style="width: 5%">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${errors.map((err, idx) => `
                        <tr>
                          <td>${err.questionNumber || idx + 1}</td>
                          <td>${err.questionText || 'N/A'}</td>
                          <td class="wrong-answer">❌ ${err.userAnswer || 'N/A'}</td>
                          <td class="correct-answer">✓ ${err.correctAnswer || 'N/A'}</td>
                          <td>✗</td>
                        </tr>
                      `).join('')}
                    </tbody>
                  </table>
                ` : `
                  <div class="no-errors">
                    ✅ Perfect! No incorrect answers in this module.
                  </div>
                `}
              </div>
            `;
          }).join('')}
          ${(!reportData.attempts || reportData.attempts.length === 0) ? `
            <div style="text-align: center; padding: 40px; color: #64748b;">
              📭 No module attempts recorded yet.
            </div>
          ` : ''}
        </div>
        
        <div class="footer">
          <p>This is an official training record generated by COHT Training Platform.</p>
          <p>© ${new Date().getFullYear()} Centre of Healthcare Training - All Rights Reserved</p>
          <p style="margin-top: 8px; font-size: 10px;">trainercourses.com</p>
        </div>
      </div>
      <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 12px 24px; background: #4f46e5; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; margin-right: 10px;">🖨️ Print / Save as PDF</button>
        <button onclick="window.close()" style="padding: 12px 24px; background: #64748b; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">❌ Close</button>
      </div>
    </body>
    </html>
  `);
  printWindow.document.close();
};
