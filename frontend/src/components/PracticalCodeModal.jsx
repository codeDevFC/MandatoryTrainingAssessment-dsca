import React, { useState } from 'react';
import { Lock, Key, CheckCircle, AlertCircle, X } from 'lucide-react';

const PracticalCodeModal = ({ 
  isOpen, 
  onClose, 
  moduleId, 
  moduleName, 
  userId, 
  onSuccess,
  onError,
  onRefreshModules 
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const response = await fetch(`${API_URL}/api/auth/verify-practical-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: userId,
          moduleId: moduleId, 
          practicalCode: code.trim().toUpperCase() 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(true);
        // Refresh modules after successful verification
        if (onRefreshModules) {
          await onRefreshModules();
        }
        if (onSuccess) {
          onSuccess();
        }
        // Close modal after delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(data.error || 'Invalid code. Please check with your trainer.');
        if (onError) onError(data.error);
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-amber-600" />
            <h2 className="text-xl font-bold text-slate-800">🔐 Practical Assessment Code</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-sm text-amber-800">
            <strong>{moduleName}</strong> requires a practical access code.
            <br />Enter the code provided by your trainer.
          </p>
        </div>

        {success && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-700">✅ Practical verification successful!</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Practical Access Code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter 8-character code"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-center text-xl font-mono tracking-wider uppercase"
              disabled={loading || success}
              maxLength="8"
              required
              autoFocus
            />
            <p className="text-xs text-slate-500 mt-1">
              This code was provided by your trainer after completing the practical assessment
            </p>
          </div>
          
          <button
            type="submit"
            disabled={loading || success || !code.trim() || code.length < 8}
            className="w-full py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2
              bg-amber-600 text-white hover:bg-amber-700 
              disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </>
            ) : success ? (
              '✅ Verified!'
            ) : (
              <>
                <Key size={18} />
                Verify Code
              </>
            )}
          </button>
          
          <p className="text-xs text-center text-slate-500">
            Don't have a code? Complete all theory modules first, then contact your trainer.
          </p>
        </form>
      </div>
    </div>
  );
};

export default PracticalCodeModal;
