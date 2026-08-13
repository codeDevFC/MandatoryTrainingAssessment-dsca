import re

file_path = '/Users/felixcobbinah/Downloads/dsca-MTA-Quiz/frontend/src/App.jsx'

with open(file_path, 'r') as f:
    content = f.read()

# The new printReport function
new_print_report = '''const printReport = () => {
  if (!reportData) return;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to print the report");
    return;
  }

  const totalDuration = reportData.totalTimeSpent || 0;
  const hours = Math.floor(totalDuration / 3600);
  const minutes = Math.floor((totalDuration % 3600) / 60);
  const passedModules = reportData.passedModules || 0;
  const failedModules = reportData.failedModules || 0;
  const totalAttempts = reportData.totalAttempts || 0;
  const passRate = totalAttempts > 0 ? Math.round((passedModules / totalAttempts) * 100) : 0;

  const esc = (str) => {
    if (str === null || str === undefined) return "N/A";
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  const studentName = esc(reportData.user?.name || "N/A");
  const studentEmail = esc(reportData.user?.email || "N/A");
  const studentPhone = esc(reportData.user?.phone || "N/A");
  const studentRole = esc(reportData.user?.role || "Trainee");
  const reportTrainingRoute = esc(reportData.user?.trainingRoute || "Full Access");

  let html = "";
  
  html += "<!DOCTYPE html>";
  html += "<html>";
  html += "<head>";
  html += "<title>COHT Training Assessment Report - " + studentName + "</title>";
  html += "<meta charset='UTF-8'>";
  html += "<style>";
  html += "* { margin: 0; padding: 0; box-sizing: border-box; }";
  html += "body { font-family: 'Segoe UI', Arial, sans-serif; background: #f0f2f5; padding: 40px; margin: 0 auto; }";
  html += ".report-container { max-width: 1100px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; }";
  html += ".header { background: linear-gradient(135deg, #1e664e 0%, #0f4a38 100%); color: white; padding: 30px 20px; text-align: center; }";
  html += ".header h1 { font-size: 24px; margin: 0; letter-spacing: 0.5px; }";
  html += ".header p { opacity: 0.9; font-size: 13px; margin-top: 5px; }";
  html += ".section { padding: 28px 32px; border-bottom: 1px solid #e2e8f0; }";
  html += ".section-title { font-size: 18px; font-weight: bold; color: #1e293b; margin-bottom: 20px; padding-bottom: 8px; border-bottom: 3px solid #1e664e; display: inline-block; }";
  html += ".info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-top: 20px; }";
  html += ".info-card { background: #f8fafc; padding: 18px 20px; border-radius: 12px; border-left: 4px solid #1e664e; }";
  html += ".info-card label { font-size: 11px; color: #64748b; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600; }";
  html += ".info-card .value { font-size: 15px; font-weight: 600; color: #1e293b; }";
  html += ".stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 24px 0; }";
  html += ".stat-card { text-align: center; padding: 24px 16px; border-radius: 12px; }";
  html += ".stat-card.total { background: linear-gradient(135deg, #e0e7ff, #c7d2fe); color: #3730a3; }";
  html += ".stat-card.passed { background: linear-gradient(135deg, #d1fae5, #a7f3d0); color: #065f46; }";
  html += ".stat-card.failed { background: linear-gradient(135deg, #fee2e2, #fecaca); color: #991b1b; }";
  html += ".stat-card.time { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #92400e; }";
  html += ".stat-number { font-size: 36px; font-weight: bold; margin-bottom: 8px; }";
  html += ".stat-label { font-size: 13px; font-weight: 500; }";
  html += ".module-card { background: #ffffff; border-radius: 12px; margin-bottom: 24px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); page-break-inside: avoid; break-inside: avoid; }";
  html += ".module-header { padding: 16px 20px; background: linear-gradient(135deg, #f8fafc, #f1f5f9); border-bottom: 2px solid #1e664e; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }";
  html += ".module-name { font-size: 16px; font-weight: bold; color: #1e293b; }";
  html += ".module-score { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; }";
  html += ".score-passed { background: #d1fae5; color: #065f46; }";
  html += ".score-failed { background: #fee2e2; color: #991b1b; }";
  html += ".module-date { padding: 8px 20px; background: #fafbfc; font-size: 12px; color: #64748b; border-bottom: 1px solid #e2e8f0; }";
  html += ".question-table { width: calc(100% - 40px); border-collapse: collapse; margin: 16px 20px; }";
  html += ".question-table th { background: #1e664e; color: white; padding: 12px; text-align: left; font-size: 12px; font-weight: 600; }";
  html += ".question-table td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 12px; vertical-align: top; }";
  html += ".question-table tr.correct { background: #f0fdf4; }";
  html += ".question-table tr.incorrect { background: #fef2f2; }";
  html += ".answer-correct { color: #16a34a; font-weight: 600; }";
  html += ".answer-incorrect { color: #dc2626; font-weight: 600; }";
  html += ".no-questions { padding: 20px; text-align: center; color: #64748b; background: #f8fafc; border-radius: 8px; margin: 16px 20px; }";
  html += ".footer { text-align: center; padding: 24px; background: #f8fafc; font-size: 11px; color: #64748b; border-top: 1px solid #e2e8f0; }";
  html += "@media print { body { background: white; padding: 0; } .no-print { display: none; } .module-card { break-inside: avoid; page-break-inside: avoid; } }";
  html += "@media (max-width: 768px) { body { padding: 20px; } .stats-grid { grid-template-columns: repeat(2, 1fr); } .info-grid { grid-template-columns: 1fr; } }";
  html += "</style>";
  html += "</head>";
  html += "<body>";
  html += '<div class="report-container">';
  html += '<div class="header">';
  html += "<h1>COHT Training Assessment Report</h1>";
  html += "<p>Official Training Record - Generated on " + new Date().toLocaleString() + "</p>";
  html += "</div>";
  html += '<div class="section">';
  html += '<div class="section-title">Trainee Information</div>';
  html += '<div class="info-grid">';
  html += '<div class="info-card"><label>Full Name</label><div class="value">' + studentName + "</div></div>";
  html += '<div class="info-card"><label>Email</label><div class="value">' + studentEmail + "</div></div>";
  html += '<div class="info-card"><label>Phone</label><div class="value">' + studentPhone + "</div></div>";
  html += '<div class="info-card"><label>Role</label><div class="value">' + studentRole + "</div></div>";
  html += '<div class="info-card"><label>Training Route</label><div class="value">' + (reportTrainingRoute === "CUSTOM" ? "Custom Selection" : "Full Access") + "</div></div>";
  html += '<div class="info-card"><label>Report ID</label><div class="value">' + Math.random().toString(36).substr(2, 8).toUpperCase() + "</div></div>";
  html += "</div>";
  html += "</div>";
  html += '<div class="section">';
  html += '<div class="section-title">Performance Summary</div>';
  html += '<div class="stats-grid">';
  html += '<div class="stat-card total"><div class="stat-number">' + totalAttempts + '</div><div class="stat-label">Total Attempts</div></div>';
  html += '<div class="stat-card passed"><div class="stat-number">' + passedModules + '</div><div class="stat-label">Passed</div></div>';
  html += '<div class="stat-card failed"><div class="stat-number">' + failedModules + '</div><div class="stat-label">Failed</div></div>';
  html += '<div class="stat-card time"><div class="stat-number">' + hours + "h " + minutes + 'm</div><div class="stat-label">Total Time</div></div>';
  html += "</div>";
  html += '<div class="info-card" style="text-align: center; background: #f0fdf4; margin-top: 16px;">';
  html += "<label>Overall Pass Rate</label>";
  html += '<div class="value" style="font-size: 24px;">' + passRate + "% Pass Rate</div>";
  html += "</div>";
  html += "</div>";
  html += '<div class="section">';
  html += '<div class="section-title">Module Results - Full Question Breakdown</div>';

  const attempts = reportData.attempts || [];
  if (attempts.length === 0) {
    html += '<div style="text-align: center; padding: 40px; color: #64748b;">No module attempts recorded yet.</div>';
  } else {
    attempts.forEach(function(attempt) {
      const percentage = Math.round((attempt.score / 20) * 100);
      const isPassed = attempt.passed;
      const moduleName = esc(attempt.module?.name || "Unknown Module");
      const completedAt = attempt.completedAt ? new Date(attempt.completedAt).toLocaleString() : "N/A";

      let allQuestions = [];

      if (attempt.detailedAnswers) {
        if (typeof attempt.detailedAnswers === "string") {
          try { allQuestions = JSON.parse(attempt.detailedAnswers); } catch(e) { allQuestions = []; }
        } else if (Array.isArray(attempt.detailedAnswers)) {
          allQuestions = attempt.detailedAnswers;
        }
      }

      if (allQuestions.length === 0 && attempt.errors) {
        let errors = [];
        if (typeof attempt.errors === "string") {
          try { errors = JSON.parse(attempt.errors); } catch(e) { errors = []; }
        } else if (Array.isArray(attempt.errors)) {
          errors = attempt.errors;
        }
        allQuestions = errors.map(function(err) {
          return {
            questionNumber: err.questionNumber || 0,
            questionText: err.questionText || "N/A",
            userAnswer: err.userAnswer || "N/A",
            correctAnswer: err.correctAnswer || "N/A",
            isCorrect: err.userAnswer === err.correctAnswer
          };
        });
      }

      if (allQuestions.length === 0 && attempt.module && attempt.answers) {
        try {
          const questions = JSON.parse(attempt.module.questions || "[]");
          const parsedAnswers = JSON.parse(attempt.answers || "{}");
          allQuestions = questions.map(function(q, idx) {
            return {
              questionNumber: idx + 1,
              questionText: q.text,
              userAnswer: q.options ? q.options[parsedAnswers[idx]] : (parsedAnswers[idx] === 0 ? "True" : "False"),
              correctAnswer: q.options ? q.options[q.correct] : (q.correct === 0 ? "True" : "False"),
              isCorrect: parsedAnswers[idx] === q.correct
            };
          });
        } catch(e) {
          allQuestions = [];
        }
      }

      html += '<div class="module-card">';
      html += '<div class="module-header">';
      html += '<span class="module-name">' + moduleName + "</span>";
      html += '<span class="module-score ' + (isPassed ? "score-passed" : "score-failed") + '">';
      html += attempt.score + "/20 (" + percentage + "%) - " + (isPassed ? "PASSED" : "FAILED");
      html += "</span>";
      html += "</div>";
      html += '<div class="module-date">Completed: ' + completedAt + "</div>";

      if (allQuestions.length > 0) {
        html += '<table class="question-table">';
        html += "<thead>";
        html += "<tr>";
        html += '<th style="width: 8%">#</th>';
        html += '<th style="width: 42%">Question</th>';
        html += '<th style="width: 20%">Your Answer</th>';
        html += '<th style="width: 20%">Correct Answer</th>';
        html += '<th style="width: 10%">Result</th>';
        html += "</tr>";
        html += "</thead>";
        html += "<tbody>";
        allQuestions.forEach(function(ans, idx) {
          const isCorrect = ans.isCorrect !== undefined ? ans.isCorrect : (ans.userAnswer === ans.correctAnswer);
          const userAns = esc(ans.userAnswer || "N/A");
          const correctAns = esc(ans.correctAnswer || "N/A");
          const qText = esc(ans.questionText || "N/A");
          html += '<tr class="' + (isCorrect ? "correct" : "incorrect") + '">';
          html += "<td>" + (idx + 1) + "</td>";
          html += "<td>" + qText + "</td>";
          html += '<td class="' + (isCorrect ? "answer-correct" : "answer-incorrect") + '">' + userAns + "</td>";
          html += '<td class="answer-correct">' + correctAns + "</td>";
          html += "<td>" + (isCorrect ? "✓" : "✗") + "</td>";
          html += "</tr>";
        });
        html += "</tbody>";
        html += "</table>";
      } else {
        html += '<div class="no-questions">No detailed question data available for this module.</div>';
      }

      html += "</div>";
    });
  }

  html += "</div>";
  html += '<div class="footer">';
  html += "<p>© " + new Date().getFullYear() + " Centre of Healthcare Training - All Rights Reserved</p>";
  html += '<p style="margin-top: 4px; font-size: 10px;">trainercourses.com</p>';
  html += "</div>";
  html += "</div>";
  html += '<div class="no-print">';
  html += '<button class="print-btn" onclick="window.print()">Print / Save as PDF</button>';
  html += '<button class="close-btn" onclick="window.close()">Close</button>';
  html += "</div>";
  html += "</body>";
  html += "</html>";

  printWindow.document.write(html);
  printWindow.document.close();
};'''

# Find and replace the old printReport function
pattern = r'const printReport = \(\) => \{.*?\n\s*\};'
content = re.sub(pattern, new_print_report, content, flags=re.DOTALL)

with open(file_path, 'w') as f:
    f.write(content)

print("printReport function fixed successfully!")
