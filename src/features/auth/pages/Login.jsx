import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Scale,
  ArrowRight,
  CheckCircle2,
  Building,
  UserCheck,
  KeyRound,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../components/ui/Toast';
import { Button } from '../../../components/ui/Button';

// 5 Client-Specified User Roles for 1-Click Fast Access
const CLIENT_ROLES_QUICK_LOGIN = [
  { id: 'usr-1', role: 'super_admin', label: 'Super Admin', name: 'Eleanor Heugly, Esq.', title: 'Managing Partner', email: 'e.heugly@utahslawyers.com', color: 'border-amber-300 bg-amber-50/60 text-amber-900' },
  { id: 'usr-2', role: 'attorney', label: 'Attorney', name: 'Thomas Bludworth, Esq.', title: 'Senior Litigator', email: 't.bludworth@utahslawyers.com', color: 'border-blue-300 bg-blue-50/60 text-blue-900' },
  { id: 'usr-6', role: 'supervisor', label: 'Supervisor', name: 'David Sterling, Esq.', title: 'Review Counsel', email: 'd.sterling@utahslawyers.com', color: 'border-purple-300 bg-purple-50/60 text-purple-900' },
  { id: 'usr-4', role: 'paralegal', label: 'Paralegal', name: 'Marcus Vance', title: 'Litigation Paralegal', email: 'm.vance@utahslawyers.com', color: 'border-emerald-300 bg-emerald-50/60 text-emerald-900' },
  { id: 'usr-5', role: 'billing', label: 'Billing Staff', name: 'Rachel Adams', title: 'Trust Accountant', email: 'r.adams@utahslawyers.com', color: 'border-rose-300 bg-rose-50/60 text-rose-900' },
];

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('e.heugly@utahslawyers.com');
  const [password, setPassword] = useState('UtahLaw@2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      addToast('Please enter your work email.', 'error');
      return;
    }

    const res = login(email);
    if (!res.success) {
      addToast(res.message, 'error');
      return;
    }

    addToast(`Signed in successfully as ${res.user.name} (${res.user.title}).`, 'success');
    navigate('/dashboard');
  };

  const handleQuickLogin = (userEmail) => {
    const res = login(userEmail);
    if (!res.success) {
      addToast(res.message, 'error');
      return;
    }

    addToast(`Welcome back, ${res.user.name}.`, 'success');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#F8F9FA] select-none">
      {/* LEFT PANEL: Deep Navy Brand Showcase */}
      <div className="hidden md:flex md:w-[42%] lg:w-[38%] xl:w-[35%] bg-[#06244B] text-white flex-col justify-between p-8 lg:p-12 relative overflow-hidden flex-shrink-0">
        {/* Subtle decorative geometry */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/[0.03] pointer-events-none" />
        <div className="absolute -left-16 -top-16 w-64 h-64 rounded-full bg-[#A4432B]/15 pointer-events-none" />
        <div className="absolute right-1/4 top-1/2 w-48 h-48 rounded-full bg-blue-500/[0.04] pointer-events-none" />

        {/* Top: Firm Identity */}
        <div className="relative z-10 space-y-8">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#A4432B] flex items-center justify-center font-serif font-bold text-white text-xl shadow-lg border border-white/10 flex-shrink-0">
              HB
            </div>
            <div>
              <h1 className="font-serif font-bold text-lg tracking-wider text-[#F5F0E5] leading-tight">
                HEUGLY &amp; BLUDWORTH
              </h1>
              <span className="text-[10px] tracking-widest text-[#B8C0C4] font-semibold uppercase block mt-0.5">
                ATTORNEYS AT LAW • SALT LAKE CITY
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-semibold text-[#F5F0E5] tracking-wide">
              <Scale className="w-3.5 h-3.5 text-[#A4432B]" />
              <span>Legal Management SaaS</span>
            </div>
            <h2 className="font-serif font-bold text-2xl lg:text-3xl text-white leading-snug">
              Integrated Practice &amp; Litigation Workspace
            </h2>
            <p className="text-xs lg:text-sm text-slate-300 leading-relaxed">
              Confidential operational portal for firm partners, trial attorneys, litigation paralegals, and IOLTA fiduciary accounting.
            </p>
          </div>

          <div className="space-y-3 pt-2 text-xs text-slate-200">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Full Civil, PI, Family &amp; Probate Dockets</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Utah RPC 1.7 Conflict Clearance &amp; Ethical Walls</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Automated 3-Way Trust Reconciliation</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Strict Role-Based Multi-User Privilege Access</span>
            </div>
          </div>
        </div>

        {/* Bottom: Utah RPC 1.6 Privileged Badge */}
        <div className="pt-6 border-t border-white/10 relative z-10 mt-8">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Utah RPC 1.6 Privileged &amp; Confidential Work Product</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Centered Professional Card */}
      <div className="w-full md:w-[58%] lg:w-[62%] xl:w-[65%] flex flex-col justify-between p-6 sm:p-10 lg:p-12 overflow-y-auto">
        {/* Mobile Header */}
        <div className="flex items-center justify-between md:hidden pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#A4432B] flex items-center justify-center font-serif font-bold text-white text-sm">
              HB
            </div>
            <div>
              <span className="font-serif font-bold text-sm tracking-wide text-[#06244B] block leading-tight">
                HEUGLY &amp; BLUDWORTH
              </span>
              <span className="text-[10px] text-[#667085]">Attorneys at Law</span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-[#06244B] text-white px-2 py-0.5 rounded">
            LEGAL PORTAL
          </span>
        </div>

        {/* Center Container: Card Wrapper */}
        <div className="max-w-xl w-full mx-auto my-auto py-6">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-7 sm:p-9 space-y-6">
            {/* Top Navigation & Headings */}
            <div>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 text-xs text-[#667085] hover:text-[#06244B] font-medium mb-3 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Firm Overview</span>
              </button>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#06244B]">
                Sign In
              </h2>
              <p className="text-xs sm:text-sm text-[#667085] mt-1">
                Enter your firm credentials to access your active cases and files.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#344054] mb-1.5">
                  Work Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="attorney@utahslawyers.com"
                    className="block w-full pl-10 pr-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#101828] placeholder-slate-400 focus:outline-none focus:border-[#06244B] focus:ring-2 focus:ring-[#06244B]/10 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#344054]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(true)}
                    className="text-xs text-[#A4432B] hover:underline font-semibold cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg text-[#101828] focus:outline-none focus:border-[#06244B] focus:ring-2 focus:ring-[#06244B]/10 transition-all shadow-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-[#A4432B] focus:ring-[#A4432B] border-slate-300 cursor-pointer"
                  />
                  <span className="text-xs text-[#475467]">Remember this workstation (30 days)</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 bg-[#A4432B] hover:bg-[#8D3823] text-white font-bold rounded-lg text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In to Legal Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick 1-Click Fast Access Section */}
            <div className="pt-5 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#475467] uppercase tracking-wider">
                  Quick Sign-In (5 Client Roles):
                </span>
                <span className="text-[11px] font-semibold text-[#A4432B] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  1-Click Fast Access
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {CLIENT_ROLES_QUICK_LOGIN.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => handleQuickLogin(u.email)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer hover:shadow-md hover:scale-[1.01] ${u.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider">
                        {u.label}
                      </span>
                      <ArrowRight className="w-3 h-3 opacity-60" />
                    </div>
                    <p className="font-bold text-xs text-[#101828] mt-1">
                      {u.name}
                    </p>
                    <p className="text-[10px] opacity-75 truncate">
                      {u.title}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Security Watermark */}
        <div className="w-full text-center py-2 text-xs text-[#667085]">
          <span>Protected by 256-Bit SSL Encryption • Utah Third Judicial District Court &amp; Bar Approved Standards</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 text-xs">
            <h3 className="font-serif font-bold text-lg text-[#06244B]">Password Reset Instructions</h3>
            <p className="text-[#475467] leading-relaxed">
              For law firm compliance, password reset tokens are dispatched via internal IT administrator authorization. Please contact the Managing Partner or IT Support at <strong>support@utahslawyers.com</strong>.
            </p>
            <div className="flex justify-end pt-2">
              <Button size="sm" variant="primary" onClick={() => setIsForgotOpen(false)}>
                Back to Sign In
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
