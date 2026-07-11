import React, { useState } from 'react';
import { LucideIcon } from './LucideIcon';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const url = activeTab === 'login' ? '/api/auth/login' : '/api/auth/signup';
    const payload = activeTab === 'login' 
      ? { email, password }
      : { name, email, phone, password };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ ما. يرجى المحاولة مرة أخرى.');
      }

      onSuccess(data.user, data.token);
      onClose();
      
      // Reset form states
      setEmail('');
      setPassword('');
      setName('');
      setPhone('');
    } catch (err: any) {
      setError(err.message || 'فشل الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
      {/* Modal Card */}
      <div 
        id="auth-modal-container"
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-rose-100/15"
      >
        {/* Header background with Islamic brand styling */}
        <div className="bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] p-6 text-center relative">
          <button 
            onClick={onClose}
            className="absolute top-4 left-4 text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <LucideIcon name="X" size={18} />
          </button>
          
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/15 border border-white/20 mb-3 shadow-inner">
            <LucideIcon name="UserCheck" className="text-[#C9A84C]" size={24} />
          </div>
          <h3 className="text-xl font-extrabold text-white">البوابة الرقمية للواقفين</h3>
          <p className="text-xs text-[#C9A84C] mt-1">سجل دخولك لتتبع أوقافك وتحميل شهادات الصدقة الجارية</p>
        </div>

        {/* Tab triggers */}
        <div className="flex border-b border-slate-100 bg-slate-50/50">
          <button
            onClick={() => {
              setActiveTab('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-sm font-bold transition-all duration-200 border-b-2 cursor-pointer ${
              activeTab === 'login'
                ? 'border-[#1B5E20] text-[#1B5E20] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => {
              setActiveTab('signup');
              setError(null);
            }}
            className={`flex-1 py-3 text-sm font-bold transition-all duration-200 border-b-2 cursor-pointer ${
              activeTab === 'signup'
                ? 'border-[#1B5E20] text-[#1B5E20] bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border-r-4 border-rose-500 rounded-lg text-rose-700 text-xs font-semibold flex items-center gap-2">
              <LucideIcon name="AlertTriangle" size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">الاسم الكامل</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                      <LucideIcon name="User" size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="عبدالله الجزائري"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B5E20] focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">رقم الهاتف (اختياري)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                      <LucideIcon name="Phone" size={16} />
                    </span>
                    <input
                      type="tel"
                      placeholder="+213 555 12 34 56"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B5E20] focus:bg-white transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <LucideIcon name="Mail" size={16} />
                </span>
                <input
                  type="email"
                  required
                  placeholder="example@waqfitek.dz"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B5E20] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">كلمة المرور</label>
              <div className="relative">
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                  <LucideIcon name="Lock" size={16} />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B5E20] focus:bg-white transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-gradient-to-r from-[#1B5E20] to-[#2E7D32] hover:from-[#154619] hover:to-[#246327] text-white font-extrabold text-sm rounded-xl transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LucideIcon name="LogIn" size={16} />
                  <span>{activeTab === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب وتفعيل العضوية'}</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
