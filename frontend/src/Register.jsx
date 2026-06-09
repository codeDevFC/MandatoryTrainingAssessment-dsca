import React, { useState } from 'react';
import { GraduationCap, Send, CreditCard, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';

const API_URL = 'http://localhost:3002';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', address: '', postCode: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hasViewedPayment, setHasViewedPayment] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const phoneRegex = /^\+44\d{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Phone must start with +44 and have 10 digits (e.g., +447123456789)');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSuccess(data.message);
        setIsSubmitted(true);
        setTimeout(() => setSuccess(''), 5000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewPaymentDetails = () => {
    setShowPayment(!showPayment);
    if (!hasViewedPayment) {
      setHasViewedPayment(true);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ firstName: '', lastName: '', email: '', phone: '', address: '', postCode: '' });
    setSuccess(null);
    setError(null);
    setShowPayment(false);
    setHasViewedPayment(false);
  };

  return (
     <>
      <Header />
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <GraduationCap className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">COHT Training Registration</h1>
          <p className="text-slate-500 text-sm mt-1">Register for your mandatory training assessment</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <AlertCircle className="inline w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {/* Success Message after submission */}
        {isSubmitted && success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
            <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Registration Submitted!</h3>
            <p className="text-green-700 mb-3">{success}</p>
            <p className="text-sm text-green-600">Your details have been sent to the admin.</p>
          </div>
        )}

        {/* Registration Form - Hidden after successful submission */}
        {!isSubmitted && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                <input 
                  type="text" 
                  name="firstName" 
                  value={formData.firstName} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                <input 
                  type="text" 
                  name="lastName" 
                  value={formData.lastName} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
              <input 
                type="tel" 
                name="phone" 
                value={formData.phone} 
                onChange={handleChange} 
                placeholder="+447123456789" 
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
              <p className="text-xs text-slate-500 mt-1">Must start with +44 (e.g., +447123456789)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Street Address *</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Post Code *</label>
              <input 
                type="text" 
                name="postCode" 
                value={formData.postCode} 
                onChange={handleChange} 
                required 
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
              >
                <Send size={18} />
                {loading ? 'Submitting...' : 'SEND'}
              </button>
              
              <button 
                type="button" 
                onClick={handleViewPaymentDetails} 
                className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
              >
                <CreditCard size={18} />
                Click for Payment Details
              </button>
            </div>
          </form>
        )}

        {/* SENT button after submission */}
        {isSubmitted && (
          <div className="flex gap-3 pt-4">
            <button 
              disabled 
              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 opacity-75 cursor-not-allowed"
            >
              <CheckCircle size={18} />
              SENT ✓
            </button>
            
            <button 
              type="button" 
              onClick={handleViewPaymentDetails} 
              className="flex-1 bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              Click for Payment Details
            </button>
          </div>
        )}

        {/* Payment Details Section */}
        {showPayment && (
          <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-bold text-slate-800 mb-2">💳 Payment Details</h3>
            <p className="text-sm text-slate-600"><strong>Asunik Care Services Ltd</strong></p>
            <p className="text-sm text-slate-600">Sort code: <strong>203721</strong></p>
            <p className="text-sm text-slate-600">Account: <strong>43749215</strong></p>
            
            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-xs text-yellow-800 mb-2">
                📝 Instructions: 
              </p>
              <ol className="text-xs text-yellow-800 list-decimal list-inside space-y-1">
                <li>Use the bank details above to make your payment</li>
                <li>After completing payment, click the WhatsApp button below</li>
                <li>Send "CONFIRM PAYMENT - [Your Name]" to notify admin</li>
                <li>You will receive your login credentials via WhatsApp</li>
              </ol>
            </div>

            {/* WhatsApp Link - Only shows when payment details are viewed */}
            {hasViewedPayment && (
              <div className="mt-4 pt-3 border-t border-slate-200">
                <a 
                  href={`https://wa.me/447446180817?text=I%20have%20completed%20payment%20for%20COHT%20Training%20registration.%0A%0AName:%20${encodeURIComponent(formData.firstName + ' ' + formData.lastName)}%0AEmail:%20${encodeURIComponent(formData.email)}%0APhone:%20${encodeURIComponent(formData.phone)}%0A%0APlease%20confirm%20payment%20and%20send%20my%20login%20credentials.`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full justify-center"
                >
                  <MessageCircle size={18} />
                  📱 Click to Confirm Payment on WhatsApp
                </a>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  After payment, click here to notify admin via WhatsApp
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-indigo-600 hover:underline">← Back to Login</a>
        </div>

        {/* New Registration Button */}
        {isSubmitted && (
          <div className="mt-4 text-center">
            <button 
              onClick={handleReset}
              className="text-sm text-slate-500 hover:text-slate-700 underline"
            >
              Need to register another student? Click here
            </button>
          </div>
        )}
      </div>
    </div>
          <Footer />
    </>
  );
}

export default Register;
  
