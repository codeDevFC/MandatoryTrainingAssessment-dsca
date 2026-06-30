// Add these state variables in the admin section
const [practicalCode, setPracticalCode] = useState('');
const [practicalCodeExpiry, setPracticalCodeExpiry] = useState(null);
const [generatingPracticalCode, setGeneratingPracticalCode] = useState(false);

// Add this function for generating practical codes
const generatePracticalCode = async () => {
  setGeneratingPracticalCode(true);
  try {
    const response = await fetch(`${API_URL}/api/admin/generate-practical-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ generatedBy: user.email })
    });
    const data = await response.json();
    if (response.ok) {
      setPracticalCode(data.code);
      setPracticalCodeExpiry(data.expiresAt);
      setSuccess(`✅ New practical code generated: ${data.code}`);
      setTimeout(() => setSuccess(''), 5000);
    } else {
      setError(data.error || 'Failed to generate practical code');
    }
  } catch (err) {
    setError('Failed to generate practical code');
  } finally {
    setGeneratingPracticalCode(false);
  }
};

// Add this function to fetch current practical code
const fetchCurrentPracticalCode = async () => {
  try {
    const response = await fetch(`${API_URL}/api/admin/current-practical-code`);
    const data = await response.json();
    if (response.ok && data.code) {
      setPracticalCode(data.code);
      setPracticalCodeExpiry(data.expiresAt);
    }
  } catch (err) {
    console.error('Failed to fetch practical code:', err);
  }
};

// Add this to the useEffect or fetchRegisteredStudents
// Call fetchCurrentPracticalCode() when admin logs in
