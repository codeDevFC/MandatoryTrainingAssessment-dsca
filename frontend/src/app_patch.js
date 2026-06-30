// Add this import at the top with other imports
import PracticalCodeModal from './components/PracticalCodeModal';

// Add these state variables after other state declarations
const [showPracticalModal, setShowPracticalModal] = useState(false);
const [pendingPracticalModule, setPendingPracticalModule] = useState(null);
const [practicalModuleName, setPracticalModuleName] = useState('');
const [practicalCode, setPracticalCode] = useState('');

// Add these functions after the fetch functions
// ============ PRACTICAL CODE HANDLING ============
const handlePracticalCodeSuccess = () => {
  setSuccess('✅ Practical code verified! You can now access the module.');
  setTimeout(() => setSuccess(''), 5000);
  // Refresh modules to update status
  fetchModules(user.id);
};

const handlePracticalCodeError = (error) => {
  setError(error || 'Failed to verify practical code. Please try again.');
  setTimeout(() => setError(''), 5000);
};

const requestPracticalCode = (module) => {
  setPendingPracticalModule(module);
  setPracticalModuleName(module.name);
  setShowPracticalModal(true);
};

// Replace the getModuleStatus function with this updated version
const getModuleStatus = (moduleId) => {
  if (user?.role !== 'TRAINEE') return 'available';
  
  const isCustomRoute = user?.trainingRoute === 'CUSTOM';
  const progress = userProgress.progress || [];
  const moduleProgress = progress.find(x => x.moduleId === moduleId);
  
  // If already passed, show as completed
  if (moduleProgress?.status === 'passed') return 'completed';
  
  // Check if this is a practical module (8 or 17)
  const isPractical = moduleId === 8 || moduleId === 17;
  
  // For CUSTOM route: check if module is selected
  if (isCustomRoute) {
    const selectedModules = user?.selectedModules || [];
    if (!selectedModules.includes(moduleId)) {
      return 'locked';
    }
  }
  
  // For practical modules (8 and 17):
  // - Must be at the end of the course
  // - All other modules (1-7, 9-16, 18-23) must be passed
  if (isPractical) {
    // Get all non-practical module IDs (all except 8 and 17)
    const allModuleIds = [1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,18,19,20,21,22,23];
    const allPreviousPassed = allModuleIds.every(id => {
      const p = progress.find(x => x.moduleId === id);
      return p?.status === 'passed';
    });
    
    if (!allPreviousPassed) {
      return 'locked'; // Not all modules completed yet
    }
    
    // Check if practical code is already verified
    let practicalModules = {};
    if (user?.practicalModules) {
      try {
        practicalModules = typeof user.practicalModules === 'string' 
          ? JSON.parse(user.practicalModules) 
          : user.practicalModules;
      } catch (e) {
        practicalModules = {};
      }
    }
    
    if (practicalModules[moduleId]?.completed) {
      return 'available'; // Practical code verified, can take the assessment
    }
    
    return 'practical_locked'; // Needs practical code
  }
  
  // For non-practical modules: sequential unlocking (but skip 8 and 17)
  if (moduleId === 1) return 'available';
  
  // Get the previous non-practical module
  let prevId = moduleId - 1;
  while (prevId === 8 || prevId === 17) {
    prevId--;
  }
  if (prevId < 1) return 'available';
  
  const prevProgress = progress.find(x => x.moduleId === prevId);
  if (prevProgress?.status === 'passed') return 'available';
  
  return 'locked';
};

// Update the module card rendering (find the module card section and replace status display)
// The status badge should show:
// - completed: '✅ Completed'
// - available: 'Available'  
// - practical_locked: '🔐 Practical Code Required'
// - locked: '🔒 Locked'

// Update the button rendering:
// - For practical_locked: Show "Enter Practical Code" button
// - For available: Show "Start Module" button
// - For locked: Show "Complete Previous Modules First" or "Not in Selection"
// - For completed: Show "Completed" badge
