import React, { useState } from 'react';
import { X, Check, BookOpen, Lock, Unlock, Shield, AlertCircle } from 'lucide-react';

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

 const PRACTICAL_IDS = [8, 17];
 const THEORY_IDS = [1,2,3,4,6,7,10,11,12,14,15,16,18,19,21,22,23];
 const EXTRA_ADD_ON_IDS = [5,9,13,20];

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

 const selectAllModules = () => {
 const allIds = availableModules.map(m => m.id);
 setTempSelected(allIds);
 setSelectAll(true);
 };

 const selectTheoryOnly = () => {
 const theoryIds = availableModules
 .filter(m => THEORY_IDS.includes(m.id))
 .map(m => m.id);
 setTempSelected(theoryIds);
 setSelectAll(false);
 };

 const selectPracticalOnly = () => {
 const practicalIds = availableModules
 .filter(m => PRACTICAL_IDS.includes(m.id))
 .map(m => m.id);
 setTempSelected(practicalIds);
 setSelectAll(false);
 };

 const unlockAllModules = () => {
 const allIds = availableModules.map(m => m.id);
 setTempSelected(allIds);
 setSelectAll(true);
 };

 const handleSave = () => {
 onSave(studentId, tempSelected);
 onClose();
 };

 const isPractical = (id) => PRACTICAL_IDS.includes(id);
 const isTheory = (id) => THEORY_IDS.includes(id);
 const isExtraAddOn = (id) => EXTRA_ADD_ON_IDS.includes(id);

 // CUSTOMIZED_02: ALL modules available immediately, NO code needed
 const isCustomized02 = routeType === 'CUSTOMIZED_02';
 // CUSTOMIZED_01: Theory available immediately, Practical needs code after theory
 const isCustomized01 = routeType === 'CUSTOMIZED_01';

 return (
 <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
 <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
 <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-4 flex justify-between items-center">
 <div className="flex items-center gap-3">
 <BookOpen className="w-5 h-5 text-white" />
 <div>
 <h3 className="text-xl font-bold text-white">
 {isCustomized02 ? '? Customized-02 - All Modules Available Immediately' : '? Customized-01 - Module Selection'}
 </h3>
 <p className="text-indigo-200 text-sm">{studentName}</p>
 </div>
 </div>
 <button onClick={onClose} className="text-white hover:text-gray-200">
 <X size={24} />
 </button>
 </div>

 <div className="p-6 overflow-y-auto max-h-[55vh]">
 <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
 <p className="text-sm text-gray-500 flex-1 min-w-[200px]">
 {isCustomized02 ? (
 <span className="text-green-700 font-medium">? ALL selected modules are available immediately. NO practical code required.</span>
 ) : isCustomized01 ? (
 <span>? Select modules to assign. Theory modules available immediately. Practical modules (8,17) require code after all theory passed.</span>
 ) : (
 <span>Select modules to assign.</span>
 )}
 </p>
 </div>

 {/* Quick Action Buttons - Only for Customized-01 */}
 {isCustomized01 && (
 <div className="mb-4 p-4 bg-emerald-50 rounded-xl border-2 border-emerald-200">
 <div className="flex items-center gap-2 mb-3">
 <Unlock className="w-5 h-5 text-emerald-600" />
 <span className="font-semibold text-emerald-800">Quick Actions</span>
 </div>
 <div className="flex flex-wrap gap-2">
 <button 
 onClick={unlockAllModules}
 className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium flex items-center gap-2"
 >
 <Unlock size={16} /> Unlock All Modules
 </button>
 <button 
 onClick={selectTheoryOnly}
 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
 >
 ? Theory Only
 </button>
 <button 
 onClick={selectPracticalOnly}
 className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition text-sm font-medium"
 >
 ? Practical Only (8,17)
 </button>
 <button 
 onClick={toggleAll}
 className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm font-medium"
 >
 {selectAll ? 'Deselect All' : 'Select All'}
 </button>
 </div>
 <p className="text-xs text-emerald-700 mt-2">
 ? <strong>Unlock All</strong> - Makes ALL modules (including practical 8 & 17) available immediately
 </p>
 </div>
 )}

 {/* Customized-02 Info - NO CODE NEEDED */}
 {isCustomized02 && (
 <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
 <p className="text-sm text-green-700 flex items-center gap-2">
 <Unlock size={16} className="text-green-600" />
 <strong>Customized-02:</strong> All selected modules are available immediately. 
 <span className="text-green-600 font-medium">No practical code required for modules 8 and 17.</span>
 </p>
 </div>
 )}

 {/* Module List */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
 {availableModules.map(module => {
 const isPracticalModule = isPractical(module.id);
 const isTheoryModule = isTheory(module.id);
 const isExtraAddOnModule = isExtraAddOn(module.id);
 const isSelected = tempSelected.includes(module.id);

 // For Customized-02: Show all modules as selectable with "Available Immediately"
 // For Customized-01: Show theory as available, practical as needing code
 
 let moduleBadge = '';
 let badgeColor = '';
 
 if (isPracticalModule) {
 if (isCustomized02) {
 moduleBadge = '? Available Immediately';
 badgeColor = 'bg-green-100 text-green-700';
 } else {
 moduleBadge = '? Practical (Code Required)';
 badgeColor = 'bg-amber-100 text-amber-700';
 }
 } else if (isTheoryModule) {
 if (isCustomized02) {
 moduleBadge = '? Available Immediately';
 badgeColor = 'bg-green-100 text-green-700';
 } else {
 moduleBadge = '? Theory (Available)';
 badgeColor = 'bg-blue-100 text-blue-700';
 }
 } else if (isExtraAddOnModule) {
 moduleBadge = '⭐ Extra Add-On';
 badgeColor = 'bg-purple-100 text-purple-700';
 }

 return (
 <label 
 key={module.id} 
 className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all
 ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
 ${isPracticalModule ? 'border-l-4 border-l-amber-500' : ''}
 ${isExtraAddOnModule ? 'border-l-4 border-l-purple-500' : ''}
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
 <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${badgeColor}`}>
 {moduleBadge}
 </span>
 </div>
 {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
 </label>
 );
 })}
 </div>
 </div>

 <div className="border-t p-4 bg-gray-50 flex flex-wrap justify-between items-center gap-3">
 <div className="text-sm text-gray-500">
 {tempSelected.length} modules selected
 {tempSelected.some(id => PRACTICAL_IDS.includes(id)) && (
 <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
 ? Includes Practical
 </span>
 )}
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
 ? Save Selection
 </button>
 </div>
 </div>
 </div>
 </div>
 );
};

export default ModulePickerModal;
