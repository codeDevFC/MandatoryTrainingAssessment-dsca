import React, { useState } from 'react';
import { X, Check, BookOpen, Lock } from 'lucide-react';

const ModulePickerModal = ({ 
  isOpen, 
  onClose, 
  studentId, 
  studentName,
  availableModules,
  selectedModules,
  onSave,
  routeType = 'CUSTOMIZED_01'
}) => {
  const [tempSelected, setTempSelected] = useState(selectedModules || []);
  const [selectAll, setSelectAll] = useState(false);

  if (!isOpen) return null;

  const toggleModule = (moduleId) => {
    setTempSelected(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId) 
        : [...prev, moduleId]
    );
  };

  const toggleAll = () => {
    if (selectAll) {
      setTempSelected([]);
    } else {
      setTempSelected(availableModules.map(m => m.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSave = () => {
    onSave(studentId, tempSelected);
    onClose();
  };

  const isPractical = (id) => id === 8 || id === 17;
  const isCustomized02 = routeType === 'CUSTOMIZED_02';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5 text-white" />
            <div>
              <h3 className="text-xl font-bold text-white">
                {isCustomized02 ? '🔐 Customized-02 Module Selection' : '🎯 Customized-01 Module Selection'}
              </h3>
              <p className="text-indigo-200 text-sm">{studentName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[55vh]">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">
              {isCustomized02 ? (
                <span>🔐 Theory modules are sequential. Practical modules (8, 17) require code after all theory passed.</span>
              ) : (
                <span>Select modules to assign to this student. All selected will be available immediately.</span>
              )}
            </p>
            <button 
              onClick={toggleAll}
              className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {selectAll ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {isCustomized02 && (
            <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-700">
                <Lock size={14} className="inline mr-1" />
                <strong>Customized-02:</strong> Modules 8 and 17 (First Aid & Moving & Handling) 
                will only be available after ALL 21 theory modules are passed.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableModules.map(module => {
              const isPractical = module.id === 8 || module.id === 17;
              const isSelected = tempSelected.includes(module.id);
              
              return (
                <label 
                  key={module.id} 
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
                    ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleModule(module.id)}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-medium text-gray-800">
                      #{module.id} {module.name}
                    </span>
                    {isPractical && (
                      <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        🔐 Practical
                      </span>
                    )}
                    {!isPractical && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                        📚 Theory
                      </span>
                    )}
                    {isCustomized02 && isPractical && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        Final Section
                      </span>
                    )}
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                </label>
              );
            })}
          </div>
        </div>

        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            {tempSelected.length} modules selected
          </div>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
            >
              💾 Save Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModulePickerModal;
