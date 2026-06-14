import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Key, Calendar, CheckCircle, Clock, Copy, Eye, EyeOff, Award, CreditCard, X, RefreshCw } from 'lucide-react';

const StudentDetailsPanel = ({ student, loginDetails, onClose, onRefresh }) => {
  const [showCode, setShowCode] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Student Details & Login Credentials</h3>
              <p className="text-indigo-200 text-sm">View registration information and generated access details</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="flex-1 p-6 border-r border-gray-200 bg-gray-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Registration Information</h4>
                <p className="text-xs text-gray-500">Details provided during sign-up</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <label className="text-xs font-semibold text-gray-500 uppercase">Full Name</label>
                <p className="text-gray-800 font-medium text-lg mt-1">{student.name || 'N/A'}</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <label className="text-xs font-semibold text-gray-500 uppercase">Email Address</label>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-gray-800 font-mono text-sm flex-1 break-all">{student.email || 'N/A'}</p>
                  <button onClick={() => copyToClipboard(student.email)} className="text-gray-400 hover:text-indigo-600">
                    <Copy size={16} />
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <label className="text-xs font-semibold text-gray-500 uppercase">Phone Number</label>
                <p className="text-gray-800 font-mono text-sm mt-1">{student.phone || 'N/A'}</p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <label className="text-xs font-semibold text-gray-500 uppercase">Address</label>
                <p className="text-gray-800 mt-1">{student.address || 'Not provided'}</p>
                {student.postCode && <p className="text-gray-800 text-sm mt-1">{student.postCode}</p>}
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <label className="text-xs font-semibold text-gray-500 uppercase">Training Route</label>
                <p className="text-gray-800 mt-1">
                  {student.trainingRoute === 'CUSTOM' ? 'Custom Selection' : 'Full Access (All Modules)'}
                </p>
              </div>

              <div className={`rounded-xl p-4 border ${student.paymentConfirmed ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                <label className="text-xs font-semibold text-gray-600 uppercase">Payment Status</label>
                <div className="flex items-center gap-2 mt-1">
                  {student.paymentConfirmed ? (
                    <>
                      <CheckCircle size={18} className="text-green-600" />
                      <span className="text-green-700 font-medium">Confirmed</span>
                    </>
                  ) : (
                    <>
                      <Clock size={18} className="text-yellow-600" />
                      <span className="text-yellow-700 font-medium">Pending</span>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border">
                <label className="text-xs font-semibold text-gray-500 uppercase">Registration Date</label>
                <p className="text-gray-800 mt-1">{new Date(student.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="flex-1 p-6 bg-indigo-50/30">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Key className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Login Credentials</h4>
                <p className="text-xs text-gray-500">Generated access details for assessment portal</p>
              </div>
            </div>

            {loginDetails ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Login Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm font-mono bg-gray-100 px-3 py-2 rounded-lg flex-1 break-all">{loginDetails.loginEmail}</code>
                    <button onClick={() => copyToClipboard(loginDetails.loginEmail)} className="text-gray-400 hover:text-indigo-600">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Access Code</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-2xl font-mono tracking-wider bg-gray-100 px-4 py-2 rounded-lg flex-1 text-center">
                      {showCode ? loginDetails.code : '••••••'}
                    </code>
                    <button onClick={() => setShowCode(!showCode)} className="text-gray-400 hover:text-indigo-600">
                      {showCode ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <button onClick={() => copyToClipboard(loginDetails.code)} className="text-gray-400 hover:text-indigo-600">
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Login Portal URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs font-mono bg-gray-100 px-3 py-2 rounded-lg flex-1 break-all">https://dsca-mta-quiz01.vercel.app</code>
                    <button onClick={() => copyToClipboard('https://dsca-mta-quiz01.vercel.app')} className="text-gray-400 hover:text-indigo-600">
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-sm text-blue-800 flex items-start gap-2">
                    <Clock size={16} className="flex-shrink-0 mt-0.5" />
                    <span>Code expires on {new Date(loginDetails.expiresAt).toLocaleDateString()}</span>
                  </p>
                </div>

                <button onClick={onRefresh} className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition">
                  <RefreshCw size={18} /> Regenerate / Resend Code
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Key size={32} className="text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No login credentials generated yet.</p>
                <p className="text-sm text-gray-400 mt-2">Please confirm payment first.</p>
                <button onClick={onRefresh} className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Generate Code Now
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPanel;
