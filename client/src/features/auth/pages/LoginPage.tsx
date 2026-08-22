import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useUIStore } from '@/store';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/api-client';
import { BRAND } from '@/lib/brand';
import {
  Eye, EyeOff, Loader2, Lock, User,
  Calendar, ChevronRight, ArrowLeft, ShieldCheck
} from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { setAcademicYear, setAcademicYearId, setActivePortal } = useUIStore();

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Three-step login flow: 'login' | 'systemSelect' | 'academicYear'
  const [step, setStep] = useState<'login' | 'systemSelect' | 'academicYear'>('login');
  const [selectedPortal, setSelectedPortal] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [academicYears, setAcademicYears] = useState<string[]>([]);
  const [academicYearsRaw, setAcademicYearsRaw] = useState<any[]>([]);

  const fetchAcademicYears = async () => {
    try {
      const res = await apiClient.get('/lookups/academic-years');
      if (res.data.success && res.data.data?.length > 0) {
        setAcademicYearsRaw(res.data.data);
        const labels = res.data.data.map((y: any) => y.label);
        setAcademicYears(labels);
        const current = res.data.data.find((y: any) => y.isCurrent);
        if (current) {
          setSelectedYear(current.label);
        } else {
          setSelectedYear(labels[0]);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch academic years lookup, using default list');
      setAcademicYears(['Apr 26 - Mar 27', 'Apr 25 - Mar 26']);
      setAcademicYearsRaw([
        { id: 'ay1', label: 'Apr 26 - Mar 27' },
        { id: 'ay0', label: 'Apr 25 - Mar 26' }
      ]);
      setSelectedYear('Apr 26 - Mar 27');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(username, password);
      setStep('systemSelect');
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        (err?.message && !err.message.includes('undefined') ? err.message : null) ||
        'Invalid username or password. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePortalSelect = async (portalName: string) => {
    setSelectedPortal(portalName);
    setIsLoading(true);
    try {
      await fetchAcademicYears();
      setStep('academicYear');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceed = () => {
    setAcademicYear(selectedYear);
    const matched = academicYearsRaw.find(y => y.label === selectedYear);
    if (matched) {
      setAcademicYearId(matched.id);
    } else {
      setAcademicYearId('ay1');
    }
    setActivePortal(selectedPortal);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col justify-center items-center bg-[#F5F7FA] px-4 py-8 sm:py-12 relative overflow-x-hidden">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-[440px] mx-auto">
        {step === 'login' && (
          <>
            {/* Logo & Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto mb-3 sm:mb-4 border border-slate-200 shadow-md bg-white flex items-center justify-center">
                <img
                  src={BRAND.iconSrc}
                  alt="Suryadhi"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">{BRAND.systemAbbr}</h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                {BRAND.systemName}
              </p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-200/60 p-5 sm:p-8">
              <div className="mb-5 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-slate-900">Sign In</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Enter your credentials to access your ERP portal
                </p>
              </div>

              {error && (
                <div className="mb-4 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm leading-relaxed">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="login-username" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="login-username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full pl-10 pr-4 py-2.5 sm:py-2.5 rounded-lg bg-slate-50/50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm sm:text-sm"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="login-password" className="block text-xs sm:text-sm font-medium text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-10 pr-11 py-2.5 rounded-lg bg-slate-50/50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm sm:text-sm"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-sm transition-all text-sm mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-5 text-center">
                <p className="text-xs sm:text-sm text-slate-500">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-blue-700 hover:text-blue-800 font-semibold transition-colors underline-offset-2 hover:underline"
                  >
                    Sign up
                  </button>
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 text-center">
                <ShieldCheck className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <span>JWT Secured • {BRAND.copyright}</span>
              </div>
            </div>
          </>
        )}

        {step === 'systemSelect' && (
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xl flex flex-col items-center">
            {/* Header branding */}
            <div className="text-center mb-5 sm:mb-6">
              <img
                src={BRAND.logoSrc}
                alt={BRAND.companyName}
                className="h-9 sm:h-10 object-contain mx-auto mb-2"
              />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Select Application Portal</h2>
              <p className="text-xs text-slate-500 mt-0.5">Choose the module you want to access</p>
            </div>

            <div className="w-full space-y-2.5">
              {BRAND.portals.map((portal) => (
                <button
                  key={portal.name}
                  onClick={() => handlePortalSelect(portal.name)}
                  className="w-full text-left p-3.5 sm:p-4 rounded-xl bg-slate-50/60 border border-slate-200 hover:border-blue-600 hover:bg-blue-50/30 hover:shadow-sm transition-all flex items-center gap-3.5 group active:scale-[0.99]"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-black flex items-center justify-center shrink-0">
                    <img src={portal.logoSrc} alt={portal.name} className="w-10 h-10 object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors truncate">{portal.name}</h3>
                    <p className="text-[11px] text-slate-500 truncate">{portal.fullName}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep('login')}
              className="mt-6 text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors py-1 px-3 rounded-md hover:bg-slate-100"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Login
            </button>
          </div>
        )}

        {step === 'academicYear' && (
          <div className="bg-white rounded-2xl p-5 sm:p-7 border border-slate-200 shadow-xl flex flex-col items-center">
            {/* Academic year step — Suryadhi SEMS badge */}
            <div className="flex flex-col items-center mb-5 sm:mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden mx-auto flex items-center justify-center bg-white border border-slate-200 shadow-sm p-2">
                <img
                  src={BRAND.semsBadgeSrc}
                  alt="SEMS"
                  className="w-full h-full object-contain"
                />
              </div>
              <p className="text-[10px] text-slate-600 font-bold tracking-widest text-center mt-2.5 uppercase leading-tight">
                {BRAND.systemAbbr}<br />{BRAND.systemName}
              </p>
            </div>

            <div className="w-full space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-semibold text-slate-700 block">
                  Select Academic Session
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-lg border border-slate-300 text-slate-800 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                  >
                    {academicYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              <Button
                onClick={handleProceed}
                className="w-full h-11 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                Proceed to Dashboard
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-5 flex gap-4 text-xs text-slate-500">
              <button
                onClick={() => setStep('systemSelect')}
                className="hover:text-slate-800 flex items-center gap-1.5 transition-colors py-1 px-3 rounded-md hover:bg-slate-100"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Change Portal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}