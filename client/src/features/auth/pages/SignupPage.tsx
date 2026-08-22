import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { BRAND } from '@/lib/brand';
import {
  Eye, EyeOff, Loader2, Lock, User, Mail,
  UserCircle, Shield, Zap, Sparkles, ShieldCheck
} from 'lucide-react';

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup, isAuthenticated, isLoading: authLoading } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      await signup({
        firstName,
        lastName,
        email,
        username,
        password,
      });
      navigate('/dashboard');
    } catch (err: any) {
      if (err.response?.data?.details && err.response.data.details.length > 0) {
        const firstError = err.response.data.details[0];
        setError(`${firstError.field}: ${firstError.message}`);
      } else {
        setError(err.response?.data?.error || err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50/50 to-purple-50/50 relative overflow-x-hidden px-4 py-8 sm:py-12">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        {/* Left Side - Branding Section (compact on mobile, prominent on desktop) */}
        <div className="w-full lg:flex-1 flex flex-col items-center justify-center text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full blur-2xl opacity-25 animate-pulse" />
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 lg:w-48 lg:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl shadow-blue-500/20 bg-white flex items-center justify-center">
              <img
                src={BRAND.iconSrc}
                alt="Suryadhi"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1 sm:mb-2">
              {BRAND.systemAbbr}
            </h1>
            <p className="text-xs sm:text-base text-slate-600 font-medium max-w-xs sm:max-w-md mx-auto">
              {BRAND.systemName}
            </p>

            {/* Feature badges (hidden on smallest screens, clean on tablet/desktop) */}
            <div className="hidden sm:flex flex-row lg:flex-col gap-2.5 items-center justify-center mt-5">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 bg-white/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200/60 shadow-xs">
                <Shield className="h-3.5 w-3.5 text-blue-500" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 bg-white/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200/60 shadow-xs">
                <Zap className="h-3.5 w-3.5 text-indigo-500" />
                <span>Fast & Connected</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 bg-white/70 backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-slate-200/60 shadow-xs">
                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                <span>Smart Multi-Tenant ERP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Card */}
        <div className="w-full lg:flex-1 max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xl shadow-blue-500/10 p-5 sm:p-7">
            <div className="mb-5">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Create Account</h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Register a new administrator or staff account
              </p>
            </div>

            {error && (
              <div className="mb-4 px-3.5 py-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm leading-relaxed flex items-start gap-2">
                <span className="text-red-500 font-bold shrink-0">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john.doe@example.com"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="johndoe"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-9 pr-9 py-2 rounded-xl bg-slate-50/50 border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-md transition-all text-sm mt-3"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-xs sm:text-sm text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors underline-offset-2 hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>JWT Secured • {BRAND.copyright}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}