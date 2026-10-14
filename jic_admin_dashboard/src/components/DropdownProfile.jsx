import React, { useState, useRef, useEffect } from 'react';
import Transition from '../utils/Transition';
import { changePassword } from '../api/authApi';
import { useAppToast } from '../hooks/useAppToast';

function DropdownProfile({ align, admin, onLogout }) {
  const toast = useAppToast();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  const [passLoading, setPassLoading] = useState(false);
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  const trigger = useRef(null);
  const dropdown = useRef(null);

  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdown.current) return;
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      if (isPasswordModalOpen) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (keyCode !== 27) return;
      if (isPasswordModalOpen) {
        setPasswordModalOpen(false);
      } else if (dropdownOpen) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassLoading(true);
    setPassError('');
    setPassSuccess('');

    try {
      const res = await changePassword(passwords);
      setPassSuccess(res.message || 'Password changed successfully!');
      toast.success('Password updated successfully');
      setTimeout(() => {
        setPasswordModalOpen(false);
        setDropdownOpen(false);
        setPasswords({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setPassSuccess('');
      }, 2000);
    } catch (err) {
      setPassError(err.response?.data?.message || 'Failed to change password.');
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPassLoading(false);
    }
  };

  const adminName = admin?.name || 'Administrator';
  const adminInitials = adminName.charAt(0).toUpperCase();
  const roleDisplay = admin?.role === 'superadmin' ? 'Super Admin' : 'Admin';

  return (
    <div className="relative inline-flex">
      <div className="flex items-center gap-3">
        {/* User Info (Hidden on smaller screens) */}
        <div className="hidden lg:block text-right">
          <div className="text-[13px] font-bold text-[#111] leading-tight">{adminName}</div>
          <div className="text-[11px] text-[#888]">{roleDisplay}</div>
        </div>

        {/* Avatar Trigger */}
        <button
          ref={trigger}
          className="w-9 h-9 rounded-[10px] border-2 border-[#e8e8e8] overflow-hidden flex items-center justify-center bg-[#03D985] cursor-pointer p-0"
          aria-haspopup="true"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          aria-expanded={dropdownOpen}
        >
          <span className="text-[#000] font-bold text-sm">{adminInitials}</span>
        </button>
      </div>

      {/* Dropdown Menu */}
      <Transition
        className={`origin-top-right z-50 absolute top-full min-w-[180px] bg-white border border-[#e8e8e8] py-1.5 rounded-[10px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden mt-2 ${align === 'right' ? 'right-0' : 'left-0'}`}
        show={dropdownOpen}
        enter="transition ease-out duration-150 transform"
        enterStart="opacity-0 -translate-y-1"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown} onFocus={() => setDropdownOpen(true)} onBlur={() => setDropdownOpen(false)}>
          <div className="pt-1 pb-2 px-3 mb-1 border-b border-[#e8e8e8]">
            <div className="font-medium text-[13px] text-[#111] truncate">{admin?.email}</div>
            <div className="text-[11px] text-[#03D985] font-semibold uppercase mt-0.5">{roleDisplay}</div>
          </div>
          <ul>
            <li>
              <button
                className="cursor-pointer w-full text-left font-medium text-[13px] text-[#03D985] hover:bg-[#f5f5f5] transition-colors py-2 px-3"
                onClick={() => setPasswordModalOpen(true)}
              >
                Change Password
              </button>
            </li>
            <li>
              <button
                className="cursor-pointer w-full text-left font-medium text-[13px] text-[#ef4444] hover:bg-[#f5f5f5] transition-colors py-2 px-3 mt-1"
                onClick={() => {
                  onLogout();
                  setDropdownOpen(false);
                }}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      </Transition>

      {/* Change Password Modal */}
      <Transition
        unmountOnExit={true}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] transition-opacity"
        show={isPasswordModalOpen}
        enter="transition ease-out duration-200" enterStart="opacity-0" enterEnd="opacity-100"
        leave="transition ease-out duration-100" leaveStart="opacity-100" leaveEnd="opacity-0"
      />
      <Transition
        unmountOnExit={true}
        className="fixed inset-0 z-[10000] overflow-hidden flex items-center justify-center px-4 sm:px-6"
        show={isPasswordModalOpen}
        enter="transition ease-in-out duration-200" enterStart="opacity-0 translate-y-4 scale-95" enterEnd="opacity-100 translate-y-0 scale-100"
        leave="transition ease-in-out duration-200" leaveStart="opacity-100 translate-y-0 scale-100" leaveEnd="opacity-0 translate-y-4 scale-95"
      >
        <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full border border-[#e8e8e8] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#e8e8e8] flex justify-between items-center bg-[#fafafa]">
            <h2 className="text-lg font-bold text-[#111]">Change Password</h2>
            <button onClick={() => setPasswordModalOpen(false)} className="text-[#888] hover:text-[#111] text-xl font-bold">&times;</button>
          </div>
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            {passError && <div className="p-3 bg-[#fef2f2] text-[#ef4444] text-sm rounded-lg border border-[#fecaca]">{passError}</div>}
            {passSuccess && <div className="p-3 bg-[#f0fdf4] text-[#16a34a] text-sm rounded-lg border border-[#bbf7d0]">{passSuccess}</div>}

            <div>
              <label className="block text-[13px] font-semibold mb-1 text-[#555]">Current Password</label>
              <input required type="password" value={passwords.currentPassword} onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} className="w-full text-sm leading-5 py-2 px-3 shadow-sm bg-white border border-[#ddd] text-[#333] rounded-lg focus:border-[#03D985] focus:ring-0 outline-none transition-colors" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1 text-[#555]">New Password</label>
              <input required type="password" value={passwords.newPassword} onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} className="w-full text-sm leading-5 py-2 px-3 shadow-sm bg-white border border-[#ddd] text-[#333] rounded-lg focus:border-[#03D985] focus:ring-0 outline-none transition-colors" />
              <p className="text-xs text-[#888] mt-1">Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.</p>
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1 text-[#555]">Confirm New Password</label>
              <input required type="password" value={passwords.confirmNewPassword} onChange={(e) => setPasswords({ ...passwords, confirmNewPassword: e.target.value })} className="w-full text-sm leading-5 py-2 px-3 shadow-sm bg-white border border-[#ddd] text-[#333] rounded-lg focus:border-[#03D985] focus:ring-0 outline-none transition-colors" />
            </div>

            <div className="pt-2 text-right space-x-3">
              <button type="button" onClick={() => setPasswordModalOpen(false)} className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#f0f0f0] text-[#555] hover:bg-[#e5e5e5] transition-colors border border-transparent">Cancel</button>
              <button type="submit" disabled={passLoading} className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#03D985] text-black hover:bg-[#02b870] transition-all transform hover:-translate-y-[1px] shadow-[0_4px_14px_rgba(3,217,133,0.25)] disabled:opacity-50 disabled:transform-none disabled:shadow-none border border-transparent">
                {passLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </Transition>
    </div>
  );
}

export default DropdownProfile;