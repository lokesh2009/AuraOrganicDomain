import React, { useState } from 'react';
import { AuthUser } from '../types';
import { 
  X, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  KeyRound, 
  CheckCircle2, 
  Lock, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  initialTab?: 'google' | 'phone' | 'admin';
}

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialTab = 'google',
}) => {
  const [activeTab, setActiveTab] = useState<'google' | 'phone' | 'admin'>(initialTab);

  // Google SSO State
  const [googleEmail, setGoogleEmail] = useState('lokeshsharma2009@gmail.com');
  const [googleName, setGoogleName] = useState('Lokesh Sharma');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Phone OTP State
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpStep, setOtpStep] = useState<'input-phone' | 'verify-otp'>('input-phone');
  const [generatedOtp, setGeneratedOtp] = useState('849201');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  // Admin Login State
  const [adminEmail, setAdminEmail] = useState('admin@auraorganic.in');
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');
  const [isAdminLoading, setIsAdminLoading] = useState(false);

  if (!isOpen) return null;

  // Handle Google SSO
  const handleGoogleSignIn = (customEmail?: string, customName?: string) => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      const email = customEmail || googleEmail;
      const name = customName || googleName || email.split('@')[0];
      const user: AuthUser = {
        id: `usr-google-${Date.now().toString(36)}`,
        name: name,
        email: email,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
        role: 'customer',
        method: 'google',
        loyaltyPoints: 1280,
        joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      setIsGoogleLoading(false);
      onLoginSuccess(user);
      onClose();
    }, 700);
  };

  // Handle Phone Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    if (cleanNumber.length < 8) {
      setOtpError('Please enter a valid phone number (at least 8-10 digits)');
      return;
    }
    setOtpError('');
    setIsSendingOtp(true);
    setTimeout(() => {
      // Generate a mock realistic 6-digit OTP
      const randomOtp = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(randomOtp);
      setIsSendingOtp(false);
      setOtpStep('verify-otp');
      setResendTimer(30);
    }, 600);
  };

  // Handle Phone Verify OTP
  const handleVerifyOtp = () => {
    const enteredCode = otpDigits.join('');
    if (enteredCode.length !== 6) {
      setOtpError('Please enter all 6 digits of the OTP');
      return;
    }
    if (enteredCode !== generatedOtp && enteredCode !== '123456') {
      setOtpError('Invalid OTP code. Please check the code or tap "Auto-fill Code".');
      return;
    }

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const user: AuthUser = {
      id: `usr-phone-${Date.now().toString(36)}`,
      name: `Member ${selectedCountryCode} ${cleanNumber.slice(-4)}`,
      phoneNumber: `${selectedCountryCode} ${cleanNumber}`,
      role: 'customer',
      method: 'phone',
      loyaltyPoints: 1280,
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    onLoginSuccess(user);
    onClose();
  };

  // Handle Digit Change
  const handleDigitChange = (index: number, val: string) => {
    const cleanVal = val.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setOtpError('');

    if (cleanVal && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Auto fill OTP helper
  const handleAutoFillOtp = () => {
    const digits = generatedOtp.split('');
    setOtpDigits(digits);
    setOtpError('');
  };

  // Handle Admin Sign In
  const handleAdminSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdminLoading(true);
    setAdminError('');

    setTimeout(() => {
      // Validate Admin Passcode (accepts AURA-ADMIN-2026 or admin123)
      if (adminPasscode.trim().toUpperCase() === 'AURA-ADMIN-2026' || adminPasscode.trim() === 'admin123' || adminPasscode.trim() === 'admin') {
        const adminUser: AuthUser = {
          id: 'admin-master-01',
          name: 'Aura Head Apothecary (Admin)',
          email: adminEmail,
          role: 'admin',
          method: 'admin',
          adminTitle: 'Senior Clinical Herbologist & Store Administrator',
          loyaltyPoints: 99999,
          joinedAt: 'Jan 01, 2026',
        };
        setIsAdminLoading(false);
        onLoginSuccess(adminUser);
        onClose();
      } else {
        setIsAdminLoading(false);
        setAdminError('Invalid Admin Passcode. Use passcode: AURA-ADMIN-2026');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#E8DFD5] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#88452D] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <ShieldCheck className="w-4 h-4 text-[#EAD3C6]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium tracking-tight text-white">
                Aura Botanical Pass
              </h3>
              <p className="text-[11px] text-[#EAD3C6]">
                Single Sign-On for Herbal Seekers & Store Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 border-b border-[#E8DFD5] bg-[#F4EFE7]/80 text-xs font-semibold text-[#7A7067]">
          <button
            type="button"
            onClick={() => {
              setActiveTab('google');
              setOtpError('');
            }}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'google'
                ? 'border-[#BA6E50] text-[#88452D] bg-[#FAF7F2] font-bold'
                : 'border-transparent hover:text-[#231E1B]'
            }`}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Gmail SSO</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('phone');
              setOtpError('');
            }}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'phone'
                ? 'border-[#BA6E50] text-[#88452D] bg-[#FAF7F2] font-bold'
                : 'border-transparent hover:text-[#231E1B]'
            }`}
          >
            <Phone className="w-3.5 h-3.5 text-[#65745E]" />
            <span>Mobile OTP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setAdminError('');
            }}
            className={`py-3 px-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'admin'
                ? 'border-[#88452D] text-[#88452D] bg-[#FAF7F2] font-bold'
                : 'border-transparent hover:text-[#231E1B]'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-[#88452D]" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto">
          {/* TAB 1: GMAIL SSO */}
          {activeTab === 'google' && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-full bg-white border border-[#E8DFD5] shadow-xs flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                </div>
                <h4 className="font-serif text-base font-semibold text-[#231E1B]">
                  Instant Google Single Sign-On
                </h4>
                <p className="text-xs text-[#5C524A] max-w-xs mx-auto">
                  Sign in instantly with your Google account to sync orders, unlock subscriber pricing, and earn 1,280 bonus points.
                </p>
              </div>

              {/* Detected Profile Quick Click */}
              <div className="bg-white rounded-xl p-3.5 border border-[#E8DFD5] shadow-xs hover:border-[#BA6E50] transition-all">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#7A7067] block mb-2">
                  Active Detected Account
                </span>
                <button
                  type="button"
                  onClick={() => handleGoogleSignIn('lokeshsharma2009@gmail.com', 'Lokesh Sharma')}
                  disabled={isGoogleLoading}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-[#FAF7F2] hover:bg-[#F3ECE4] border border-[#E8DFD5] text-left transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#88452D] text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      LS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#231E1B] flex items-center gap-1.5">
                        <span>Lokesh Sharma</span>
                        <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[10px] font-medium">Verified</span>
                      </div>
                      <span className="text-[11px] text-[#7A7067] font-mono">lokeshsharma2009@gmail.com</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#BA6E50] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Or enter any custom Google account */}
              <div className="space-y-3 pt-2">
                <div className="relative flex py-1 items-center">
                  <div className="flex-grow border-t border-[#E8DFD5]"></div>
                  <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-[#7A7067]">or use another account</span>
                  <div className="flex-grow border-t border-[#E8DFD5]"></div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#231E1B] block">Google Account Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7A7067] absolute left-3 top-3" />
                    <input
                      type="email"
                      value={googleEmail}
                      onChange={(e) => setGoogleEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8DFD5] rounded-lg text-xs text-[#231E1B] focus:outline-hidden focus:border-[#BA6E50]"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleGoogleSignIn()}
                  disabled={isGoogleLoading || !googleEmail.trim()}
                  className="w-full py-3 px-4 bg-[#231E1B] hover:bg-[#3D3531] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isGoogleLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Authenticating with Google...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                        <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                        <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                        <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>
              </div>

              {/* Security Note */}
              <p className="text-[11px] text-[#7A7067] text-center leading-relaxed">
                By signing in, you agree to Aura Organic’s Ethical Sourcing Terms and Privacy Policy. Secure encrypted single sign-on.
              </p>
            </div>
          )}

          {/* TAB 2: MOBILE OTP */}
          {activeTab === 'phone' && (
            <div className="space-y-4">
              {otpStep === 'input-phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs flex items-center justify-center">
                      <Phone className="w-6 h-6" />
                    </div>
                    <h4 className="font-serif text-base font-semibold text-[#231E1B]">
                      Mobile Number Authentication
                    </h4>
                    <p className="text-xs text-[#5C524A] max-w-xs mx-auto">
                      Receive an instant 6-digit SMS code to verify your phone number without remembering a password.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[#231E1B] block">Mobile Number</label>
                    <div className="flex gap-2">
                      <select
                        value={selectedCountryCode}
                        onChange={(e) => setSelectedCountryCode(e.target.value)}
                        className="py-2.5 px-2 bg-white border border-[#E8DFD5] rounded-lg text-xs font-medium text-[#231E1B] focus:outline-hidden focus:border-[#BA6E50] shrink-0"
                      >
                        {COUNTRY_CODES.map((c, i) => (
                          <option key={i} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>

                      <div className="relative flex-1">
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            setOtpError('');
                          }}
                          placeholder="98765 43210"
                          className="w-full px-3 py-2.5 bg-white border border-[#E8DFD5] rounded-lg text-xs text-[#231E1B] font-mono tracking-wider focus:outline-hidden focus:border-[#BA6E50]"
                          autoFocus
                        />
                      </div>
                    </div>
                    {otpError && (
                      <p className="text-[11px] text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{otpError}</span>
                      </p>
                    )}
                  </div>

                  {/* Pre-fill Quick Test Numbers */}
                  <div className="p-2.5 bg-white/80 rounded-lg border border-[#E8DFD5] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[#7A7067]">Quick fill test:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCountryCode('+91');
                        setPhoneNumber('9823019842');
                      }}
                      className="text-[11px] font-mono font-medium text-[#88452D] hover:underline cursor-pointer"
                    >
                      +91 98230 19842
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp || !phoneNumber.trim()}
                    className="w-full py-3 px-4 bg-[#BA6E50] hover:bg-[#A85A3D] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSendingOtp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Dispatching SMS Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* VERIFY OTP STEP */
                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-xs flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-serif text-base font-semibold text-[#231E1B]">
                      Enter Verification Code
                    </h4>
                    <p className="text-xs text-[#5C524A]">
                      Sent to <strong className="text-[#231E1B] font-mono">{selectedCountryCode} {phoneNumber}</strong>
                    </p>
                  </div>

                  {/* Demo OTP Banner with quick fill */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-amber-700 block">Simulated SMS Code</span>
                      <span className="font-mono text-base font-bold tracking-widest text-[#88452D]">{generatedOtp}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="px-2.5 py-1.5 bg-[#88452D] text-white rounded text-[11px] font-semibold hover:bg-[#6D3623] transition-colors cursor-pointer"
                    >
                      Auto-fill Code
                    </button>
                  </div>

                  {/* 6-Digit Boxes */}
                  <div className="space-y-2">
                    <div className="flex justify-between gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          id={`otp-box-${idx}`}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleDigitChange(idx, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !digit && idx > 0) {
                              const prev = document.getElementById(`otp-box-${idx - 1}`);
                              prev?.focus();
                            }
                          }}
                          className="w-12 h-12 text-center text-lg font-bold font-mono bg-white border border-[#E8DFD5] rounded-lg focus:border-[#BA6E50] focus:ring-2 focus:ring-[#BA6E50]/20 focus:outline-hidden"
                        />
                      ))}
                    </div>

                    {otpError && (
                      <p className="text-[11px] text-red-600 flex items-center gap-1 justify-center">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{otpError}</span>
                      </p>
                    )}
                  </div>

                  {/* Verify button */}
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="w-full py-3 px-4 bg-[#88452D] hover:bg-[#6D3623] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="flex items-center justify-between text-xs pt-1 text-[#7A7067]">
                    <button
                      type="button"
                      onClick={() => setOtpStep('input-phone')}
                      className="hover:underline cursor-pointer"
                    >
                      Change Phone Number
                    </button>
                    <span>
                      {resendTimer > 0 ? (
                        <span>Resend code in {resendTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
                            setGeneratedOtp(newOtp);
                            setResendTimer(30);
                          }}
                          className="text-[#88452D] font-semibold hover:underline cursor-pointer"
                        >
                          Resend OTP
                        </button>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ADMIN PORTAL */}
          {activeTab === 'admin' && (
            <form onSubmit={handleAdminSignIn} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#88452D]/10 text-[#88452D] border border-[#88452D]/20 shadow-xs flex items-center justify-center">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-serif text-base font-semibold text-[#231E1B]">
                  Apothecary Administrator Portal
                </h4>
                <p className="text-xs text-[#5C524A] max-w-xs mx-auto">
                  Access live customer order fulfillment, inventory stock levels, daily gross sales metrics, and product management.
                </p>
              </div>

              {/* Fast Fill Demo Key Helper */}
              <div className="p-3 bg-stone-100 rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-600 block">Default Master Passcode</span>
                  <span className="font-mono font-semibold text-[#88452D]">AURA-ADMIN-2026</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAdminEmail('admin@auraorganic.in');
                    setAdminPasscode('AURA-ADMIN-2026');
                    setAdminError('');
                  }}
                  className="px-2.5 py-1.5 bg-[#88452D] text-white rounded text-[11px] font-semibold hover:bg-[#6D3623] transition-colors cursor-pointer"
                >
                  Fill Admin Key
                </button>
              </div>

              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#231E1B] block">Administrator Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#7A7067] absolute left-3 top-3" />
                    <input
                      type="email"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      required
                      placeholder="admin@auraorganic.in"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8DFD5] rounded-lg text-xs text-[#231E1B] focus:outline-hidden focus:border-[#BA6E50]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#231E1B] block">Admin Security Passcode</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-[#7A7067] absolute left-3 top-3" />
                    <input
                      type="password"
                      value={adminPasscode}
                      onChange={(e) => {
                        setAdminPasscode(e.target.value);
                        setAdminError('');
                      }}
                      required
                      placeholder="Enter security key..."
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8DFD5] rounded-lg text-xs font-mono text-[#231E1B] focus:outline-hidden focus:border-[#BA6E50]"
                    />
                  </div>
                </div>

                {adminError && (
                  <p className="text-[11px] text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{adminError}</span>
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isAdminLoading || !adminPasscode.trim()}
                className="w-full py-3 px-4 bg-[#88452D] hover:bg-[#6D3623] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {isAdminLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Security Clearance...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Sign In to Admin Console</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
