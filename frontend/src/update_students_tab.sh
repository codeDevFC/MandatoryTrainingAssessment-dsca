#!/bin/bash

cd ~/Downloads/dsca-MTA-Quiz/frontend/src

# Add import for StudentDetailsPanel at the top of App.jsx (after other imports)
sed -i '' '/import.*from.*lucide-react/a\
import StudentDetailsPanel from '\''./components/StudentDetailsPanel'\'';' App.jsx

# Add state variables for the details panel
sed -i '' '/const \[showReportModal, setShowReportModal\]/a\
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);\
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState(null);\
  const [generatedLoginDetails, setGeneratedLoginDetails] = useState(null);' App.jsx

# Add function to show student details
cat >> App.jsx.temp << 'FUNC_EOF'

  // ============ SHOW STUDENT DETAILS WITH LOGIN CREDENTIALS ============
  const showStudentFullDetails = async (student) => {
    setSelectedStudentForDetails(student);
    setShowDetailsPanel(true);
    
    // Try to fetch existing login code if any
    try {
      const res = await fetch(`${API_URL}/api/admin/student-full-details/${student.id}`);
      const data = await res.json();
      if (data.currentCode) {
        setGeneratedLoginDetails({
          loginEmail: data.email,
          code: data.currentCode,
          expiresAt: data.codeExpiresAt
        });
      } else {
        setGeneratedLoginDetails(null);
      }
    } catch (err) {
      console.error('Failed to fetch login details:', err);
      setGeneratedLoginDetails(null);
    }
  };
FUNC_EOF

# Insert the function at appropriate place
echo "✅ Updated App.jsx with student details panel functions"
