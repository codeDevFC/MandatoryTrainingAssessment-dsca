import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Key, Calendar, CheckCircle, Clock, Copy, Eye, EyeOff, X, RefreshCw } from 'lucide-react';

const StudentDetailsPanel = ({ student, loginDetails, onClose, onRefresh }) => {
  const [showCode, setShowCode] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Student Details & Login Credentials</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row overflow-y-auto p-6">
          {/* LEFT COLUMN - Registration Info */}
          <div className="flex-1 pr-6">
            <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">Registration Information</h4>
            <div className="space-y-3">
              <p><strong>Full Name:</strong> {student.name || 'N/A'}</p>
              <p><strong>Email:</strong> {student.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {student.phone || 'N/A'}</p>
              <p><strong>Address:</strong> {student.address || 'Not provided'}</p>
              <p><strong>Post Code:</strong> {student.postCode || 'Not provided'}</p>
              <p><strong>Training Route:</strong> {student.trainingRoute === 'CUSTOM' ? 'Custom Selection' : 'Full Access'}</p>
              <p><strong>Payment Status:</strong> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${student.paymentConfirmed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {student.paymentConfirmed ? 'Confirmed' : 'Pending'}
                </span>
              </p>
              <p><strong>Registered:</strong> {new Date(student.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* RIGHT COLUMN - Login Credentials */}
          <div className="flex-1 pl-6 border-l border-gray-200">
            <h4 className="font-semibold text-gray-800 mb-4 border-b pb-2">Login Credentials</h4>
            {loginDetails ? (
              <div className="space-y-4">
                <div>
                  <strong>Login Email:</strong>
                  <code className="block bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono break-all mt-1">{loginDetails.loginEmail}</code>
                </div>
                <div>
                  <strong>Access Code:</strong>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="bg-gray-100 px-4 py-2 rounded-lg font-mono text-2xl tracking-wider">
                      {showCode ? loginDetails.code : '••••••'}
                    </code>
                    <button onClick={() => setShowCode(!showCode)} className="text-indigo-600 hover:underline text-sm">
                      {showCode ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => copyToClipboard(loginDetails.code)} className="text-green-600 hover:underline text-sm">
                      Copy
                    </button>
                  </div>
                </div>
                <div>
                  <strong>Expires:</strong>
                  <p className="mt-1">{new Date(loginDetails.expiresAt).toLocaleDateString()}</p>
                </div>
                <button onClick={onRefresh} className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition">
                  <RefreshCw size={16} className="inline mr-2" /> Regenerate Code
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Key size={48} className="mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No login credentials generated yet.</p>
                <button onClick={onRefresh} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                  Generate Code Now
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t p-4 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPanel;
