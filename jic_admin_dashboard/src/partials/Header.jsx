import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Bell, Search, Menu } from 'lucide-react';
import SearchModal from '../components/ModalSearch';
import UserMenu from '../components/DropdownProfile';

function Header({ sidebarOpen, setSidebarOpen }) {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { admin, logout } = useAuth();

  // GLOBAL SHORTCUT: Ctrl+K / Cmd+K to open search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#e5e5e5] h-[60px] flex items-center justify-between px-3 md:px-7 py-2 md:py-3">
      
      {/* Left side: Hamburger (Mobile) + Search Bar */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          className="lg:hidden w-10 h-10 rounded-[10px] flex items-center justify-center bg-transparent border border-[#ddd] text-[#888] cursor-pointer shrink-0 transition-all duration-200"
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          onClick={(e) => { e.stopPropagation(); setSidebarOpen(!sidebarOpen); }}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="w-5 h-5" />
        </button>
        
        {/* Search Input Trigger */}
        <div 
          className="relative w-full max-w-full md:max-w-[380px] min-w-0 cursor-text group"
          onClick={(e) => { e.stopPropagation(); setSearchModalOpen(true); }}
        >
          <Search className="absolute left-[14px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#aaa] pointer-events-none" />
          <div className="w-full py-[9px] pr-[14px] pl-[38px] text-[14px] text-[#aaa] bg-[#f5f5f5] border border-[#ddd] rounded-md transition-colors duration-200 group-hover:border-[#03D985] flex items-center justify-between">
            <span>Search...</span>
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-mono font-medium opacity-70 text-[#aaa]">
              <kbd className="px-1 py-0.5 rounded border border-[#ddd] bg-white">Ctrl</kbd>
              <kbd className="px-1.5 py-0.5 rounded border border-[#ddd] bg-white">K</kbd>
            </div>
          </div>
        </div>
        <SearchModal id="search-modal" searchId="search" modalOpen={searchModalOpen} setModalOpen={setSearchModalOpen} />
      </div>

      {/* Right side: Revenue, Notifications, User */}
      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        
        {/* Revenue Pill */}
        {/* <div className="hidden md:flex items-center gap-1.5 text-[13px] font-semibold py-1.5 px-3.5 rounded-full border border-[#ddd] bg-white whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-[#03D985]"></span>
          <span className="text-[#888]">Revenue:</span>
          <span className="text-[#111] font-semibold">$12,840.60</span>
        </div> */}

        {/* Bell Notification */}
        {/* <button className="relative p-2 text-[#888] bg-transparent border-none cursor-pointer rounded-lg hover:bg-[#f0f0f0] hover:text-[#111] transition-colors">
          <span className="sr-only">Notifications</span>
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-white"></span>
        </button> */}

        {/* Separator */}
        <div className="hidden md:block h-8 w-px bg-[#e5e5e5] mx-1"></div>

        {/* User Menu Profile */}
        <UserMenu align="right" admin={admin} onLogout={logout} />
      </div>

    </header>
  );
}

export default Header;