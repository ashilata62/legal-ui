import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, Scale, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { useToast } from '../../../components/ui/Toast';
import { Button } from '../../../components/ui/Button';

// 5 Client-Specified User Roles for 1-Click Access
const CLIENT_ROLES_QUICK_LOGIN = [
  { id: 'usr-1', role: 'super_admin', label: 'Super Admin', name: 'Eleanor H., Esq.', email: 'e.heugly@utahslawyers.com' },
  { id: 'usr-2', role: 'attorney', label: 'Attorney', name: 'Thomas B., Esq.', email: 't.bludworth@utahslawyers.com' },
  { id: 'usr-4', role: 'paralegal', label: 'Paralegal / Staff', name: 'Marcus Vance', email: 'm.vance@utahslawyers.com' },
  { id: 'usr-5', role: 'billing', label: 'Billing Staff', name: 'Rachel Adams', email: 'r.adams@utahslawyers.com' },
  { id: 'usr-6', role: 'supervisor', label: 'Supervisor', name: 'David S., Esq.', email: 'd.sterling@utahslawyers.com' },
];

export function Login() {
  const navigate = useNavigate();
  const { login, allUsers } = useAuth();
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
    <div className="min-h-screen md:h-screen w-full overflow-x-hidden md:overflow-hidden flex flex-col md:flex-row bg-white select-none">
      {/* LEFT PANEL: Full-Bleed Deep Navy Brand Showcase (Edge-to-Edge Desktop & Tablet) */}
      <div className="hidden md:flex md:w-[44%] lg:w-[40%] xl:w-[36%] bg-[#06244B] text-white flex-col justify-between p-5 sm:p-6 lg:p-8 relative overflow-hidden flex-shrink-0">
        {/* Subtle decorative background circles */}
        <div className="absolute -right-16 -bottom-16 w-64 h-64 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-[#A4432B]/10 pointer-events-none" />
        <div className="absolute right-1/4 top-1/3 w-32 h-32 rounded-full bg-white/[0.02] pointer-events-none" />

        {/* Top: Firm Identity */}
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-[#A4432B] flex items-center justify-center font-serif font-bold text-white text-xl shadow-md flex-shrink-0">
              HB
            </div>
            <div>
              <h1 className="font-serif font-bold text-base sm:text-lg tracking-wider text-[#F5F0E5] leading-tight">
                HEUGLY &amp; BLUDWORTH
              </h1>
              <span className="text-[10px] tracking-widest text-[#B8C0C4] font-semibold uppercase block mt-0.5">
                ATTORNEYS AT LAW
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#0B356D] space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A4432B] uppercase tracking-wider">
              <Scale className="w-3.5 h-3.5" />
              <span>Legal Management SaaS</span>
            </div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#F5F0E5] leading-snug">
              Integrated Practice &amp; Litigation Workspace
            </h2>
            <p className="text-xs text-[#B8C0C4] leading-relaxed max-w-sm">
              Confidential workspace for firm attorneys, litigation paralegals, master court calendar tracking, and CosmoLex accounting ledger synchronization.
            </p>
          </div>

          <div className="space-y-2 pt-2 text-xs text-[#B8C0C4]">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#287A55] flex-shrink-0" />
              <span>Nine Practice Area Case Dockets</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#287A55] flex-shrink-0" />
              <span>Utah RPC 1.7 Conflict Clearance Workflow</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#287A55] flex-shrink-0" />
              <span>Official CosmoLex Accounting Bridge</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#287A55] flex-shrink-0" />
              <span>Role-Based Privilege &amp; Ethical Boundaries</span>
            </div>
          </div>
        </div>

        {/* Bottom: Utah RPC 1.6 Privileged Badge */}
        <div className="pt-6 border-t border-[#0B356D] relative z-10 mt-6">
          <div className="flex items-center gap-2 text-[11px] text-[#B8C0C4]">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Utah RPC 1.6 Privileged &amp; Confidential Work Product</span>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Full-Bleed Sign-In Form (Edge-to-Edge) */}
      <div className="w-full md:w-[56%] lg:w-[60%] xl:w-[64%] bg-[#F5F0E5]/50 flex flex-col justify-between p-4 sm:p-6 lg:p-8 h-full overflow-y-auto">
        {/* Mobile-only compact brand header */}
        <div className="flex items-center justify-between md:hidden pb-3 border-b border-[#D9D6CF]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-[#A4432B] flex items-center justify-center font-serif font-bold text-white text-xs">
              HB
            </div>
            <span className="font-serif font-bold text-sm tracking-wide text-[#06244B]">
              HEUGLY &amp; BLUDWORTH
            </span>
          </div>
          <span className="text-[10px] text-[#A4432B] font-bold uppercase">Legal Portal</span>
        </div>

        {/* Vertically centered form container */}
        <div className="max-w-md w-full mx-auto my-auto py-2">
          <div className="mb-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-1.5 text-[11px] text-[#667085] hover:text-[#06244B] font-medium mb-2 cursor-pointer transition-colors"
            >
              <span>&larr; Return to Firm Overview</span>
            </button>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#06244B]">
              Sign In
            </h2>
            <p className="text-xs text-[#667085] mt-1">
              Enter your firm credentials to access the legal management workspace.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#202A35] mb-1">
                Work Email Address
              </label>
              <div className="relative rounded">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="attorney@utahslawyers.com"
                  className="block w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-[#D9D6CF] rounded text-[#202A35] placeholder-[#667085]/60 focus:outline-none focus:border-[#06244B] focus:ring-1 focus:ring-[#06244B] transition-colors shadow-xs"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#202A35]">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-[11px] text-[#A4432B] hover:underline font-semibold cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative rounded">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#667085]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-10 py-2 text-xs sm:text-sm bg-white border border-[#D9D6CF] rounded text-[#202A35] focus:outline-none focus:border-[#06244B] focus:ring-1 focus:ring-[#06244B] transition-colors shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#667085] hover:text-[#06244B] cursor-pointer z-10"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#A4432B] focus:ring-[#A4432B] border-[#D9D6CF] cursor-pointer"
                />
                <span className="text-[11px] text-[#667085]">Remember this workstation (30 days)</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full mt-1.5 font-semibold shadow-md py-2 sm:py-2.5 text-xs sm:text-sm"
            >
              <span>Sign In to Legal Portal</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>

          {/* Quick Demo Sign-in Shortcuts (Exact 5 Client Roles) */}
          <div className="mt-3 pt-2.5 border-t border-[#D9D6CF]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold text-[#667085] uppercase tracking-wider">
                Quick Sign-In (5 Client Roles):
              </span>
              <span className="text-[10px] text-[#A4432B] font-semibold">1-Click Fast Access</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-1.5">
              {CLIENT_ROLES_QUICK_LOGIN.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickLogin(u.email)}
                  title={`Sign in as ${u.name} (${u.label})`}
                  className="text-xs p-1.5 rounded bg-white hover:bg-[#FAF7F0] hover:border-[#A4432B] text-[#06244B] border border-[#D9D6CF] font-medium transition-all text-left flex flex-col justify-between group shadow-2xs cursor-pointer"
                >
                  <span className="text-[9px] text-[#A4432B] font-bold uppercase tracking-wider block truncate">
                    {u.label}
                  </span>
                  <span className="truncate font-semibold text-[11px] text-[#202A35] group-hover:text-[#06244B]">
                    {u.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom security watermark */}
        <div className="w-full text-center py-1 text-[10px] text-[#667085]">
          <span>Protected by 256-Bit SSL Encryption • Utah Third Judicial District Court &amp; Bar Approved Standards</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#06244B]/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg p-6 max-w-md w-full border border-[#D9D6CF] shadow-2xl space-y-4 text-xs">
            <h3 className="font-serif font-bold text-lg text-[#06244B]">Password Reset Instructions</h3>
            <p className="text-[#667085] leading-relaxed">
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
