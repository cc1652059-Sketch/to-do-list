import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckSquare, Lock, Mail, User as UserIcon, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle2 } from 'lucide-react';
import { User } from '../types';
import { INITIAL_USER } from '../utils/storage';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onContinueAsGuest: () => void;
}

export function LoginPage({ onLogin, onContinueAsGuest }: LoginPageProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !email.includes('@')) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    if (isSignUp && !name.trim()) {
      setErrorMessage('Please enter your name');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: User = {
        id: 'usr-' + Date.now(),
        name: isSignUp ? name.trim() : (email.split('@')[0] ? email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Task Master'),
        email: email.trim(),
      };
      onLogin(user);
    }, 400);
  };

  const handleDemoLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(INITIAL_USER);
    }, 300);
  };

  const handleForgotPassword = () => {
    if (!email) {
      setEmail('demo@student.edu');
    }
    setForgotSent(true);
    setTimeout(() => setForgotSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] flex flex-col justify-between px-4 py-8 sm:py-12 selection:bg-[#2F4A3D]/15 selection:text-[#1A1A1A]">
      {/* Header bar */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2F4A3D] text-white flex items-center justify-center shadow-xs">
            <CheckSquare className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-base font-bold tracking-tight text-[#1A1A1A]">Tasks</span>
        </div>

        <button
          type="button"
          onClick={onContinueAsGuest}
          className="text-xs font-medium text-[#73716B] hover:text-[#1A1A1A] px-2.5 py-1.5 rounded-lg hover:bg-[#EAE8E3]/60 transition-colors"
        >
          Skip to app →
        </button>
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
        className="w-full max-w-md mx-auto my-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1A1A]">
            {isSignUp ? 'Create your space' : 'Welcome back'}
          </h1>
          <p className="text-sm text-[#73716B] mt-2 max-w-xs mx-auto">
            {isSignUp
              ? 'A distraction-free home for your daily priorities and notes.'
              : 'Sign in to access your daily tasks, upcoming goals, and progress.'}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2DFD7] p-6 sm:p-8 shadow-xs">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 p-1 mb-6 rounded-xl bg-[#EAE8E3]/70 border border-[#E2DFD7]/80">
            <button
              type="button"
              id="auth-tab-signin"
              onClick={() => {
                setIsSignUp(false);
                setErrorMessage('');
              }}
              className={`relative py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                !isSignUp ? 'text-[#1A1A1A]' : 'text-[#73716B] hover:text-[#1A1A1A]'
              }`}
            >
              Sign In
              {!isSignUp && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
            </button>
            <button
              type="button"
              id="auth-tab-signup"
              onClick={() => {
                setIsSignUp(true);
                setErrorMessage('');
              }}
              className={`relative py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                isSignUp ? 'text-[#1A1A1A]' : 'text-[#73716B] hover:text-[#1A1A1A]'
              }`}
            >
              Create Account
              {isSignUp && (
                <motion.div
                  layoutId="authTabIndicator"
                  className="absolute inset-0 bg-white rounded-lg shadow-xs -z-10"
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                />
              )}
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-[#FBE8E7] border border-[#F4C8C5] text-xs font-medium text-[#9C413D]">
              {errorMessage}
            </div>
          )}

          {/* Reset password notification */}
          {forgotSent && (
            <div className="mb-4 p-3 rounded-xl bg-[#EBF2EE] border border-[#CEE0D7] text-xs font-medium text-[#3E6554] flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              Password reset link sent to your email.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (for signup) */}
            <AnimatePresence initial={false}>
              {isSignUp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8B83]" />
                    <input
                      type="text"
                      id="signup-name-input"
                      placeholder="e.g. Alex Rivera"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-[#F8F7F4] border border-[#E2DFD7] text-[#1A1A1A] placeholder:text-[#8E8B83] focus:outline-none focus:border-[#2F4A3D] focus:ring-2 focus:ring-[#2F4A3D]/10 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email field */}
            <div>
              <label className="block text-xs font-medium text-[#1A1A1A] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8B83]" />
                <input
                  type="email"
                  id="auth-email-input"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl bg-[#F8F7F4] border border-[#E2DFD7] text-[#1A1A1A] placeholder:text-[#8E8B83] focus:outline-none focus:border-[#2F4A3D] focus:ring-2 focus:ring-[#2F4A3D]/10 transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-[#1A1A1A]">
                  Password
                </label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-[#73716B] hover:text-[#2F4A3D] transition-colors"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8E8B83]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="auth-password-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-[#F8F7F4] border border-[#E2DFD7] text-[#1A1A1A] placeholder:text-[#8E8B83] focus:outline-none focus:border-[#2F4A3D] focus:ring-2 focus:ring-[#2F4A3D]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8E8B83] hover:text-[#1A1A1A]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-[#2F4A3D] focus:ring-[#2F4A3D]/30 accent-[#2F4A3D]"
                />
                <span className="text-xs text-[#73716B]">Remember on this device</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="auth-submit-btn"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-[#2F4A3D] text-white text-sm font-medium hover:bg-[#253B30] active:scale-[0.99] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#2F4A3D]/40 disabled:opacity-70 shadow-xs"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#EAE8E3]" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider">
              <span className="bg-white px-2 text-[#8E8B83]">Or continue with</span>
            </div>
          </div>

          {/* Demo Login Quick Action */}
          <button
            type="button"
            id="demo-login-btn"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#EAE8E3]/60 hover:bg-[#EAE8E3] border border-[#E2DFD7] text-xs font-medium text-[#1A1A1A] transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#2F4A3D]" />
            <span>Quick Demo Profile (Alex Rivera)</span>
          </button>
        </div>

        {/* Guest access hint */}
        <div className="text-center mt-5">
          <button
            type="button"
            onClick={onContinueAsGuest}
            className="text-xs text-[#73716B] hover:text-[#1A1A1A] transition-colors underline decoration-[#D8D5CC] underline-offset-4"
          >
            Continue as Guest without saving account
          </button>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="w-full max-w-md mx-auto text-center text-xs text-[#8E8B83] mt-8">
        Minimal & Calm Productivity • 60/30/10 Aesthetic
      </div>
    </div>
  );
}
