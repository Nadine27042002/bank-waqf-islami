import React, { useState, useEffect } from 'react';
import { User, UserDonation, Project } from '../../types';
import { LucideIcon } from '../LucideIcon';
import { WaqfCertificate } from '../WaqfCertificate';

interface DashboardProps {
  user: User;
  token: string;
  projectsList: Project[];
  onUpdateUser: (updatedUser: User) => void;
  onNavigatePage: (page: any) => void;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  token,
  projectsList,
  onUpdateUser,
  onNavigatePage,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'settings'>('overview');
  const [donations, setDonations] = useState<UserDonation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Settings form local state
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [preferredWaqf, setPreferredWaqf] = useState(user.preferredWaqf || 'general');
  const [monthlyGoal, setMonthlyGoal] = useState(user.monthlyGoal || 50000);
  const [savingProfile, setSavingProfile] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Selected donation for certificate rendering
  const [selectedDonationForCert, setSelectedDonationForCert] = useState<UserDonation | null>(null);

  const fetchUserDonations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/donations', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setDonations(data.donations || []);
      } else {
        throw new Error('Failed to fetch personal donations');
      }
    } catch (err: any) {
      console.error(err);
      setError('فشل في تحميل سجل المساهمات من الخادم.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDonations();
  }, [token]);

  // Sync settings local state when user prop changes
  useEffect(() => {
    setName(user.name);
    setPhone(user.phone);
    setPreferredWaqf(user.preferredWaqf || 'general');
    setMonthlyGoal(user.monthlyGoal || 50000);
  }, [user]);

  // Calculations
  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);
  const totalWaqfTransactions = donations.length;
  
  // Calculate distinct project titles
  const uniqueProjectsSupported = Array.from(new Set(donations.map(d => d.projectTitle))).length;

  // Monthly Goal completion percentage
  const goalPercent = Math.min(100, Math.round((totalDonated / monthlyGoal) * 100)) || 0;

  // Tangible Islamic Waqf Impact breakdown
  // Based on categories and amount donated
  const calculateImpacts = () => {
    let dialysisHours = 0;
    let studentDays = 0;
    let treesPlanted = 0;
    let housingDays = 0;
    let quranCopies = 0;

    donations.forEach(d => {
      const amount = d.amount;
      const title = d.projectTitle || '';
      
      // Match by project title keyword or general category
      if (title.includes('التعليم') || title.includes('العلم') || d.waqfTarget === 'educational') {
        studentDays += Math.floor(amount / 500); // 500 DZD per educational support day
      } else if (title.includes('الشفاء') || title.includes('الكل') || d.waqfTarget === 'health') {
        dialysisHours += Math.floor(amount / 800); // 800 DZD per dialysis run hour
      } else if (title.includes('الجود') || title.includes('الأمن') || title.includes('بئر') || d.waqfTarget === 'agricultural') {
        treesPlanted += Math.floor(amount / 2000); // 2000 DZD per date palm tree
      } else if (title.includes('مسكن') || title.includes('البركة') || title.includes('الأرامل') || d.waqfTarget === 'social') {
        housingDays += Math.floor(amount / 1500); // 1500 DZD per shelter day
      } else {
        // Fallback or general split
        quranCopies += Math.floor(amount / 400); // 400 DZD per printed/distributed quran copies
      }
    });

    return { dialysisHours, studentDays, treesPlanted, housingDays, quranCopies };
  };

  const impacts = calculateImpacts();

  // Save profile edits
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setSuccessMsg(null);
    setError(null);

    try {
      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          phone,
          preferredWaqf,
          monthlyGoal: Number(monthlyGoal)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء حفظ الملف الشخصي');
      }

      onUpdateUser(data.user);
      setSuccessMsg('تم تحديث بيانات ملفك الشخصي بنجاح.');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      setError(err.message || 'فشل في حفظ التعديلات.');
    } finally {
      setSavingProfile(false);
    }
  };

  // Preset monthly goals for quick click
  const goalPresets = [10000, 30000, 50000, 100000, 250000];

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" dir="rtl">
      
      {/* Page Header Cockpit */}
      <div id="dashboard-header" className="bg-white rounded-2xl p-6 shadow-sm border border-rose-50/10 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1B5E20] to-[#C9A84C] p-0.5 shadow-md">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <img 
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`}
                alt={user.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-[#1B5E20]">تقبل الله صالح أعمالك، {user.name}</h1>
            <p className="text-xs text-slate-500 font-medium">عضوية البنك الرقمي نشطة • بريدك: {user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigatePage('waqf')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1B5E20] hover:bg-[#154619] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow"
          >
            <LucideIcon name="Coins" size={14} />
            <span>مساهمة جديدة</span>
          </button>
          
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 border border-rose-100 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <LucideIcon name="LogOut" size={14} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Main navigation tabs for cockpit */}
      <div className="flex border-b border-slate-200 mb-8">
        <button
          onClick={() => { setActiveTab('overview'); setSelectedDonationForCert(null); }}
          className={`px-6 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'overview' && !selectedDonationForCert
              ? 'border-[#1B5E20] text-[#1B5E20] font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          لوحة التحكم العامة
        </button>
        <button
          onClick={() => { setActiveTab('history'); setSelectedDonationForCert(null); }}
          className={`px-6 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'history' || selectedDonationForCert
              ? 'border-[#1B5E20] text-[#1B5E20] font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          سجل الأوقاف والشهادات ({totalWaqfTransactions})
        </button>
        <button
          onClick={() => { setActiveTab('settings'); setSelectedDonationForCert(null); }}
          className={`px-6 py-3.5 text-sm font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'settings' && !selectedDonationForCert
              ? 'border-[#1B5E20] text-[#1B5E20] font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          إعدادات الحساب
        </button>
      </div>

      {/* Error state if any */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border-r-4 border-rose-500 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2">
          <LucideIcon name="AlertTriangle" size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Certificate viewer override */}
      {selectedDonationForCert ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-100">
            <h3 className="text-md font-bold text-[#1B5E20] flex items-center gap-2">
              <LucideIcon name="Award" />
              <span>معاينة حجة الوقف الرسمية</span>
            </h3>
            <button
              onClick={() => setSelectedDonationForCert(null)}
              className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-all cursor-pointer"
            >
              العودة للسجل
            </button>
          </div>
          <WaqfCertificate
            donorName={selectedDonationForCert.donorName || user.name}
            amount={selectedDonationForCert.amount}
            waqfTypeOrProject={selectedDonationForCert.projectTitle}
            onReset={() => setSelectedDonationForCert(null)}
          />
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              
              {/* Statistical cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                <div className="bg-gradient-to-br from-[#1B5E20] to-[#2E7D32] rounded-2xl p-6 text-white shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-semibold opacity-75 block">إجمالي أوقافك النقدية</span>
                    <span className="text-2xl md:text-3xl font-extrabold block mt-2">
                      {new Intl.NumberFormat('ar-DZ').format(totalDonated)} <span className="text-xs font-normal">د.ج</span>
                    </span>
                    <span className="text-[10px] opacity-75 mt-1 block">مستمرة ومنتجة للأثر بإذن الله</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/15 flex items-center justify-center">
                    <LucideIcon name="TrendingUp" className="text-[#C9A84C]" size={24} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">المعاملات الوقفية</span>
                    <span className="text-2xl font-extrabold text-slate-800 block mt-2">
                      {totalWaqfTransactions} <span className="text-xs font-normal text-slate-500">معاملات</span>
                    </span>
                    <span className="text-[10px] text-emerald-600 font-medium mt-1 block">كل معاملة بصدقة جارية ممتدة</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                    <LucideIcon name="History" className="text-[#1B5E20]" size={24} />
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold block">المصارف والأبواب المدعومة</span>
                    <span className="text-2xl font-extrabold text-slate-800 block mt-2">
                      {uniqueProjectsSupported} <span className="text-xs font-normal text-slate-500">مصارف</span>
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 block">تنويع منابع الأجر والخير</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                    <LucideIcon name="Grid" className="text-amber-600" size={24} />
                  </div>
                </div>

                {/* SVG Progress Gauge Card */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                  {/* Circular progress wheel using clean custom SVG */}
                  <div className="relative w-18 h-18 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#1B5E20] transition-all duration-1000"
                        strokeDasharray={`${goalPercent}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-extrabold text-slate-800">{goalPercent}%</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold block">هدف عهدة الأثر</span>
                    <span className="text-sm font-extrabold text-slate-800 mt-1 block">
                      {new Intl.NumberFormat('ar-DZ').format(totalDonated)} / {new Intl.NumberFormat('ar-DZ').format(monthlyGoal)} <span className="text-[10px] font-normal text-slate-400">د.ج</span>
                    </span>
                    <button 
                      onClick={() => setActiveTab('settings')}
                      className="text-[10px] text-[#1B5E20] font-bold hover:underline mt-1 block text-right"
                    >
                      تعديل الهدف السنوي ←
                    </button>
                  </div>
                </div>

              </div>

              {/* Tangible Waqf Impact Grid - Visual metrics illustrating what their money did */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h3 className="text-md font-extrabold text-[#1B5E20] flex items-center gap-2">
                    <LucideIcon name="Sparkles" className="text-[#C9A84C]" />
                    <span>سجل أثرك الوقفي الجاري لحظياً</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">يتحول دينارك الجزائري إلى وقفيات مادية تولد نفعاً ملموساً للمستحقين بالجزائر في كل ثانية</p>
                </div>

                {totalDonated === 0 ? (
                  <div className="text-center py-12 px-4">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 text-slate-400 border border-dashed border-slate-200">
                      <LucideIcon name="Coins" size={24} />
                    </div>
                    <p className="text-sm font-bold text-slate-600">لا يوجد أثر مسجل حالياً</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">سجل أول مساهمة وقفية لك لتفعيل حاسبة الأجر وتتبع الأثر المادي الجاري للصدقة.</p>
                    <button
                      onClick={() => onNavigatePage('waqf')}
                      className="mt-4 px-5 py-2 bg-[#1B5E20] hover:bg-[#154619] text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      المساهمة الأولى الآن
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    
                    {/* Impact Item: Dialysis */}
                    <div className="bg-rose-50/40 rounded-2xl p-5 border border-rose-100/50 flex flex-col justify-between h-40 transition-transform hover:scale-102">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-700">
                          <LucideIcon name="Activity" size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-100/50 px-2 py-0.5 rounded-full">الصحة</span>
                      </div>
                      <div>
                        <span className="text-2xl font-extrabold text-rose-900 block">{impacts.dialysisHours} ساعة</span>
                        <span className="text-xs font-semibold text-slate-600 block mt-1">غسيل كلى مجاني</span>
                        <span className="text-[9px] text-slate-400 block mt-1">ساعات الرعاية المركزة للمعوزين</span>
                      </div>
                    </div>

                    {/* Impact Item: Students */}
                    <div className="bg-indigo-50/40 rounded-2xl p-5 border border-indigo-100/50 flex flex-col justify-between h-40 transition-transform hover:scale-102">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                          <LucideIcon name="GraduationCap" size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100/50 px-2 py-0.5 rounded-full">التعليم</span>
                      </div>
                      <div>
                        <span className="text-2xl font-extrabold text-indigo-900 block">{impacts.studentDays} يوم</span>
                        <span className="text-xs font-semibold text-slate-600 block mt-1">كفالة تعليمية للأيتام</span>
                        <span className="text-[9px] text-slate-400 block mt-1">دعم شامل شامل للمميزين المعسرين</span>
                      </div>
                    </div>

                    {/* Impact Item: Agriculture */}
                    <div className="bg-emerald-50/40 rounded-2xl p-5 border border-emerald-100/50 flex flex-col justify-between h-40 transition-transform hover:scale-102">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-[#1B5E20]">
                          <LucideIcon name="TreePine" size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-[#1B5E20] bg-emerald-100/50 px-2 py-0.5 rounded-full">البيئة</span>
                      </div>
                      <div>
                        <span className="text-2xl font-extrabold text-emerald-900 block">{impacts.treesPlanted} نخلة</span>
                        <span className="text-xs font-semibold text-slate-600 block mt-1">غرس نخيل وقفي مثمر</span>
                        <span className="text-[9px] text-slate-400 block mt-1">إنتاج تمور مستدام لصالح الفقراء</span>
                      </div>
                    </div>

                    {/* Impact Item: Social Shelter */}
                    <div className="bg-amber-50/40 rounded-2xl p-5 border border-amber-100/50 flex flex-col justify-between h-40 transition-transform hover:scale-102">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
                          <LucideIcon name="Home" size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100/50 px-2 py-0.5 rounded-full">المجتمع</span>
                      </div>
                      <div>
                        <span className="text-2xl font-extrabold text-amber-900 block">{impacts.housingDays} يوم</span>
                        <span className="text-xs font-semibold text-slate-600 block mt-1">إيواء كريم ومستقر للأرامل</span>
                        <span className="text-[9px] text-slate-400 block mt-1">تأمين مساكن مسكن البركة مجاناً</span>
                      </div>
                    </div>

                    {/* Impact Item: Quran Copies */}
                    <div className="bg-purple-50/40 rounded-2xl p-5 border border-purple-100/50 flex flex-col justify-between h-40 transition-transform hover:scale-102">
                      <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700">
                          <LucideIcon name="BookOpen" size={20} />
                        </div>
                        <span className="text-[10px] font-bold text-purple-700 bg-purple-100/50 px-2 py-0.5 rounded-full">عامة</span>
                      </div>
                      <div>
                        <span className="text-2xl font-extrabold text-purple-900 block">{impacts.quranCopies} مصحف</span>
                        <span className="text-xs font-semibold text-slate-600 block mt-1">طباعة مصاحف شريفة</span>
                        <span className="text-[9px] text-slate-400 block mt-1">توزيع المصاحف وحلقات التحفيظ</span>
                      </div>
                    </div>

                  </div>
                )}
              </div>

              {/* Quran Reminder Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 via-[#1B5E20]/5 to-[#C9A84C]/10 rounded-2xl p-6 border border-[#C9A84C]/20 text-center max-w-3xl mx-auto">
                <span className="inline-block w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-[#C9A84C] text-sm mb-2">⭐</span>
                <p className="text-sm font-semibold text-slate-800 italic">"إِذَا مَاتَ ابنُ آدم انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ: صَدَقَةٍ جَارِيَةٍ، أَوْ عِلْمٍ يُنْتَفَعُ بِهِ، أَوْ وَلَدٍ صَالِحٍ يَدْعُو لَهُ"</p>
                <p className="text-[10px] text-slate-500 mt-1">رواه مسلم • الصدقة الجارية هي الوقف الحابس للأصل المسبل للمنفعة</p>
              </div>

            </div>
          )}

          {/* TAB 2: HISTORY */}
          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="border-b border-slate-100 pb-4 mb-6">
                <h3 className="text-md font-extrabold text-[#1B5E20] flex items-center gap-2">
                  <LucideIcon name="History" />
                  <span>سجل المعاملات وحجج الوقف الرسمية</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">يمكنك تصفح تبرعاتك السابقة وتحميل وطباعة حجتك الوقفية الشريفة المختومة بختم النظارة الشرعية للبنك</p>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-4 border-[#1B5E20] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : donations.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3 text-slate-400 border border-dashed border-slate-200">
                    <LucideIcon name="Award" size={24} />
                  </div>
                  <p className="text-sm font-bold">لا يوجد أوقاف مسجلة لهذا الحساب حالياً</p>
                  <p className="text-xs text-slate-400 mt-1">عند تبرعك باستخدام نفس البريد الإلكتروني المسجل حسابك به ({user.email})، ستظهر كافة المعاملات هنا تلقائياً.</p>
                  <button
                    onClick={() => onNavigatePage('waqf')}
                    className="mt-4 px-5 py-2 bg-[#1B5E20] text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                  >
                    أوقف الآن
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-right border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-500 font-bold text-xs">
                        <th className="py-3 px-4">رقم المعاملة</th>
                        <th className="py-3 px-4">الباب الوقفي المستهدف</th>
                        <th className="py-3 px-4">المبلغ</th>
                        <th className="py-3 px-4">التاريخ</th>
                        <th className="py-3 px-4">الحالة</th>
                        <th className="py-3 px-4 text-left">الحجة الشرعية</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {donations.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-4 font-mono text-xs text-slate-400">
                            {d.id.substring(4, 12)}...
                          </td>
                          <td className="py-4 px-4 font-bold text-slate-700">
                            {d.projectTitle}
                          </td>
                          <td className="py-4 px-4 font-bold text-[#1B5E20] font-mono">
                            {new Intl.NumberFormat('ar-DZ').format(d.amount)} د.ج
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-500">
                            {new Date(d.timestamp).toLocaleDateString('ar-DZ', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span>موقوف ومؤكد</span>
                            </span>
                          </td>
                          <td className="py-4 px-4 text-left">
                            <button
                              onClick={() => setSelectedDonationForCert(d)}
                              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#1B5E20] hover:text-[#123d15] text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1 inline-flex"
                            >
                              <LucideIcon name="Award" size={13} />
                              <span>حجة الوقف</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 md:col-span-2">
                <div className="border-b border-slate-100 pb-4 mb-6">
                  <h3 className="text-md font-extrabold text-[#1B5E20] flex items-center gap-2">
                    <LucideIcon name="Settings" />
                    <span>تعديل البيانات الشخصية ومقصد الوقف</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">تحديث معلومات العضوية وتفضيلات الوقف والالتزام التنموي</p>
                </div>

                {successMsg && (
                  <div className="mb-6 p-4 bg-emerald-50 border-r-4 border-emerald-500 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                    <LucideIcon name="CheckCircle" size={16} />
                    <span>{successMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">الاسم الكامل</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B5E20] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">رقم الهاتف</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B5E20] focus:bg-white transition-all"
                        placeholder="+213 555 12 34 56"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">الباب الوقفي المفضل</label>
                      <select
                        value={preferredWaqf}
                        onChange={(e) => setPreferredWaqf(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B5E20] focus:bg-white transition-all cursor-pointer"
                      >
                        <option value="general">البنك الوقفي العام</option>
                        <option value="educational">وقف العلم وكفالة طلاب العلم</option>
                        <option value="health">وقف الصحة ورعاية مرضى الكلى</option>
                        <option value="agricultural">وقف الأمن الغذائي وحفر الآبار</option>
                        <option value="social">مسكن البركة للأرامل والأيتام</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 mb-1.5">الهدف الوقفي الشخصي (د.ج)</label>
                      <input
                        type="number"
                        min="1000"
                        step="1000"
                        value={monthlyGoal}
                        onChange={(e) => setMonthlyGoal(Number(e.target.value))}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1B5E20] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="block text-xs font-bold text-slate-500 mb-2">تحديد سريع لهدف الأجر والالتزام (د.ج):</span>
                    <div className="flex flex-wrap gap-2">
                      {goalPresets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => setMonthlyGoal(preset)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                            monthlyGoal === preset
                              ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {new Intl.NumberFormat('ar-DZ').format(preset)} د.ج
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="px-6 py-2.5 bg-[#1B5E20] hover:bg-[#154619] text-white text-xs font-extrabold rounded-xl transition-all shadow cursor-pointer disabled:opacity-50"
                    >
                      {savingProfile ? 'جاري الحفظ...' : 'حفظ التعديلات الشريفة'}
                    </button>
                  </div>
                </form>

              </div>

              <div className="space-y-6">
                
                {/* Security instructions Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h4 className="text-xs font-bold text-[#1B5E20] mb-2 uppercase tracking-wide">عضوية الوقف الرقمية</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    يتم الحفاظ على بياناتك الشخصية ومعلومات تبرعاتك الوقفية بسرية تامة وتشفير آمن. مساهماتك يتم توجيهها وإدارتها بدقة شرعية ورقابة مستقلة عن طريق نظارة شؤون الوقف بالجزائر.
                  </p>
                  <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-100 text-amber-900 text-[10px] leading-relaxed">
                    <strong>البيان الشرعي:</strong> "الوقف صدقة ممتدة يزول ملك الواقف عنها وتؤول المنافع المترتبة عليها لله تعالى في أوجه الخير المعلنة."
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-[#C9A84C] flex items-center justify-center mx-auto mb-3">
                    <LucideIcon name="Award" size={24} />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">تحميل حجج الوقف الورقية</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    يمكنك طباعة أو حفظ حجتك الوقفية الرسمية من تبويب "سجل الأوقاف والشهادات" بضغطة زر واحدة لمشاركتها مع عائلتك أو الاحتفاظ بها كصدقة جارية.
                  </p>
                </div>

              </div>

            </div>
          )}

        </>
      )}

    </div>
  );
};
