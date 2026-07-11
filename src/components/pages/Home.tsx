import React, { useState } from 'react';
import { Project, Page } from '../../types';
import { QuranVerses } from '../../data';
import { IslamicPattern } from '../IslamicPattern';
import { LucideIcon } from '../LucideIcon';

interface HomeProps {
  onNavigatePage: (page: Page) => void;
  aboutRef: React.RefObject<HTMLDivElement | null>;
  onQuickDonate: (project: Project) => void;
  projectsList: Project[];
}

export const Home: React.FC<HomeProps> = ({
  onNavigatePage,
  aboutRef,
  onQuickDonate,
  projectsList,
}) => {
  // Quranic verse rotator
  const [currentVerseIdx, setCurrentVerseIdx] = useState(0);

  // "تاريخ وقفك" interactive state
  const [waqfStep, setWaqfStep] = useState<1 | 2 | 3 | 4>(1);
  const [searchName, setSearchName] = useState('');
  const [searchTitle, setSearchTitle] = useState('');
  const [searchFileNumber, setSearchFileNumber] = useState('');
  const [shareType, setShareType] = useState('التعليمي الفضي');
  const [selectedContributionProject, setSelectedContributionProject] = useState('مجمع النور التعليمي');

  const handleNextStep = () => {
    if (waqfStep < 4) {
      setWaqfStep((prev) => (prev + 1) as any);
    }
  };

  const handlePrevStep = () => {
    if (waqfStep > 1) {
      setWaqfStep((prev) => (prev - 1) as any);
    }
  };

  const resetWaqfWizard = () => {
    setWaqfStep(1);
    setSearchName('');
    setSearchTitle('');
    setSearchFileNumber('');
  };

  return (
    <div className="w-full" dir="rtl">
      
      {/* 1. Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center bg-slate-900 overflow-hidden text-right pt-20">
        
        {/* Background photo of a gorgeous Islamic architecture/mosque with green-golden styling overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/waqfitek_hero_banner_1783158049987.jpg"
            alt="صرح إسلامي شريف"
            className="w-full h-full object-cover object-center opacity-25 scale-105 transition-transform duration-10000 bg-black"
            style={{ backgroundColor: '#000000' }}
            referrerPolicy="no-referrer"
          />
          {/* Emerald green and slate gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-[#1B5E20]/75 to-slate-950/80"></div>
          {/* Subtle golden geometric lines */}
          <IslamicPattern opacity={0.12} color="#C9A84C" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10 pb-16">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#C9A84C] text-sm font-bold border border-white/5 mb-6 animate-pulse">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12,2L14.47,7.03L20,7.84L16,11.74L16.94,17.25L12,14.65L7.06,17.25L8,11.74L4,7.84L9.53,7.03L12,2Z" />
            </svg>
            <span>شراكات الحبس والتنمية الشاملة</span>
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight font-sans drop-shadow-md">
            وقفك <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-l from-[#C9A84C] to-[#E0C068]">صدقة جارية</span>
            <br />
            تنمو الأصول، ويدوم الأثر
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-slate-200 font-sans max-w-3xl mx-auto leading-relaxed drop-shadow-sm">
            نحفظ أصل تبرعك باستثمارات نقدية وعينية متوافقة مع الشريعة الإسلامية، ونصرف ريعها لتمويل التعليم والرعاية وتفتيت الفقر ليدوم أجر ثوابك إلى قيام الساعة.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
              onClick={() => onNavigatePage('waqf')}
              id="hero-cta-contribute"
              className="w-full sm:w-auto px-8 py-4 bg-[#C9A84C] hover:bg-[#B3933B] text-[#1B5E20] font-extrabold text-md rounded-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-[#C9A84C]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LucideIcon name="Coins" size={20} />
              <span>أوقف الآن</span>
            </button>
            
            <button
              onClick={() => {
                aboutRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
              id="hero-cta-about"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-extrabold text-md rounded-xl backdrop-blur-md border border-white/10 transition-all duration-305 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>اكتشف فلسفتنا</span>
              <LucideIcon name="ArrowLeft" size={18} />
            </button>
          </div>

          {/* Quick numbers bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-white/10 text-right">
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-[#C9A84C] font-mono">١٨,٥٠٠+</span>
              <span className="text-xs text-slate-350">واقف مسجل في السجل</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-[#C9A84C] font-mono">١٤٥,٠٠٠+</span>
              <span className="text-xs text-slate-350">مستفيد صحي وتعليمي سنوي</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-[#C9A84C] font-mono">%١٠٠</span>
              <span className="text-xs text-slate-350">توافق واستئناس شرعي دقيق</span>
            </div>
            <div>
              <span className="block text-2xl sm:text-3xl font-black text-[#C9A84C] font-mono">١٢+</span>
              <span className="text-xs text-slate-350">مليون ريال أصول مدرة موقوفة</span>
            </div>
          </div>
        </div>

        {/* Waves divider */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-[#F9F6F0]"></div>
      </section>

      {/* 2. Overview / "عن البنك" Section */}
      <section 
        ref={aboutRef}
        id="about-bank-section"
        className="py-20 bg-[#F9F6F0] relative overflow-hidden"
      >
        <IslamicPattern opacity={0.03} color="#1B5E20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual illustration side with CSS decorative frames */}
            <div className="lg:col-span-5 relative px-4">
              <div className="relative mx-auto max-w-sm rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600"
                  alt="مبادئ الوقف التأسيسية"
                  className="w-full h-96 object-cover"
                  referrerPolicy="no-referrer"
                />
                {/* Visual filter overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1B5E20]/80 via-transparent to-transparent"></div>
                
                {/* Floating card */}
                <div className="absolute bottom-6 inset-x-6 bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-[#C9A84C]/30 text-right">
                  <span className="text-xs text-[#C9A84C] font-mono font-bold block">ميثاق البنك</span>
                  <p className="text-sm font-bold text-slate-800 mt-1">حبس الأصل وتسبيل المنفعة هو الضمان المستدام للاقتصادات الصالحة.</p>
                </div>
              </div>
              
              {/* Decorative graphic dots */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-tr from-[#C9A84C]/20 to-[#1B5E20]/5 rounded-full filter blur-xl"></div>
            </div>

            {/* Typography content side */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold tracking-wider text-[#C9A84C] font-mono block">من نحن؟</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#1B5E20] font-sans">
                صرح مصرفي مالي بمقاصد وقفية شرعية نبيلة
              </h2>
              
              <p className="text-slate-700 leading-relaxed text-md font-sans">
                البنك الوقفي الرقمي هو مؤسسة ريادية مالية تسعى لتوفير بيئة رقمية آمنة ومريحة تجمع أوقاف المسلمين النقدية منها والعينية، وتعمل على حفظها واستثمارها بأقصى درجات الضبط والشفافية. نحن لا نقنع بالتبرع الاستهلاكي المؤقت؛ بل نوثق أسلوب الوقف الحضاري الذي يضمن بقاء أصل تبرعك حياً يدر خيرات لا متناهية على مصارف المنفعة الإسلامية المحددة.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white text-[#1B5E20] shadow-sm shrink-0 border border-[#1B5E20]/10">
                    <LucideIcon name="ShieldCheck" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">مجلس نظارة شرعي</h4>
                    <p className="text-xs text-slate-500 mt-0.5">مراقبة شرعية صارمة تواكب مقاصد الواقفين ورغباتهم.</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white text-[#1B5E20] shadow-sm shrink-0 border border-[#1B5E20]/10">
                    <LucideIcon name="TrendingUp" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">استثمار تنموي واعد</h4>
                    <p className="text-xs text-slate-500 mt-0.5">أعلى درجات الكفاءة الاستثمارية لتعظيم الريع والخير.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white text-[#1B5E20] shadow-sm shrink-0 border border-[#1B5E20]/10">
                    <LucideIcon name="Users" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">تكافل اجتماعي مستشف</h4>
                    <p className="text-xs text-slate-500 mt-0.5">تطوير مستدام للتعليم والصحة ومكافحة الفقر المزمن.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white text-[#1B5E20] shadow-sm shrink-0 border border-[#1B5E20]/10">
                    <LucideIcon name="CheckCircle2" size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">شهادات وقفية فورية</h4>
                    <p className="text-xs text-slate-500 mt-0.5">توثيق مستندات الأوقاف فور إتمام المساهمة المالية.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Quranic Verses Frame Section */}
      <section className="py-20 bg-gradient-to-b from-slate-50 to-[#F9F6F0]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold text-[#C9A84C] tracking-widest uppercase">الهدْي القرآني الوجيه</span>
          </div>

          <div className="relative bg-white border-2 border-dashed border-[#C9A84C]/55 rounded-2xl p-8 md:p-12 shadow-md overflow-hidden">
            <IslamicPattern opacity={0.06} color="#1B5E20" />
            
            {/* Animated/Rotatable verses list */}
            <div className="text-center relative z-10 space-y-4">
              <span className="text-3xl text-[#C9A84C] block font-serif">۝</span>
              <p className="text-lg md:text-2xl font-semibold text-[#1B5E20] leading-loose max-w-3xl mx-auto font-serif italic">
                "{QuranVerses[currentVerseIdx].text}"
              </p>
              <p className="text-xs md:text-sm text-slate-500 font-medium">
                — {QuranVerses[currentVerseIdx].source}
              </p>
            </div>

            {/* Slider Dots */}
            <div className="flex justify-center items-center gap-2 mt-6 relative z-10">
              {QuranVerses.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentVerseIdx(i)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentVerseIdx === i ? 'bg-[#1B5E20] scale-125' : 'bg-slate-200'
                  }`}
                  aria-label={`تغيير الآية الشريفة إلى ${i + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. "تاريخ وقفك" (Your Waqf History) 4-step wizard */}
      <section className="py-20 bg-white relative overflow-hidden">
        <IslamicPattern opacity={0.03} color="#C9A84C" />
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          
          {/* Section visual banners */}
          <div className="text-center mb-12">
            <span className="text-xs font-bold text-[#C9A84C] tracking-widest block font-mono">سجل الأمانات الشريف</span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#1B5E20] font-sans mt-1">تاريخ وقفك وعطائك الباقي</h2>
            <p className="text-sm text-slate-500 max-w-xl mx-auto mt-2">
              تصفح، طالع، وتتبع تفاصيل سهمك الوقفي من خلال هذا المستكشف التفاعلي المكون من 4 خطوات منظمة.
            </p>
          </div>

          {/* Stepper Header (Top Row) */}
          <div className="flex justify-between items-center max-w-lg mx-auto mb-8 relative">
            {/* Stepper line layout background wrapper */}
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-100 z-0">
              <div 
                className="h-full bg-[#1B5E20] transition-all duration-500"
                style={{ width: `${((waqfStep - 1) / 3) * 100}%` }}
              ></div>
            </div>

            {[1, 2, 3, 4].map((step) => {
              const isActive = waqfStep >= step;
              const isCurrent = waqfStep === step;
              
              const labels = ['الاسم واللقب', 'رقم الملف', 'محتوى السهم', 'المساهمة'];
              
              return (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    isCurrent 
                      ? 'bg-[#1B5E20] text-white border-[#C9A84C] shadow-md scale-110'
                      : isActive 
                      ? 'bg-[#1B5E20] text-white border-[#1B5E20]'
                      : 'bg-white text-slate-400 border-slate-200'
                  }`}>
                    {step}
                  </div>
                  <span className={`text-[11px] mt-1 hidden sm:block ${
                    isCurrent ? 'text-[#1B5E20] font-bold' : 'text-slate-400'
                  }`}>
                    {labels[step - 1]}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Step Contents Dynamic Frame */}
          <div className="bg-[#F9F6F0] rounded-2xl p-6 md:p-8 border border-[#1B5E20]/10 shadow-sm min-h-[220px] flex flex-col justify-between">
            <div>
              {waqfStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-md font-bold text-[#1B5E20] flex items-center gap-2">
                    <LucideIcon name="Users" size={18} />
                    <span>الخطوة 1: أدخل الاسم واللقب الشريف</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    يرجى تزويدنا ببيانات للتسجيل في السجل الرقمي للأوقاف أو استعلام السجلات السابقة باسمك.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">الاسم الكريم:</label>
                      <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="مثال: د. عبدالرحمن"
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">الكنية أو اللقب الفخري:</label>
                      <input
                        type="text"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        placeholder="مثال: الشريف آل رشيد"
                        className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-[#1B5E20]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {waqfStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-md font-bold text-[#1B5E20] flex items-center gap-2">
                    <LucideIcon name="FileText" size={18} />
                    <span>الخطوة 2: رقم ملف العائلة أو رقم الحفظ الوقفي</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    أدخل رقم الملف لمطابقة بيانات الأصول الموقوفة مسبقًا، أو أنشئ كودًا تلقائيًا لملفك الجديد.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">رقم ملف النظارة الوقفي المكون من 6 أرقام:</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={searchFileNumber}
                        onChange={(e) => setSearchFileNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="مثال: 541298"
                        className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-mono text-center tracking-widest focus:outline-none focus:border-[#1B5E20]"
                      />
                      <button
                        onClick={() => setSearchFileNumber(Math.floor(100000 + Math.random() * 900000).toString())}
                        className="px-4 py-2 bg-[#C9A84C] text-[#1B5E20] font-bold text-xs rounded-lg hover:bg-opacity-90"
                      >
                        توليد رقم عشوائي
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">
                      * هذا الكود يحمي سرية بيانات أوقاف العوائل والذراري الموثقة لدينا.
                    </p>
                  </div>
                </div>
              )}

              {waqfStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-md font-bold text-[#1B5E20] flex items-center gap-2">
                    <LucideIcon name="Award" size={18} />
                    <span>الخطوة 3: اطلع على مسارات وتفاصيل سهمك</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    اختر فئة السهم الذي ترغب في حبسه والاطلاع على حزمة ريعه وأثره التنموي المتوقع:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {['التعليمي الفضي', 'الصحي الذهبي', 'الزراعي البركاني'].map((type) => (
                      <div
                        key={type}
                        onClick={() => setShareType(type)}
                        className={`p-3 rounded-lg border text-center cursor-pointer transition-colors ${
                          shareType === type 
                            ? 'bg-white border-[#C9A84C] text-[#1B5E20] font-bold ring-2 ring-[#C9A84C]/20' 
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <span className="text-xs">{type}</span>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/60 p-3 rounded-lg border border-slate-100 text-xs text-slate-600">
                    {shareType === 'التعليمي الفضي' && "يذهب ١٠٠٪ من ريع هذا السهم لكفالة الرسوم والمواصلات وشراء الأجهزة اللوحية والمراجع العلمية الميسرة للأيتام المتفوقين في مدارس النور."}
                    {shareType === 'الصحي الذهبي' && "سهم مخصص لتمويل غسيل الكلى العاجل وصيانات أجهزة التنفس الصناعي، ومصممة لدعم ما لا يقل عن ٢٠ مريضاً محتاجاً شهرياً."}
                    {shareType === 'الزراعي البركاني' && "يشارك في تسبيل السلال الغذائية من مزارع الجود الوقفية المستصلحة بالمدينة المنورة وتوزيع خيرات التمور والنخيل على الوفود والزائرين."}
                  </div>
                </div>
              )}

              {waqfStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-md font-bold text-[#1B5E20] flex items-center gap-2">
                    <LucideIcon name="Coins" size={18} />
                    <span>الخطوة 4: مساهمتك المختارة في سهمك الشريف</span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    اسم الواقف: <strong className="text-slate-800">{searchName || "فاعل خير"} {searchTitle}</strong> | ملف الكود: <strong className="text-slate-800 font-mono text-[11px]">{searchFileNumber || "ملف جديد"}</strong>
                  </p>
                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700">اختر مشروعاً وقفياً لتخصيص السهم والريع لصالحه:</label>
                    <select
                      value={selectedContributionProject}
                      onChange={(e) => setSelectedContributionProject(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#1B5E20]"
                    >
                      {projectsList.map((p) => (
                        <option key={p.id} value={p.title}>{p.title}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Step Controls (Bottom buttons within card) */}
            <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-200/50">
              <button
                onClick={handlePrevStep}
                disabled={waqfStep === 1}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
                  waqfStep === 1 
                    ? 'text-slate-300 cursor-not-allowed' 
                    : 'text-[#1B5E20] hover:bg-slate-100'
                }`}
              >
                السابق
              </button>

              {waqfStep < 4 ? (
                <button
                  onClick={handleNextStep}
                  className="px-5 py-2 bg-[#1B5E20] text-white hover:bg-[#154619] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <span>التالي</span>
                  <LucideIcon name="ArrowLeft" size={14} />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const matchedProject = projectsList.find(p => p.title.includes(selectedContributionProject)) || projectsList[0];
                    onQuickDonate(matchedProject);
                  }}
                  id="home-wizard-finish-cta"
                  className="px-5 py-2.5 bg-[#C9A84C] text-[#1B5E20] hover:bg-opacity-95 shadow-sm font-extrabold text-xs rounded-lg transition-transform hover:-translate-y-0.5 flex items-center gap-1.5"
                >
                  <LucideIcon name="Coins" size={14} />
                  <span>انتقل لإنشاء الوقف وإصدار الشهادة</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Active Projects Spotlight ("أوقافنا") Section */}
      <section className="py-20 bg-[#F9F6F0] relative overflow-hidden text-right border-t border-slate-100">
        <IslamicPattern opacity={0.03} color="#1B5E20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-[#C9A84C] tracking-widest uppercase font-mono">الاستقطابات النشطة</span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-[#1B5E20] font-sans mt-1">تداول الأجر في مشاريعنا العصرية</h2>
              <p className="text-sm text-slate-500 mt-2 max-w-lg">
                صناديق ومشاريع معلنة تسهم مباشرة في رفع النفع العام، طالع تقدير الميزانيات ونسبة المنجز.
              </p>
            </div>

            <button
              onClick={() => onNavigatePage('projects')}
              className="px-5 py-2.5 bg-white hover:bg-slate-50 text-[#1B5E20] border border-[#1B5E20]/20 font-bold text-sm rounded-xl duration-300 transition-all shrink-0 flex items-center gap-2"
            >
              <span>تصفّح كافة أوقافنا</span>
              <LucideIcon name="ArrowLeft" size={16} />
            </button>
          </div>

          {/* Grid of 3 selected Project cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projectsList.slice(0, 3).map((project) => {
              const percentage = Math.min(
                100,
                Math.round((project.currentAmount / project.targetAmount) * 100)
              );

              return (
                <div
                  key={project.id}
                  id={`project-card-${project.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border border-slate-50 hover:shadow-xl transition-all duration-300 flex flex-col h-full group"
                >
                  <div className="relative h-48 overflow-hidden select-none">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-[#1B5E20] font-bold text-[11px] py-1 px-3 rounded-full shadow-sm border border-[#1B5E20]/10">
                      {project.category === 'educational' && 'الوقف التعليمي'}
                      {project.category === 'health' && 'الوقف الصحي'}
                      {project.category === 'agricultural' && 'الوقف الزراعي'}
                      {project.category === 'social' && 'الوقف الاجتماعي'}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between text-right space-y-4">
                    <div>
                      <h4 className="text-md font-bold text-slate-800 line-clamp-1 group-hover:text-[#1B5E20] transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-3 mt-2 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {/* Technical Progress Bars */}
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono font-bold text-[#1B5E20]">{percentage}% مكتمل</span>
                          <span className="text-slate-400">النسبة المجمّعة</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-l from-[#1B5E20] to-[#C9A84C] rounded-full transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Financial data counts and details */}
                      <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-50 text-right">
                        <div>
                          <span className="block text-slate-400">الهدف المالي:</span>
                          <span className="font-bold font-mono text-slate-800">{project.targetAmount.toLocaleString('ar-EG')} ر.س</span>
                        </div>
                        <div>
                          <span className="block text-slate-400">المبلغ المجمّع:</span>
                          <span className="font-bold font-mono text-[#1B5E20]">{project.currentAmount.toLocaleString('ar-EG')} ر.س</span>
                        </div>
                      </div>

                      {/* Call to action donation buttons */}
                      <button
                        onClick={() => onQuickDonate(project)}
                        id={`btn-spotlight-donate-${project.id}`}
                        className="w-full py-2.5 bg-gradient-to-r from-[#1B5E20]/5 to-[#1B5E20]/10 hover:from-[#1B5E20] hover:to-[#2E7D32] hover:text-white text-[#1B5E20] font-bold text-xs rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LucideIcon name="Coins" size={14} />
                        <span>ساهم بمبلغ وقفي مباشر</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
