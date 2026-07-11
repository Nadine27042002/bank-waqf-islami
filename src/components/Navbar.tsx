import React, { useState, useEffect } from 'react';
import { Page, User } from '../types';
import { LucideIcon } from './LucideIcon';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  onScrollToAbout: () => void;
  user: User | null;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onScrollToAbout, user, onOpenAuth }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; value: Page | 'about' }[] = [
    { label: 'الرئيسية', value: 'home' },
    { label: 'عن البنك', value: 'about' }, // Special action
    { label: 'أوقف الآن', value: 'waqf' },
    { label: 'استثمر معنا', value: 'invest' },
    { label: 'أوقافنا', value: 'projects' },
    { label: 'ثقافة وقفية', value: 'culture' },
    { label: 'تواصل معنا', value: 'contact' },
    ...(user ? [{ label: 'لوحة التحكم', value: 'dashboard' as Page }] : []),
  ];

  const handleItemClick = (item: { label: string; value: Page | 'about' }) => {
    setIsOpen(false);
    if (item.value === 'about') {
      onNavigate('home');
      setTimeout(() => {
        onScrollToAbout();
      }, 100);
    } else {
      onNavigate(item.value);
    }
  };

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3 border-b border-rose-50/10'
          : 'bg-[#1B5E20] text-white py-4'
      }`}
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Brand Title (Right side in RTL) */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C9A84C] bg-white flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
              <img 
                src="/src/assets/images/waqfitek_logo_1783159586464.jpg" 
                alt="وقفي تك" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className={`text-lg md:text-xl font-extrabold tracking-tight font-sans block ${
                scrolled ? 'text-[#1B5E20]' : 'text-white'
              }`}>
                البنك الوقفي الرقمي
              </span>
              <span className={`text-[10px] block -mt-1 font-mono uppercase tracking-widest ${
                scrolled ? 'text-[#C9A84C]' : 'text-[#C9A84C]'
              }`}>
                وقفي تك - WAQFITEK
              </span>
            </div>
          </div>

          {/* Desktop Navigation Row (Centered) */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isAbout = item.value === 'about';
              const isActive = !isAbout && currentPage === item.value;
              
              return (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  id={`nav-item-${item.value}`}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? scrolled
                        ? 'bg-[#1B5E20] text-white shadow-sm'
                        : 'bg-[#C9A84C] text-[#1B5E20] shadow-sm'
                      : scrolled
                      ? 'text-slate-700 hover:bg-slate-50 hover:text-[#1B5E20]'
                      : 'text-slate-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Call to action & Auth portal (Left side in RTL) */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <button
                onClick={() => onNavigate('dashboard')}
                id="nav-user-dashboard"
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  scrolled
                    ? 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-white border border-[#C9A84C]/50 flex items-center justify-center">
                  <img 
                    src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`} 
                    alt={user.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span>{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                id="nav-login-portal"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  scrolled
                    ? 'bg-slate-100 text-[#1B5E20] hover:bg-slate-200'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <LucideIcon name="User" size={14} />
                <span>بوابة الواقفين</span>
              </button>
            )}

            <button
              onClick={() => onNavigate('waqf')}
              id="nav-quick-contribute"
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold transition-all duration-300 shadow-md cursor-pointer hover:shadow-lg hover:-translate-y-0.5 ${
                scrolled
                  ? 'bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white hover:opacity-95'
                  : 'bg-[#C9A84C] text-[#1B5E20] hover:bg-white hover:text-[#1B5E20]'
              }`}
            >
              <LucideIcon name="Coins" size={16} />
              <span>أوقف الآن</span>
            </button>
          </div>

          {/* Mobile responsive toggle */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              id="mobile-nav-toggle"
              className={`p-2 rounded-lg transition-colors ${
                scrolled ? 'text-slate-800 hover:bg-slate-100' : 'text-white hover:bg-white/10'
              }`}
              aria-label="Toggle navigation menu"
            >
              <LucideIcon name={isOpen ? 'X' : 'Menu'} size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay and Menu */}
      {isOpen && (
        <div id="mobile-nav-drawer" className="lg:hidden absolute top-20 inset-x-0 bg-white border-b border-slate-100 shadow-xl transition-all duration-300 z-50 py-4" dir="rtl">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {navItems.map((item) => {
              const isAbout = item.value === 'about';
              const isActive = !isAbout && currentPage === item.value;

              return (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  id={`nav-item-mobile-${item.value}`}
                  className={`w-full text-right px-4 py-3 rounded-xl text-base font-bold transition-all duration-150 block ${
                    isActive
                      ? 'bg-[#1B5E20] text-white'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-[#1B5E20]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <div className="pt-4 border-t border-slate-100 mt-2 space-y-2">
              {user ? (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate('dashboard');
                  }}
                  className="w-full py-3 px-4 bg-slate-50 border border-slate-200 text-[#1B5E20] font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-white border border-[#C9A84C]/50 flex items-center justify-center">
                    <img 
                      src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span>لوحة تحكم: {user.name}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LucideIcon name="User" size={16} />
                  <span>دخول بوابة الواقفين</span>
                </button>
              )}

              <button
                onClick={() => {
                  setIsOpen(false);
                  onNavigate('waqf');
                }}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] text-white font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-md"
              >
                <LucideIcon name="Coins" size={18} />
                <span>أوقف الآن</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
