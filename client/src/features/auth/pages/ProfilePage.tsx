import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authApi } from '../api';
import { Loader2 } from 'lucide-react';
import { showToast } from '@/lib/toast';

export default function ProfilePage() {
  const { user, checkAuth } = useAuthStore();
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'profileInfo' | 'account' | 'editProfile'>('profileInfo');

  // Extended Profile fields
  const [schoolAddress, setSchoolAddress] = useState('');
  const [residenceAddress, setResidenceAddress] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [landlineNumber, setLandlineNumber] = useState('');
  const [defaultPaymentMode, setDefaultPaymentMode] = useState('Bank Account');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankAccountBeneficiaryName, setBankAccountBeneficiaryName] = useState('');
  const [bankAccountType, setBankAccountType] = useState('Current');
  const [bankName, setBankName] = useState('');
  const [ifscCode, setIfscCode] = useState('');
  const [uinNumber, setUinNumber] = useState('');
  const [uinName, setUinName] = useState('');
  const [noOfClassRooms, setNoOfClassRooms] = useState('');
  const [typeOfOwnership, setTypeOfOwnership] = useState('Proprietorship');
  const [dobFranchisePartner1, setDobFranchisePartner1] = useState('');
  const [dobFranchisePartner2, setDobFranchisePartner2] = useState('');
  const [marriageAnniversary, setMarriageAnniversary] = useState('');
  const [facebookId, setFacebookId] = useState('');
  const [instagramId, setInstagramId] = useState('');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Load/Alert states
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Map values from database/profiles store to react states
  const loadProfileData = () => {
    if (user) {
      const info = (user as any).profileInfo || {};
      setSchoolAddress(info.schoolAddress || '');
      setResidenceAddress(info.residenceAddress || '');
      setPanNumber(info.panNumber || '');
      setAadharNumber(info.aadharNumber || '');
      setContactNumber(info.contactNumber || user.phone || '');
      setLandlineNumber(info.landlineNumber || '');
      setDefaultPaymentMode(info.defaultPaymentMode || 'Bank Account');
      setBankAccountNumber(info.bankAccountNumber || '');
      setBankAccountBeneficiaryName(info.bankAccountBeneficiaryName || '');
      setBankAccountType(info.bankAccountType || 'Current');
      setBankName(info.bankName || '');
      setIfscCode(info.ifscCode || '');
      setUinNumber(info.uinNumber || '');
      setUinName(info.uinName || '');
      setNoOfClassRooms(info.noOfClassRooms || '');
      setTypeOfOwnership(info.typeOfOwnership || 'Proprietorship');
      setDobFranchisePartner1(info.dobFranchisePartner1 || '');
      setDobFranchisePartner2(info.dobFranchisePartner2 || '');
      setMarriageAnniversary(info.marriageAnniversary || '');
      setFacebookId(info.facebookId || '');
      setInstagramId(info.instagramId || '');
    }
  };

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    try {
      const res = await authApi.updateProfile({
        firstName: user?.firstName || 'Admin',
        lastName: user?.lastName || 'User',
        email: user?.email || 'admin@epms.local',
        phone: contactNumber || null,
        // Extended fields
        schoolAddress,
        residenceAddress,
        panNumber,
        aadharNumber,
        contactNumber,
        landlineNumber,
        defaultPaymentMode,
        bankAccountNumber,
        bankAccountBeneficiaryName,
        bankAccountType,
        bankName,
        ifscCode,
        uinNumber,
        uinName,
        noOfClassRooms,
        typeOfOwnership,
        dobFranchisePartner1,
        dobFranchisePartner2,
        marriageAnniversary,
        facebookId,
        instagramId,
      });

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        showToast('Profile updated successfully!', 'success');
        await checkAuth(); // Refresh Zustand store
      } else {
        const errorText = res.data.error || 'Failed to update profile.';
        setMessage({ type: 'error', text: errorText });
        showToast(errorText, 'error');
      }
    } catch (err: any) {
      const errorText = err.response?.data?.error || err.message || 'An error occurred during update.';
      setMessage({ type: 'error', text: errorText });
      showToast(errorText, 'error');
    } finally {
      setIsLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validate password policy matching red guidelines
    if (newPassword.length < 6) {
      const msg = 'Password must be at least 6 characters.';
      setMessage({ type: 'error', text: msg });
      showToast(msg, 'error');
      return;
    }
    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword)) {
      const msg = 'Password must contain uppercase and lowercase letters.';
      setMessage({ type: 'error', text: msg });
      showToast(msg, 'error');
      return;
    }
    if (!/[@#$%!*]/.test(newPassword)) {
      const msg = 'Password must contain a special character (@, #, $, %, !).';
      setMessage({ type: 'error', text: msg });
      showToast(msg, 'error');
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      const msg = 'Password must contain a digit (0-9).';
      setMessage({ type: 'error', text: msg });
      showToast(msg, 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      const msg = 'New passwords do not match.';
      setMessage({ type: 'error', text: msg });
      showToast(msg, 'error');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authApi.updateProfile({
        firstName: user?.firstName || 'Admin',
        lastName: user?.lastName || 'User',
        email: user?.email || 'admin@epms.local',
        currentPassword,
        newPassword,
      });

      if (res.data.success) {
        const msg = 'Password changed successfully!';
        setMessage({ type: 'success', text: msg });
        showToast(msg, 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const msg = res.data.error || 'Failed to change password.';
        setMessage({ type: 'error', text: msg });
        showToast(msg, 'error');
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || err.message || 'An error occurred during password change.';
      setMessage({ type: 'error', text: msg });
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#f5f5f5] dark:bg-[#121212] min-h-screen text-slate-800 dark:text-slate-200">
      {/* Header and Breadcrumbs */}
      <div className="bg-white dark:bg-[#1a1a1a] px-6 py-4 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">User Profile</h1>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 font-medium">
          <span>🏠 Home</span>
          <span>&gt;</span>
          <span>Masters</span>
          <span>&gt;</span>
          <span className="text-slate-600 dark:text-slate-300">User Profile</span>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Messages */}
        {message.text && (
          <div
            className={`p-3 rounded-lg text-sm border font-medium ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                : 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Tab Headers */}
        <div className="flex border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => { setActiveTab('profileInfo'); setMessage({ type: '', text: '' }); }}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'profileInfo'
                ? 'border-red-500 text-slate-800 dark:text-white bg-white dark:bg-[#1a1a1a] rounded-t-md'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Profile Info
          </button>
          <button
            onClick={() => { setActiveTab('account'); setMessage({ type: '', text: '' }); }}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'account'
                ? 'border-red-500 text-slate-800 dark:text-white bg-white dark:bg-[#1a1a1a] rounded-t-md'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Account
          </button>
          <button
            onClick={() => { setActiveTab('editProfile'); setMessage({ type: '', text: '' }); }}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activeTab === 'editProfile'
                ? 'border-red-500 text-slate-800 dark:text-white bg-white dark:bg-[#1a1a1a] rounded-t-md'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            Edit Profile
          </button>
        </div>

        {/* Main Tab Cards */}
        <div className="bg-white dark:bg-[#1a1a1a] border rounded-lg shadow-sm overflow-hidden">
          {/* PROFILE INFO & EDIT PROFILE TABS (Address / Bank fields) */}
          {(activeTab === 'profileInfo' || activeTab === 'editProfile') && (
            <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
              {/* Note in Red */}
              <p className="text-[11px] font-semibold text-red-500">
                Note: The above information is mandatory for fund transfer purpose at the time of child transfers.
              </p>

              {/* Input Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* School Address */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Franchisee School Address *
                  </label>
                  <textarea
                    value={schoolAddress}
                    onChange={(e) => setSchoolAddress(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2.5 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-background resize-none"
                    disabled={activeTab === 'profileInfo'}
                    required
                  />
                </div>

                {/* Residence Address */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Franchisee Residence Address
                  </label>
                  <textarea
                    value={residenceAddress}
                    onChange={(e) => setResidenceAddress(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-2.5 border rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none bg-background resize-none"
                    disabled={activeTab === 'profileInfo'}
                  />
                </div>

                {/* PAN Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    PAN Number *
                  </label>
                  <Input
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                    required
                  />
                </div>

                {/* Aadhar Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Aadhar Number (Optional)
                  </label>
                  <Input
                    value={aadharNumber}
                    onChange={(e) => setAadharNumber(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                  />
                </div>

                {/* Contact Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Contact Number *
                  </label>
                  <Input
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                    required
                  />
                </div>

                {/* Landline Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Landline Number (Optional)
                  </label>
                  <Input
                    value={landlineNumber}
                    onChange={(e) => setLandlineNumber(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                  />
                </div>

                {/* Default Payment Mode */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Default Payment Mode *
                  </label>
                  <select
                    value={defaultPaymentMode}
                    onChange={(e) => setDefaultPaymentMode(e.target.value)}
                    className="w-full h-9 px-3 border rounded text-xs bg-background"
                    disabled={activeTab === 'profileInfo'}
                    required
                  >
                    <option value="Bank Account">Bank Account</option>
                    <option value="Cash">Cash</option>
                  </select>
                </div>

                {/* Bank Account Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Bank Account Number *
                  </label>
                  <Input
                    value={bankAccountNumber}
                    onChange={(e) => setBankAccountNumber(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                    required
                  />
                </div>

                {/* Bank Account Beneficiary Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Bank Account Beneficiary Name *
                  </label>
                  <Input
                    value={bankAccountBeneficiaryName}
                    onChange={(e) => setBankAccountBeneficiaryName(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                    required
                  />
                </div>

                {/* Bank Account Type */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Bank Account Type *
                  </label>
                  <select
                    value={bankAccountType}
                    onChange={(e) => setBankAccountType(e.target.value)}
                    className="w-full h-9 px-3 border rounded text-xs bg-background"
                    disabled={activeTab === 'profileInfo'}
                    required
                  >
                    <option value="Current">Current</option>
                    <option value="Savings">Savings</option>
                  </select>
                </div>

                {/* Bank Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Bank Name *
                  </label>
                  <Input
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                    required
                  />
                </div>

                {/* IFSC Code */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    IFSC Code *
                  </label>
                  <Input
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                    required
                  />
                </div>

                {/* UIN Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    UIN Number *
                  </label>
                  <Input
                    value={uinNumber}
                    onChange={(e) => setUinNumber(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                    required
                  />
                </div>

                {/* UIN Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    UIN Name *
                  </label>
                  <Input
                    value={uinName}
                    onChange={(e) => setUinName(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                    required
                  />
                </div>

                {/* No of Class Rooms */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    No of Class Rooms *
                  </label>
                  <Input
                    type="number"
                    value={noOfClassRooms}
                    onChange={(e) => setNoOfClassRooms(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                    required
                  />
                </div>

                {/* Type of Ownership */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Type of ownership *
                  </label>
                  <select
                    value={typeOfOwnership}
                    onChange={(e) => setTypeOfOwnership(e.target.value)}
                    className="w-full h-9 px-3 border rounded text-xs bg-background"
                    disabled={activeTab === 'profileInfo'}
                    required
                  >
                    <option value="Proprietorship">Proprietorship</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Company">Company</option>
                    <option value="Trust">Trust</option>
                  </select>
                </div>

                {/* Date of Birth Partner 1 */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Date of Birth of the Franchisee Partner -1
                  </label>
                  <Input
                    type="date"
                    value={dobFranchisePartner1}
                    onChange={(e) => setDobFranchisePartner1(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                  />
                </div>

                {/* Date of Birth Partner 2 */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Date of Birth of the Franchisee Partner -2
                  </label>
                  <Input
                    type="date"
                    value={dobFranchisePartner2}
                    onChange={(e) => setDobFranchisePartner2(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                  />
                </div>

                {/* Marriage Anniversary */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Marriage Anniversary
                  </label>
                  <Input
                    type="date"
                    value={marriageAnniversary}
                    onChange={(e) => setMarriageAnniversary(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                  />
                </div>

                {/* Facebook ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Facebook ID *
                  </label>
                  <Input
                    value={facebookId}
                    onChange={(e) => setFacebookId(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                    required
                  />
                </div>

                {/* Instagram ID */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                    Instagram ID *
                  </label>
                  <Input
                    value={instagramId}
                    onChange={(e) => setInstagramId(e.target.value)}
                    className="h-9 text-xs"
                    disabled={activeTab === 'profileInfo'}
                    required
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t flex gap-2">
                <Button
                  type="submit"
                  disabled={isLoading || activeTab === 'profileInfo'}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-9 text-xs font-semibold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update'
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={loadProfileData}
                  disabled={activeTab === 'profileInfo'}
                  className="bg-slate-700 hover:bg-slate-800 text-white px-5 h-9 text-xs font-semibold"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}

          {/* ACCOUNT TAB (Change Password Left/Right columns) */}
          {activeTab === 'account' && (
            <div className="grid grid-cols-1 md:grid-cols-4 min-h-[400px]">
              {/* Left Column: Menu items */}
              <div className="md:col-span-1 border-r border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-[#151515] p-4">
                <div className="flex items-center gap-3 px-3 py-2.5 rounded bg-blue-600 text-white font-medium text-xs shadow">
                  <span>🔒</span>
                  <span>Change Password</span>
                </div>
              </div>

              {/* Right Column: Change Password fields */}
              <form onSubmit={handleChangePassword} className="md:col-span-3 p-6 space-y-5">
                {/* Guidelines */}
                <div className="space-y-1 text-xs text-red-500 font-medium">
                  <p className="font-bold">New password must satisfy following criteria:</p>
                  <p>- Minimum length should be at least 6 character</p>
                  <p>- Must contain letters in both uppercase (A-Z) and lowercase (a-z)</p>
                  <p>- Must contain Special character (@, #, $, %, !)</p>
                  <p>- Must contain numeric digits (0-9)</p>
                </div>

                {/* Current Password */}
                <div className="space-y-1.5 max-w-lg">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Current Password
                  </label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>

                {/* New Password */}
                <div className="space-y-1.5 max-w-lg">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    New Password
                  </label>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5 max-w-lg">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Re-type New Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-9 text-xs"
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="pt-2 flex gap-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 h-9 text-xs font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Changing...
                      </>
                    ) : (
                      'Change Password'
                    )}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setCurrentPassword('');
                      setNewPassword('');
                      setConfirmPassword('');
                    }}
                    className="bg-slate-700 hover:bg-slate-800 text-white px-5 h-9 text-xs font-semibold"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
