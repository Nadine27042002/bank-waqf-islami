import React from 'react';
import { Page } from '../types';
import { LucideIcon } from './LucideIcon';

interface FooterProps {
  onNavigate: (page: Page) => void;
  onScrollToAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onScrollToAbout }) => {
  const handleQuickLink = (page: Page) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate(page);
  };

  const handleAboutClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onNavigate('home');
    setTimeout(() => {
      onScrollToAbout();
    }, 100);
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 font-sans mt-auto" dir="rtl">
      {/* Upper footer grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-right">
          
          {/* Column 1: Brand & Description */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-[#C9A84C] bg-white flex items-center justify-center shadow-md">
                <img 
                  src="/src/assets/images/waqfitek_logo_1783159586464.jpg" 
                  alt="وقفي تك" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-white">البنك الوقفي الرقمي</h4>
                <p className="text-[10px] text-[#C9A84C] font-mono tracking-widest uppercase">وقفي تك - WAQFITEK</p>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed">
              أول صرح ريادي يدمج التقنيات المالية المعاصرة ومبادئ الاقتصاد التكافلي مع مقاصد الوقف الإسلامي الشريف لتقديم خدمات استقطاب، وحفظ، وتنمية الأوقاف وتوزيع ريعها بشفافية ومسؤولية كاملة.
            </p>

            {/* Social media connections */}
            <div className="flex items-center gap-4 pt-2">
              <a 
                href="#facebook" 
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#1B5E20] hover:text-white transition-all duration-300 shadow-sm hover:scale-105"
                aria-label="صفحة فيسبوك"
              >
                <LucideIcon name="Facebook" size={16} />
              </a>
              <a 
                href="#instagram" 
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#1B5E20] hover:text-white transition-all duration-300 shadow-sm hover:scale-105"
                aria-label="حساب إنستغرام"
              >
                <LucideIcon name="Instagram" size={16} />
              </a>
              <a 
                href="#youtube" 
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#1B5E20] hover:text-white transition-all duration-300 shadow-sm hover:scale-105"
                aria-label="قناة يوتيوب"
              >
                <LucideIcon name="Youtube" size={16} />
              </a>
              <a 
                href="#x" 
                className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-[#1B5E20] hover:text-white font-bold text-sm transition-all duration-300 shadow-sm hover:scale-105"
                aria-label="حساب إكس"
              >
                𝕏
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation Links */}
          <div className="space-y-4">
            <h4 className="text-md font-bold text-white border-r-4 border-[#C9A84C] pr-3">روابط وتسهيلات</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button 
                  onClick={() => handleQuickLink('home')} 
                  className="hover:text-[#C9A84C] hover:translate-x-[-4px] transition-transform text-right cursor-pointer"
                >
                  الرئيسية
                </button>
              </li>
              <li>
                <button 
                  onClick={handleAboutClick} 
                  className="hover:text-[#C9A84C] hover:translate-x-[-4px] transition-transform text-right cursor-pointer"
                >
                  عن البنك الوقفي
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLink('waqf')} 
                  className="hover:text-[#C9A84C] hover:translate-x-[-4px] transition-transform text-right cursor-pointer"
                >
                  أوقف الآن
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLink('invest')} 
                  className="hover:text-[#C9A84C] hover:translate-x-[-4px] transition-transform text-right cursor-pointer"
                >
                  استثمر معنا
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleQuickLink('projects')} 
                  className="hover:text-[#C9A84C] hover:translate-x-[-4px] transition-transform text-right cursor-pointer"
                >
                  أرقام ومشاريع الأوقاف
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Waqf sectors / Categories */}
          <div className="space-y-4">
            <h4 className="text-md font-bold text-white border-r-4 border-[#C9A84C] pr-3">مصارف الوقف الرئيسية</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20]"></span>
                <span className="text-slate-400">التعليم وكفالة طلاب العلم</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20]"></span>
                <span className="text-slate-400">الرعاية الاستشفائية والصحية</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20]"></span>
                <span className="text-slate-400">الزراعة المستدامة والأمن الغذائي</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20]"></span>
                <span className="text-slate-400">التضامن والتمكين الاجتماعي</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1B5E20]"></span>
                <span className="text-slate-400">التشييد الوقفي والتجهيز العيني</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div className="space-y-4">
            <h4 className="text-md font-bold text-white border-r-4 border-[#C9A84C] pr-3">معلومات الاتصال</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <div className="text-[#C9A84C] mt-1 shrink-0">
                  <LucideIcon name="MapPin" size={18} />
                </div>
                <span>الجزائر العاصمة، حي السعيد حمدين، المجمع التكنولوجي لوقفي تك</span>
              </li>
              
              <li className="flex items-center gap-3">
                <div className="text-[#C9A84C] shrink-0">
                  <LucideIcon name="Phone" size={18} />
                </div>
                <span dir="ltr">+213 21 00 00 00</span>
              </li>

              <li className="flex items-center gap-3">
                <div className="text-[#C9A84C] shrink-0">
                  <LucideIcon name="Mail" size={18} />
                </div>
                <span className="text-slate-400 hover:text-white transition-colors">contact@waqfitek.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Decorative footer ribbon */}
      <div className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>
            حقوق الطبع محفوظة © {currentYear} البنك الوقفي الرقمي. خاضع لإشراف الهيئة الشرعية المستقلة والنظارة الإلكترونية المشتركة.
          </p>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-slate-400 transition-colors">اتفاقية الخدمة</a>
            <a href="#privacy" className="hover:text-slate-400 transition-colors">سياسة الخصوصية</a>
            <a href="#fatwa" className="hover:text-slate-400 transition-colors">الميثاق الشرعي</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
