import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Key, Calendar, CheckCircle, Clock, Copy, Eye, EyeOff } from 'lucide-react';

const StudentDetailsPanel = ({ student, loginDetails, onClose, onRefresh }) => {
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!student) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 px-6 py-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-white">Student Details & Login Credentials</h3>
          <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl">&times;</button>
        </div>
        
        <div className="flex flex-col md:flex-row overflow-y-auto max-h-[calc(90vh-70px)]">
          {/* Left Column - Student Details */}
          <div className="flex-1 p-6 border-r border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Student Information</h4>
                <p className="text-xs text-gray-500">Details provided during registration</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                <div className="flex items-center gap-2 mt-1">
                  <User size={16} className="text-gray-400" />
                  <p className="text-gray-800 font-medium">{student.name || 'N/A'}</p>
                </div>
              </div>
              
              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail size={16} className="text-gray-400" />
                  <p className="text-gray-800 font-mono text-sm">{student.email || 'N/A'}</p>
                  <button onClick={() => copyToClipboard(student.email, 'Email')} className="ml-auto text-gray-400 hover:text-indigo-600">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              
              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone size={16} className="text-gray-400" />
                  <p className="text-gray-800 font-mono text-sm">{student.phone || 'N/A'}</p>
                  {student.phone && (
                    <a href={`https://wa.me/${student.phone.replace('+', '')}`} target="_blank" className="ml-auto text-green-600 hover:text-green-700">
                      📱 WhatsApp
                    </a>
                  )}
                </div>
              </div>
              
              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Street Address</label>
                <div className="flex items-start gap-2 mt-1">
                  <MapPin size={16} className="text-gray-400 mt-0.5" />
                  <p className="text-gray-800 flex-1">{student.address || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Post Code</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin size={16} className="text-gray-400" />
                  <p className="text-gray-800 uppercase">{student.postCode || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Training Route</label>
                <div className="flex items-center gap-2 mt-1">
                  {student.trainingRoute === 'CUSTOM' ? '🎯 Custom Selection' : '📚 Full Access'}
                </div>
              </div>
              
              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Status</label>
                <div className="flex items-center gap-2 mt-1">
                  {student.paymentConfirmed ? (
                    <>
                      <CheckCircle size={16} className="text-green-600" />
                      <span className="text-green-700 font-medium">Confirmed</span>
                      <span className="text-xs text-gray-500 ml-2">
                        {student.paymentConfirmedAt ? new Date(student.paymentConfirmedAt).toLocaleDateString() : ''}
                      </span>
                    </>
                  ) : (
                    <>
                      <Clock size={16} className="text-yellow-600" />
                      <span className="text-yellow-700 font-medium">Pending</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="border-b pb-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Registration Date</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar size={16} className="text-gray-400" />
                  <p className="text-gray-800">{new Date(student.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Column - Login Credentials */}
          <div className="flex-1 p-6 bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Key className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Login Credentials</h4>
                <p className="text-xs text-gray-500">Generated login details for assessment portal</p>
              </div>
            </div>
            
            {loginDetails ? (
              <div className="space-y-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Login Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Mail size={16} className="text-green-600" />
                    <code className="text-sm font-mono bg-gray-100 px-3 py-1.5 rounded-lg flex-1 break-all">
                      {loginDetails.loginEmail || student.email}
                    </code>
                    <button 
                      onClick={() => copyToClipboard(loginDetails.loginEmail || student.email, 'Login Email')}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Access Code</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Key size={16} className="text-green-600" />
                    <div className="relative flex-1">
                      <code className="text-xl font-mono tracking-wider bg-gray-100 px-4 py-2 rounded-lg block text-center">
                        {showCode ? loginDetails.code : '••••••'}
                      </code>
                    </div>
                    <button 
                      onClick={() => setShowCode(!showCode)}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      {showCode ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button 
                      onClick={() => copyToClipboard(loginDetails.code, 'Access Code')}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-4 shadow-sm border border-green-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Login URL</label>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1">
                      <code className="text-xs font-mono bg-gray-100 px-3 py-1.5 rounded-lg block break-all">
                        https://dsca-mta-quiz01.vercel.app
                      </code>
                    </div>
                    <button 
                      onClick={() => copyToClipboard('https://dsca-mta-quiz01.vercel.app', 'Login URL')}
                      className="text-gray-400 hover:text-indigo-600"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                  <p className="text-xs text-blue-800 flex items-start gap-2">
                    <span>ℹ️</span>
                    <span>Code expires in 30 days from generation. Please ensure the student receives these credentials via WhatsApp.</span>
                  </p>
                </div>
                
                {loginDetails.whatsappLink && (
                  <a 
                    href={loginDetails.whatsappLink} 
                    target="_blank"
                    className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                  >
                    📱 Send Credentials via WhatsApp
                  </a>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Key size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No login credentials generated yet.</p>
                <p className="text-xs text-gray-400 mt-2">Please confirm payment and generate code first.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailsPanel;
